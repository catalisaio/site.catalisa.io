/** Explicit local→staging migration preserving cookies, history and idempotency receipts. */
import fs from'node:fs/promises';import{DatabaseSync}from'node:sqlite';import{randomUUID,createHash}from'node:crypto';import{parse}from'dotenv';
import{CatalisaSessionStore}from'../server/site/catalisa-store';import type{Receipt,SessionState}from'../server/site/types';
const root=process.cwd(),lock=root+'/.local/site/store-migration.lock',manifestFile=root+'/.local/site/store-migration.json';
const env=parse(await fs.readFile('.env.local')),cfg=JSON.parse(await fs.readFile('.local/site/staging-connection.json','utf8')),connection=JSON.parse(await fs.readFile('.local/site/store-connection.json','utf8'));
if(cfg.origin!=='https://panel-api.wpp.bb.stg.catalisa.app'||connection.origin!==cfg.origin||!connection.verifiedAt)throw Error('Verified staging target required');
if(env.SITE_STORE==='catalisa')throw Error('Preview already uses shared store; do not overwrite it from a local backup');
let manifest:{id:string;createdAt:string;completedAt?:string};try{manifest=JSON.parse(await fs.readFile(manifestFile,'utf8'));}catch{manifest={id:randomUUID(),createdAt:new Date().toISOString()};await fs.writeFile(manifestFile,JSON.stringify(manifest),{mode:0o600});}
const lockId=randomUUID();await fs.writeFile(lock,JSON.stringify({id:lockId,pid:process.pid,createdAt:new Date().toISOString()}),{flag:'wx',mode:0o600});
const db=new DatabaseSync('.local/site/sessions.sqlite',{readOnly:true});const report:Record<string,unknown>={date:new Date().toISOString(),passed:false,target:cfg.origin,cookiesPreserved:true,localBackupPreserved:true};
try{
 const deadline=Date.now()+75000;
 while(true){const rows=db.prepare('SELECT state FROM sessions WHERE expires_at>?').all(new Date().toISOString());let pending=0;for(const row of rows){const state=JSON.parse(String(row.state)) as SessionState;pending+=Object.values(state.jobs??{}).filter(entry=>entry.job.status==='running'&&Date.parse(entry.deadline)>Date.now()).length;pending+=Object.values(state.handoffs??{}).filter(entry=>entry.receipt.status==='queued'&&Date.parse(entry.deadline)>Date.now()).length;}if(!pending)break;if(Date.now()>deadline)throw Error('Live jobs still active; migration did not change preview');await new Promise(resolve=>setTimeout(resolve,500));}
 await new Promise(resolve=>setTimeout(resolve,300));
 const rows=db.prepare('SELECT hash,revision,state,expires_at FROM sessions WHERE expires_at>? ORDER BY hash').all(new Date().toISOString());
 const before=rows.map(row=>({hash:String(row.hash),revision:Number(row.revision)}));const store=new CatalisaSessionStore({origin:cfg.origin,token:cfg.token,ownerEmail:'admin@catalisa.app',collection:connection.collection});let imported=0,replayed=0,receiptCount=0;
 for(const row of rows){
  const hash=String(row.hash),state=JSON.parse(String(row.state)) as SessionState,receipts:Record<string,{expiresAt:string;receipt:Receipt}>={};
  for(const saved of db.prepare('SELECT key,value,expires_at FROM receipts WHERE session_hash=? AND expires_at>?').all(hash,new Date().toISOString()))receipts[String(saved.key)]={expiresAt:String(saved.expires_at),receipt:JSON.parse(String(saved.value))};
  const outcome=await store.importLocalSession(hash,{revision:Number(row.revision),state,expiresAt:String(row.expires_at)},receipts,manifest.id);if(outcome==='imported')imported++;else replayed++;receiptCount+=Object.keys(receipts).length;
  const recovered=await store.read(hash);if(!recovered||createHash('sha256').update(JSON.stringify(recovered.state)).digest('hex')!==createHash('sha256').update(JSON.stringify(state)).digest('hex'))throw Error('Migration readback differs; preview remains local');
 }
 const after=db.prepare('SELECT hash,revision FROM sessions WHERE expires_at>? ORDER BY hash').all(new Date().toISOString()).map(row=>({hash:String(row.hash),revision:Number(row.revision)}));if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Source changed while migration lock was active; preview remains local');
 const next={...env,SITE_STORE:'catalisa',SITE_STORE_COLLECTION:connection.collection};const contents=Object.entries(next).map(([key,value])=>key+'='+JSON.stringify(value)).join('\n')+'\n';
 const temporary=root+'/.local/site/preview-env.next';await fs.writeFile(temporary,contents,{mode:0o600});await fs.rename(temporary,root+'/.env.local');
 manifest.completedAt=new Date().toISOString();await fs.writeFile(manifestFile,JSON.stringify({...manifest,imported,replayed,receipts:receiptCount}),{mode:0o600});Object.assign(report,{passed:true,imported,replayed,receipts:receiptCount,backend:'catalisa',sharedReadback:true});
}catch(reason){report.error=String(reason);throw reason;}
finally{db.close();const current=JSON.parse(await fs.readFile(lock,'utf8'));if(current.id===lockId)await fs.unlink(lock);await fs.mkdir('docs/redesign-2026-10-22/qa/integrations',{recursive:true});await fs.writeFile('docs/redesign-2026-10-22/qa/integrations/local-store-migration.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));}
