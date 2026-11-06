import { loadEnv } from 'vite';
import type { Plugin } from 'vite';
import { siteRuntime } from './runtime';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';

/** Local BFF on the same origin as HMR, without exposing service env to VITE_*. */
export function siteApiPlugin(): Plugin {
  return {
    name: 'catalisa-site-api', apply: 'serve',
    async configureServer(server) {
      if (process.env.VITE_REDESIGN_PREVIEW !== '1') return;
      const handle = await siteRuntime({ ...loadEnv(server.config.mode, server.config.root, 'SITE_'), ...process.env }, true);
      const migrationLock=resolve(server.config.root,'.local/site/store-migration.lock');
      server.middlewares.use(async (incoming, outgoing, next) => {
        if (!incoming.url?.startsWith('/api/site/') && incoming.url!=='/api/internal/handoff-events') return next();
        if(!['GET','HEAD'].includes(incoming.method||'GET')&&existsSync(migrationLock)){
          outgoing.writeHead(503,{'Content-Type':'application/json','Cache-Control':'no-store','Retry-After':'2'});
          outgoing.end(JSON.stringify({code:'store_migration',message:'Estamos atualizando a conexão da sua conversa. Suas respostas estão preservadas; tente novamente em instantes.',retryable:true}));return;
        }
        const chunks: Buffer[] = []; let length = 0;
        for await (const value of incoming) {
          const chunk = Buffer.from(value); length += chunk.length;
          if (length > 16000) { outgoing.writeHead(413, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); outgoing.end(JSON.stringify({ code: 'body_too_large', message: 'A resposta excedeu o tamanho permitido.', retryable: false })); return; }
          chunks.push(chunk);
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(incoming.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(',') : value);
        const request = new Request('http://127.0.0.1:5175' + incoming.url, { method: incoming.method, headers, ...(!['GET', 'HEAD'].includes(incoming.method || 'GET') && length ? { body: Buffer.concat(chunks) } : {}) });
        const response = await handle(request, incoming.socket.remoteAddress || 'local');
        outgoing.writeHead(response.status, Object.fromEntries(response.headers));
        outgoing.end(Buffer.from(await response.arrayBuffer()));
      });
    },
  };
}
