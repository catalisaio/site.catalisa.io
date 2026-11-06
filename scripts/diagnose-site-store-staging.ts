import fs from'node:fs/promises';import{randomUUID}from'node:crypto';import{CatalisaSessionStore}from'../server/site/catalisa-store';
const cfg=JSON.parse(await fs.readFile('.local/site/staging-connection.json','utf8'));const connection=JSON.parse(await fs.readFile('.local/site/store-connection.json','utf8'));
if(cfg.origin!=='https://panel-api.wpp.bb.stg.catalisa.app')throw Error('Staging required');
const store=new CatalisaSessionStore({origin:cfg.origin,token:cfg.token,ownerEmail:'admin@catalisa.app',collection:connection.collection});
try{const missing=await store.read('diagnostic-'+randomUUID());console.log(JSON.stringify({readMissing:missing===null}));const allowed=await store.quota('diagnostic-'+randomUUID(),2,new Date(Date.now()+60000).toISOString());console.log(JSON.stringify({quota:allowed}));}
catch(reason){const error=reason as Error&{code?:string;diagnostic?:unknown};console.log(JSON.stringify({code:error.code,diagnostic:error.diagnostic,message:error.message}));process.exitCode=1;}
