import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {contactHarness} from './contact-integration-harness';

const output=path.resolve('docs/redesign-2026-10-22/qa/contact-integrated');await fs.mkdir(output,{recursive:true});
const harness=await contactHarness({initialHumanReview:false}),browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const results:unknown[]=[],errors:string[]=[];let passed=false;
try{
  for(const width of[320,390,768,1440]){
    const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
    await context.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/,route=>route.abort());
    let slowSessionUntil=0;
    await context.route('**/api/site/**',async route=>{const request=route.request();if(request.method()==='GET'&&new URL(request.url()).pathname==='/api/site/session'&&Date.now()<slowSessionUntil)await new Promise(resolve=>setTimeout(resolve,slowSessionUntil-Date.now()));const response=await route.fetch({url:harness.origin+new URL(request.url()).pathname});await route.fulfill({response});});
    const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:5175/contato/');await expect(page.locator('#z-title')).toHaveText(/Converse sobre o que sua empresa precisa/);
    const send=async(text:string)=>{await page.locator('#z-input').fill(text);await page.locator('#z-entry button[type="submit"]').click();};
    await send('Quero organizar agendamentos.');await expect(page.locator('#z-title')).toHaveText('O que seria importante entendermos?');
    await send('Clientes e equipe.');await expect(page.locator('#z-title')).toHaveText('O que você espera dessa primeira conversa?');await page.locator('.z-directions [data-z-answer]').first().click();await expect(page.locator('#z-title')).toHaveText(/Como podemos/);
    await send('Pessoa fictícia '+width);await expect(page.locator('.z-view-contact')).toBeVisible();await page.locator('#z-contact-email').fill('pessoa.teste@example.invalid');await page.locator('.z-view-contact button[type="submit"]').click();await expect(page.locator('#z-title')).toHaveText(/A conversa já tem/);await page.locator('[data-z="continue"]').click();await expect(page.locator('.zd-workspace')).toBeVisible();await expect(page.locator('.zd-concept-stamp')).toContainText('Versão 1');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
    await page.screenshot({path:path.join(output,`concept-${width}.png`),fullPage:true});
    const tabs=page.getByRole('tablist',{name:'Explore seu conceito'});await tabs.getByRole('tab',{name:'As peças'}).focus();await page.keyboard.press('Enter');await expect(page.locator('.zd-block-list')).toBeVisible();await page.keyboard.press('ArrowRight');await expect(page.locator('.zd-flow-nodes')).toBeVisible();
    const beforeReview=harness.counts().generationCalls;await page.getByRole('button',{name:'Incluir revisão humana',exact:true}).click();await expect(page.locator('.zd-concept-stamp')).toContainText('Versão 2');await expect(page.locator('.zd-flow-nodes .zd-node-active')).toContainText('Revisão humana');expect(harness.counts().generationCalls).toBe(beforeReview);await page.getByRole('button',{name:'Ver revisão humana',exact:true}).click();expect(harness.counts().generationCalls).toBe(beforeReview);slowSessionUntil=Date.now()+1500;await page.reload();await expect(page.locator('[data-contact-bootstrap-status],[data-contact-bootstrap-fallback]')).toBeVisible();await expect(page.locator('.z-view-intro')).toBeHidden();await expect(page.locator('.zd-workspace')).toBeVisible({timeout:15000});await expect(page.locator('.zd-concept-stamp')).toContainText('Versão 2');
    await page.getByRole('button',{name:'Conversar com uma pessoa'}).click();const selected=width===390?'email':width===768?'whatsapp':'here';await page.getByRole('button',{name:selected==='email'?/Por e-mail/:selected==='whatsapp'?/Pelo WhatsApp/:/Aqui na página/}).click();
    if(selected==='whatsapp'){const input=page.locator('#z-address');await input.fill('inválido');await page.getByRole('button',{name:'Revisar encaminhamento'}).click();await expect(page.locator('#z-address-error')).not.toBeEmpty();await input.fill(selected==='email'?'pessoa.teste@example.invalid':'+1 (202) 555-0123');await page.getByRole('button',{name:'Revisar encaminhamento'}).click();}const confirm=page.getByRole('button',{name:'Confirmar encaminhamento'});await expect(confirm).toBeDisabled();await page.getByRole('checkbox').check();await confirm.click();await expect(page.locator('[data-handoff-status="accepted"]')).toBeVisible();
    const packet=[...harness.packets.values()].at(-1)!;expect(packet.confirmation.confirmed).toBe(true);expect(packet.channel).toBe(selected);if(selected==='whatsapp')expect(packet.address).toBe('+12025550123');expect(packet.concept?.version).toBe(2);expect(packet.messages.some(message=>message.step==='refinement')).toBe(true);
    await harness.event({eventId:randomUUID(),handoffRef:packet.handoffRef,sequence:1,status:'delivered',occurredAt:new Date().toISOString()});await page.getByRole('button',{name:'Atualizar estado'}).click();await expect(page.locator('[data-handoff-status="delivered"]')).toBeVisible();
    await harness.event({eventId:randomUUID(),handoffRef:packet.handoffRef,sequence:2,status:'assigned',occurredAt:new Date().toISOString()});await page.getByRole('button',{name:'Atualizar estado'}).click();await expect(page.locator('[data-handoff-status="assigned"]')).toBeVisible();await page.reload();await expect(page.locator('[data-handoff-status="assigned"]')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);await page.screenshot({path:path.join(output,`handoff-${width}.png`),fullPage:true});
    results.push({width,channel:selected,conceptVersions:[1,2],tabsKeyboard:true,confirmationRequired:true,callbackStates:['delivered','assigned'],reload:true,counts:harness.counts()});console.log('Contact integrated contract passed at '+width);await context.close();
  }
  expect(errors).toEqual([]);expect(harness.counts()).toEqual({generationCalls:4,handoffCalls:4});passed=true;
}catch(error){errors.push(String(error));throw error;}finally{await fs.writeFile(path.join(output,'verification.json'),JSON.stringify({date:new Date().toISOString(),passed,scope:'Local HTTP contract emulators with real site API, SQLite, Catalisa adapter, schema validator, handoff signer and callback verifier. One browser, sequential widths. No real AI inference or external messages.',results,errors},null,2));await browser.close();await harness.close();}
