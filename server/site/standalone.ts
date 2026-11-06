import { createServer } from 'node:http';
import { isIP } from 'node:net';
import { siteRuntime, siteStore } from './runtime';
import { CatalisaSessionStore } from './catalisa-store';
import {siteInbox} from './site-inbox';

/** Private BFF behind the site's reverse proxy. Never serve this port at the edge. */
const env = process.env;
const host = env.SITE_LISTEN_HOST || '127.0.0.1';
const port = Number(env.SITE_LISTEN_PORT || 8096);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error('Invalid site listen port');
const normalize = (value: string) => value.replace(/^::ffff:/, '');
const proxies = new Set((env.SITE_TRUSTED_PROXIES || '').split(',').map(value => normalize(value.trim())).filter(Boolean));
if ([...proxies].some(value => !isIP(value))) throw Error('Trusted proxies must be explicit IP addresses');
const allowed = (env.SITE_ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean);
const publicOrigin = allowed[0];
if (!publicOrigin || allowed.some(value => { const url = new URL(value); return url.protocol !== 'https:' || url.origin !== value; })) throw Error('HTTPS site origins required');
const handle = await siteRuntime({...env,SITE_RUNTIME_MODE:'node'}, false);
const retention = await siteStore(env, false);
const inboxRetention=siteInbox(env,false);
let cleaning = false;
const cleanup = async () => {
  if (cleaning) return;
  cleaning = true;
  try { if(retention instanceof CatalisaSessionStore)await retention.cleanup(20, Date.now() + 24000); await inboxRetention?.cleanup(AbortSignal.timeout(24000),10); await handle.marketWorker?.cleanup(); console.info(JSON.stringify({ event: 'site_retention_complete' })); }
  catch { console.error(JSON.stringify({ event: 'site_retention_failed' })); }
  finally { cleaning = false; }
};
const interval = Number(env.SITE_RETENTION_INTERVAL_MS || 3600000);
if (!Number.isInteger(interval) || interval < 60000 || interval > 3600000) throw Error('Invalid retention interval');
const timer = setInterval(() => { void cleanup(); }, interval);
timer.unref();
const drainMarket=async()=>{if(!handle.marketWorker)return;try{const previous=handle.marketWorker.last.failed,result=await handle.marketWorker.run();if(result.failed>previous)console.error(JSON.stringify({event:'site_market_delivery_failed',failures:result.failed-previous,deadLetters:result.deadLetters}));}catch{console.error(JSON.stringify({event:'site_market_worker_failed'}));}};
const marketTimer=handle.marketWorker?setInterval(()=>{void drainMarket();},30000):undefined;marketTimer?.unref();
const server = createServer(async (incoming, outgoing) => {
  const fail = (status: number, code: string) => {
    outgoing.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    outgoing.end(JSON.stringify({ code }));
  };
  const path = incoming.url || '/';
  if (path === '/healthz' && incoming.method === 'GET') return fail(200, 'ready');
  if (!(path.startsWith('/api/site/') || path.split('?')[0] === '/api/internal/handoff-events')) return fail(404, 'not_found');
  if (incoming.headers['content-encoding'] && incoming.headers['content-encoding'] !== 'identity') return fail(415, 'encoding_not_supported');
  const length = incoming.headers['content-length'];
  if (length && (!/^\d+$/.test(length) || Number(length) > 16384)) return fail(413, 'body_too_large');
  const abort = new AbortController();
  outgoing.once('close', () => { if (!outgoing.writableEnded) abort.abort(); });
  try {
    let size = 0;
    const chunks: Buffer[] = [];
    for await (const chunk of incoming) {
      const bytes = Buffer.from(chunk); size += bytes.length;
      if (size > 16384) { fail(413, 'body_too_large'); incoming.resume(); return; }
      chunks.push(bytes);
    }
    const headers = new Headers();
    for (const [key, value] of Object.entries(incoming.headers)) {
      if (value !== undefined && !['host', 'connection', 'transfer-encoding', 'content-length'].includes(key)) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    }
    const socketIp = normalize(incoming.socket.remoteAddress || 'unknown');
    const forwarded = incoming.headers['x-real-ip'];
    const ip = proxies.has(socketIp) && typeof forwarded === 'string' && isIP(normalize(forwarded)) ? normalize(forwarded) : socketIp;
    // Origin is fixed by configuration; incoming Host and X-Forwarded-* cannot redirect requests.
    const request = new Request(new URL(path, publicOrigin), { method: incoming.method, headers, signal: abort.signal, ...(!['GET', 'HEAD'].includes(incoming.method || 'GET') ? { body: Uint8Array.from(Buffer.concat(chunks)).buffer } : {}) });
    const response = await handle(request, ip);
    outgoing.statusCode = response.status;
    response.headers.forEach((value, key) => { if (key !== 'set-cookie') outgoing.setHeader(key, value); });
    const cookies = response.headers.getSetCookie();
    if (cookies.length) outgoing.setHeader('Set-Cookie', cookies);
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch { if (!outgoing.headersSent) fail(503, 'service_unavailable'); else outgoing.end(); }
});
server.requestTimeout = 180000;
server.headersTimeout = 15000;
server.keepAliveTimeout = 5000;
server.listen(port, host, () => { console.info(JSON.stringify({ event: 'site_server_ready', port })); void cleanup(); if(handle.marketWorker)void drainMarket(); });
const stop = () => { clearInterval(timer);if(marketTimer)clearInterval(marketTimer);server.close(() => process.exit(0)); setTimeout(() => process.exit(1), 10000).unref(); };
process.once('SIGTERM', stop);
process.once('SIGINT', stop);
