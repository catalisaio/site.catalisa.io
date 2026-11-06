/** Native Lab + real BFF against explicit local HTTP fixtures. No external AI or messages. */
import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import {contactHarness} from './contact-integration-harness';
const output=path.resolve('docs/redesign-2026-10-22/qa/lab');await fs.mkdir(output,{recursive:true});
const harness=await contactHarness(),browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const results:unknown[]=[],errors:string[]=[];let passed=false;
try{
 for(const width of[320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
  await context.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/,route=>route.abort());
  await context.route('**/api/site/**',async route=>{const response=await route.fetch({url:harness.origin+new URL(route.request().url()).pathname});await route.fulfill({response});});
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:5175/lab/');await expect(page.locator('h1')).toHaveText('O que vocêquer construir?');await expect(page.locator('.l-result-title')).toContainText('Pata & Prosa');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);await page.screenshot({path:path.join(output,`initial-${width}.png`),fullPage:true});
  for(const[key,title]of Object.entries({repair:'Oficina em Dia',credit:'Crédito com Contexto',hiring:'Próxima Pessoa',vet:'Pata & Prosa'})){await page.locator(`[data-l-example="${key}"]`).click();await expect(page.locator('.l-result-title h3')).toHaveText(title);await expect(page.locator('#l-form-status')).toContainText('Exemplo demonstrativo');}
  await page.locator('[data-l-step="2"]').click();await expect(page.locator('.l-step-detail')).toContainText('PASSO 3 / 4');
  await page.getByRole('tab',{name:'Uma tela possível',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('.l-app')).toBeVisible();
  await page.locator('[data-l-try]').click();await expect(page.locator('dialog[open]')).toBeVisible();await page.locator('dialog[open] .l-slot-options button').first().click();await expect(page.locator('#l-booking-status')).toContainText('Escolha registrada');await page.keyboard.press('Escape');await expect(page.locator('dialog[open]')).toHaveCount(0);
  await page.getByRole('tab',{name:'Uma tela possível',exact:true}).focus();await page.keyboard.press('ArrowRight');await expect(page.locator('.l-blocks')).toBeVisible();
  const idea='Quero organizar pedidos da minha loja pelo WhatsApp';await page.locator('#l-prompt').fill(idea);await page.locator('#l-form button[type="submit"]').click();await expect(page.locator('.l-identity-dialog[open]')).toBeVisible();
  await page.locator('#l-name').fill('Pessoa fictícia Lab '+width);await page.getByRole('button',{name:'Gerar meu conceito',exact:true}).click();await expect(page.locator('.l-identity-dialog .l-error')).toContainText(/e-mail|telefone/);
  if(width<500)await page.locator('#l-email').fill('lab.teste@example.invalid');else await page.locator('#l-phone').fill('+12025550123');
  await page.getByRole('button',{name:'Gerar meu conceito',exact:true}).click();await expect(page.locator('.l-result-title')).toContainText('Conceito gerado por IA');
  const before=await page.evaluate(async()=>await(await fetch('/api/site/session')).json());expect(before.latestConcept).toBeTruthy();expect(before.contactDetails.email||before.contactDetails.phone).toBeTruthy();expect(before.messages.map((message:{role:string})=>message.role)).toEqual(['visitor','system']);
  await page.reload();await expect(page.locator('.l-result-title')).toContainText('Conceito gerado por IA');await expect(page.locator('#l-prompt')).toHaveValue(idea);
  await page.getByRole('tab',{name:'Uma tela possível',exact:true}).click();await expect(page.locator('.l-app h4')).toHaveText('Escolha um horário');await page.locator('.l-app>div>button').click();await expect(page.locator('.l-app h4')).toHaveText('Confira o pedido');
  await page.screenshot({path:path.join(output,`generated-${width}.png`),fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
  const next='Quero agendar visitas na minha loja';await page.locator('#l-prompt').fill(next);
  if(width===1440){harness.failNextGeneration();await page.locator('#l-form button[type="submit"]').click();await expect(page.locator('.l-global-error')).toContainText('prévia anterior');await expect(page.locator('#l-prompt')).toHaveValue(next);await expect(page.locator('.l-result-title')).toContainText('Prévia anterior');}
  await page.locator('#l-form button[type="submit"]').click();await expect(page.locator('.l-your-idea')).toContainText(next);const after=await page.evaluate(async()=>await(await fetch('/api/site/session')).json());expect(after.session.briefVersion).toBe(2);expect(after.latestConcept.conceptRef).not.toBe(before.latestConcept.conceptRef);
  await page.locator('.l-prototype-note a').click();await expect(page.locator('.zd-workspace')).toBeVisible();await expect(page.locator('.zd-concept-stamp')).toContainText(after.latestConcept.content.title.toLocaleUpperCase('pt-BR'));
  results.push({width,examples:4,tabsKeyboard:true,demoDialog:true,contactRequired:true,contactChannel:width<500?'email':'phone',generatedScreens:true,reload:true,newIdea:true,contactContinuation:true,errorAndRetry:width===1440,overflow:false});console.log('Lab passed at '+width);await context.close();
 }
 expect(errors).toEqual([]);expect(harness.counts()).toEqual({generationCalls:9,handoffCalls:0});passed=true;
}catch(reason){errors.push(String(reason));throw reason;}finally{await fs.writeFile(path.join(output,'verification.json'),JSON.stringify({date:new Date().toISOString(),passed,scope:'Native Lab UI with real BFF, SQLite, schema validation and HTTP fixtures. No external inference, CRM or messages. One browser; sequential widths.',results,errors},null,2));await browser.close();await harness.close();}
