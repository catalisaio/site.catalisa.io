import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const origin=process.env.OP_ASSISTANT_ORIGIN||'http://127.0.0.1:5175';
const routes={
 'pt-BR':'/assistente-operacional','en-US':'/en/operational-assistant',
 'de-DE':'/de/operativer-assistent','es-ES':'/es/asistente-operativo',
 'da-DK':'/da/driftsassistent','nl-NL':'/nl/operationele-assistent','fr-FR':'/fr/assistant-operationnel',
};
const directory=new URL('../docs/redesign-2026-10-22/qa/operational-assistant/'+(process.env.OP_ASSISTANT_QA_SCOPE ? process.env.OP_ASSISTANT_QA_SCOPE+'/' : ''),import.meta.url);
await fs.mkdir(directory,{recursive:true});
const output=new URL('locales.json',directory);
const report={origin,passed:false,checks:[],errors:[],productionChanged:false,realMessagesSent:false};
const browser=await chromium.launch({headless:true});
try{
 for(const [locale,path] of Object.entries(routes)){
  const {messages}=JSON.parse(await fs.readFile('src/redesign/i18n/locales/'+locale+'.json','utf8'));
  const t=source=>messages[source]||source;
  for(const width of [390,1440]){
   const page=await browser.newPage({locale,viewport:{width,height:1000},reducedMotion:'reduce'});
   await page.addInitScript(()=>localStorage.setItem('catalisa_cookie_consent','denied'));
   page.on('pageerror',error=>report.errors.push(error.message));
   const res=await page.goto(origin+path);assert.equal(res.status(),200);
   await page.locator('.op-assistant h1').waitFor();
   await page.waitForFunction(()=>Object.keys(document.querySelector('.op-assistant h1')||{}).some(key=>key.startsWith('__reactFiber$')));
   assert.equal(await page.locator('html').getAttribute('lang'),locale);
   assert.equal((await page.locator('h1').innerText()).replace(/\s+/g,' ').trim(),t('Consulte e opere')+' '+t('seus sistemas com IA.'));
   assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://catalisa.io'+path);
   assert.equal((await page.locator('[data-stage-label]').innerText()).trim(),t('Qualificação'));
   await page.locator('.demo-steps [data-action=consult]').click();
   assert.ok((await page.locator('#assistant-messages').innerText()).includes(t('Origem: histórico da negociação Projeto Aurora.')));
   await page.locator('#assistant-input').fill(t('Mova esta oportunidade para proposta enviada.'));
   await page.locator('#assistant-input').press('Enter');
   assert.equal((await page.locator('[data-stage-label]').innerText()).trim(),t('Proposta enviada'));
   assert.equal(await page.locator('.history-new').count(),1);
   await page.locator('.demo-steps [data-action=verify]').click();
   assert.equal(await page.locator('#history-tab').getAttribute('aria-selected'),'true');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'overflow '+locale+' '+width);
   for(const image of await page.locator('.op-assistant img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(e=>e.decode());}
   await page.evaluate(()=>scrollTo(0,0));
   await page.screenshot({path:new URL(`locale-${locale}-${width}.png`,directory).pathname,fullPage:true});
   report.checks.push({locale,width,path,translatedHero:true,canonical:true,consultation:true,localizedTypedAction:true,history:true,overflow:false});
   await page.close();
  }
 }
 assert.deepEqual(report.errors,[]);report.passed=true;
}finally{await browser.close();await fs.writeFile(output,JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,errors:report.errors}));
