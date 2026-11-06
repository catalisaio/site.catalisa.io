import fs from 'node:fs/promises';
import path from 'node:path';
import {expect} from '@playwright/test';

export async function verifyContact(browser){
  const output=path.resolve('docs/redesign-2026-10-22/qa/contact');await fs.mkdir(output,{recursive:true});
  const results=[],errors=[];let passed=false;
  try{
    for(const width of [320,390,768,1440]){
      const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
      await context.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/,route=>route.abort());
      const page=await context.newPage(),reference=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
      page.on('response',response=>{if(response.url().includes('/api/site/')&&response.request().method()!=='GET'){const data=response.request().postDataJSON();console.log(JSON.stringify({width,operation:new URL(response.url()).pathname,status:response.status(),step:data?.step,briefVersion:data?.briefVersion}));}});
      await page.goto('http://127.0.0.1:5175/contato/');await reference.goto('http://127.0.0.1:8176/contato/');
      for(const current of [page,reference])await current.evaluate(async()=>{await document.fonts.ready;});
      await expect(page.locator('#z-title')).toHaveText(/Converse sobre o que sua empresa precisa/);
      const measure=async current=>current.locator('.z-stage').evaluate(node=>({width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height,scroll:document.documentElement.scrollWidth,title:document.querySelector('#z-title').textContent.replace(/\s+/g,''),children:[...document.querySelector('.z-view').children].map(child=>({className:child.className,text:child.textContent,height:child.getBoundingClientRect().height,top:child.getBoundingClientRect().top}))}));
      const native=await measure(page),original=await measure(reference);
      await page.screenshot({path:path.join(output,`intro-native-${width}.png`),fullPage:true});await reference.screenshot({path:path.join(output,`intro-reference-${width}.png`),fullPage:true});
      results.push({width,initial:{native,reference:original}});
      expect(native.scroll).toBe(width);expect(native.title).toEqual(original.title);expect(Math.abs(native.height-original.height)).toBeLessThanOrEqual(1);
      let writes=0;
      if(width===390)await page.route('**/api/site/messages',async route=>{writes++;if(writes===1){await route.fetch();await route.abort('failed');}else await route.continue();});
      const send=async value=>{
        await page.locator('#z-input').fill(value);
        await page.locator('#z-entry button[type="submit"]').click();
        console.log(JSON.stringify({width,title:await page.locator('#z-title').textContent(),input:await page.locator('#z-input').inputValue(),error:await page.locator('#z-input-error').textContent(),busy:await page.locator('#z-entry').getAttribute('aria-busy')}));
      };
      await send('Agendar consultas pelo WhatsApp');
      if(width===390){await expect(page.locator('#z-input-error')).toContainText('Não foi possível conectar');await expect(page.locator('#z-input')).toHaveValue('Agendar consultas pelo WhatsApp');await page.locator('#z-entry button[type="submit"]').click();}
      await expect(page.locator('#z-title')).toHaveText('O que seria importante entendermos?');
      await send('Pacientes de uma clínica');
      await expect(page.locator('#z-title')).toHaveText('O que você espera dessa primeira conversa?');
      await page.locator('.z-directions [data-z-answer]').first().click();
      await expect(page.locator('#z-title')).toHaveText(/Como podemos/);
      await send('Pessoa de teste '+width);
      await expect(page.locator('#z-title')).toHaveText(/A conversa já tem/);
      const snapshot=await page.evaluate(async()=>await(await fetch('/api/site/session')).json());
      expect(snapshot.messages).toHaveLength(3);expect(snapshot.session.identityStatus).toBe('provisional');expect(snapshot.session.leadStatus).toBe('pending');
      expect(snapshot.identity.leadRef).toMatch(/^site_lead_/);expect(snapshot.displayName).toBe('Pessoa de teste '+width);
      await page.reload();await expect(page.locator('#z-title')).toHaveText(/A conversa já tem/);await expect(page.locator('.z-kicker')).toContainText('PESSOA DE TESTE '+width);
      await page.locator('[data-z-edit="context"]').click();await send('Pacientes e recepção');await expect(page.locator('#z-title')).toHaveText(/A conversa já tem/);
      const edited=await page.evaluate(async()=>await(await fetch('/api/site/session')).json());expect(edited.session.briefVersion).toBe(4);expect(edited.messages).toHaveLength(4);expect(edited.messages[1].text).toBe('Pacientes de uma clínica');
      await page.locator('[data-z="continue"]').click();await expect(page.locator('.z-error[role="status"]').last()).toContainText('Sua conversa está salva');
      await page.locator('#z-history-button').click();const dialog=page.getByRole('dialog',{name:'Nossa conversa.'});await expect(dialog).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('#z-history-button')).toBeFocused();
      await page.screenshot({path:path.join(output,`summary-native-${width}.png`),fullPage:true});results.push({width,native,reference:original,resume:true,editPreservesHistory:true,identity:'provisional',crm:'pending',lostResponseReplay:width===390,ai:'not configured; explicit 503'});await context.close();
    }
    expect(errors).toEqual([]);passed=true;
  }catch(error){errors.push(String(error));throw error;}finally{await fs.writeFile(path.join(output,'verification.json'),JSON.stringify({date:new Date().toISOString(),passed,scope:'Local SQLite BFF and native Contact through persisted summary, four widths. Staging database, IA, channels, full concept renderer and delivery remain pending.',results,errors},null,2));}
}
