/** Production-host simulation. Public vendor SDK, every collection request intercepted. */
import{chromium,expect}from'@playwright/test';import fs from'node:fs/promises';import path from'node:path';
import fixture from'../docs/redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/contracts/concept.example.json';
const dist=path.resolve(process.env.SITE_SMOKE_DIST||'/tmp/catalisa-seo-candidate'),output='docs/redesign-2026-10-22/qa/seo-detailed/browser';await fs.mkdir(output,{recursive:true});
const googleSdk=await fs.readFile('.local/site/seo-inventory/ga-correct-sdk.js');
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const contexts:Awaited<ReturnType<typeof browser.newContext>>[]=[],checks:string[]=[],errors:string[]=[],collections:{host:string;url:string;body:string}[]=[],vendorRequests:string[]=[];
let passed=false,failure:unknown;
const snapshot:any={session:{sessionRef:'synthetic-private-session',briefVersion:3,identityStatus:'provisional',leadStatus:'pending'},briefing:{idea:'PRIVATE_IDEA_DO_NOT_MEASURE',context:'PRIVATE_CONTEXT_DO_NOT_MEASURE',goal:'Explorar'},displayName:'PRIVATE_NAME_DO_NOT_MEASURE',identity:{contactRef:'synthetic-contact',leadRef:'synthetic-lead',identityStatus:'provisional',briefVersion:3},contactDetails:{email:'measurement.private@example.invalid',phone:'+12025550123'},messages:[],availableChannels:['here'],generationAvailable:true};
async function setup(host='catalisa.io',consent?:string){
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});contexts.push(context);
 await context.addInitScript(()=>localStorage.setItem('catalisa_site_locale','pt-BR'));
 if(consent)await context.addInitScript(value=>localStorage.setItem('catalisa_cookie_consent',value),consent);
 const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
 await context.route('**/*',async route=>{
  const req=route.request(),url=new URL(req.url());
  if(url.hostname!==host){
   if(url.hostname==='www.googletagmanager.com'&&url.pathname==='/gtag/js'){vendorRequests.push(req.url());return route.fulfill({status:200,contentType:'text/javascript',body:googleSdk});}
   if(req.resourceType()==='script'&&req.method()==='GET'&&['www.googletagmanager.com','www.clarity.ms','scripts.clarity.ms'].includes(url.hostname)){vendorRequests.push(req.url());return route.continue();}
   if(/google-analytics\.com$|clarity\.ms$|doubleclick\.net$|google\.com$/.test(url.hostname)){collections.push({host:url.hostname,url:req.url(),body:req.postData()||''});return route.fulfill({status:204,body:''});}
   return route.abort();
  }
  if(url.pathname.startsWith('/api/site/')){
   const name=url.pathname.slice('/api/site/'.length);let data:any=snapshot,status=200;
   if(name==='concepts'){snapshot.latestConcept={conceptRef:'PRIVATE_CONCEPT_REFERENCE',version:1,briefVersion:3,content:fixture};data={jobRef:'qa-job',status:'running'};status=202;}
   else if(name==='jobs/qa-job')data={jobRef:'qa-job',status:'succeeded',concept:snapshot.latestConcept};
   return route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
  }
  const pathname=decodeURIComponent(url.pathname);let file=path.resolve(dist,'.'+pathname);if(!file.startsWith(dist+path.sep)&&file!==dist)return route.abort();
  try{if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');await fs.access(file);}catch{file=path.join(dist,/^\/(?:apresentacao|treinamento|en\/(?:presentation|training))/.test(pathname)?'spa.html':'404.html');try{await fs.access(file);}catch{file=path.join(dist,'index.html');}}
  const mime:Record<string,string>={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.ttf':'font/ttf'};
  return route.fulfill({status:200,contentType:mime[path.extname(file)]||'application/octet-stream',body:await fs.readFile(file)});
 });return{context,page,origin:'https://'+host};
}
function events(){return collections.filter(x=>/google-analytics\.com$/.test(x.host)).flatMap(record=>{const base=new URL(record.url).searchParams;const lines=record.body?record.body.split('\n'):[''];return lines.map(line=>{const values=new URLSearchParams(base);for(const[key,value]of new URLSearchParams(line))values.set(key,value);return{event:values.get('en'),location:values.get('dl'),campaignSource:values.get('cs'),ctaType:values.get('ep.cta_type'),measurementId:values.get('tid')};});});}
try{
 const{page,origin}=await setup();await page.goto(origin+'/?utm_source=linkedin&utm_campaign=products');await expect(page.locator('.c-consent')).toBeVisible();
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await page.screenshot({path:output+'/consent-'+width+'.png'});}
 expect(vendorRequests).toHaveLength(0);expect(collections).toHaveLength(0);checks.push('No optional SDK or collection before consent; banner fits all four widths');
 await page.getByRole('button',{name:'Aceitar analytics',exact:true}).click();await expect.poll(()=>events().filter(x=>x.event==='page_view').length,{timeout:20000}).toBe(1);
 expect(vendorRequests.filter(x=>x.includes('/gtag/js'))).toHaveLength(1);checks.push('Existing Google SDK produces exactly one initial page_view after consent');await expect.poll(()=>vendorRequests.some(url=>url.includes('clarity.ms/tag/z4073yqv5z')),{timeout:20000}).toBe(true);checks.push('New user-owned Clarity project z4073yqv5z is the requested SDK after consent');
 await page.locator('.c-footer a[href="/mapa"]').click();await expect(page.locator('main h1')).toContainText('Todas as conexões');
 await expect.poll(()=>events().filter(x=>x.event==='page_view').length,{timeout:20000}).toBe(2);expect(events().filter(x=>x.event==='page_view').map(x=>new URL(x.location!).pathname)).toEqual(['/','/mapa']);checks.push('One Google automatic history page_view per native route, with correct URL');
 await page.goto(origin+'/produtos');await page.waitForLoadState('networkidle');await page.locator('[data-product=banking] .p-product-detail').click();await expect(page).toHaveURL(/\/ecossistema\/banking/);await expect.poll(()=>events().some(x=>x.event==='cta_click'&&x.ctaType==='product_banking_details'),{timeout:20000}).toBe(true);checks.push('Products directory click reports the fixed product slug and detail/showcase kind');
 await page.goto(origin+'/produtos');await page.waitForLoadState('networkidle');await page.locator('[data-product=credit] .p-product-button').click();await expect(page).toHaveURL(/\/contato\/?$/);await expect.poll(()=>events().filter(x=>x.event==='cta_click'&&x.ctaType==='product_credit_contact').length,{timeout:20000}).toBe(1);checks.push('Financial Contact CTA reports exactly one product-specific contact click');
 const clarityBefore=vendorRequests.filter(x=>x.includes('clarity')).length;await page.goto(origin+'/contato');await expect(page.locator('.z-view-summary')).toBeVisible({timeout:20000});
 expect(await page.locator('main').getAttribute('data-clarity-mask')).toBe('true');
 await page.locator('[data-z="continue"]').click();await expect(page.locator('.zd-workspace')).toBeVisible({timeout:20000});
 await expect.poll(()=>events().some(x=>x.event==='concept_ready'),{timeout:20000}).toBe(true);
 expect(vendorRequests.filter(x=>x.includes('clarity')).length).toBe(clarityBefore);checks.push('Controlled Contact request reports requested/ready without loading session replay');
 const payload=JSON.stringify(collections);for(const forbidden of ['PRIVATE_IDEA','PRIVATE_CONTEXT','PRIVATE_NAME','measurement.private','12025550123','PRIVATE_CONCEPT_REFERENCE','synthetic-private-session'])expect(payload).not.toContain(forbidden);checks.push('No seeded identity, contact, idea, concept reference or session reference in intercepted collection requests');
 await page.getByRole('button',{name:'Preferências de cookies',exact:true}).click();await page.getByRole('button',{name:'Recusar',exact:true}).click();await expect(page.locator('.z-view-summary,.zd-workspace')).toBeVisible({timeout:20000});expect(await page.evaluate(()=>localStorage.getItem('catalisa_cookie_consent'))).toBe('denied');
 const loaded=vendorRequests.length;await page.reload();await expect(page.locator('main')).toBeVisible();expect(vendorRequests.length).toBe(loaded);checks.push('Consent revocation persists and reloads without optional vendors');
 for(const[host,url]of [['catalisa.io','/lab?email=private%40example.invalid'],['catalisa.io','/apresentacao/i/private-token']]){
  const before=vendorRequests.length;const sandbox=await setup(host,'granted');await sandbox.page.goto(sandbox.origin+url);await sandbox.page.waitForTimeout(1200);expect(vendorRequests.length).toBe(before);
 }checks.push('Even with an old grant: private query and authenticated invite do not load production measurement');
 expect(events().every(value=>value.measurementId==='G-JYJWH17ZVX')).toBe(true);checks.push('Every Google event targets the account-verified Catalisa property G-JYJWH17ZVX');expect(errors).toEqual([]);passed=true;
}catch(reason){failure=String(reason);process.exitCode=1;}
finally{for(const context of contexts)await context.close();await browser.close();const report={checkedAt:new Date().toISOString(),passed,scope:'Local artifact fulfilled at a production hostname; original public Google SDK snapshot and public Clarity scripts. All collection requests intercepted with204; no events delivered to production Analytics/Clarity accounts. Contact inference/session API controlled, not a real AI smoke.',checks,events:events(),vendorScriptRequests:vendorRequests.length,collectionRequestsIntercepted:collections.length,externalCollectionDelivered:false,errors,failure};await fs.writeFile(output+'/verification.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));}
