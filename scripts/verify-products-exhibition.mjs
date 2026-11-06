/** Visual/interaction acceptance of the local product exhibition; no AI or lead writes. */
import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
const argument=name=>process.argv.find(value=>value.startsWith('--'+name+'='))?.slice(name.length+3);
const origin=argument('origin')??'http://127.0.0.1:5175',out=argument('output')??'docs/redesign-2026-10-22/qa/products-exhibition';
if(!['http://127.0.0.1:5175','https://site-staging.catalisa.io'].includes(origin))throw Error('Only preview/staging is allowed');
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const context=await browser.newContext({reducedMotion:'reduce',locale:'pt-BR'});
await context.addInitScript(()=>{localStorage.setItem('catalisa_cookie_consent','denied');localStorage.setItem('catalisa_site_locale','pt-BR');});
await context.route('**/*',route=>{const url=new URL(route.request().url());if(url.origin!==origin)return route.abort();if(url.pathname.startsWith('/api/'))return route.fulfill({status:401,contentType:'application/json',body:'{"code":"session_required"}'});return route.continue();});
const page=await context.newPage(),checks=[],errors=[];page.on('pageerror',e=>errors.push(e.message));let passed=false;
async function ready(path,width){await page.setViewportSize({width,height:1000});await page.goto(origin+path);await page.waitForLoadState('networkidle');await expect(page.locator('main h1')).toHaveCount(1);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No overflow '+path+' '+width).toBe(true);}
async function images(){for(const img of await page.locator('main img').all()){if(!await img.isVisible())continue;await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);}await page.evaluate(()=>scrollTo(0,0));}
try{
 for(const width of [320,390,768,1440]){
  for(const[locale,route]of [['pt-BR','/produtos'],['de-DE','/de/produkte']]){
   await ready(route,width);await expect(page.locator('html')).toHaveAttribute('lang',locale);await expect(page.locator('[data-product]')).toHaveCount(6);await expect(page.locator('.p-financial-grid>[data-product]')).toHaveCount(2);await expect(page.locator('#beyond-finance [data-product]')).toHaveCount(4);await expect(page.locator('[data-product] a[target="_blank"]')).toHaveCount(4);await expect(page.locator('.p-financial-grid .p-product-button')).toHaveCount(2);
   for(const anchor of await page.locator('.p-financial-grid .p-product-button').all())expect(await anchor.getAttribute('href')).toMatch(/\/(?:contato|kontakt)\/?$/);
   await images();await page.screenshot({path:out+`/products-${locale}-${width}.png`,fullPage:true});checks.push({route,locale,width,financialPlatforms:2,beyondFinanceProducts:4,siteLinks:4,financialContactLinks:2,imagesLoaded:true,overflow:false});
  }
  for(const slug of ['banking','credit','med','juridico','biometrics','decision']){
   await ready('/ecossistema/'+slug,width);const more=page.locator('.p-detail-more');await expect(more).toHaveCount(1);await expect(more.locator(':scope>summary')).toHaveCount(0);await expect(more.locator('.p-detail-expanded')).toBeVisible();
   if(['banking','credit'].includes(slug)){await expect(page.locator('.p-financial-hero-primary')).toHaveAttribute('href',/^\/contato\/?$/);}else{await expect(page.locator('.p-detail-button')).toHaveAttribute('target','_blank');await expect(page.locator('.p-detail-highlights>div')).toHaveCount(3);}
   await images();await page.screenshot({path:out+`/detail-${slug}-${width}.png`,fullPage:true});
   await expect(page.locator('main h1')).toHaveCount(1);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Expanded details fit '+slug+' '+width).toBe(true);checks.push({slug,width,compactHero:true,detailsAlwaysVisible:true,overflow:false});
  }
 }
 await page.setViewportSize({width:1440,height:1000});
 for(const[locale,route]of [['en-US','/en/products'],['es-ES','/es/productos'],['da-DK','/da/produkter'],['nl-NL','/nl/producten'],['fr-FR','/fr/produits']]){await ready(route,1440);await expect(page.locator('html')).toHaveAttribute('lang',locale);await expect(page.locator('[data-product]')).toHaveCount(6);await images();await page.screenshot({path:out+`/products-${locale}-1440.png`,fullPage:true});checks.push({locale,route,width:1440,products:6,imagesLoaded:true});}
 await ready('/produtos',390);await page.locator('[data-product=banking] .p-product-detail').click();await expect(page).toHaveURL(/\/ecossistema\/banking\/?$/);await page.locator('.p-financial-hero-primary').click();await expect(page).toHaveURL(/\/contato\/?$/);await expect(page.locator('#z-input')).toBeEnabled();checks.push({detailToContact:true,contactReady:true,apiControlled:true});
 expect(errors).toEqual([]);passed=true;
}catch(e){errors.push(String(e));throw e;}finally{await fs.writeFile(out+'/verification.json',JSON.stringify({checkedAt:new Date().toISOString(),origin,passed,scope:'Actual selected preview/staging browser: financial flagships separated from four sector solutions; all seven locales, four widths, loaded images, site/contact/detail CTA paths and full product content without a disclosure. Anonymous API controlled401. No external requests, sessions, AI, leads or deployments.',checks,errors},null,2)+'\n');await browser.close();}
console.log(JSON.stringify({passed,checks:checks.length,errors}));
