import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const baseline=process.env.OP_ASSISTANT_BASELINE||'http://127.0.0.1:8143';
const candidate=process.env.OP_ASSISTANT_CANDIDATE||'http://127.0.0.1:8144';
const locales={'pt-BR':'/','en-US':'/en','es-ES':'/es','fr-FR':'/fr','de-DE':'/de','nl-NL':'/nl','da-DK':'/da'};
const directory=new URL('../docs/redesign-2026-10-22/qa/operational-assistant/home-preservation/',import.meta.url);
await fs.mkdir(directory,{recursive:true});
const report={baseline,candidate,checkedAt:new Date().toISOString(),passed:false,checks:[],errors:[],productionChanged:false};
const browser=await chromium.launch({headless:true});
try{
 for(const [locale,path] of Object.entries(locales))for(const width of [390,1440]){
  const snapshots=[];
  for(const [name,origin] of [['baseline',baseline],['candidate',candidate]]){
   const page=await browser.newPage({locale,viewport:{width,height:1000},reducedMotion:'reduce'});
   await page.addInitScript(()=>localStorage.setItem('catalisa_cookie_consent','denied'));
   await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
   page.on('pageerror',error=>report.errors.push({name,locale,width,error:error.message}));
   const response=await page.goto(origin+path);assert.equal(response.status(),200);
   await page.locator('main h1').waitFor();
   const trigger=page.locator('[data-menu=all]');
   await trigger.click();await page.waitForFunction(()=>document.querySelector('[data-menu=all]')?.getAttribute('aria-expanded')==='true');
   await page.keyboard.press('Escape');await page.waitForFunction(()=>document.querySelector('[data-menu=all]')?.getAttribute('aria-expanded')==='false');
   await page.evaluate(()=>document.fonts.ready);await page.waitForLoadState('networkidle');
   const snapshot=await page.evaluate(()=>{
    const main=document.querySelector('main');
    const nodes=[...main.querySelectorAll('*')].map(e=>({tag:e.tagName,attributes:Object.fromEntries(['class','role','href','src','alt','aria-label','type','name'].flatMap(k=>e.hasAttribute(k)?[[k,e.getAttribute(k)]]:[])),text:[...e.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent).join('').replace(/\s+/g,' ').trim()}));
    const geometry=[...main.querySelectorAll('section,h1,h2,h3,p')].filter(e=>e.getClientRects().length).map(e=>{const rect=e.getBoundingClientRect(),style=getComputedStyle(e);return {tag:e.tagName,class:e.getAttribute('class'),rect:['x','y','width','height'].map(k=>Math.round(rect[k]*10)/10),font:style.fontFamily,size:style.fontSize,weight:style.fontWeight,color:style.color,background:style.backgroundColor};});
    return {nodes,geometry,h1:main.querySelector('h1').textContent.replace(/\s+/g,' ').trim()};
   });
   snapshots.push(snapshot);
   if(locale==='pt-BR')await page.screenshot({path:new URL(`${name}-${width}.png`,directory).pathname,fullPage:true});
   await page.close();
  }
  const [before,after]=snapshots;
  const sameNodes=JSON.stringify(before.nodes)===JSON.stringify(after.nodes);
  const sameGeometry=JSON.stringify(before.geometry)===JSON.stringify(after.geometry);
  const item={locale,width,path,baselineH1:before.h1,candidateH1:after.h1,runtimeReactConfirmed:true,mainContentUnchanged:sameNodes,geometryAndTypographyUnchanged:sameGeometry,baselineMainSha256:createHash('sha256').update(JSON.stringify(before.nodes)).digest('hex'),candidateMainSha256:createHash('sha256').update(JSON.stringify(after.nodes)).digest('hex')};
  if(!sameNodes)item.nodeDifferences=before.nodes.flatMap((node,index)=>JSON.stringify(node)!==JSON.stringify(after.nodes[index])?[{index,before:node,after:after.nodes[index]}]:[]).slice(0,8);
  if(!sameGeometry)item.geometryDifferences=before.geometry.flatMap((node,index)=>JSON.stringify(node)!==JSON.stringify(after.geometry[index])?[{index,before:node,after:after.geometry[index]}]:[]).slice(0,8);
  report.checks.push(item);
 }
 assert.deepEqual(report.errors,[]);
 assert.ok(report.checks.every(item=>item.mainContentUnchanged&&item.geometryAndTypographyUnchanged),'Home changed after actual React mounted');
 report.passed=true;
}finally{await browser.close();await fs.writeFile(new URL('verification.json',directory),JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,errors:report.errors}));
