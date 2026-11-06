/** User-authorized isolated site storage provisioning and real CAS smoke. Never deploys. */
import fs from'node:fs/promises';import{randomUUID}from'node:crypto';
const cfg=JSON.parse(await fs.readFile('.local/site/staging-connection.json','utf8'));
if(cfg.origin!=='https://panel-api.wpp.bb.stg.catalisa.app')throw Error('Staging required');
const collection='site_catalisa_sessions_v1',base='/data-store/collections/'+collection,connectionFile='.local/site/store-connection.json';
const headers={Authorization:'Bearer '+cfg.token,'Content-Type':'application/json'};
async function raw(route,method='GET',body){const response=await fetch(cfg.origin+route,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(18000),redirect:'error'});return{status:response.status,body:await response.json().catch(()=>({}))};}
async function request(route,method='GET',body){const result=await raw(route,method,body);if(result.status<200||result.status>=300){await fs.writeFile('.local/site/store-provision-failure.json',JSON.stringify({route,method,...result}),{mode:0o600});throw Error(method+' '+route.replace(/[a-f0-9-]{30,}/g,':id')+' HTTP '+result.status);}return result.body;}
const me=await request('/auth/me');if((me.email??me.user?.email)!=='admin@catalisa.app')throw Error('Owner mismatch');
let connection;try{connection=JSON.parse(await fs.readFile(connectionFile,'utf8'));}catch{connection={origin:cfg.origin,collection};}
if(connection.origin!==cfg.origin||connection.collection!==collection)throw Error('Storage connection mismatch');
let found=await raw(base),created=false;let probeId;const report={date:new Date().toISOString(),passed:false,origin:cfg.origin,collection,productionDeploy:false,panelCodeChanged:false,buildingBlockCodeChanged:false};
try{
 if(found.status===404){
  const description='Site Catalisa — provisionamento isolado da persistência privada. Sem envio de mensagens. Gerenciado por site.catalisa.io.';
  if(!connection.provisionWorkflowId){
   const workflow=await request('/workflows','POST',{name:'Site Catalisa — Preparar persistência privada',description,active:false,trigger:{type:'manual',name:'Provisionamento manual do site',active:false,config:{}},actions:[{type:'DATASTORE_CREATE_COLLECTION',name:'Criar coleção privada do site',order:1,active:true,config:{name:collection,pii:true,jsonSchema:{type:'object',properties:{purpose:{type:'string',enum:['catalisa-site-v1']},state:{type:'object',encrypted:true},receipts:{type:'object',encrypted:true}},required:['purpose']}}}]});connection.provisionWorkflowId=workflow.id;await fs.writeFile(connectionFile,JSON.stringify(connection),{mode:0o600});
  }
  const definition=await request('/workflows/'+connection.provisionWorkflowId);if(definition.description!==description||definition.actions?.length!==1||definition.actions[0].config?.name!==collection)throw Error('Provision workflow mismatch');
  const execution=await request('/workflows/'+connection.provisionWorkflowId+'/execute','POST',{manualExecution:true,payload:{purpose:'site-storage-provisioning'}});connection.provisionExecutionId=execution.executionId;await fs.writeFile(connectionFile,JSON.stringify(connection),{mode:0o600});
  for(let index=0;index<25;index++){found=await raw(base);if(found.status===200)break;await new Promise(resolve=>setTimeout(resolve,800));}
  if(found.status!==200)throw Error('Collection not created');created=true;
 }else if(found.status!==200)throw Error('Storage metadata HTTP '+found.status);
 const metadata=found.body.data??found.body;
 if(metadata.pii!==true||metadata.jsonSchema?.properties?.state?.encrypted!==true||metadata.jsonSchema?.properties?.receipts?.encrypted!==true||!metadata.jsonSchema?.properties?.purpose?.enum?.includes('catalisa-site-v1'))throw Error('Collection privacy/schema differs from site contract');
 report.collectionCreated=created;report.pii=true;report.encryptedFieldsConfigured=['state','receipts'];
 const key='smoke-'+randomUUID(),marker='handoff_'+randomUUID();const initial={purpose:'catalisa-site-v1',kind:'smoke',state:{note:'Dado fictício de verificação'},receipts:{},handoffRefs:[marker],expiresAt:new Date(Date.now()+3600000).toISOString()};
 const createdDocument=await request(base+'/documents','POST',{docKey:key,data:initial});const doc=createdDocument.data;probeId=doc.id;if(!probeId||!Number.isInteger(doc.version))throw Error('Document contract mismatch');
 const duplicate=await raw(base+'/documents','POST',{docKey:key,data:initial});if(duplicate.status!==409)throw Error('Natural key did not reject duplicate');report.duplicateCreate=duplicate.status;
 const results=await Promise.all(['left','right'].map(side=>raw(base+'/documents/'+probeId,'PUT',{expectedVersion:doc.version,data:{...initial,state:{note:side}}})));const statuses=results.map(result=>result.status).sort();if(JSON.stringify(statuses)!=='[200,409]')throw Error('CAS did not allow exactly one writer');report.concurrentCas=statuses;
 const current=await request(base+'/documents/'+probeId);if(current.data.version!==doc.version+1||!['left','right'].includes(current.data.attributes.state.note))throw Error('CAS readback mismatch');report.decryptedReadback=true;
 const query=await request(base+'/query','POST',{where:{$docKey:{op:'eq',value:key}},page:1,pageSize:2});if(query.data?.length!==1||query.data[0].id!==probeId)throw Error('Natural-key query mismatch');report.lookupByKey=true;
 const lookup=await request(base+'/query','POST',{where:{handoffRefs:{op:'contains',value:[marker]}},page:1,pageSize:2});if(lookup.data?.[0]?.id!==probeId)throw Error('Handoff index mismatch');report.handoffLookup=true;
 const encryptedQuery=await raw(base+'/query','POST',{where:{'state.note':{op:'eq',value:'left'}},page:1,pageSize:2});if(encryptedQuery.status!==400)throw Error('Encrypted field unexpectedly queryable');report.encryptedFilterRejected=true;
 await request(base+'/documents/'+probeId,'PUT',{expectedVersion:current.data.version,data:{purpose:'catalisa-site-v1',kind:'erased',state:{},receipts:{},handoffRefs:[],expiresAt:new Date().toISOString()}});await request(base+'/documents/'+probeId,'DELETE');probeId=undefined;report.syntheticDataRemoved=true;
 await fs.writeFile(connectionFile,JSON.stringify({...connection,verifiedAt:new Date().toISOString()}),{mode:0o600});report.passed=true;
}catch(reason){report.error=String(reason);throw reason;}
finally{report.remainingSyntheticDocument=!!probeId;await fs.mkdir('docs/redesign-2026-10-22/qa/integrations',{recursive:true});await fs.writeFile('docs/redesign-2026-10-22/qa/integrations/site-store-staging.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));}
