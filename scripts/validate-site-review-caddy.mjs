import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {reviewHeaders,reviewRobots,reviewHostingInclude} from './site-review-caddy.mjs';
const source=process.argv.find(value=>value.startsWith('--include='))?.slice(10)||'.local/site/releases/staging-20261025-0446/public/site-hosting.caddy';
const original=await readFile(source,'utf8');
const input=`{\n admin off\n auto_https off\n persist_config off\n}\n:80 {\n${reviewHeaders}${reviewRobots}${reviewHostingInclude(original)}\n}\n`;
const result=await new Promise((accept,reject)=>{
 const child=spawn('ssh',['-T','-o','BatchMode=yes','-o','ConnectTimeout=10','root@177.104.184.34','pct exec 154 -- docker exec -i catalisa-site-staging-caddy-1 caddy adapt --config /dev/stdin --adapter caddyfile --validate'],{stdio:['pipe','pipe','pipe'],signal:AbortSignal.timeout(25000)});
 let output='',errors='';child.stdout.on('data',part=>{output+=part;});child.stderr.on('data',part=>{errors+=part;});child.on('error',reject);child.on('close',code=>accept({code,output,errors}));child.stdin.end(input);
});
const report={date:new Date().toISOString(),passed:result.code===0,scope:'Caddy2 adapt/validate using the already-running isolated staging container binary, stdin only; no reload, files changed, restart, route switch or production-container command',includeSource:source,includeSha256:createHash('sha256').update(original).digest('hex'),reviewConfigSha256:createHash('sha256').update(input).digest('hex'),exitCode:result.code,errors:result.code===0?[]:result.errors.split('\n').filter(Boolean).slice(0,8),limits:['Syntax/provision validation only; HTTP response assertions required after staging install']};
await mkdir('docs/redesign-2026-10-22/qa/release',{recursive:true});await writeFile('docs/redesign-2026-10-22/qa/release/review-caddy-validate.json',JSON.stringify(report,null,2)+'\n');console.info(JSON.stringify(report));if(!report.passed)process.exitCode=1;
