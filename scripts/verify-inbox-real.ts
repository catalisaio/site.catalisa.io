/** Real dedicated Data Store + Catalisa IAM. Synthetic visitor, here only; no external messages. */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';
import {parse} from 'dotenv';
import {siteRuntime} from '../server/site/runtime';
import {CatalisaSessionStore} from '../server/site/catalisa-store';
const env=parse(await fs.readFile('.env.local'));
assert.equal(env.SITE_HANDOFF_BACKEND,'site-inbox');assert.equal(env.SITE_INBOX_COLLECTION,'site_catalisa_inbox_v1');assert.match(env.SITE_CATALISA_ORIGIN,/\.stg\./);
const credentials=parse(await fs.readFile(path.join(os.homedir(),'.config/catalisa/admin.staging.env')));
assert.equal(credentials.EMAIL,'admin@catalisa.app');
const origin='https://site-staging.catalisa.io',configuration={...env,SITE_ALLOWED_ORIGINS:origin};
const first=await siteRuntime(configuration,false),second=await siteRuntime(configuration,false);
let visitor='',staff='',other='',ref='',sessionHash='';
const report:Record<string,unknown>={date:new Date().toISOString(),passed:false,scope:'Two independent site runtimes, actual staging IAM and encrypted Data Store, email-only synthetic contact, here-only team chat. No CRM lead, email or WhatsApp messages.'};
async function call(handler:typeof first,route:string,method='GET',body?:unknown,cookie=visitor){
 const response=await handler(new Request(origin+'/api/site/'+route,{method,headers:{Origin:origin,...(cookie?{Cookie:cookie}:{}),...(body===undefined?{}:{'Content-Type':'application/json','Idempotency-Key':randomUUID()})},...(body===undefined?{}:{body:JSON.stringify(body)})}),'192.0.2.74');
 const raw=await response.text();let value;try{value=JSON.parse(raw);}catch{value={html:raw};}return {response,value};
}
function ok(result:Awaited<ReturnType<typeof call>>,status=200){assert.equal(result.response.status,status,JSON.stringify({status:result.response.status,code:result.value.code}));return result.value;}
async function removePacket(){if(!ref)return;const base=env.SITE_CATALISA_ORIGIN+'/data-store/collections/site_catalisa_inbox_v1';const headers={Authorization:'Bearer '+env.SITE_CATALISA_TOKEN,'Content-Type':'application/json'};const query=await fetch(base+'/query',{method:'POST',headers,body:JSON.stringify({where:{$docKey:{op:'eq',value:'handoff:'+ref}},page:1,pageSize:2}),signal:AbortSignal.timeout(15000)});const found=await query.json();assert.equal(found.data?.length,1);const doc=found.data[0];assert.equal(doc.attributes.packet.original.contact.email,'inbox-smoke@example.invalid');const clear=await fetch(base+'/documents/'+doc.id,{method:'PUT',headers,body:JSON.stringify({expectedVersion:doc.version,data:{purpose:'catalisa-site-inbox-v1',kind:'erased',expiresAt:new Date().toISOString(),packet:{},staffSession:{},count:0}}),signal:AbortSignal.timeout(15000)});assert.equal(clear.status,200);const erased=await fetch(base+'/documents/'+doc.id,{method:'DELETE',headers,signal:AbortSignal.timeout(15000)});assert.ok([200,204].includes(erased.status));report.syntheticPacketRemoved=true;}
try{
 const initial=await call(first,'sessions','POST');ok(initial,201);visitor=initial.response.headers.get('set-cookie')!.split(';')[0];assert.match(initial.response.headers.get('set-cookie')!,/Secure/);sessionHash=createHash('sha256').update(visitor.split('=')[1]).digest('hex');
 ok(await call(first,'lab/briefing','POST',{idea:'Teste fictício: criar produto de crédito para lojistas, com revisão humana.',expectedVersion:0}));
 ok(await call(second,'identity','POST',{name:'Verificação fictícia Inbox',briefVersion:1}),201);
 ok(await call(first,'contact','POST',{email:'inbox-smoke@example.invalid',briefVersion:1}));
 const handoff=ok(await call(second,'handoffs','POST',{channel:'here',confirmed:true,contextVersion:1}),202);ref=handoff.handoffRef;
 assert.equal(ok(await call(first,'handoffs/'+ref)).status,'accepted');report.durableAcceptance=true;report.emailOnly=true;
 const unauthorized=await call(first,'team/requests','GET',undefined,visitor);assert.equal(unauthorized.response.status,401);report.visitorCannotReadTeam=true;
 const alternate=await call(first,'sessions','POST',undefined,'');ok(alternate,201);other=alternate.response.headers.get('set-cookie')!.split(';')[0];assert.equal((await call(second,'handoffs/'+ref+'/messages','GET',undefined,other)).response.status,404);report.otherCookieIsolated=true;
 const login=await call(first,'team/login','POST',{email:credentials.EMAIL,password:credentials.PASSWORD},'');ok(login);staff=login.response.headers.get('set-cookie')!.split(';')[0];assert.match(login.response.headers.get('set-cookie')!,/HttpOnly/);assert.match(login.response.headers.get('set-cookie')!,/Secure/);assert.equal(login.value.token,undefined);report.actualIamLogin=true;
 ok(await call(second,'team/session','GET',undefined,staff));report.staffAcrossInstances=true;
 const detail=ok(await call(second,'team/requests/'+ref,'GET',undefined,staff));assert.equal(detail.packet.contact.email,'inbox-smoke@example.invalid');assert.equal(detail.packet.confirmation.confirmed,true);assert.equal(ok(await call(first,'handoffs/'+ref)).status,'delivered');report.deliveryOnlyAfterOpened=true;
 ok(await call(first,'team/requests/'+ref+'/claim','POST',{},staff));assert.equal(ok(await call(second,'handoffs/'+ref)).status,'assigned');report.assignmentOnlyAfterClaim=true;
 const message={clientMessageId:randomUUID(),text:'Tenho pressa. Podemos começar pelo produto de crédito?'};ok(await call(first,'handoffs/'+ref+'/messages','POST',message));ok(await call(second,'handoffs/'+ref+'/messages','POST',message));assert.equal((await call(first,'handoffs/'+ref+'/messages','POST',{...message,text:'Outra mensagem'})).response.status,409);
 const reply={clientMessageId:randomUUID(),text:'Podemos começar pela jornada de crédito e pelas regras de análise. Vou revisar seu contexto.'};ok(await call(second,'team/requests/'+ref+'/replies','POST',reply,staff));ok(await call(first,'team/requests/'+ref+'/replies','POST',reply,staff));
 const restored=ok(await call(second,'handoffs/'+ref+'/messages'));assert.equal(restored.messages.length,2);assert.deepEqual(restored.messages.map((message:{role:string})=>message.role),['visitor','team']);assert.equal(restored.messages[1].text,reply.text);assert.ok(restored.messages.every((message:{actorId?:string})=>message.actorId===undefined));report.actualThreadReplyRestored=true;report.messageDeduplication=true;report.messageMismatchRejected=true;
 const cross=await first(new Request(origin+'/api/site/team/requests/'+ref+'/claim',{method:'POST',headers:{Origin:'https://example.invalid',Cookie:staff,'Content-Type':'application/json'},body:'{}'}),'192.0.2.74');assert.equal(cross.status,403);report.crossOriginRejected=true;
 ok(await call(second,'team/logout','POST',{},staff));assert.equal((await call(first,'team/session','GET',undefined,staff)).response.status,401);staff='';report.logoutAcrossInstances=true;report.passed=true;
}finally{
 if(staff)await call(second,'team/logout','POST',{},staff).catch(()=>{});
 await removePacket();
 const store=new CatalisaSessionStore({origin:env.SITE_CATALISA_ORIGIN,token:env.SITE_CATALISA_TOKEN,ownerEmail:env.SITE_CATALISA_OWNER_EMAIL,collection:env.SITE_STORE_COLLECTION});
 for(const cookie of [visitor,other].filter(Boolean)){const hash=createHash('sha256').update(cookie.split('=')[1]).digest('hex');await store.eraseSession(hash);}
 report.syntheticSessionsRemoved=true;
 await fs.writeFile('docs/redesign-2026-10-22/qa/integrations/inbox-real.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
