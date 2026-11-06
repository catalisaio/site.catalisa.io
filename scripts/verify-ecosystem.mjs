import {expect} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export async function verifyEcosystem(browser) {
  const output=path.resolve('docs/redesign-2026-10-22/qa/ecosystem');
  await fs.mkdir(output,{recursive:true});
  const pages=JSON.parse(await fs.readFile('src/redesign/data/ecosystem.json','utf8'));
  const context=await browser.newContext({reducedMotion:'reduce'});
  await context.addInitScript(()=>localStorage.setItem('catalisa_cookie_consent','denied'));
  await context.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/,route=>route.abort());
  const page=await context.newPage(),reference=await context.newPage();
  const measurements=[],states=[],errors=[];let passed=false;
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(!['GET','HEAD'].includes(request.method()))errors.push('Unexpected mutation request: '+request.url());});
  const copy=async root=>root.locator('h1,h2,h3,h4,p,li,small').evaluateAll(nodes=>nodes.map(node=>node.textContent.replace(/\s+/g,'').trim()));
  try {
    for(const entry of pages)for(const width of [320,390,768,1440]){
      await page.setViewportSize({width,height:1000});await reference.setViewportSize({width,height:1000});
      const response=await page.goto('http://127.0.0.1:5175'+entry.path+'/');
      await reference.goto('http://127.0.0.1:8176'+entry.path+'/');
      await page.locator('.c-ecosystem h1').waitFor();
      await page.evaluate(()=>document.fonts.ready);await reference.evaluate(()=>document.fonts.ready);await page.bringToFront();
      expect(await copy(page.locator('main')),entry.path+' copy').toEqual(await copy(reference.locator('main')));
      const vectors=async active=>active.locator('main svg').evaluateAll(nodes=>nodes.map(svg=>[...svg.querySelectorAll('*')].map(node=>({tag:node.localName,d:node.getAttribute('d'),filter:node.getAttribute('filter')}))));
      expect(await vectors(page),entry.path+' SVG structure and filter elements').toEqual(await vectors(reference));
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex, nofollow');
      const metrics=await page.evaluate(async()=>{
        const images=[...document.querySelectorAll('main img')];
        await Promise.all(images.map(async image=>{image.loading='eager';await image.decode();}));
        return{width:innerWidth,scrollWidth:document.documentElement.scrollWidth,font:getComputedStyle(document.querySelector('main h1')).fontFamily,images:images.length};
      });
      expect(response.status()).toBe(200);expect(metrics.scrollWidth).toBeLessThanOrEqual(width);expect(metrics.font).toContain('Catalisa Inter');
      // Preserve final-page destinations, including external primary sources and capability links.
      const links=async active=>active.locator('main a').evaluateAll(nodes=>nodes.map(node=>[node.textContent.replace(/\s+/g,''),node.getAttribute('href')]));
      expect(await links(page)).toEqual(await links(reference));
      if([390,1440].includes(width)){
        await reference.evaluate(async()=>{await Promise.all([...document.querySelectorAll('main img')].map(async image=>{image.loading='eager';await image.decode();}));});
        await page.screenshot({path:path.join(output,entry.path.slice(1).replaceAll('/','-')+'-'+width+'.png'),fullPage:true});
        if(width===1440){const original=await reference.screenshot(),native=await page.screenshot();await sharp({create:{width:1440,height:500,channels:3,background:'#F4F0E8'}}).composite([{input:await sharp(original).resize(720,500).toBuffer(),left:0,top:0},{input:await sharp(native).resize(720,500).toBuffer(),left:720,top:0}]).png().toFile(path.join(output,entry.path.slice(1).replaceAll('/','-')+'-comparison.png'));}
      }
      if(entry.path==='/composicoes'){
        for(let index=0;index<3;index++){
          await page.locator(`[data-composition="${index}"]`).click();await reference.locator(`[data-composition="${index}"]`).evaluate(node=>node.click());
          await expect(page.locator('#composition-example')).toHaveAttribute('aria-labelledby','c-composition-tab-'+index);
          expect(await copy(page.locator('#composition-example'))).toEqual(await copy(reference.locator('#composition-example')));
          expect(await page.getByRole('tab',{selected:true}).count()).toBe(1);states.push({width,index});
        }
        await page.getByRole('tab',{name:'Decisão',exact:true}).focus();await page.keyboard.press('ArrowRight');
        await expect(page.getByRole('tab',{name:'Atendimento',exact:true})).toBeFocused();
        await page.keyboard.press('End');await expect(page.getByRole('tab',{name:'Decisão',exact:true})).toHaveAttribute('aria-selected','true');
        await page.keyboard.press('Home');await expect(page.getByRole('tab',{name:'Atendimento',exact:true})).toBeFocused();
      }
      measurements.push({route:entry.path,...metrics});console.log(`${entry.path} verified at ${width}px`);
    }
    // Check real SPA navigation into and out of these styles, without document reloads.
    await page.goto('http://127.0.0.1:5175/ecossistema/');
    await page.locator('.product-directory a[href="/ecossistema/med/"]').click();await expect(page.locator('main h1')).toHaveText('Med');
    await page.locator('.block-list a').first().click();await expect(page.locator('.building-detail')).toBeVisible();
    await page.locator('.c-breadcrumb a[href="/capacidades/"]').click();await expect(page.locator('.building-blocks-page')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(1440);
    expect(errors).toEqual([]);passed=true;
    console.log(JSON.stringify({measurements:measurements.length,states:states.length,errors}));
  }catch(error){errors.push(String(error));throw error;}finally{
    await fs.writeFile(path.join(output,'verification.json'),JSON.stringify({date:new Date().toISOString(),passed,scope:'Seven native composition/ecosystem pages compared to final N01 HTML at four widths; copy, source/capability links, local images, keyboard tabs and SPA CSS isolation. No service operations or physical-device QA.',measurements,states,errors},null,2));
    await context.close();
  }
}
