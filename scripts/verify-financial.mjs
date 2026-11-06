import {expect} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export async function verifyFinancial(browser){
  const screensOnly=process.argv.includes('--screens-only');
  const output=path.resolve('docs/redesign-2026-10-22/qa/financial');await fs.mkdir(output,{recursive:true});
  const context=await browser.newContext({reducedMotion:'reduce'});
  await context.addInitScript(()=>localStorage.setItem('catalisa_cookie_consent','denied'));
  await context.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/,route=>route.abort());
  const page=await context.newPage(),reference=await context.newPage();
  const errors=[],measurements=[],states=[],checks=[];let passed=false;
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(!['GET','HEAD'].includes(request.method()))errors.push('Unexpected mutation: '+request.url());});
  const text=async root=>root.locator('h1,h2,h3,h4,p,strong,small,li,svg text').evaluateAll(nodes=>nodes.map(node=>node.textContent.replace(/\s+/g,'')));
  const compare=async(selector,key)=>{await expect(page.locator(selector)).toBeVisible();await expect(reference.locator(selector)).toBeVisible();expect(await text(page.locator(selector)),key).toEqual(await text(reference.locator(selector)));states.push(key);};
  const clickBoth=async selector=>{await page.locator(selector).click();await reference.locator(selector).evaluate(node=>node.click());};
  const gallery=async()=>{
    const buttons=page.locator('main [data-capture-file]:visible');let count=0;
    for(let index=0;index<await buttons.count();index++){
      const button=buttons.nth(index);await button.click();const dialog=page.locator('dialog[open]');await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('button',{name:'Fechar imagem'})).toBeFocused();
      await expect(dialog.locator('img')).toHaveAttribute('src','/redesign/screens/'+await button.getAttribute('data-capture-file'));
      await expect.poll(()=>dialog.locator('img').evaluate(image=>image.complete&&image.naturalWidth>0)).toBe(true);
      await dialog.getByRole('button',{name:'100%',exact:true}).click();await expect(dialog.locator('.c-capture-viewport')).toHaveClass(/c-capture-actual/);
      await dialog.getByRole('button',{name:'Ajustar',exact:true}).click();
      const original=await dialog.locator('img').getAttribute('src');await dialog.getByRole('button',{name:'Próxima imagem'}).click();await page.keyboard.press('ArrowLeft');await expect(dialog.locator('img')).toHaveAttribute('src',original);
      const box=await dialog.boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(page.viewportSize().width+1);
      await page.keyboard.press('Escape');await expect(button).toBeFocused();count++;
    }return count;
  };
  try{
    for(const [name,prefix]of[['banking','bk'],['credit','cr']])for(const width of screensOnly?[390,1440]:[320,390,768,1440]){
      const route='/ecossistema/'+name+'/';await page.setViewportSize({width,height:1000});await reference.setViewportSize({width,height:1000});
      const response=await page.goto('http://127.0.0.1:5175'+route);await reference.goto('http://127.0.0.1:8176'+route);
      await page.locator('main h1').waitFor();await page.evaluate(()=>document.fonts.ready);await reference.evaluate(()=>document.fonts.ready);await page.bringToFront();
      expect(await text(page.locator('main')),name+' initial copy').toEqual(await text(reference.locator('main')));
      await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex, nofollow');await expect(page.locator('main h1')).toHaveCount(1);
      const metrics=await page.evaluate(async()=>{const images=[...document.querySelectorAll('main img')];await Promise.all(images.map(async image=>{image.loading='eager';await image.decode();}));return{width:innerWidth,scrollWidth:document.documentElement.scrollWidth,font:getComputedStyle(document.querySelector('main h1')).fontFamily,images:images.length};});
      expect(response.status()).toBe(200);expect(metrics.scrollWidth).toBeLessThanOrEqual(width);expect(metrics.font).toContain('Catalisa Inter');measurements.push({route,...metrics});
      if([390,1440].includes(width)){
        await reference.evaluate(async()=>{await Promise.all([...document.querySelectorAll('main img')].map(async image=>{image.loading='eager';await image.decode();}));});
        await page.screenshot({path:path.join(output,`${name}-${width}.png`),fullPage:true});
        if(width===1440){const original=await reference.screenshot(),native=await page.screenshot();await sharp({create:{width:1440,height:500,channels:3,background:'#F4F0E8'}}).composite([{input:await sharp(original).resize(720,500).toBuffer(),left:0,top:0},{input:await sharp(native).resize(720,500).toBuffer(),left:720,top:0}]).png().toFile(path.join(output,name+'-comparison.png'));}
      }
      if(screensOnly){console.log(`${name} refreshed at ${width}px`);continue;}
      await page.bringToFront();let captureTriggers=0;
      if(name==='banking'){
        for(const channel of ['app','desktop','console']){await clickBoth(`[data-bk-channel="${channel}"]`);await compare('#bk-panel-'+channel,`${name}:${width}:channel:${channel}`);await expect(page.locator('#bk-panel-'+channel)).toBeVisible();captureTriggers+=await gallery();}
        await page.locator('[data-bk-channel=console]').focus();await page.keyboard.press('ArrowRight');await expect(page.locator('[data-bk-channel=app]')).toBeFocused();await page.keyboard.press('End');await expect(page.locator('[data-bk-channel=console]')).toHaveAttribute('aria-selected','true');
        for(const layer of ['channels','capabilities','provider']){await clickBoth(`[data-bk-layer="${layer}"]`);await compare('#bk-base',`${name}:${width}:layer:${layer}`);await expect(page.locator('#bk-base')).toHaveAttribute('data-layer',layer);}
        for(let index=0;index<4;index++){await clickBoth(`[data-bk-tour="${index}"]`);await compare('.bk-tour',`${name}:${width}:tour:${index}`);await expect(page.locator('#bk-tour-scene')).toHaveAttribute('data-step',String(index));}
        await page.locator('[data-bk-tour-next]').click();await expect(page.locator('#bk-tour-scene')).toHaveAttribute('data-step','0');
        for(const balance of ['free','reserved','checking']){await clickBoth(`[data-bk-balance="${balance}"]`);await compare('#bk-balance-example',`${name}:${width}:balance:${balance}`);await expect(page.locator('#bk-balance-example')).toHaveAttribute('data-state',balance);expect(await page.locator('.bk-balance-rail').getAttribute('aria-label')).toBe(await reference.locator('.bk-balance-rail').getAttribute('aria-label'));}
        await expect(page.locator('#bk-usable-value')).toHaveText('Em conferência');
      }else{
        for(const stage of ['receive','assess','formalize','follow']){await clickBoth(`[data-cr-stage="${stage}"]`);await compare('#cr-panel-'+stage,`${name}:${width}:stage:${stage}`);await expect(page.locator('#cr-panel-'+stage)).toBeVisible();captureTriggers+=await gallery();}
        await page.locator('[data-cr-next="3"]').click();await expect(page.locator('[data-cr-stage=receive]')).toBeFocused();await expect(page.locator('#cr-panel-receive')).toBeVisible();
        await page.locator('[data-cr-stage=receive]').focus();await page.keyboard.press('ArrowLeft');await expect(page.locator('[data-cr-stage=follow]')).toBeFocused();await page.keyboard.press('Home');await expect(page.locator('[data-cr-stage=receive]')).toHaveAttribute('aria-selected','true');
        for(const state of ['complete','missing','human']){await clickBoth(`[data-cr-evidence="${state}"]`);await compare('#cr-evidence-dossier',`${name}:${width}:evidence:${state}`);await expect(page.locator('#cr-evidence-dossier')).toHaveAttribute('data-state',state);}
        for(const modality of ['receivables','vehicle','property','personal','payroll']){await clickBoth(`[data-cr-collateral="${modality}"]`);await compare('.cr-collateral-detail',`${name}:${width}:collateral:${modality}`);}
      }
      await page.getByRole('button',{name:'Pausar movimento'}).click();await expect(page.locator('#'+prefix+'-page')).toHaveClass(new RegExp(prefix+'-paused'));await page.getByRole('button',{name:'Retomar movimento'}).click();
      const video=page.locator('main video');await expect(video).toHaveAttribute('controls','');await expect(video).toHaveAttribute('preload','none');
      await video.evaluate(async node=>{await node.play();});await expect.poll(()=>video.evaluate(node=>node.currentTime)).toBeGreaterThan(0);
      expect(await video.evaluate(node=>node.duration)).toBeGreaterThan(0);await video.evaluate(node=>node.pause());expect(await video.evaluate(node=>node.paused)).toBe(true);
      checks.push({name,width,captureTriggers,video:'local playback and pause',keyboard:true});console.log(`${name} verified at ${width}px`);
    }
    await page.goto('http://127.0.0.1:5175/ecossistema/');await page.locator('.product-directory a[href="/ecossistema/banking/"]').click();await expect(page.locator('.bk-page')).toBeVisible();
    await page.locator('.c-header a[href="/ecossistema/"]').click();await expect(page.locator('.c-ecosystem')).toBeVisible();await page.locator('.product-directory a[href="/ecossistema/credit/"]').click();await expect(page.locator('.cr-page')).toBeVisible();
    // Shared gallery keeps the existing operation captures available after adding a collection.
    await page.goto('http://127.0.0.1:5175/studio/');const trigger=page.locator('main [data-capture-file]').first();await trigger.click();await expect(page.locator('dialog[open] img')).toHaveAttribute('src','/redesign/screens/'+await trigger.getAttribute('data-capture-file'));await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
    expect(errors).toEqual([]);passed=true;console.log(JSON.stringify({measurements:measurements.length,states:states.length,checks:checks.length,errors}));
  }catch(error){errors.push(String(error));throw error;}finally{
    await fs.writeFile(path.join(output,screensOnly?'visual-refresh.json':'verification.json'),JSON.stringify({date:new Date().toISOString(),passed,scope:screensOnly?'Final native screenshots and SPA navigation; preserves functional report.':'Banking and Credit final prototype HTML, all illustrative states, keyboard, galleries, local videos and SPA navigation at four widths; no real banking/credit service calls; not a complete accessibility or physical-device audit.',measurements,states,checks,errors},null,2));await context.close();
  }
}
