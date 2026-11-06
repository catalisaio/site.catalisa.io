/** Isolated source-preview language selection checks. One Chromium, contexts serial.
 * No build, AI, handoff or external service call. */
import fs from'node:fs/promises';
import{chromium,expect}from'@playwright/test';
import type{Browser,BrowserContext,Page}from'@playwright/test';
const origin=process.env.SITE_AUTO_LOCALE_ORIGIN??'http://127.0.0.1:5175',output=process.env.SITE_AUTO_LOCALE_OUTPUT??'docs/redesign-2026-10-22/qa/localization/auto-locale-browser.json';
if(!['http://127.0.0.1:5175','https://site-staging.catalisa.io','https://catalisa.io'].includes(origin))throw Error('Only source preview or staging is allowed');
if(origin==='https://catalisa.io'){const release=process.env.SITE_AUTO_LOCALE_RELEASE;if(!release)throw Error('Expected public release required');const head=await fetch(origin,{method:'HEAD'});if(head.headers.get('x-catalisa-site-release')!==release)throw Error('Public release differs');}
const results:Record<string,unknown>[]=[],startedAt=new Date().toISOString();
async function save(){await fs.writeFile(output,JSON.stringify({startedAt,updatedAt:new Date().toISOString(),origin,scope:'One real headless Chromium against the explicitly selected preview/staging origin; serial isolated contexts. Machine languages, persisted manual choice, explicit URLs, bots, public attribution, secret-param stripping and redirect visibility. No build/AI/handoff/external requests.',passed:results.length===14&&results.every(value=>value.passed),results},null,2)+'\n');}
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
interface Options{locale:string;preference?:string;userAgent?:string}
async function contextFor(browser:Browser,options:Options){
 const context=await browser.newContext({locale:options.locale,...(options.userAgent?{userAgent:options.userAgent}:{}),viewport:{width:1440,height:960},reducedMotion:'reduce'});
 await context.route('**/*',route=>{const url=new URL(route.request().url());if(url.origin!==origin)return route.abort();if(url.pathname.startsWith('/api/'))return route.fulfill({status:401,contentType:'application/json',body:'{"code":"session_required"}'});return route.continue();});
 await context.addInitScript(({preference})=>{
  localStorage.setItem('catalisa_cookie_consent','denied');
  if(preference)localStorage.setItem('catalisa_site_locale',preference);
  const samples:{path:string;lang:string;visible:boolean;hasMain:boolean;pending:boolean}[]=[];
  (window as unknown as{__autoLocaleSamples:typeof samples}).__autoLocaleSamples=samples;
  let frames=0;
  function sample(){if(document.body)samples.push({path:location.pathname,lang:document.documentElement.lang,visible:getComputedStyle(document.body).visibility!=='hidden',hasMain:!!document.querySelector('main h1'),pending:document.documentElement.hasAttribute('data-site-locale-redirect')});if(++frames<180)requestAnimationFrame(sample);}
  requestAnimationFrame(sample);
  addEventListener('pagehide',()=>{try{const prior=JSON.parse(sessionStorage.getItem('__autoLocalePriorSamples')??'[]');sessionStorage.setItem('__autoLocalePriorSamples',JSON.stringify([...prior,...samples].slice(-500)));}catch{}});
 },{preference:options.preference});
 return context;
}
async function ready(page:Page,path:string,locale:string){
 await page.waitForURL(url=>url.origin===origin&&url.pathname===path,{timeout:30000});
 await page.waitForFunction(locale=>!!document.querySelector('main h1')&&document.documentElement.lang===locale&&!document.documentElement.hasAttribute('data-site-locale-redirect')&&getComputedStyle(document.body).visibility==='visible',locale,{timeout:30000});
 await page.waitForTimeout(180);
 const state=await page.evaluate(()=>({path:location.pathname,lang:document.documentElement.lang,bodyVisibility:getComputedStyle(document.body).visibility,pending:document.documentElement.hasAttribute('data-site-locale-redirect'),preference:localStorage.getItem('catalisa_site_locale'),samples:[...JSON.parse(sessionStorage.getItem('__autoLocalePriorSamples')??'[]'),...(window as unknown as{__autoLocaleSamples:unknown[]}).__autoLocaleSamples]}));
 expect(state.lang).toBe(locale);expect(state.bodyVisibility).toBe('visible');expect(state.pending).toBe(false);return state;
}
async function run(name:string,options:Options,test:(page:Page,context:BrowserContext)=>Promise<Record<string,unknown>>){
 for(let attempt=0;attempt<3;attempt++){
  const context=await contextFor(browser,options),page=await context.newPage();const navigations:string[]=[];
  page.on('request',request=>{if(request.isNavigationRequest()&&request.frame()===page.mainFrame())navigations.push(new URL(request.url()).pathname);});
  try{const evidence=await test(page,context);results.push({name,passed:true,fixtureRetries:attempt,navigations,...evidence});await save();console.log(JSON.stringify({name,passed:true,fixtureRetries:attempt,path:evidence.path,lang:evidence.lang}));await context.close();return;}
  catch(error){await context.close();const message=error instanceof Error?error.message:String(error);if(attempt<2&&/Execution context was destroyed|net::ERR_CONNECTION_RESET|net::ERR_CONNECTION_REFUSED|Navigation.*interrupted|Target page.*closed/.test(message)){await new Promise(resolve=>setTimeout(resolve,1000));continue;}results.push({name,passed:false,fixtureRetries:attempt,error:message.slice(0,1600),navigations});await save();console.log(JSON.stringify({name,passed:false,error:message.slice(0,300)}));process.exitCode=1;return;}
 }
}
try{
 for(const[machine,locale,path]of[['pt-PT','pt-BR','/'],['en-GB','en-US','/en'],['de-CH','de-DE','/de'],['es-MX','es-ES','/es'],['da-DK','da-DK','/da'],['nl-BE','nl-NL','/nl'],['fr-CH','fr-FR','/fr']])await run('machine-'+machine,{locale:machine},async page=>{await page.goto(origin+'/',{waitUntil:'domcontentloaded'});const state=await ready(page,path,locale);if(path!=='/')expect((state.samples as {path:string;lang:string;visible:boolean;hasMain:boolean}[]).some(value=>value.path==='/'&&value.lang==='pt-BR'&&value.visible&&value.hasMain)).toBe(false);expect(state.preference).toBeNull();return state;});
 await run('unsupported-falls-back-English',{locale:'ja-JP'},async page=>{await page.goto(origin+'/');return ready(page,'/en','en-US');});
 await run('saved-manual-Portuguese-over-English',{locale:'en-US',preference:'pt-BR'},async page=>{await page.goto(origin+'/');const state=await ready(page,'/','pt-BR');expect(state.preference).toBe('pt-BR');return state;});
 await run('French-picker-to-Portuguese-stays-root',{locale:'en-US'},async page=>{await page.goto(origin+'/fr');await ready(page,'/fr','fr-FR');await page.locator('.c-language-trigger').click();await page.locator('.c-language-options a[lang="pt-BR"]').click();await ready(page,'/','pt-BR');expect(await page.evaluate(()=>localStorage.getItem('catalisa_site_locale'))).toBe('pt-BR');await page.reload();return ready(page,'/','pt-BR');});
 await run('explicit-French-over-machine-and-saved-English',{locale:'de-CH',preference:'en-US'},async page=>{await page.goto(origin+'/fr/vision');return ready(page,'/fr/vision','fr-FR');});
 await run('Portuguese-deep-link-stays-Portuguese',{locale:'de-CH',preference:'fr-FR'},async page=>{await page.goto(origin+'/capacidades/ai-engine');return ready(page,'/capacidades/ai-engine','pt-BR');});
 await run('search-bot-keeps-Portuguese-root',{locale:'de-CH',preference:'fr-FR',userAgent:'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'},async page=>{await page.goto(origin+'/');return ready(page,'/','pt-BR');});
 await run('UTM-and-existing-anchor-without-private-token',{locale:'de-CH'},async page=>{await page.goto(origin+'/?utm_source=auto-smoke&token=private&session=private#arquitetura');const state=await ready(page,'/de','de-DE'),url=new URL(page.url());expect(url.search).toBe('?utm_source=auto-smoke');expect(url.hash).toBe('#arquitetura');return{...state,search:url.search,hash:url.hash};});
}finally{await browser.close();await save();console.log(JSON.stringify({finished:true,browserClosed:true,passed:results.length===14&&results.every(value=>value.passed),completed:results.length,report:output}));}
