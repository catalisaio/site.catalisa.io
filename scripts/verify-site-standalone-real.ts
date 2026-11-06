/** Actual final Node bundle over loopback HTTP; configured public origin remains HTTPS. */
import assert from'node:assert/strict';import fs from'node:fs/promises';import{parse}from'dotenv';import{createHash}from'node:crypto';import{CatalisaSessionStore}from'../server/site/catalisa-store';
const base='http://127.0.0.1:8096',origin='https://site-staging.catalisa.io';const env=parse(await fs.readFile('.local/site/staging-runtime.env'));
const request=(route:string,init:RequestInit={})=>fetch(base+route,{...init,signal:AbortSignal.timeout(20000)});
const report:Record<string,unknown>={date:new Date().toISOString(),passed:false,scope:'Final bundled Node server over actual private HTTP, configured HTTPS origin; real staging shared persistence, synthetic session only.'};let cookie='';
try{
 assert.equal((await request('/healthz')).status,200);assert.equal((await request('/api/site/session')).status,401);assert.equal((await request('/unexpected-route')).status,404);report.routing=true;
 const team=await request('/api/site/team/');assert.equal(team.status,200);assert.ok(team.headers.get('content-security-policy')?.includes("frame-ancestors 'none'"));assert.equal(team.headers.get('cache-control'),'no-store');report.teamPortalCsp=true;
 assert.equal((await request('/api/site/sessions',{method:'POST',headers:{Origin:'https://evil.invalid'}})).status,403);report.originEnforced=true;
 assert.equal((await request('/api/site/sessions',{method:'POST',headers:{Origin:origin,'Content-Encoding':'gzip'},body:'{}'})).status,415);report.encodingRejected=true;
 assert.equal((await request('/api/site/sessions',{method:'POST',headers:{Origin:origin},body:'x'.repeat(17000)})).status,413);report.bodyLimit=true;
 const created=await request('/api/site/sessions',{method:'POST',headers:{Origin:origin}});assert.equal(created.status,201);cookie=created.headers.get('set-cookie')!.split(';')[0];assert.match(created.headers.get('set-cookie')!,/Secure/);assert.match(created.headers.get('set-cookie')!,/HttpOnly/);report.secureCookie=true;
 const response=await request('/api/site/session',{headers:{Cookie:cookie}});assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');const snapshot=await response.json();assert.deepEqual(snapshot.availableChannels,['here']);assert.equal(snapshot.generationAvailable,true);report.realPersistence=true;report.configuredAgentAndInbox=true;report.passed=true;
}finally{
 if(cookie){const store=new CatalisaSessionStore({origin:env.SITE_CATALISA_ORIGIN,token:env.SITE_CATALISA_TOKEN,ownerEmail:env.SITE_CATALISA_OWNER_EMAIL,collection:env.SITE_STORE_COLLECTION});await store.eraseSession(createHash('sha256').update(cookie.split('=')[1]).digest('hex'));report.syntheticSessionRemoved=true;}
 await fs.writeFile('docs/redesign-2026-10-22/qa/integrations/standalone-real.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
