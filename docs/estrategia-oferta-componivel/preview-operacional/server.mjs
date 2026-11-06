import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('./', import.meta.url);
const project = new URL('../../../', root);
const assets = {
 '/assets/brand.svg': 'public/redesign/brand/catalisa-logo-principal.svg',
 '/assets/symbol.svg': 'public/redesign/brand/catalisa-simbolo-principal.svg',
 '/assets/inter-regular.woff2': 'public/redesign/inter-latin-0.woff2',
 '/assets/inter-medium.woff2': 'public/redesign/inter-latin-1.woff2',
 '/assets/inter-semibold.woff2': 'public/redesign/inter-latin-2.woff2',
 '/assets/editorial-creator.jpg': 'public/redesign/media-v3/editorial-creator.jpg',
};
const pages = { '/': 'index.html', '/style.css': 'style.css', '/app.js': 'app.js' };
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg' };
createServer(async (request, response) => {
 const path = new URL(request.url, 'http://localhost').pathname;
 response.setHeader('Cache-Control', 'no-store');
 response.setHeader('X-Robots-Tag', 'noindex,nofollow');
 response.setHeader('X-Content-Type-Options', 'nosniff');
 response.setHeader('Referrer-Policy', 'no-referrer');
 response.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
 if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405); return response.end(); }
 if (path === '/robots.txt') return response.end('User-agent: *\nDisallow: /\n');
 const file = assets[path] ? new URL(assets[path], project) : pages[path] ? new URL(pages[path], root) : null;
 if (!file) { response.writeHead(404); return response.end('Não encontrado'); }
 try { const body = await readFile(file); const extension = '.' + file.pathname.split('.').at(-1); response.setHeader('Content-Type', mime[extension] || 'application/octet-stream'); response.setHeader('Content-Length', body.length); response.end(request.method === 'HEAD' ? undefined : body); }
 catch { response.writeHead(404); response.end('Não encontrado'); }
}).listen(8142,'127.0.0.1',() => process.stdout.write('Proposta operacional: http://127.0.0.1:8142/\n'));
