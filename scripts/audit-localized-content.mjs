/** Read-only browser audit of actual native routes. AI/contact mutations are never executed. */
import fs from'node:fs/promises';import{chromium}from'@playwright/test';
const arg=(name,fallback)=>process.argv.find(a=>a.startsWith('--'+name+'='))?.slice(name.length+3)??fallback;
const output=arg('output','docs/redesign-2026-10-22/qa/localization/rendered-content.json');
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
await context.addInitScript(()=>{localStorage.setItem('catalisa_cookie_consent','denied');localStorage.setItem('catalisa_site_locale','pt-BR');});
await context.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/,r=>r.abort());
await context.route('**/api/site/**',r=>r.fulfill({status:401,contentType:'application/json',body:JSON.stringify({code:'no_session',message:'Comece uma conversa para continuar.'})}));
const page=await context.newPage(),checks=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
const options=arg('locales','').split(',').filter(Boolean);let inventory;
try{
 await page.goto('http://127.0.0.1:5175/');await page.locator('main h1').waitFor();
 inventory=await page.evaluate(async()=>{const routes=await import('/src/redesign/i18n/routes.ts');return routes.supportedSiteLocales.map(locale=>({locale,paths:routes.siteBasePaths.map(basePath=>({basePath,path:routes.localizeSitePath(basePath,locale)}))}));});
 for(const localeInfo of inventory.filter(i=>!options.length||options.includes(i.locale))){
  const locale=localeInfo.locale;await page.goto('http://127.0.0.1:5175'+localeInfo.paths[0].path);await page.locator('main h1').waitFor();
  const envelope=locale==='pt-BR'?{messages:{}}:JSON.parse(await fs.readFile('src/redesign/i18n/locales/'+locale+'.json','utf8'));
  const sourcePairs=Object.entries(envelope.messages).filter(([source,target])=>source.trim().length>=8&&source.trim()!==target.trim()).map(([source,target])=>[source.trim(),target]);
  for(const{basePath,path}of localeInfo.paths){
   await page.evaluate(async path=>{const runtime=await import('/src/redesign/i18n/runtime.ts');runtime.clearMissingSiteTranslations();if(location.pathname!==path){history.pushState(null,'',path);dispatchEvent(new PopStateEvent('popstate'));}},path);
   await page.waitForFunction(path=>document.querySelector('link[rel=canonical]')?.getAttribute('href')==='https://catalisa.io'+path&&document.querySelector('main h1')?.textContent?.trim(),path,{timeout:20000});
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const result=await page.evaluate(async pairs=>{const runtime=await import('/src/redesign/i18n/runtime.ts'),source=new Map(pairs),untranslated=[];const scope=document.querySelector('.c-site');if(!scope)throw Error('Native page not mounted');
    const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(node.parentElement?.closest('pre,code,script,style'))continue;const text=node.textContent.trim();if(source.has(text))untranslated.push({kind:'text',source:text,expected:source.get(text),element:node.parentElement?.tagName});}
    for(const element of scope.querySelectorAll('[aria-label],[title],[placeholder],img[alt]')){if(element.closest('pre,code'))continue;for(const attribute of['aria-label','title','placeholder','alt']){const text=element.getAttribute(attribute)?.trim();if(text&&source.has(text))untranslated.push({kind:attribute,source:text,expected:source.get(text),element:element.tagName});}}
    return{heading:document.querySelector('main h1')?.innerText,missing:runtime.getMissingSiteTranslations(),untranslated:[...new Map(untranslated.map(item=>[item.kind+item.source,item])).values()]};},sourcePairs);
   checks.push({locale,path,basePath,...result});
  }
  console.log(JSON.stringify({locale,pages:localeInfo.paths.length,missing:checks.filter(c=>c.locale===locale).reduce((n,c)=>n+c.missing.length,0),untranslated:checks.filter(c=>c.locale===locale).reduce((n,c)=>n+c.untranslated.length,0)}));
 }
}finally{await fs.mkdir(output.slice(0,output.lastIndexOf('/')),{recursive:true});await fs.writeFile(output,JSON.stringify({generatedAt:new Date().toISOString(),scope:'Actual local native routes, rendered text/attributes and missing runtime keys. Private API requests intercepted as anonymous; no AI generation, visitor sessions or deploy. Exact-source detection is a diagnostic, not proof of native linguistic quality.',passed:!errors.length&&checks.every(c=>!c.missing.length&&!c.untranslated.length),pages:checks.length,errors,checks},null,2)+'\n');await browser.close();}
