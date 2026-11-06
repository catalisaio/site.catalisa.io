import {createServer} from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import{gzipSync}from'node:zlib';
import {anonymousSnapshotApi} from './anonymous-snapshot-api.mjs';

const argument=name=>process.argv.find(value=>value.startsWith('--'+name+'='))?.slice(name.length+3);
const directory=path.resolve(argument('dir')||'docs/redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/reference/site/dist');
const port=Number(argument('port')||8176);
const compression=process.argv.includes('--gzip');
const inventory=await fs.readFile(path.join(directory,'release-routes.json'),'utf8').then(JSON.parse).catch(()=>undefined);
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.otf':'font/otf','.mp4':'video/mp4','.webmanifest':'application/manifest+json'};
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url||'/','http://localhost');
    const pathname=decodeURIComponent(url.pathname);
    const api=anonymousSnapshotApi(pathname,req.method);
    if(api){res.writeHead(api.status,api.headers);res.end(req.method==='HEAD'?undefined:JSON.stringify(api.body));return;}
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
    if(pathname.split('/').some(part=>part.startsWith('.'))){res.writeHead(403);res.end();return;}
    const normalized=pathname.replace(/\/+$/,'')||'/';
    const target=inventory?.redirects[normalized];
    if(target){res.writeHead(301,{Location:target+url.search});res.end();return;}
    let file=path.resolve(directory,'.'+pathname);
    if(file!==directory&&!file.startsWith(directory+path.sep)){res.writeHead(403);res.end();return;}
    try{if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');await fs.access(file);}
    catch{
      const authenticated=inventory?.authenticatedPrefixes.some(prefix=>normalized===prefix||normalized.startsWith(prefix+'/'));
      file=path.join(directory,authenticated?'spa.html':'404.html');res.statusCode=authenticated?200:404;
    }
    let body;try{body=await fs.readFile(file);}catch{res.writeHead(404);res.end('Not found');return;}
    res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex, nofollow');
    if(compression&&/\bgzip\b/.test(req.headers['accept-encoding']||'')&&body.length>512&&/text\/|javascript|json|svg|xml/.test(types[path.extname(file)]||'')){body=gzipSync(body);res.setHeader('Content-Encoding','gzip');res.setHeader('Vary','Accept-Encoding');}
    res.end(req.method==='HEAD'?undefined:body);
  }catch{res.writeHead(400);res.end();}
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
console.info(JSON.stringify({origin:'http://127.0.0.1:'+port,directory,compression:compression?'gzip for text assets':'none',scope:'Read-only local artifact/reference, anonymous API contract; not deployed hosting'}));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
