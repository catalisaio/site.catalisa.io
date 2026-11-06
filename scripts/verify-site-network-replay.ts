/** Real staging receipt replay with a deliberately lost browser response. No new inference. */
import{chromium,expect}from'@playwright/test';import fs from'node:fs/promises';import{resolve}from'node:path';import{createHash}from'node:crypto';import{parse}from'dotenv';import{build}from'esbuild';import{siteSmokeEnvironment}from'./site-smoke-environment';
const smoke=await siteSmokeEnvironment();if(!smoke.staging)throw Error('Dedicated staging only');
const env=parse(await fs.readFile('.local/site/staging-runtime.env')),storage=JSON.parse(await fs.readFile('.local/site/smoke-staging-lab-network-failure.json','utf8'));
const cookie=storage.cookies.find((item:{name:string})=>item.name==='catalisa_site');if(!cookie)throw Error('Own synthetic cookie missing');
const headers={Authorization:'Bearer '+env.SITE_CATALISA_TOKEN,'Content-Type':'application/json'};
async function ownSession(){const response=await fetch(env.SITE_CATALISA_ORIGIN+'/data-store/collections/'+env.SITE_STORE_COLLECTION+'/query',{method:'POST',headers,body:JSON.stringify({where:{$docKey:{op:'eq',value:'session:'+createHash('sha256').update(cookie.value).digest('hex')}},page:1,pageSize:2}),signal:AbortSignal.timeout(20000)});expect(response.ok).toBe(true);const result=await response.json();expect(result.data).toHaveLength(1);return result.data[0].attributes;}
const before=await ownSession();if(before.state.name!=='Pessoa fictícia Lab real')throw Error('Only the known synthetic session may be replayed');
const job=Object.values(before.state.jobs)[0]as{job:{jobRef:string;status:string}};expect(job.job.status).toBe('succeeded');
const receipt=Object.entries(before.receipts).find(([,value])=>(value as{receipt?:{body?:{jobRef?:string}}}).receipt?.body?.jobRef===job.job.jobRef);if(!receipt)throw Error('Reserved receipt missing');
const source=await fs.readFile('src/redesign/site-client.ts','utf8'),module=await build({stdin:{contents:source,loader:'ts',resolveDir:resolve('src/redesign')},bundle:true,platform:'browser',format:'esm',target:'es2022',write:false,define:{'import.meta.env':'undefined'}});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:smoke.launchArgs}),context=await browser.newContext({...smoke.browserOptions,storageState:storage}),page=await context.newPage();
let dropped=false,posts=0,passed=false,error:unknown;const keys:string[]=[];
try{
 await context.route('**/*',smoke.restrictOrigin);
 await context.route('**/__qa_site_client.mjs',route=>route.fulfill({status:200,contentType:'text/javascript',body:module.outputFiles[0].text}));
 await context.route('**/api/site/concepts',async route=>{if(route.request().method()!=='POST')return route.continue();posts++;keys.push(route.request().headers()['idempotency-key']);if(dropped)return route.continue();const response=await route.fetch();expect(response.status()).toBe(202);dropped=true;await route.abort('failed');});
 await page.goto(smoke.origin+'/lab');await expect(page.locator('.l-result-title')).toContainText('Conceito gerado por IA',{timeout:20000});
 const result=await page.evaluate(async({key,version})=>{const modulePath='/__qa_site_client.mjs',module=await import(/* @vite-ignore */modulePath);return module.siteRequest('concepts','POST',{briefVersion:version},key);},{key:receipt[0],version:before.state.session.briefVersion});
 expect(result.jobRef).toBe(job.job.jobRef);expect(posts).toBe(2);expect(keys[0]).toBe(keys[1]);
 const after=await ownSession();expect(Object.keys(after.state.jobs)).toHaveLength(Object.keys(before.state.jobs).length);expect(after.state.concepts).toEqual(before.state.concepts);passed=true;
}catch(reason){error=String(reason);process.exitCode=1;}
finally{await browser.close();const report={checkedAt:new Date().toISOString(),passed,scope:'Actual staging read and replay of a previously completed synthetic Lab receipt. First browser acknowledgement deliberately aborted; current client retries the identical key. No new concept, inference, contact, external message or production change.',injectedResponseLoss:dropped,postRequests:posts,sameIdempotencyKey:keys.length===2&&keys[0]===keys[1],newGenerationJobs:passed?0:undefined,sourceSha256:createHash('sha256').update(source).digest('hex'),error};await fs.writeFile('docs/redesign-2026-10-22/qa/release/network-response-replay.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));}
