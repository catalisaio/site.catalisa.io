import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {extname, resolve, sep} from 'node:path';

const root = resolve(process.argv[2] || '/home/klederson/Projects/site.catalisa.io');
const port = Number(process.argv[3] || 5186);
const types = {'.html':'text/html; charset=utf-8','.md':'text/plain; charset=utf-8','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.mp4':'video/mp4','.mp3':'audio/mpeg','.ttf':'font/ttf','.css':'text/css','.js':'text/javascript','.zip':'application/zip'};
const server = createServer(async(req,res)=>{
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{'Allow':'GET, HEAD'}).end();return;}
  let pathname;
  try {pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);} catch {res.writeHead(400).end();return;}
  let file=resolve(root,'.'+pathname);
  if(!file.startsWith(root+sep)||pathname.split('/').some(p=>p.startsWith('.'))){res.writeHead(404).end();return;}
  try {
    let info=await stat(file);
    if(info.isDirectory()){file=resolve(file,'index.html');info=await stat(file);}
    if(!info.isFile()){res.writeHead(404).end();return;}
    const headers={'Content-Type':types[extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache'};
    let start=0,end=info.size-1,status=200;
    if(req.headers.range){
      const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return;}
      if(!match[1]){start=Math.max(0,info.size-Number(match[2]));}
      else {start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]));}
      if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return;}
      status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
    }
    headers['Content-Length']=Math.max(0,end-start+1);
    res.writeHead(status,headers);
    if(req.method==='HEAD'||!info.size){res.end();return;}
    const stream=createReadStream(file,{start,end});
    stream.on('error',()=>res.destroy());
    res.on('close',()=>stream.destroy());
    stream.pipe(res);
  }catch(error){if(!res.headersSent)res.writeHead(error.code==='ENOENT'?404:500);res.end();}
});
server.listen(port,'127.0.0.1',()=>console.log(`Preview com suporte a vídeo: http://127.0.0.1:${port}/`));
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
