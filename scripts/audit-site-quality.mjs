import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const argument=name=>process.argv.find(value=>value.startsWith('--'+name+'='))?.slice(name.length+3);
const origin=argument('origin')||'http://127.0.0.1:8180';
const locale=argument('locale')||'pt-BR';
const routes=(argument('routes')||'/,/arquitetura,/contato,/lab,/capacidades,/ecossistema/banking,/ecossistema/credit').split(',');
const output=path.resolve(argument('output')||'docs/redesign-2026-10-22/qa/site-quality');
const credentialsFile=argument('credentials-file');
const access=credentialsFile?JSON.parse(await fs.readFile(credentialsFile,'utf8')):undefined;
const credentials=access?.basicAuth===false?undefined:access;
const mobile={viewport:{width:390,height:844},screen:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true};
const network={offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750,connectionType:'cellular4g'};
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:argument('browser')||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox',...(argument('host-map')?['--host-resolver-rules='+argument('host-map')]:[])]});
const results=[],keyboard=[],failures=[];
const sensitiveUrl=url=>{const parsed=new URL(url);return ['http:','https:'].includes(parsed.protocol)?parsed.origin+parsed.pathname:parsed.protocol;};
const metricScript=()=>{
  const data=window.__siteQuality={lcp:null,layoutShifts:[],longTasks:[],fontLoadingEvents:[],fontsReadyAtCheck:null};
  for(const [type,callback]of[
    ['largest-contentful-paint',entries=>{for(const e of entries)data.lcp={value:e.startTime,size:e.size,element:e.element?.tagName??null,url:e.url?new URL(e.url,location.href).pathname:null};}],
    ['layout-shift',entries=>{for(const e of entries)if(!e.hadRecentInput)data.layoutShifts.push({time:e.startTime,value:e.value,sources:e.sources?.map(source=>source.node?{tag:source.node.tagName,id:source.node.id||null,className:source.node.getAttribute?.('class')||null,previous:{x:source.previousRect.x,y:source.previousRect.y,width:source.previousRect.width,height:source.previousRect.height},current:{x:source.currentRect.x,y:source.currentRect.y,width:source.currentRect.width,height:source.currentRect.height}}:null)});}],
    ['longtask',entries=>{for(const e of entries)data.longTasks.push({start:e.startTime,duration:e.duration});}],
  ])try{new PerformanceObserver(list=>callback(list.getEntries())).observe({type,buffered:true});}catch{}
  for(const event of ['loading','loadingdone','loadingerror'])document.fonts.addEventListener(event,()=>data.fontLoadingEvents.push({event,time:performance.now()}));
};
const domAudit=()=>{
  const visible=e=>!!e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[hidden],[inert],[aria-hidden="true"]');
  const name=e=>e.getAttribute('aria-label')?.trim()||(e.getAttribute('aria-labelledby')||'').split(/\s+/).map(id=>document.getElementById(id)?.textContent||'').join(' ').trim()||[...(e.labels||[])].map(label=>label.textContent).join(' ').trim()||e.textContent?.trim()||[...e.querySelectorAll('img[alt]')].map(img=>img.alt).join(' ').trim()||e.getAttribute('title')?.trim()||(e.tagName==='INPUT'&&['button','submit','reset'].includes(e.type)?e.value:'');
  const controls=[...document.querySelectorAll('button,a[href],input:not([type="hidden"]),textarea,select,[role="tab"]')].filter(visible);
  const unnamed=controls.filter(e=>!name(e)).map(e=>({tag:e.tagName,id:e.id,role:e.getAttribute('role'),type:e.getAttribute('type')}));
  const images=[...document.querySelectorAll('img')].filter(visible);
  const missingAlt=images.filter(e=>!e.hasAttribute('alt')).map(e=>e.getAttribute('src'));
  const brokenImages=images.filter(e=>e.complete&&!e.naturalWidth).map(e=>e.getAttribute('src'));
  const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
  const duplicateIds=[...new Set(ids.filter((id,index)=>ids.indexOf(id)!==index))];
  const brokenReferences=[...document.querySelectorAll('[aria-labelledby],[aria-describedby],[aria-controls]')].flatMap(e=>['aria-labelledby','aria-describedby','aria-controls'].flatMap(attribute=>(e.getAttribute(attribute)||'').split(/\s+/).filter(id=>id&&!document.getElementById(id)).map(id=>({element:e.id||e.tagName,attribute,id}))));
  const h1s=[...document.querySelectorAll('main h1')].filter(visible);
  return {lang:document.documentElement.lang,startupScript:new URL(document.querySelector('script[type="module"][src]')?.src||location.href).pathname,mainCount:document.querySelectorAll('main').length,h1Count:h1s.length,controlCount:controls.length,unnamedControls:unnamed,missingAlt,brokenImages,duplicateIds,brokenReferences,overflow:document.documentElement.scrollWidth>innerWidth+1,fonts:{status:document.fonts.status,faces:[...document.fonts].map(font=>({family:font.family,status:font.status}))},errorText:[...document.querySelectorAll('.z-error,.l-error,.l-global-error')].map(e=>e.textContent.trim()).filter(Boolean)};
};
const captureMetrics=()=>{
  const data=window.__siteQuality;
  let cls=0,session=0,start=0,last=0;
  for(const shift of data.layoutShifts){if(!session||shift.time-last>1000||shift.time-start>5000){start=shift.time;session=0;}session+=shift.value;last=shift.time;cls=Math.max(cls,session);}
  const nav=performance.getEntriesByType('navigation')[0];
  const resources=performance.getEntriesByType('resource');
  return {fcpMs:performance.getEntriesByName('first-contentful-paint')[0]?.startTime??null,lcp:data.lcp,cls,layoutShifts:data.layoutShifts,longTasks:{count:data.longTasks.length,totalMs:data.longTasks.reduce((sum,task)=>sum+task.duration,0),maxMs:Math.max(0,...data.longTasks.map(task=>task.duration))},fontsReadyAtCheckMs:data.fontsReadyAtCheck,fontLoadingEvents:data.fontLoadingEvents,observedUntilMs:performance.now(),navigation:nav?{ttfbMs:nav.responseStart,domContentLoadedMs:nav.domContentLoadedEventEnd,loadMs:nav.loadEventEnd,transferSize:nav.transferSize,encodedBodySize:nav.encodedBodySize}:null,resources:{count:resources.length,scriptPaths:[...new Set(resources.filter(resource=>new URL(resource.name).pathname.endsWith('.js')).map(resource=>new URL(resource.name).pathname))].sort(),transferBytes:resources.reduce((sum,r)=>sum+r.transferSize,0),encodedBytes:resources.reduce((sum,r)=>sum+r.encodedBodySize,0),largest:resources.sort((a,b)=>b.encodedBodySize-a.encodedBodySize).slice(0,8).map(r=>({path:new URL(r.name).pathname,encodedBytes:r.encodedBodySize,durationMs:r.duration,type:r.initiatorType}))}};
};
try{
  for(const route of routes){
    const record={route};const context=await browser.newContext({...mobile,locale,...(credentials?{httpCredentials:{username:credentials.username,password:credentials.password}}:{})});
    const page=await context.newPage(),cdp=await context.newCDPSession(page),exceptions=[],requests=[],failedRequests=[];
    page.on('pageerror',e=>exceptions.push(e.message));
    page.on('request',r=>requests.push(sensitiveUrl(r.url())));
    page.on('requestfailed',r=>failedRequests.push({url:sensitiveUrl(r.url()),error:r.failure()?.errorText}));
    await page.addInitScript(metricScript);
    await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
    await cdp.send('Network.emulateNetworkConditions',network);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
    try{
      const response=await page.goto(origin+route,{waitUntil:'domcontentloaded',timeout:60000});record.status=response.status();record.contentEncoding=response.headers()['content-encoding']||'identity';
      await expect(page.locator('main h1')).toBeVisible({timeout:30000});
      if(route==='/contato')await expect(page.locator('#z-input')).toBeEnabled({timeout:15000});
      if(route==='/lab')await expect(page.locator('#l-prompt')).toBeEnabled({timeout:15000});
      await page.evaluate(async()=>{await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,10000))]);window.__siteQuality.fontsReadyAtCheck=performance.now();});await page.waitForLoadState('networkidle',{timeout:15000}).catch(()=>{});
      await page.waitForTimeout(3000);
      record.metrics=await page.evaluate(captureMetrics);record.dom=await page.evaluate(domAudit);record.exceptions=exceptions;
      record.failedRequests=failedRequests;record.trackerRequests=requests.filter(url=>/googletagmanager\.com|clarity\.ms\/tag\//i.test(url));
      record.legacyChunkRequests=requests.filter(url=>/\/assets\/(?:chakra|icons|motion|presentation|playbooks|i18n)-/.test(url));
      record.externalOrigins=[...new Set(requests.filter(url=>url.startsWith('http')).map(url=>new URL(url).origin).filter(value=>value!==new URL(origin).origin))];
      const issues=[];
      if(record.status!==200)issues.push('HTTP status');
      for(const key of ['unnamedControls','missingAlt','brokenImages','duplicateIds','brokenReferences','errorText'])if(record.dom[key].length)issues.push(key);
      if(record.dom.mainCount!==1||record.dom.h1Count!==1||!record.dom.lang)issues.push('document landmarks/language');
      if(record.dom.overflow)issues.push('horizontal overflow');if(exceptions.length)issues.push('JavaScript exception');if(record.trackerRequests.length)issues.push('unexpected optional tracking');
      if(record.legacyChunkRequests.length)issues.push('native page downloaded legacy framework/content chunks');
      if(record.dom.fonts.status!=='loaded'||record.metrics.fontLoadingEvents.some(event=>event.event==='loadingerror'))issues.push('font loading failure');
      record.domChecksPassed=issues.length===0;record.issues=issues;if(issues.length)failures.push({route,issues});
      await page.screenshot({path:path.join(output,(route==='/'?'home':route.slice(1).replaceAll('/','-'))+'-mobile.png'),animations:'disabled'});
      console.log(JSON.stringify({route,lcpMs:Math.round(record.metrics.lcp?.value||0),cls:record.metrics.cls,issues}));
    }catch(error){record.failure=String(error);failures.push({route,error:String(error)});console.error(route,String(error));}
    finally{results.push(record);await context.close();}
  }
  // Interaction checks follow the load measurement, so keyboard activity cannot distort initial CLS/LCP.
  for(const width of process.argv.includes('--skip-keyboard')?[]:[390,1440]){
    const context=await browser.newContext({viewport:{width,height:1000},locale,reducedMotion:'reduce',...(credentials?{httpCredentials:{username:credentials.username,password:credentials.password}}:{})});
    const page=await context.newPage();
    try{
      await page.goto(origin+'/');await expect(page.locator('.c-home')).toBeVisible();await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
      const skip=page.locator('.c-skip');await skip.focus();await page.keyboard.press('Enter');
      expect(await page.evaluate(()=>document.activeElement?.id)).toBe('c-main');keyboard.push({width,check:'skip link reaches main',passed:true});
      for(const menu of width===1440?['platform','all']:['all']){
        const trigger=page.locator('[data-menu="'+menu+'"]');await trigger.focus();
        const before=await page.locator('main h1').boundingBox();await page.keyboard.press('Enter');await expect(trigger).toHaveAttribute('aria-expanded','true');
        const menuId=await trigger.getAttribute('aria-controls');await expect(page.locator('[id="'+menuId+'"]')).toBeVisible();
        const after=await page.locator('main h1').boundingBox();const shift=Math.max(...['x','y','width','height'].map(key=>Math.abs(before[key]-after[key])));expect(shift).toBeLessThanOrEqual(1);
        await page.evaluate(()=>{const items=[...document.querySelectorAll('.c-header a,.c-header button')].filter(e=>e.getClientRects().length);items.at(-1)?.focus();});
        await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.activeElement===document.querySelector('.c-header a'))).toBe(true);
        await page.keyboard.press('Shift+Tab');expect(await page.evaluate(()=>{const items=[...document.querySelectorAll('.c-header a,.c-header button')].filter(e=>e.getClientRects().length);return document.activeElement===items.at(-1);})).toBe(true);
        await page.keyboard.press('Escape');await expect(trigger).toHaveAttribute('aria-expanded','false');await expect(trigger).toBeFocused();
        keyboard.push({width,menu,check:'Enter/Tab loop/Shift+Tab/Escape/focus return/no heading movement',maxHeadingShiftPx:shift,passed:true});
      }
    }catch(error){keyboard.push({width,passed:false,error:String(error)});failures.push({keyboardWidth:width,error:String(error)});}
    finally{await context.close();}
  }
}finally{
  await browser.close();
  await fs.writeFile(path.join(output,'verification.json'),JSON.stringify({generatedAt:new Date().toISOString(),origin,passed:failures.length===0,scope:'Single-run Chrome laboratory measurement of initial anonymous mobile pages under CDP network/CPU throttling, focused DOM and optional keyboard checks. No field Core Web Vitals, INP claim, full WCAG certification or automated axe/Lighthouse result. No axe/Lighthouse dependency is installed.',keyboardScope:process.argv.includes('--skip-keyboard')?'Not run in this invocation':'390/1440px skip link and menus',emulation:{...mobile,locale,cpuSlowdown:4,network,coldCache:true,settleAfterFontsAndNetworkMs:3000},metricsAreMeasurementsNotThresholdPasses:true,results,keyboard,failures},null,2));
}
if(failures.length)process.exitCode=1;
