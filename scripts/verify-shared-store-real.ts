/** Real shared Data Store + two independent BFF/store instances + one real AI generation. */
import fs from'node:fs/promises';import{createHash,randomBytes,randomUUID}from'node:crypto';import assert from'node:assert/strict';
import{CatalisaSessionStore}from'../server/site/catalisa-store';import{CatalisaConceptGenerator}from'../server/site/integrations';import{createSiteApi}from'../server/site/api';import type{SessionState}from'../server/site/types';
const config=JSON.parse(await fs.readFile('.local/site/staging-connection.json','utf8')),connection=JSON.parse(await fs.readFile('.local/site/store-connection.json','utf8'));
if(config.origin!=='https://panel-api.wpp.bb.stg.catalisa.app'||connection.origin!==config.origin||!connection.verifiedAt)throw Error('Verified staging store required');
const settings={origin:config.origin,token:config.token,ownerEmail:'admin@catalisa.app',collection:connection.collection};const storeA=new CatalisaSessionStore(settings),storeB=new CatalisaSessionStore(settings);
const provider=new CatalisaConceptGenerator({agentOrigin:config.origin,agentToken:config.token,agentId:config.agentId,ownerEmail:settings.ownerEmail},false);let generationCalls=0;
const generator={generate:async(...args:Parameters<typeof provider.generate>)=>{generationCalls++;return provider.generate(...args);}};
const secret=randomBytes(32).toString('hex'),origin='https://site-smoke.example.invalid',network='shared-store-smoke-'+randomUUID(),options={secret,origins:[origin],secure:true,generator};
const a=createSiteApi({...options,store:storeA}),b=createSiteApi({...options,store:storeB});
const call=(api:typeof a,route:string,method='GET',body?:unknown,cookie='',key=randomUUID())=>api(new Request(origin+'/api/site/'+route,{method,headers:{Origin:origin,Cookie:cookie,'Content-Type':'application/json','Idempotency-Key':key},...(body===undefined?{}:{body:JSON.stringify(body)})}),network);
const hashCookie=(cookie:string)=>createHash('sha256').update(cookie.slice(cookie.indexOf('=')+1)).digest('hex');
const hashes:string[]=[];let stage='session',passed=false;const report:Record<string,unknown>={date:new Date().toISOString(),scope:'Real staging Data Store, two independent BFF/store instances, real agent inference, no SQLite, no outbound messages or handoff.'};
try{
 const created=await call(a,'sessions','POST');assert.equal(created.status,201);const cookie=created.headers.get('set-cookie')!.split(';')[0];hashes.push(hashCookie(cookie));assert.match(created.headers.get('set-cookie')!,/; Secure/);
 const initial=await(await call(b,'session','GET',undefined,cookie)).json();assert.equal(initial.session.briefVersion,0);
 stage='idempotency';const idea={clientMessageId:randomUUID(),step:'idea',text:'Organizar pedidos pelo WhatsApp',briefVersion:0},key=randomUUID();const first=await call(a,'messages','POST',idea,cookie,key);assert.equal(first.status,201);const firstBody=await first.json();assert.deepEqual(await(await call(b,'messages','POST',idea,cookie,key)).json(),firstBody);
 stage='concurrency';const variants=await Promise.all(['Loja de roupas pequena','Atendimento de uma loja'].map((text,index)=>call(index?a:b,'messages','POST',{clientMessageId:randomUUID(),step:'context',text,briefVersion:1},cookie)));assert.deepEqual(variants.map(response=>response.status).sort(),[201,409]);
 assert.equal((await call(a,'messages','POST',{clientMessageId:randomUUID(),step:'goal',text:'Vender com revisão humana',briefVersion:2},cookie)).status,201);
 assert.equal((await call(b,'identity','POST',{name:'Pessoa fictícia de smoke compartilhado',briefVersion:3},cookie)).status,201);
 assert.equal((await call(a,'contact','POST',{email:'shared.store.smoke@example.invalid',briefVersion:3},cookie)).status,200);
 const snapshot=await(await call(b,'session','GET',undefined,cookie)).json();assert.equal(snapshot.messages.length,3);assert.equal(snapshot.contactDetails.email,'shared.store.smoke@example.invalid');
 stage='real-generation';const generationKey=randomUUID(),start=Date.now(),pending=call(a,'concepts','POST',{briefVersion:3},cookie,generationKey);let pendingVisible=false;
 for(let index=0;index<10;index++){await new Promise(resolve=>setTimeout(resolve,350));const read=await(await call(b,'session','GET',undefined,cookie)).json();if(read.pendingJob){pendingVisible=true;break;}}
 const generated=await pending;assert.equal(generated.status,202);const job=await generated.json();const result=await(await call(b,'jobs/'+job.jobRef,'GET',undefined,cookie)).json();assert.equal(result.status,'succeeded',JSON.stringify(result.error));assert.ok(pendingVisible);assert.equal(generationCalls,1);
 const replay=await call(b,'concepts','POST',{briefVersion:3},cookie,generationKey);assert.equal(replay.status,202);assert.deepEqual(await replay.json(),job);assert.equal(generationCalls,1);
 const recovered=await(await call(b,'session','GET',undefined,cookie)).json();assert.equal(recovered.latestConcept.conceptRef,result.concept.conceptRef);
 report.generation={elapsedMs:Date.now()-start,title:result.concept.content.title,calls:generationCalls,pendingVisible};report.atomicReplay=true;report.casStatuses=[201,409];report.sharedRecovery=true;
 stage='isolation';const other=await call(b,'sessions','POST');const otherCookie=other.headers.get('set-cookie')!.split(';')[0];hashes.push(hashCookie(otherCookie));assert.equal((await call(b,'jobs/'+job.jobRef,'GET',undefined,otherCookie)).status,404);report.isolation=true;
 stage='retention';const expiredHash=randomBytes(32).toString('hex');hashes.push(expiredHash);const state:SessionState={session:{sessionRef:randomUUID(),briefVersion:0,identityStatus:'anonymous',leadStatus:'none'},briefing:{},messages:[]};await storeA.create(expiredHash,state,new Date(Date.now()-1000).toISOString());assert.equal(await storeB.read(expiredHash),null);const cleanup=await storeB.cleanup(10,Date.now()+24000);assert.ok(cleanup.removed>=1);report.expiredSessionExcluded=true;report.retentionCleanup=cleanup;
 passed=true;
}catch(reason){report.error=String(reason);throw reason;}
finally{
 let removed=0;for(const hash of hashes)try{if(await storeA.eraseSession(hash))removed++;}catch{ /* report remaining below */ }
 report.passed=passed;report.stage=stage;report.syntheticSessionsRemoved=removed;report.syntheticSessionsCreated=hashes.length;await fs.mkdir('docs/redesign-2026-10-22/qa/integrations',{recursive:true});await fs.writeFile('docs/redesign-2026-10-22/qa/integrations/shared-store-real.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
