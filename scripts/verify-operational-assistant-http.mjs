import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
const origin=process.env.OP_ASSISTANT_ORIGIN,release=process.env.OP_ASSISTANT_RELEASE;
if(!['https://site-staging.catalisa.io','https://catalisa.io'].includes(origin)||!release)throw Error('Explicit expected HTTPS origin and release required');
const artifact=process.env.OP_ASSISTANT_ARTIFACT||'.local/operational-assistant-integration/candidate-final';
const scope=origin.includes('staging')?'staging':'production',directory=new URL('../docs/redesign-2026-10-22/qa/operational-assistant/'+scope+'/',import.meta.url);await fs.mkdir(directory,{recursive:true});
const sha=body=>createHash('sha256').update(body).digest('hex');
const inventory=JSON.parse(await fs.readFile(path.join(artifact,'release-routes.json'))),routes=inventory.localizedPages.filter(item=>item.basePath==='/assistente-operacional');
const assembly=JSON.parse(await fs.readFile('docs/redesign-2026-10-22/qa/operational-assistant/delta-assembly.json'));
const report={origin,release,checkedAt:new Date().toISOString(),passed:false,checks:[],noMutations:true,realMessagesSent:false};
async function request(route){const response=await fetch(origin+route,{signal:AbortSignal.timeout(20000)});if(response.status!==404)assert.equal(response.headers.get('x-catalisa-site-release'),release,route);if(scope==='staging'){assert.match(response.headers.get('x-robots-tag')||'',/noindex/);assert.equal(response.headers.get('cache-control'),'no-store');}return {response,body:Buffer.from(await response.arrayBuffer())};}
try{
 for(const route of routes)for(const suffix of ['', '/']){const {response,body}=await request(route.path+suffix);assert.equal(response.status,200);const expected=await fs.readFile(path.join(artifact,route.path.slice(1),'index.html'));assert.equal(sha(body),sha(expected));assert.match(body.toString(),/op-assistant/);report.checks.push({path:route.path+suffix,status:200,finalPath:new URL(response.url).pathname,locale:route.lang,exactCandidateBytes:true});}
 for(const route of inventory.localizedPages.filter(item=>item.basePath==='/')){const {response,body}=await request(route.path);assert.equal(response.status,200);const expected=await fs.readFile(path.join(artifact,route.path==='/'?'index.html':route.path.slice(1)+'/index.html'));assert.equal(sha(body),sha(expected));report.checks.push({home:route.path,status:200,exactCandidateBytes:true});}
 const home=await fs.readFile(path.join(artifact,'index.html'),'utf8'),entry=home.match(/<script[^>]*type="module"[^>]*src="([^"]+)"/)?.[1];
 for(const asset of [entry,assembly.navigationExtension]){const {response,body}=await request(asset);assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/javascript/);assert.equal(sha(body),sha(await fs.readFile(path.join(artifact,asset))));report.checks.push({asset,status:200,exactCandidateBytes:true});}
 const {response:api}=await request('/api/site/session');assert.equal(api.status,401);report.checks.push({anonymousSession:401});
 const {response:missing}=await request('/operational-assistant-nonexistent-smoke');assert.equal(missing.status,404);report.checks.push({unknownPath:404});
 report.passed=true;
}finally{await fs.writeFile(new URL('http.json',directory),JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({passed:report.passed,origin,release,checks:report.checks.length}));
