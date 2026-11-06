import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const origin = 'http://127.0.0.1:8142';
const directory = new URL('./qa/', import.meta.url);
await mkdir(directory, { recursive: true });
const report = { origin, widths: [320,390,768,1440], completedJourneys: 0, repeatedActionChecks: 0, textRequests: 0, keyboardChecks: 0, foundationStates: 0, errors: [], missingResponses: [], externalRequests: [], overflow: [], passed: false, realCrmChanges: false, realMessagesSent: false, productionChanged: false };
const browser = await chromium.launch({ headless: true });
function cleanText(value) { return value.replace(/\s+/g,' ').trim(); }
try {
 for (const width of report.widths) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if(response.status() >= 400) report.missingResponses.push({url:response.url(),status:response.status()}); });
  page.on('request', request => { if(!request.url().startsWith(origin)) report.externalRequests.push(request.url()); });
  const response = await page.goto(origin);
  assert.equal(response.status(),200);
  assert.equal(response.headers()['x-robots-tag'],'noindex,nofollow');
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('h1').count(),1);
  const broken = await page.locator('a[href^="#"]').evaluateAll(links=>links.map(link=>link.getAttribute('href').slice(1)).filter(id=>!document.getElementById(id)));
  assert.deepEqual(broken,[]);
  assert.equal(cleanText(await page.locator('[data-stage-label]').textContent()),'Qualificação');
  await page.locator('.demo-steps [data-action=consult]').click();
  assert.match(await page.locator('#assistant-messages').innerText(),/Origem: histórico da negociação Projeto Aurora/);
  assert.match(await page.locator('#assistant-messages').innerText(),/detalhamento de escopo/);
  await page.locator('.demo-steps [data-action=move]').click();
  assert.equal(cleanText(await page.locator('[data-stage-label]').textContent()),'Proposta enviada');
  assert.equal(await page.locator('[data-stage=proposal]').getAttribute('aria-current'),'step');
  assert.equal(await page.locator('[data-stage=qualification]').getAttribute('aria-current'),null);
  assert.equal(cleanText(await page.locator('[data-composer-stage]').textContent()),'Proposta enviada');
  assert.equal(cleanText(await page.locator('[data-next-step]').textContent()),'Acompanhar retorno');
  assert.equal(await page.locator('.history-new').count(),1);
  assert.equal(await page.locator('#record-confirmation').isVisible(),true);
  await page.locator('.demo-steps [data-action=verify]').click();
  assert.equal(await page.locator('#history-tab').getAttribute('aria-selected'),'true');
  assert.match(await page.locator('.history-new').innerText(),/Qualificação → Proposta enviada/);
  await page.locator('.demo-steps [data-action=move]').click();
  assert.equal(await page.locator('.history-new').count(),1);
  report.repeatedActionChecks++;
  await page.locator('[data-record-tab=overview]').click();
  if(width===1440) await page.locator('.workspace').screenshot({path:new URL('workspace-after.png',directory).pathname});
  report.completedJourneys++;
  await page.locator('#reset-demo').click();
  assert.equal(cleanText(await page.locator('[data-stage-label]').textContent()),'Qualificação');
  assert.equal(await page.locator('.history-new').count(),0);
  await page.locator('#assistant-input').fill('Resuma o histórico desta negociação.');
  await page.locator('#assistant-input').press('Enter');
  assert.match(await page.locator('#assistant-messages').innerText(),/Origem: histórico/);
  await page.locator('#assistant-input').fill('Mova esta oportunidade para proposta enviada.');
  await page.locator('#assistant-input').press('Enter');
  assert.equal(cleanText(await page.locator('[data-stage-label]').textContent()),'Proposta enviada');
  await page.locator('#reset-demo').click();
  await page.locator('#assistant-input').fill('Qual proposta está em discussão?');
  await page.locator('#assistant-input').press('Enter');
  assert.equal(cleanText(await page.locator('[data-stage-label]').textContent()),'Qualificação');
  await page.locator('#assistant-input').fill('Organize a agenda do próximo mês');
  await page.locator('#assistant-input').press('Enter');
  assert.match(await page.locator('#assistant-messages').innerText(),/Neste exemplo, experimente/);
  assert.equal(await page.locator('.history-new').count(),0);
  report.textRequests+=4;
  await page.locator('#overview-tab').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#history-tab').evaluate(e=>e===document.activeElement),true);
  report.keyboardChecks++;
  for(const key of ['context','connections','rules']){
   await page.locator(`[data-foundation=${key}]`).click();
   assert.equal(await page.locator(`[data-foundation=${key}]`).getAttribute('aria-selected'),'true');
   assert.equal(await page.locator(`[data-foundation-path=${key}]`).getAttribute('class'),'foundation-path is-active');
   report.foundationStates++;
  }
  await page.locator('[data-foundation=context]').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[data-foundation=connections]').getAttribute('aria-selected'),'true');
  report.keyboardChecks++;
  const overflows = await page.evaluate(()=>[...document.querySelectorAll('header *,main *,footer *')].filter(e=>{const r=e.getBoundingClientRect();const parent=e.closest('.assistant-messages');return r.width>0&&!parent&&!e.closest('.closing>svg')&&(r.left< -1||r.right>innerWidth+1)}).map(e=>({tag:e.tagName,className:typeof e.className==='string'?e.className:'svg'})));
  if(overflows.length) report.overflow.push({width,items:overflows});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'Page overflow '+width);
  await page.locator('#reset-demo').click();
  await page.locator('[data-foundation=context]').click();
  for(const image of await page.locator('img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(e=>e.decode());}
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:new URL(`home-${width}.png`,directory).pathname,fullPage:true});
  if(width===390||width===1440) await page.screenshot({path:new URL(`hero-${width}.png`,directory).pathname});
  await page.close();
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.missingResponses,[]);assert.deepEqual(report.externalRequests,[]);assert.deepEqual(report.overflow,[]);report.passed=true;
} finally { await browser.close(); await writeFile(new URL('verification.json',directory),JSON.stringify(report,null,2)+'\n'); }
process.stdout.write(JSON.stringify(report)+'\n');
