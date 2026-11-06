/** Prove the live local preview reads the shared store, without modifying a real visitor. */
import fs from'node:fs/promises';import{createHash,randomUUID}from'node:crypto';import{parse}from'dotenv';import assert from'node:assert/strict';import{CatalisaSessionStore}from'../server/site/catalisa-store';
const env=parse(await fs.readFile('.env.local'));assert.equal(env.SITE_STORE,'catalisa');
const file=JSON.parse(await fs.readFile('.local/site/smoke-real-clinica-agenda.json','utf8')),cookie=file.cookies.find((item:{name:string})=>item.name==='catalisa_site');assert.ok(cookie);
const hash=createHash('sha256').update(cookie.value).digest('hex'),store=new CatalisaSessionStore({origin:env.SITE_CATALISA_ORIGIN,token:env.SITE_CATALISA_TOKEN,ownerEmail:env.SITE_CATALISA_OWNER_EMAIL,collection:env.SITE_STORE_COLLECTION});
const saved=await store.read(hash);assert.ok(saved);assert.equal(saved.state.name,'Paulo — teste');assert.equal(saved.state.contactDetails?.phone,'+12025550123');
const marker=randomUUID(),key='internal:preview-proof:'+marker;saved.state.messages.push({messageRef:marker,role:'system',step:'shared-store-proof',text:'Verificação fictícia de persistência compartilhada.',occurredAt:new Date().toISOString(),briefVersion:saved.state.session.briefVersion});
const result=await store.commit(hash,saved.revision,saved.state,key,{digest:createHash('sha256').update(key).digest('hex'),status:200,body:{}});assert.equal(result.kind,'committed');let passed=false;
try{
 const response=await fetch('http://127.0.0.1:5175/api/site/session',{headers:{Cookie:'catalisa_site='+cookie.value},signal:AbortSignal.timeout(15000)});assert.equal(response.status,200);const snapshot=await response.json();assert.ok(snapshot.messages.some((message:{messageRef:string})=>message.messageRef===marker));assert.equal(snapshot.latestConcept?.conceptRef,saved.state.concepts?.at(-1)?.conceptRef);passed=true;
}finally{
 const current=await store.read(hash);assert.ok(current);current.state.messages=current.state.messages.filter(message=>message.messageRef!==marker);const cleanupKey='internal:preview-proof-cleanup:'+marker;assert.equal((await store.commit(hash,current.revision,current.state,cleanupKey,{digest:createHash('sha256').update(cleanupKey).digest('hex'),status:200,body:{}})).kind,'committed');
 const report={date:new Date().toISOString(),passed,scope:'Live preview read marker written by an independent Data Store client to a previously fictional smoke session. Marker removed; no real visitor changed.',backend:'catalisa',cookiePreserved:true,conceptPreserved:true,syntheticMarkerRemoved:true};await fs.writeFile('docs/redesign-2026-10-22/qa/integrations/preview-shared-store.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
