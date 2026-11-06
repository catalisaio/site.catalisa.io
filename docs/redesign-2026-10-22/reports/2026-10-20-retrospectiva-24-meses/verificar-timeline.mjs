import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { milestones } from './timeline-model.mjs';

export async function verifyTimeline(page, dir) {
  const url = pathToFileURL(path.join(dir, 'timeline.html')).href;
  const count = expected => page.waitForFunction(n => window.reportApi?.getFiltered().length === n, expected);
  const close = async id => { if (await page.locator('#' + id).evaluate(dialog => dialog.open)) await page.keyboard.press('Escape'); };
  const reset = async () => {
    await page.evaluate(async () => { await window.reportApi.setState({ topic: '', lens: '', phase: '', month: '', q: '', repo: '', status: '', category: '', page: 0 }); });
  };
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => !!window.reportApi);
  await count(milestones.length);
  assert.equal(await page.locator('.map-node').count(), milestones.length);
  assert.equal(await page.locator('.story-card').count(), milestones.length);
  assert.equal(await page.locator('.chapter').count(), 7);
  assert.equal(await page.evaluate(() => window.reportApi.getState().view), 'history');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.screenshot({ path: path.join(dir, 'preview-timeline.png'), fullPage: false });

  await page.locator('[data-map-story="M28"]').click();
  await page.locator('#detail-title').getByText('Configurar o atendimento fica guiado').waitFor();
  assert(await page.locator('#detail-content').innerText().then(text => text.includes('planId')));
  await page.keyboard.press('Escape');
  await page.locator('[data-map-story="M34"]').click();
  assert(await page.locator('#detail-content').innerText().then(text => text.includes('401') && text.includes('Developy')));
  await page.keyboard.press('Escape');
  await page.locator('[data-map-story="M01"]').focus();
  await page.keyboard.press('Enter');
  assert(await page.locator('#detail-dialog').evaluate(dialog => dialog.open));
  await page.keyboard.press('Escape');

  await page.locator('#all-stories').click(); await count(110);
  assert.equal(await page.locator('.story-card').count(), 110);
  await page.locator('#filter-toggle').click();
  await page.locator('[data-preset="credit"]').click(); await count(29);
  assert.equal(await page.evaluate(() => window.reportApi.getState().topic), 'credito');
  assert(await page.locator('#chips').innerText().then(text => text.includes('Crédito')));
  await page.locator('#chips [data-remove="topic"]').click(); await count(110);
  await page.locator('#filter-toggle').click();
  await page.locator('[data-preset="today"]').click(); await count(3);
  assert(await page.evaluate(() => window.reportApi.getFiltered().some(item => item.storyId === 'E072')));
  await reset(); await count(110);

  await page.locator('[data-map-topic="infra"]').click(); await count(14);
  assert(await page.evaluate(() => window.reportApi.getFiltered().every(item => item.group === 'infra')));
  await reset(); await count(110);

  await page.locator('[data-map-topic="ia"]').click(); await count(18);
  assert(await page.evaluate(() => window.reportApi.getFiltered().every(item => item.group === 'ia')));
  await reset(); await count(110);
  await page.locator('#q').fill('planId');
  await page.waitForFunction(() => window.reportApi.getState().q === 'planId');
  assert(await page.evaluate(() => window.reportApi.getFiltered().some(item => item.storyId === 'E072')));
  await page.locator('#reset').click(); await count(110);

  await page.locator('#records-view').click(); await count(2978);
  await page.goto(url+'#view=records&repo=developy&kind=prs',{waitUntil:'load'}); await count(335);
  assert(await page.evaluate(() => window.reportApi.getFiltered().every(item => item.repo === 'developy')));
  await reset(); await count(2978);
  assert.equal(await page.evaluate(() => window.reportApi.data.commits.length), 9909);
  await page.locator('#q').fill('idempot');
  await page.waitForFunction(() => window.reportApi.getState().q === 'idempot' && window.reportApi.getFiltered().length < 2978);
  const idempot = await page.evaluate(() => window.reportApi.getFiltered().length);
  assert(idempot > 15);
  await page.locator('#filter-toggle').click(); await page.locator('#advanced').evaluate(node => { node.open = true; });
  await page.locator('#repo').selectOption('bb'); await page.locator('#filters-done').click();
  await page.waitForFunction(() => window.reportApi.getFiltered().length > 0 && window.reportApi.getFiltered().every(item => item.repo === 'bb'));
  assert(locationSafe(await page.url()));
  const saved = page.url();
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.reportApi?.getState().q === 'idempot' && window.reportApi.getFiltered().length > 0);
  assert.equal(page.url(), saved);

  await reset(); await count(2978);
  await page.locator('#filter-toggle').click(); await page.locator('#advanced').evaluate(node => { node.open = true; });
  await page.locator('#status').selectOption('Aberto'); await page.locator('#filters-done').click(); await count(75);
  await page.locator('#filter-toggle').click();
  await page.locator('#status').selectOption('Mesclado em outro ramo'); await page.locator('#filters-done').click(); await count(16);
  await reset(); await count(2978);
  await page.locator('#kind').selectOption('commits'); await count(9909);
  await page.locator('#filter-toggle').click(); await page.locator('#month').selectOption('2026-10'); await page.locator('#filters-done').click();
  await page.locator('#kind').selectOption('docs'); await count(1613);
  assert.equal(await page.evaluate(() => window.reportApi.getState().month), '');
  await page.locator('#kind').selectOption('modules'); await count(159);
  await page.locator('#kind').selectOption('prs'); await count(2978);
  await page.locator('#next').click();
  await page.waitForFunction(() => window.reportApi.getState().page === 1);
  await page.locator('.record-title').first().click();
  await page.waitForFunction(() => document.querySelector('#detail-dialog').open && document.querySelector('#detail-content pre'));
  assert(await page.locator('#detail-content pre').first().innerText().then(text => text.length > 30));
  await page.keyboard.press('Escape');
  const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#export').click()]);
  assert.equal(download.suggestedFilename(), 'inventario-filtrado.csv');

  await page.locator('#q').fill('zzzznenhumregistro123');
  await page.waitForFunction(() => window.reportApi.getState().q === 'zzzznenhumregistro123'); await count(0);
  assert(await page.locator('.empty-state').isVisible());
  await page.locator('[data-empty-reset]').click(); await count(2978);
  await page.locator('#history-view').click(); await count(milestones.length);
  await page.locator('#all-stories').click(); await count(110);
  await page.locator('#highlights').click(); await count(milestones.length);
  await page.locator('#present').click();
  assert.equal(await page.locator('#slide-position').innerText(), '01 / ' + milestones.length);
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#slide-position').innerText(), '02 / ' + milestones.length);
  await page.keyboard.press('ArrowLeft');
  assert.equal(await page.locator('#slide-position').innerText(), '01 / ' + milestones.length);
  assert(await page.locator('#slide-prev').isDisabled());
  await page.screenshot({ path: path.join(dir, 'preview-timeline-presentation.png') });
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#presentation-dialog').evaluate(dialog => dialog.open), false);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'present');
  await page.locator('#help').click();
  assert(await page.locator('#guide-content').innerText().then(text => text.includes('Critérios se combinam')));
  await close('guide-dialog');
  await page.locator('#about').click();
  assert.equal(await page.locator('.benchmark').count(), 4);
  await close('guide-dialog');

  await page.evaluate(() => document.getElementById('explorar').scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.screenshot({ path: path.join(dir, 'preview-timeline-reading.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: 'load' }); await count(milestones.length);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.screenshot({ path: path.join(dir, 'preview-timeline-mobile.png') });
  await page.locator('#filter-toggle').click();
  assert.equal(await page.evaluate(() => document.querySelector('#filters-dialog').getBoundingClientRect().width <= innerWidth), true);
  await page.locator('[data-preset="today"]').click();
  await page.waitForFunction(() => window.reportApi.getState().phase === 'hoje');
  assert(await page.locator('.story-card').count() > 0);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.screenshot({ path: path.join(dir, 'preview-timeline-mobile-reading.png') });
  await page.setViewportSize({ width: 1440, height: 1100 });
  return { page: 'timeline', version: 'artistic-atlas-v3', milestones: milestones.length, allStories: 110, chapters: 7, allPrs: 2978, commits: 9909, docs: 1613, modules: 159, searchIdempotMatches: idempot, filters: true, chipRemoval: true, savedHash: true, openPrs: 75, otherBranchPrs: 16, recordDetails: true, csvDownload: true, presentationKeyboard: true, svgKeyboard: true, emptyStateRecovery: true, mobileOverflow: false, benchmarks: 4 };
}

function locationSafe(url) {
  return url.includes('q=idempot') && url.includes('repo=bb');
}
