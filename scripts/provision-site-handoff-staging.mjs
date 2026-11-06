/** Site Catalisa handoff resources in STAGING: private ledger collection, dedicated pipeline and lead type.
 * Idempotent. Never deploys, never creates leads, never sends messages, never edits resources it did not create.
 * DRY_RUN=1 performs reads only. Sanitized summary on stdout; references in .local/site (mode 600). */
import fs from'node:fs/promises';import{randomUUID}from'node:crypto';
const origin='https://panel-api.wpp.bb.stg.catalisa.app',owner='admin@catalisa.app',dry=process.env.DRY_RUN==='1';
const cfg=JSON.parse(await fs.readFile('.local/site/staging-connection.json','utf8'));
if(cfg.origin!==origin||typeof cfg.token!=='string'||!cfg.token)throw Error('Staging connection required');
const collection='site_catalisa_handoffs_v1',purpose='catalisa-site-handoff-v1',leadType='SITE_CATALISA',pipelineName='Site Catalisa',firstStage='Novo pelo site';
const marker='Site Catalisa — fila de encaminhamentos do site. Gerenciado por site.catalisa.io; não editar manualmente.';
const workflowName='Site Catalisa — Preparar registro de encaminhamentos';
const base='/data-store/collections/'+collection,connectionFile='.local/site/handoff-connection.json',reportFile='.local/site/handoff-provision-report.json';
const headers={Authorization:'Bearer '+cfg.token,'Content-Type':'application/json',Accept:'application/json'};
const shape=r=>r.split('?')[0].replace(/\/[\w-]{20,}/g,'/:id');
async function raw(r,method='GET',body){const res=await fetch(origin+r,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(20000),redirect:'error'});return{status:res.status,body:await res.json().catch(()=>({}))};}
async function request(r,method='GET',body){if(dry&&method!=='GET')throw Error('DRY_RUN blocks '+method+' '+shape(r));const res=await raw(r,method,body);if(res.status<200||res.status>=300)throw Error(method+' '+shape(r)+' HTTP '+res.status);return res.body;}
const list=x=>Array.isArray(x)?x:Array.isArray(x?.data)?x.data:Array.isArray(x?.items)?x.items:[];
const unwrap=x=>x?.data&&typeof x.data==='object'&&!Array.isArray(x.data)?x.data:x;
await fs.mkdir('.local/site',{recursive:true,mode:0o700});
let connection={origin,collection,leadType};try{connection={...connection,...JSON.parse(await fs.readFile(connectionFile,'utf8'))};}catch{}
if(connection.origin!==origin||connection.collection!==collection||connection.leadType!==leadType)throw Error('Handoff connection mismatch');
const save=async()=>{if(dry)return;await fs.writeFile(connectionFile,JSON.stringify(connection,null,2)+'\n',{mode:0o600});await fs.chmod(connectionFile,0o600);};
const report={date:new Date().toISOString(),dryRun:dry,origin,passed:false,created:{},ledger:{},pipeline:{},leadType:{},leadCreatedFanout:{},whatsapp:{},channels:{},blockers:[],productionDeploy:false,leadsCreated:0,messagesSent:0,preexistingResourcesModified:false};
const detail={leadCreatedFanout:[]};let probeId;
try{
 const me=await request('/auth/me');if((me.email??me.user?.email)!==owner)throw Error('Owner mismatch');report.ownerMatches=true;

 // 1. Private ledger. The proxy POST /data-store/collections forwards only the name, so pii and the
 //    encrypted schema go through DATASTORE_CREATE_COLLECTION, exactly like the session store.
 let meta=await raw(base);
 if(meta.status===404&&dry)report.ledger.wouldCreate=true;
 else if(meta.status===404){
  if(!connection.ledgerWorkflowId){
   const same=list(await request('/workflows?limit=100&offset=0&search='+encodeURIComponent(workflowName))).filter(w=>w.name===workflowName);
   if(same.length>1||same.some(w=>w.description!==marker))throw Error('Reserved workflow name already used by another resource; not modifying it');
   const workflow=same[0]??unwrap(await request('/workflows','POST',{name:workflowName,description:marker,active:false,trigger:{type:'manual',name:'Provisionamento manual do site',active:false,config:{}},actions:[{type:'DATASTORE_CREATE_COLLECTION',name:'Criar coleção privada de encaminhamentos',order:1,active:true,config:{name:collection,pii:true,jsonSchema:{type:'object',properties:{purpose:{type:'string',enum:[purpose]},packet:{type:'object',encrypted:true}},required:['purpose']}}}]}));
   report.created.ledgerWorkflow=!same[0];connection.ledgerWorkflowId=workflow.id;await save();
  }
  const definition=unwrap(await request('/workflows/'+connection.ledgerWorkflowId));
  if(definition.description!==marker||definition.actions?.length!==1||definition.actions[0].type!=='DATASTORE_CREATE_COLLECTION'||definition.actions[0].config?.name!==collection)throw Error('Ledger workflow differs from the site contract');
  const execution=await request('/workflows/'+connection.ledgerWorkflowId+'/execute','POST',{manualExecution:true,payload:{purpose:'site-handoff-ledger-provisioning'}});connection.ledgerExecutionId=execution.executionId;await save();
  for(let i=0;i<25;i++){meta=await raw(base);if(meta.status===200)break;await new Promise(r=>setTimeout(r,800));}
  if(meta.status!==200)throw Error('Ledger collection not created');report.created.ledgerCollection=true;
 }else if(meta.status!==200)throw Error('Ledger metadata HTTP '+meta.status);
 if(meta.status===200){const m=meta.body.data??meta.body;if(m.pii!==true||m.jsonSchema?.properties?.packet?.encrypted!==true||!m.jsonSchema?.properties?.purpose?.enum?.includes(purpose))throw Error('Ledger collection privacy/schema differs from the site contract');report.ledger={...report.ledger,pii:true,encryptedFields:['packet']};}

 // 2. Synthetic ledger smoke (no personal data): natural key, CAS, lookup + decryption, erase.
 if(!dry&&report.ledger.pii){
  const key='smoke-handoff:'+randomUUID(),data={purpose,kind:'smoke',handoffRef:'handoff_smoke',packet:{note:'Dado fictício de verificação'}};
  const doc=unwrap(await request(base+'/documents','POST',{docKey:key,data}));probeId=doc?.id;if(!probeId||!Number.isInteger(doc.version))throw Error('Ledger document contract mismatch');
  const dup=await raw(base+'/documents','POST',{docKey:key,data});if(dup.status!==409)throw Error('Ledger natural key did not reject duplicate');report.ledger.duplicateCreate=409;
  const cas=(await Promise.all(['a','b'].map(side=>raw(base+'/documents/'+probeId,'PUT',{expectedVersion:doc.version,data:{...data,packet:{note:side}}})))).map(r=>r.status).sort();
  if(JSON.stringify(cas)!=='[200,409]')throw Error('Ledger CAS did not allow exactly one writer');report.ledger.concurrentCas=cas;
  const q=await request(base+'/query','POST',{where:{$docKey:{op:'eq',value:key}},page:1,pageSize:2});
  if(q.data?.length!==1||q.data[0].id!==probeId||!['a','b'].includes(q.data[0].attributes?.packet?.note))throw Error('Ledger lookup/decryption mismatch');report.ledger.lookupAndDecrypt=true;
  await request(base+'/documents/'+probeId,'PUT',{expectedVersion:q.data[0].version,data:{purpose,kind:'erased',handoffRef:'handoff_smoke',packet:{}}});await request(base+'/documents/'+probeId,'DELETE');probeId=undefined;report.ledger.syntheticRemoved=true;
 }

 // 3. Dedicated pipeline: the team queue on the Kanban. A foreign "Site Catalisa" pipeline aborts.
 let pipeline=list(await request('/pipelines')).find(p=>p.name===pipelineName);
 if(pipeline&&pipeline.description!==marker)throw Error('A "Site Catalisa" pipeline exists and is not managed by the site; not modifying it');
 if(!pipeline&&!dry){pipeline=unwrap(await request('/pipelines','POST',{name:pipelineName,description:marker,isDefault:false,stages:[{name:firstStage,category:'OPEN',color:'blue'},{name:'Em atendimento',category:'OPEN',color:'purple'},{name:'Convertido',category:'WON',color:'green'},{name:'Sem continuidade',category:'LOST',color:'gray'}]}));report.created.pipeline=true;}
 if(pipeline){
  pipeline=unwrap(await request('/pipelines/'+pipeline.id));const stage=(pipeline.stages??[]).find(s=>s.name===firstStage);
  if(!stage||stage.category!=='OPEN'||stage.active===false)throw Error('Site pipeline first stage missing; not modifying it');
  connection.pipelineId=pipeline.id;connection.stageId=stage.id;await save();report.pipeline={ready:true,stages:pipeline.stages.length};
 }else report.pipeline={wouldCreate:true};

 // 4. Dedicated lead type, bound to the pipeline. A foreign SITE_CATALISA aborts.
 let type=list(await request('/lead-types?'+new URLSearchParams({'filter[name][eq]':leadType}))).find(t=>t.name===leadType);
 if(type&&type.description!==marker)throw Error('Lead type SITE_CATALISA exists and is not managed by the site; not modifying it');
 if(!type&&!dry&&connection.pipelineId){type=unwrap(await request('/lead-types','POST',{name:leadType,description:marker,color:'blue',active:true,order:0,pipelineId:connection.pipelineId}));report.created.leadType=true;}
 if(type){if(type.active===false||(type.pipelineId&&type.pipelineId!==connection.pipelineId))throw Error('Lead type differs from the site contract; not modifying it');connection.leadTypeId=type.id;await save();report.leadType={ready:true};}
 else report.leadType={wouldCreate:true};

 // 5. Read-only fan-out scan: every lead emits lead.created; which active workflows would react to a site lead?
 const workflows=[];for(let offset=0;offset<3000;offset+=100){const items=list(await request('/workflows?limit=100&offset='+offset));workflows.push(...items);if(items.length<100)break;}
 const isLeadCreated=t=>[t.type,t.config?.eventType,t.config?.event].some(v=>typeof v==='string'&&/^(LEAD_CREATED|lead\.created)$/i.test(v));
 const outward=/^(SEND_|CREATE_GROUP|WEB_REQUEST|CUSTOM_ACTION|RUN_AGENT|AI_HUB_AGENT|RUN_WORKFLOW|DISPATCH_EVENT|CREATE_CHARGE|CREATE_PAYMENT)/;
 for(const w of workflows){if(!w.active||w.id===connection.ledgerWorkflowId)continue;for(const t of w.triggers??[]){
  if(t.active===false||!isLeadCreated(t))continue;const only=t.config?.filters?.leadType??t.config?.leadTypeName??t.config?.leadType;
  if(typeof only==='string'&&only!==leadType&&!only.includes('{{'))continue;
  detail.leadCreatedFanout.push({workflowId:w.id,name:String(w.name??'').slice(0,120),outwardActions:[...new Set((w.actions??[]).filter(a=>a.active!==false&&outward.test(String(a.type))).map(a=>a.type))]});}}
 report.leadCreatedFanout={workflowsScanned:workflows.length,reactToSiteLeads:detail.leadCreatedFanout.length,withOutwardActions:detail.leadCreatedFanout.filter(r=>r.outwardActions.length).length};
 if(detail.leadCreatedFanout.length)report.blockers.push('lead.created fan-out: review the listed workflows (in '+reportFile+') before any real lead smoke');

 // 6. WhatsApp: delivery evidence needs the team to send from a connected device in this account.
 let connected=0;try{const devices=list(await request('/whatsapp-devices'));connected=devices.filter(d=>/^(connected|open|active)$/i.test(String(d.status??d.connectionStatus??''))).length;report.whatsapp={devices:devices.length,connected,heuristic:'status field name/values not verified'};}catch(error){report.whatsapp={error:String(error.message)};}
 report.channels={recommended:[...(connected?['whatsapp']:[]),'email'].join(','),here:'unavailable: no product route for the team to answer inside the site',email:'only with a typed phone (CRM lead requires phone); assignment provable, delivery never',whatsapp:connected?'delivery provable from outbound message status in the lead chat':'blocked: no connected device seen'};
 if(!connected)report.blockers.push('no connected WhatsApp device seen: whatsapp delivery cannot be evidenced');
 report.env={SITE_HANDOFF_BACKEND:'catalisa',SITE_HANDOFF_COLLECTION:collection,SITE_HANDOFF_LEAD_TYPE:leadType,SITE_HANDOFF_STAGE_ID:connection.stageId?'see '+connectionFile:null,SITE_HANDOFF_CHANNELS:report.channels.recommended};
 report.passed=!dry&&!!(report.ledger.lookupAndDecrypt&&connection.stageId&&connection.leadTypeId)&&!detail.leadCreatedFanout.length;
}catch(reason){report.error=String(reason.message??reason);process.exitCode=1;}
finally{
 report.remainingSyntheticDocument=!!probeId;
 await fs.writeFile(reportFile,JSON.stringify({...report,detail},null,2)+'\n',{mode:0o600});await fs.chmod(reportFile,0o600);
 console.log(JSON.stringify(report,null,2));
}
