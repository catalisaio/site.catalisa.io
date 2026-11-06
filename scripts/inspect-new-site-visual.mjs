import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {expect} from '@playwright/test';

export async function inspectNewSite(browser){
  const homeFidelity=process.argv.includes('--home-fidelity');
  const pressKit=process.argv.includes('--press-kit');
  const output=path.resolve('docs/redesign-2026-10-22/qa/visual-review');await fs.mkdir(output,{recursive:true});
  const context=await browser.newContext({reducedMotion:'reduce'});await context.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/,route=>route.abort());
  const page=await context.newPage(),reference=await context.newPage(),results=[],errors=[],modules=[];
  let passed=false;
  page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>modules.push(request.url()));
  try{
    for(const [name,route]of(pressKit?[['press-kit','/press-kit/']]:homeFidelity?[['home','/']]:[['home','/'],['studio','/studio/'],['catalog','/capacidades/']]))for(const width of(homeFidelity||pressKit?[320,390,768,1440]:[390,1440])){
      await page.setViewportSize({width,height:1000});await reference.setViewportSize({width,height:1000});
      await page.goto('http://127.0.0.1:5175'+route);await reference.goto('http://127.0.0.1:8176'+route);await page.locator('main h1').waitFor();
      for(const active of[page,reference])await active.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('main img')].map(async image=>{image.loading='eager';await image.decode();}));scrollTo(0,0);});
      const inspect=async active=>active.evaluate(()=>({h1:document.querySelector('main h1').textContent,font:getComputedStyle(document.querySelector('main h1')).fontFamily,headings:[...document.querySelectorAll('main h1,main h2,main h3')].map(node=>node.textContent.replace(/\s+/g,'')),sections:[...(document.querySelector('.c-home')??document.querySelector('main')).children].map(node=>({tag:node.tagName,className:node.className,height:Math.round(node.getBoundingClientRect().height)})),width:innerWidth,scrollWidth:document.documentElement.scrollWidth,chakra:document.querySelectorAll('[data-emotion]').length}));
      const native=await inspect(page),original=await inspect(reference);results.push({name,width,native,reference:original});
      if(homeFidelity){expect(native.headings).toEqual(original.headings);expect(native.sections.map(section=>section.className)).toEqual(original.sections.map(section=>section.className));for(let index=0;index<native.sections.length;index++)expect(Math.abs(native.sections[index].height-original.sections[index].height),native.sections[index].className+' section height').toBeLessThanOrEqual(1);}
      if(pressKit){
        const details=async active=>active.locator('.k-page').evaluate(node=>({text:node.textContent.replace(/\s+/g,''),sections:[...node.children].map(child=>({height:child.getBoundingClientRect().height,width:child.getBoundingClientRect().width})),assets:[...node.querySelectorAll('img')].map(image=>image.getAttribute('src').split('/').pop()),downloads:[...node.querySelectorAll('a[download]')].map(link=>link.getAttribute('href').split('/').pop())}));
        const actual=await details(page),expected=await details(reference);results.at(-1).pressKit={native:actual,reference:expected};
        expect(actual.text).toEqual(expected.text);expect(actual.assets).toEqual(expected.assets);expect(actual.downloads).toEqual(expected.downloads);expect(native.scrollWidth).toBe(width);
        for(let index=0;index<actual.sections.length;index++)expect(Math.abs(actual.sections[index].height-expected.sections[index].height),'press kit section '+index+' height').toBeLessThanOrEqual(1);
      }
      await page.screenshot({path:path.join(output,`${name}-native-${width}.png`),fullPage:true});await reference.screenshot({path:path.join(output,`${name}-reference-${width}.png`),fullPage:true});
      if(width===1440){const left=await reference.screenshot(),right=await page.screenshot();await sharp({create:{width:1440,height:500,channels:3,background:'#f6f3ee'}}).composite([{input:await sharp(left).resize(720,500).toBuffer(),left:0,top:0},{input:await sharp(right).resize(720,500).toBuffer(),left:720,top:0}]).png().toFile(path.join(output,name+'-comparison.png'));}
      expect(native.chakra).toBe(0);console.log(`${name}: captured native and reference at ${width}`);
      if(homeFidelity){const trigger=page.locator('[data-open-film]');await trigger.click();const dialog=page.getByRole('dialog',{name:'Estudo de composição'});await expect(dialog).toBeVisible();await expect(dialog.locator('[data-toggle-film]')).toBeHidden();await page.keyboard.press('Escape');await expect(trigger).toBeFocused();await page.locator('details summary').nth(1).focus();await page.keyboard.press('Enter');await expect(page.locator('details[open]')).toHaveCount(1);}
    }
    if(homeFidelity){await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('http://127.0.0.1:5175/');const trigger=page.locator('[data-open-film]');await trigger.click();const dialog=page.getByRole('dialog',{name:'Estudo de composição'}),pause=dialog.locator('[data-toggle-film]');await expect(pause).toBeVisible();await pause.click();await expect(pause).toHaveAttribute('aria-pressed','true');await expect(dialog).toHaveClass(/paused/);await page.keyboard.press('Escape');await expect(trigger).toBeFocused();}
    expect(modules.some(url=>url.includes('/src/App.tsx')||url.includes('/src/pages/'))).toBe(false);expect(errors).toEqual([]);passed=true;
  }catch(error){errors.push(String(error));throw error;}finally{await fs.writeFile(path.join(output,pressKit?'press-kit.json':homeFidelity?'home-fidelity.json':'inspection.json'),JSON.stringify({date:new Date().toISOString(),passed,scope:pressKit?'Press kit at four widths: reference text, assets, downloads, section geometry. Header/footer identity is still pending.':homeFidelity?'Home at four widths: final reference heading/section order and height within one pixel; film and accordion, reduced and regular motion; isolated new application. Does not certify every visual detail or the rest of the site.':'Visual comparison for user feedback. Captures differences; does not certify visual fidelity.',results,errors,legacyPageModulesRequested:modules.filter(url=>url.includes('/src/pages/'))},null,2));await context.close();}
}
