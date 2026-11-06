/** Prepare an EMPTY dedicated market collection in staging. Does not enable collection, deploy or send messages. */
import fs from 'node:fs/promises';
const directory='.local/site',file=directory+'/market-connection.json';
await fs.mkdir(directory,{recursive:true,mode:0o700});
const cfg=JSON.parse(await fs.readFile(directory+'/staging-connection.json','utf8'));
if(cfg.origin!=='https://panel-api.wpp.bb.stg.catalisa.app'||!cfg.token)throw Error('Staging connection required');
const collection='site_catalisa_metrics_v1',purpose='catalisa-site-market-v1',base='/data-store/collections/'+collection;
const description='Site Catalisa — armazenamento reservado de métricas minimizadas. Sem coleta habilitada, CRM, envio externo ou alteração do painel. Gerenciado por site.catalisa.io.';
async function raw(path,method='GET',body){const response=await fetch(cfg.origin+path,{method,headers:{Authorization:'Bearer '+cfg.token,Accept:'application/json',...(body===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(18000),redirect:'error'});return{status:response.status,body:await response.json().catch(()=>({}))};}
async function request(path,method='GET',body){const result=await raw(path,method,body);if(result.status<200||result.status>=300)throw Error('Inbox provisioning HTTP '+result.status);return result.body;}
const me=await request('/auth/me');if((me.email??me.user?.email)!=='admin@catalisa.app')throw Error('Owner mismatch');
let connection;try{connection=JSON.parse(await fs.readFile(file,'utf8'));}catch{connection={origin:cfg.origin,collection};}
if(connection.origin!==cfg.origin||connection.collection!==collection)throw Error('Inbox connection mismatch');
const save=()=>fs.writeFile(file,JSON.stringify(connection,null,2)+'\n',{mode:0o600});
const report={date:new Date().toISOString(),passed:false,origin:cfg.origin,collection,productionDeploy:false,panelCodeChanged:false,buildingBlockCodeChanged:false};
try{
 let found=await raw(base);report.collectionCreated=false;
 if(found.status===404){
  if(!connection.provisionWorkflowId){
   const workflow=await request('/workflows','POST',{name:'Site Catalisa — Preparar métricas privadas',description,active:false,trigger:{type:'manual',name:'Provisionamento manual do site',active:false,config:{}},actions:[{type:'DATASTORE_CREATE_COLLECTION',name:'Criar armazenamento privado de métricas',order:1,active:true,config:{name:collection,pii:true,jsonSchema:{type:'object',properties:{purpose:{type:'string',enum:[purpose]},payload:{type:'object',encrypted:true}},required:['purpose']}}}]});
   if(!workflow.id)throw Error('Provision workflow did not return ID');connection.provisionWorkflowId=workflow.id;await save();
  }
  const definition=await request('/workflows/'+connection.provisionWorkflowId),action=definition.actions?.[0];
  const triggers=definition.triggers??(definition.trigger?[definition.trigger]:[]);
  if(definition.description!==description||definition.active!==false||triggers.length!==1||triggers[0].type!=='manual'||triggers[0].active!==false||definition.actions?.length!==1||action?.type!=='DATASTORE_CREATE_COLLECTION'||action.config?.name!==collection||action.config?.pii!==true||action.config?.jsonSchema?.properties?.purpose?.enum?.[0]!==purpose)throw Error('Reserved provision workflow mismatch');
  const execution=await request('/workflows/'+connection.provisionWorkflowId+'/execute','POST',{manualExecution:true,payload:{purpose:'site-market-empty-provisioning'}});connection.provisionExecutionId=execution.executionId;await save();
  for(let index=0;index<25;index++){found=await raw(base);if(found.status===200)break;await new Promise(resolve=>setTimeout(resolve,800));}
  if(found.status!==200)throw Error('Inbox collection not created');report.collectionCreated=true;
 }else if(found.status!==200)throw Error('Inbox metadata HTTP '+found.status);
 const metadata=found.body.data??found.body,properties=metadata.jsonSchema?.properties;
 if(metadata.pii!==true||properties?.payload?.encrypted!==true||!properties?.purpose?.enum?.includes(purpose))throw Error('Existing collection differs from dedicated encrypted site inbox contract');
 report.pii=true;report.encryptedFieldsConfigured=['payload'];connection.verifiedAt=new Date().toISOString();await save();report.passed=true;
}catch(reason){report.error=String(reason);throw reason;}
finally{await fs.mkdir('docs/redesign-2026-10-22/qa/integrations',{recursive:true});await fs.writeFile('docs/redesign-2026-10-22/qa/integrations/site-market-staging.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));}
