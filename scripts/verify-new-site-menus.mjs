import fs from 'node:fs/promises';
import {expect} from '@playwright/test';

export async function verifyNewSiteMenus(browser){
  const context=await browser.newContext({reducedMotion:'reduce'});await context.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/,route=>route.abort());
  const page=await context.newPage(),checks=[],errors=[];let passed=false;
  page.on('pageerror',error=>errors.push(error.message));
  const metrics=()=>page.evaluate(()=>{
    const box=selector=>{const rect=document.querySelector(selector).getBoundingClientRect();return{x:rect.x,y:rect.y,width:rect.width,height:rect.height};};
    return{header:box('.c-header'),heading:box('main h1'),scrollX,scrollY,bodyWidth:document.body.getBoundingClientRect().width,bodyPadding:getComputedStyle(document.body).paddingRight,gutter:innerWidth-document.documentElement.clientWidth};
  });
  const same=(before,after)=>{for(const key of['header','heading'])for(const axis of['x','y','width','height'])expect(Math.abs(before[key][axis]-after[key][axis]),key+'.'+axis+' must stay still').toBeLessThanOrEqual(.1);expect(after.scrollX).toBe(before.scrollX);expect(after.scrollY).toBe(before.scrollY);};
  try{
    for(const width of[320,390,768,1440]){
      await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:5175/');await page.locator('main h1').waitFor();await page.evaluate(()=>document.fonts.ready);await page.bringToFront();
      await page.evaluate(()=>{window.__menuShifts=[];new PerformanceObserver(list=>window.__menuShifts.push(...list.getEntries().map(entry=>entry.value))).observe({type:'layout-shift',buffered:false});});
      const platform=page.locator('.c-top-nav').getByRole('button',{name:'Plataforma',exact:true}),right=page.getByRole('button',{name:'Abrir navegação',exact:true});
      if(await platform.isVisible()){
        const fonts=await page.locator('.c-top-nav').evaluate(node=>[...node.querySelectorAll('a,button')].map(item=>{const css=getComputedStyle(item);return{size:css.fontSize,family:css.fontFamily,weight:css.fontWeight};}));
        expect(fonts.every(font=>font.size==='13px'&&font.family===fonts[0].family&&font.weight===fonts[0].weight)).toBe(true);
        const before=await metrics();await platform.click();await expect(platform).toHaveAttribute('aria-expanded','true');const open=await metrics();const check={width,menu:'Plataforma',fonts,before,open};checks.push(check);same(before,open);await page.keyboard.press('Escape');await expect(platform).toBeFocused();same(before,await metrics());check.closed=await metrics();
      }
      const before=await metrics();await right.click();const close=page.getByRole('button',{name:'Fechar navegação',exact:true});await expect(close).toHaveAttribute('aria-expanded','true');const open=await metrics();const check={width,menu:'Direita',before,open};checks.push(check);same(before,open);await close.click();await expect(right).toHaveAttribute('aria-expanded','false');same(before,await metrics());check.closed=await metrics();
      await page.waitForTimeout(150);const shifts=await page.evaluate(()=>window.__menuShifts);expect(shifts.reduce((sum,value)=>sum+value,0),'No layout shift during menu interactions').toBeLessThan(.001);checks.at(-1).layoutShifts=shifts;
    }
    expect(errors).toEqual([]);passed=true;console.log(JSON.stringify({passed,checks:checks.length,errors}));
  }catch(error){errors.push(String(error));throw error;}finally{
    await fs.mkdir('docs/redesign-2026-10-22/qa/visual-review',{recursive:true});await fs.writeFile('docs/redesign-2026-10-22/qa/visual-review/menus.json',JSON.stringify({date:new Date().toISOString(),passed,scope:'Local new-site preview. Checks both menus, typography and header/heading geometry while opening and closing; desktop Chromium, not physical-device certification.',checks,errors},null,2));await context.close();
  }
}
