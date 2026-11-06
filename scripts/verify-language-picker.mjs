import fs from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
const argument=name=>process.argv.find(value=>value.startsWith('--'+name+'='))?.slice(name.length+3);
const origin=argument('origin')||'http://127.0.0.1:5175';
if(!['http://127.0.0.1:5175','https://site-staging.catalisa.io','https://catalisa.io'].includes(origin))throw Error('Unsupported language-check origin');
const output=argument('output')||'docs/redesign-2026-10-22/qa/localization/language-picker';
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,ignoreDefaultArgs:['--hide-scrollbars'],args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
await context.addInitScript(()=>{localStorage.setItem('catalisa_cookie_consent','denied');localStorage.setItem('catalisa_site_locale','pt-BR');});
await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
const page=await context.newPage(),errors=[],checks=[];
page.on('pageerror',error=>errors.push(error.message));
const metrics=()=>page.evaluate(()=>{const rect=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};};return{heading:rect('main h1'),header:rect('.c-header'),trigger:rect('.c-language-trigger'),scrollY,overflow:document.body.style.overflow,bodyPadding:document.body.style.paddingRight,headerOverflow:document.querySelector('.c-header-row').scrollWidth-document.querySelector('.c-header-row').clientWidth};});
const stable=(before,after)=>{for(const key of['heading','header','trigger'])for(const dimension of['x','y','width','height'])expect(Math.abs(before[key][dimension]-after[key][dimension]),key+'.'+dimension).toBeLessThan(.1);expect(after.scrollY).toBe(before.scrollY);expect(after.overflow).toBe(before.overflow);expect(after.bodyPadding).toBe(before.bodyPadding);};
let passed=false;
try{
 for(const width of[320,390,768,1440]){
  await page.setViewportSize({width,height:1000});await page.goto(origin+'/');await page.locator('main h1').waitFor();await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
  const trigger=page.locator('.c-language-trigger');await expect(trigger).toBeVisible();await expect(trigger).not.toHaveAttribute('aria-controls');const before=await metrics();expect(before.headerOverflow,'Header must fit '+width).toBeLessThanOrEqual(1);
  await trigger.click();const nav=page.locator('.c-language-options');await expect(nav).toBeVisible();expect(await nav.getAttribute('id')).toBe(await trigger.getAttribute('aria-controls'));await expect(nav.getByRole('link')).toHaveCount(7);stable(before,await metrics());
  const bounds=await nav.boundingBox();expect(bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.x+bounds.width).toBeLessThanOrEqual(width);await page.screenshot({path:output+'/open-'+width+'.png'});
  await page.keyboard.press('Escape');await expect(trigger).toBeFocused();await expect(nav).toHaveCount(0);await expect(trigger).not.toHaveAttribute('aria-controls');stable(before,await metrics());
  await trigger.click();await page.mouse.click(2,900);await expect(nav).toHaveCount(0);
  const menu=page.locator('.c-menu-trigger');await menu.click();await expect(menu).toHaveAttribute('aria-expanded','true');await trigger.click();await expect(menu).toHaveAttribute('aria-expanded','false');await expect(nav).toBeVisible();await page.keyboard.press('Escape');checks.push({width,kind:'layout-keyboard-outside-and-menu-coordination',passed:true,before});
 }
 await page.setViewportSize({width:1440,height:1000});
 for(const [label,prefix,code,hero]of[['English','en','EN','The shape'],['Deutsch','de','DE',null],['Español','es','ES',null],['Dansk','da','DA',null],['Nederlands','nl','NL',null],['Français','fr','FR',null],['Português','','PT','A forma']]){
  await page.locator('.c-language-trigger').click();const link=page.locator('.c-language-options').getByRole('link',{name:label,exact:true});await Promise.all([page.waitForURL(url=>url.pathname===(prefix?'/'+prefix:'/')),link.click()]);await page.waitForLoadState('networkidle');await page.locator('main h1').waitFor();await expect(page.locator('.c-language-trigger')).toContainText(code);const heading=await page.locator('main h1').innerText();expect(heading.length).toBeGreaterThan(3);if(prefix)expect(heading).not.toMatch(/^A forma/);if(hero)expect(heading).toContain(hero);checks.push({kind:'actual-language-navigation',locale:label,path:new URL(page.url()).pathname,heading});
 }
 await page.goto(origin+'/arquitetura/?utm_source=smoke&token=private#missing');await page.locator('main h1').waitFor();await page.waitForLoadState('networkidle');await page.locator('.c-language-trigger').click();await Promise.all([page.waitForURL(url=>url.pathname==='/en/architecture'),page.locator('.c-language-options').getByRole('link',{name:'English',exact:true}).click()]);expect(new URL(page.url()).search).toBe('?utm_source=smoke');expect(new URL(page.url()).hash).toBe('');await page.locator('main h1').waitFor();checks.push({kind:'same-page-language-switch',path:new URL(page.url()).pathname,search:new URL(page.url()).search});
 expect(errors).toEqual([]);passed=true;
}catch(error){errors.push(String(error));throw error;}finally{await fs.writeFile(output+'/verification.json',JSON.stringify({date:new Date().toISOString(),passed,origin,scope:'Actual language picker visibility, seven locale navigations, accessible control references only while expanded, same-page URL mapping, keyboard/outside closure and unchanged heading/header geometry. Does not certify complete localization/SEO or physical devices.',checks,errors},null,2));await browser.close();}
console.log(JSON.stringify({passed,checks:checks.length,errors}));
