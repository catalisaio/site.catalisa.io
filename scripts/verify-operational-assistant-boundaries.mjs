import {chromium} from 'playwright';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
const origin=process.env.OP_ASSISTANT_ORIGIN||'http://127.0.0.1:8144';
const scope=process.env.OP_ASSISTANT_QA_SCOPE||'candidate';
const directory=new URL('../docs/redesign-2026-10-22/qa/operational-assistant/'+scope+'/',import.meta.url);await fs.mkdir(directory,{recursive:true});
const pages={ 'pt-BR':['/','/assistente-operacional'],'en-US':['/en','/en/operational-assistant'],'es-ES':['/es','/es/asistente-operativo'],'fr-FR':['/fr','/fr/assistant-operationnel'],'de-DE':['/de','/de/operativer-assistent'],'nl-NL':['/nl','/nl/operationele-assistent'],'da-DK':['/da','/da/driftsassistent']};
const baseline=await fs.readFile('.local/site/releases/production-20261027-hero-clarity/public/index.html','utf8');
const entry=baseline.match(/<script[^>]*type="module"[^>]*src="([^"]+)"/)?.[1];assert.ok(entry);
const report={origin,passed:false,checks:[],errors:[],realCrmChanges:false};
const browser=await chromium.launch({headless:true});
try{for(const [locale,[home,path]]of Object.entries(pages)){
 const page=await browser.newPage({locale,viewport:{width:1440,height:1000},reducedMotion:'reduce'});const documents=[];
 await page.addInitScript(()=>localStorage.setItem('catalisa_cookie_consent','denied'));
 await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
 page.on('request',request=>{if(request.isNavigationRequest()&&request.frame()===page.mainFrame())documents.push(new URL(request.url()).pathname);});
 page.on('pageerror',error=>report.errors.push(error.message));
 await page.goto(origin+home);await page.locator('main h1').waitFor();await page.waitForFunction(()=>Object.keys(document.querySelector('main h1')||{}).some(key=>key.startsWith('__reactFiber$')));
 const actualEntry=()=>page.locator('script[type=module][src]').first().getAttribute('src');
 assert.equal(await actualEntry(),entry);
 for(let i=0;i<3;i++){
  await page.locator('[data-menu=platform]').click();
  const link=page.locator('.c-platform-menu>nav>a[href="'+path+'"]');await link.waitFor({state:'visible'});assert.equal(await link.count(),1);
  await page.keyboard.press('Escape');
 }
 await page.setViewportSize({width:390,height:1000});
 await page.locator('[data-menu=all]').click();let link=page.locator('.c-all-menu a[href="'+path+'"]');await link.waitFor({state:'visible'});assert.equal(await link.count(),1);
 await page.keyboard.press('Escape');await page.locator('[data-menu=all]').click();await link.waitFor({state:'visible'});
 const before=documents.length;
 await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),link.click()]);
 await page.locator('.op-assistant h1').waitFor();await page.waitForFunction(()=>Object.keys(document.querySelector('.op-assistant h1')||{}).some(key=>key.startsWith('__reactFiber$')));assert.equal(new URL(page.url()).pathname,path);assert.equal(documents.length,before+1,'Hard navigation required');assert.notEqual(await actualEntry(),entry);
 await page.locator('.demo-steps [data-action=move]').click();assert.equal(await page.locator('.history-new').count(),1);
 const beforeBack=documents.length;
 await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('header .c-brand').click()]);
 await page.locator('main h1').waitFor();await page.waitForFunction(()=>Object.keys(document.querySelector('main h1')||{}).some(key=>key.startsWith('__reactFiber$')));assert.equal(new URL(page.url()).pathname,home);assert.equal(documents.length,beforeBack+1,'Exit must reload original runtime');assert.equal(await actualEntry(),entry);
 await page.locator('[data-menu=all]').click();link=page.locator('.c-all-menu a[href="'+path+'"]');await link.waitFor({state:'visible'});assert.equal(await link.count(),1);
 report.checks.push({locale,menuReopened:3,resize:true,linkPersisted:true,entryToPageDocumentNavigation:true,exitViaHeaderDocumentNavigation:true,originalRuntimeRestored:true,demoChangedLocally:true,documentRequests:documents});
 await page.close();
}assert.deepEqual(report.errors,[]);report.passed=true;}finally{await browser.close();await fs.writeFile(new URL('boundaries.json',directory),JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,errors:report.errors}));
