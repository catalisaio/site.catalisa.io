import { expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export async function verifyOperations(browser) {
  const output = path.resolve('docs/redesign-2026-10-22/qa/operations');
  await fs.mkdir(output, { recursive: true });
  const screensOnly=process.argv.includes('--screens-only');
  const data = JSON.parse(await fs.readFile('src/redesign/data/operations.json', 'utf8'));
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.addInitScript(() => localStorage.setItem('catalisa_cookie_consent', 'denied'));
  await context.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/, route => route.abort());
  const page = await context.newPage(), reference = await context.newPage();
  const errors = [], measurements = [], states = [], checks = [];
  let passed=false;
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!['GET','HEAD'].includes(request.method())) errors.push('Unexpected mutation request: ' + request.url()); });
  const text = async root => root.locator('h1,h2,h3,h4,p,svg text').evaluateAll(nodes => nodes.map(node => node.textContent.replace(/\s+/g, '').trim()));
  const compare = async (selector, state) => {
    expect(await text(page.locator(selector)), state).toEqual(await text(reference.locator(selector)));
    states.push(state);
  };
  const clickBoth = async selector => { await page.locator(selector).click(); await reference.locator(selector).evaluate(node=>node.click()); };
  const selectBoth = async (selector, value) => { await page.locator(selector).selectOption(value); await reference.locator(selector).selectOption(value); };
  try {
    for (const [family, route, prefix] of [['studio','/studio/','s'],['workflows','/workflows/','w'],['agents','/agentes/','n'],['governance','/governanca/','q']]) {
      for (const width of (screensOnly ? [390,1440] : [320,390,768,1440])) {
        await page.setViewportSize({width,height:1000}); await reference.setViewportSize({width,height:1000});
        const response = await page.goto('http://127.0.0.1:5175'+route);
        await reference.goto('http://127.0.0.1:8176'+route);
        await page.locator('main h1').waitFor();
        await page.evaluate(() => document.fonts.ready); await reference.evaluate(() => document.fonts.ready); await page.bringToFront();
        expect(await text(page.locator('main')), `${family} initial copy at ${width}`).toEqual(await text(reference.locator('main')));
        await expect(page.locator('main h1')).toHaveCount(1);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex, nofollow');
        const size = await page.evaluate(() => ({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,broken:[...document.querySelectorAll('main img')].filter(image=>image.complete&&!image.naturalWidth).map(image=>image.src)}));
        expect(size.scrollWidth).toBeLessThanOrEqual(width); expect(size.broken).toEqual([]); expect(response.status()).toBe(200);
        measurements.push({family,route,width,...size});
        if ([390,1440].includes(width)) {
          for (const active of [page,reference]) {
            const images=active.locator('main img');
            for(let i=0;i<await images.count();i++) { await images.nth(i).scrollIntoViewIfNeeded(); await expect.poll(()=>images.nth(i).evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true); }
            await active.evaluate(()=>scrollTo(0,0));
          }
          await page.screenshot({path:path.join(output,`${family}-${width}.png`),fullPage:true});
          if (width===1440) {
            const native=await page.screenshot(), original=await reference.screenshot();
            await sharp({create:{width:1440,height:500,channels:3,background:'#F4F0E8'}}).composite([{input:await sharp(original).resize(720,500).toBuffer(),left:0,top:0},{input:await sharp(native).resize(720,500).toBuffer(),left:720,top:0}]).png().toFile(path.join(output,`${family}-comparison.png`));
          }
        }
        if(screensOnly) { console.log(`${family} refreshed at ${width}px`); continue; }
        await page.bringToFront();
        if (family==='studio') {
          for(const [attribute,panel,count] of [['s-stage','#s-stage-panel',4],['s-capture','#s-capture-panel',3],['s-case','#s-example-panel',5]]) {
            for(let i=0;i<count;i++) { await clickBoth(`[data-${attribute}="${i}"]`); await compare(panel,`${family}:${width}:${attribute}:${i}`); }
          }
          await page.locator('[data-s-stage="0"]').focus(); await page.keyboard.press('End');
          await expect(page.locator('[data-s-stage="3"]')).toBeFocused(); await expect(page.locator('[data-s-stage="3"]')).toHaveAttribute('aria-selected','true');
        }
        if (family==='workflows') {
          for(let scenario=0;scenario<data.scenarios.length;scenario++) {
            await clickBoth(`[data-w-scenario="${scenario}"]`);
            for(const mode of ['regular','missing','failure']) {
              await selectBoth('#w-sim-mode',mode);
              for(let step=0;step<data.scenarios[scenario].groups.length;step++) {
                await compare('#w-simulation',`${family}:${width}:${scenario}:${mode}:${step}`);
                await clickBoth('[data-w-next]');
              }
            }
          }
          await page.locator('[data-w-scenario="2"]').focus(); await page.keyboard.press('Home'); await expect(page.locator('[data-w-scenario="0"]')).toBeFocused();
          await expect(page.locator('#w-sim-mode')).toHaveValue('regular');
          await expect(page.locator('[data-w-prev]')).toBeDisabled(); await page.locator('[data-w-next]').click(); await page.locator('[data-w-prev]').click();
          await expect(page.locator('.w-simulation-reading>span')).toHaveText(/ETAPA 1/);
        }
        if(family==='agents') {
          for(let role=0;role<data.roles.length;role++) {
            await clickBoth(`[data-n-role="${role}"]`); await compare('#n-demo',`${family}:${width}:${role}:read`); await expect(page.locator('[data-n-prepare]')).toBeDisabled();
            await clickBoth('[data-n-access="prepare"]'); await compare('#n-demo',`${family}:${width}:${role}:prepare`);
            await clickBoth('[data-n-prepare]'); await compare('#n-demo',`${family}:${width}:${role}:prepared`);
            await expect(page.locator('.n-demo-outcome')).toHaveAttribute('role','status');
          }
          await page.locator('[data-n-access="read"]').click(); await expect(page.locator('.n-demo-outcome')).toHaveCount(0); await expect(page.locator('[data-n-prepare]')).toBeDisabled();
          await page.locator('[data-n-role="3"]').focus(); await page.keyboard.press('ArrowRight'); await expect(page.locator('[data-n-role="0"]')).toBeFocused();
        }
        if(family==='governance') {
          await compare('#q-approval',`${family}:${width}:new:requester`);
          await selectBoth('#q-actor','reviewer'); await compare('#q-approval',`${family}:${width}:new:reviewer`); await expect(page.locator('[data-q-request]')).toBeDisabled();
          await selectBoth('#q-actor','requester'); await clickBoth('[data-q-request]'); await compare('#q-approval',`${family}:${width}:pending:requester`); await expect(page.locator('#q-actor')).toBeFocused();
          await clickBoth('[data-q-approve]'); await compare('#q-approval',`${family}:${width}:pending:denied`); await expect(page.locator('.q-request-feedback')).toContainText('não pode aprovar');
          await selectBoth('#q-actor','reviewer'); await compare('#q-approval',`${family}:${width}:pending:reviewer`);
          await clickBoth('[data-q-approve]'); await compare('#q-approval',`${family}:${width}:approved:reviewer`); await expect(page.locator('[data-q-reset]')).toBeFocused();
          await selectBoth('#q-actor','requester'); await compare('#q-approval',`${family}:${width}:approved:requester`);
          await clickBoth('[data-q-reset]'); await clickBoth('[data-q-request]'); await selectBoth('#q-actor','reviewer'); await clickBoth('[data-q-refuse]'); await compare('#q-approval',`${family}:${width}:refused:reviewer`);
          await selectBoth('#q-actor','requester'); await compare('#q-approval',`${family}:${width}:refused:requester`);
          await clickBoth('[data-q-reset]'); await expect(page.locator('[data-q-request]')).toBeFocused();
        }
        const pause=page.getByRole('button',{name:'Pausar movimento'}); await pause.click(); await expect(page.getByRole('button',{name:'Retomar movimento'})).toHaveAttribute('aria-pressed','true'); await page.getByRole('button',{name:'Retomar movimento'}).click();
        const faq=page.locator(`.${prefix}-questions details`).first(); await faq.locator('summary').focus(); await page.keyboard.press('Enter'); await expect(faq).toHaveAttribute('open','');
        // Open every visible capture, including the selected Studio Canvas and profile methods.
        const buttons=page.locator('main [data-capture-file]'); const count=await buttons.count();
        for(let i=0;i<count;i++) {
          const button=buttons.nth(i); await button.click(); const dialog=page.locator('dialog[open]'); await expect(dialog).toBeVisible();
          await expect(dialog.getByRole('button',{name:'Fechar imagem'})).toBeFocused();
          await expect(dialog.locator('img')).toBeVisible(); await expect(dialog.locator('img')).toHaveAttribute('src','/redesign/screens/'+await button.getAttribute('data-capture-file')); await expect.poll(()=>dialog.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
          await dialog.getByRole('button',{name:'100%',exact:true}).click(); await expect(dialog.locator('.c-capture-viewport')).toHaveClass(/c-capture-actual/);
          await dialog.getByRole('button',{name:'Ajustar',exact:true}).click();
          const next=dialog.getByRole('button',{name:'Próxima imagem'}); if(await next.isEnabled()) {await next.click(); await page.keyboard.press('ArrowLeft');}
          const box=await dialog.boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width+1);
          await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0); await expect(button).toBeFocused();
        }
        checks.push(`${family}:${width}: tab state, pause, FAQ, ${count} capture triggers, fit/zoom/navigation/Escape/focus`);
        console.log(`${family} verified at ${width}px`);
      }
    }
    // Loading all four CSS families must not change the existing catalogue layout.
    await page.goto('http://127.0.0.1:5175/studio/');
    await page.bringToFront();await expect(page.locator('.s-page')).toBeVisible();
    for(const [route,root] of [['/workflows/','.w-page'],['/agentes/','.n-page'],['/governanca/','.q-page'],['/capacidades/','.building-blocks-page']]) {
      const trigger=page.locator('.c-header').getByRole('button',{name:'Plataforma',exact:true});
      await expect(trigger).toHaveAttribute('aria-expanded','false');await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded','true');
      await page.locator(`.c-header a[href="${route}"]:visible`).click();
      await page.waitForURL('**'+route);
      await expect(page.locator(root)).toBeVisible();await expect(trigger).toHaveAttribute('aria-expanded','false');
    }
    await expect(page.locator('.building-blocks-page')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(1440);
    expect(errors).toEqual([]);
    passed=true;
    console.log(JSON.stringify({measurements:measurements.length,states:states.length,checks:checks.length,errors}));
  } catch(error) { errors.push(String(error)); throw error; } finally {
    await fs.writeFile(path.join(output,screensOnly?'visual-refresh.json':'verification.json'),JSON.stringify({date:new Date().toISOString(),passed,scope:'Four native operation families compared with final reference HTML and finite states at 320/390/768/1440; gallery and keyboard; no real service calls; not full accessibility/device/production QA',measurements,states,checks,errors},null,2));
    await context.close();
  }
}
