import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

export async function verifyPublication(dir) {
  const publication = JSON.parse(fs.readFileSync(path.join(dir, 'hosting/publicacao.json'), 'utf8'));
  const credentials = JSON.parse(fs.readFileSync('/tmp/entregas-site-auth.json', 'utf8'));
  assert.equal(publication.url, 'https://entregas.interno.catalisa.app');
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const result = { url: publication.url, checkedAt: new Date().toISOString(), checks: [], pageErrors: [], passed: false };
  try {
    const context = await browser.newContext({ httpCredentials: credentials, viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => result.pageErrors.push(String(error)));
    const response = await page.goto(publication.url, { waitUntil: 'load', timeout: 90000 });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator('body').getAttribute('data-design'), 'bauhaus-infographic-v1');
    assert.equal(await page.locator('[data-story]').count(), 110);
    await page.goto(publication.url + '/dossie.html', { waitUntil: 'load', timeout: 90000 });
    assert.equal(await page.locator('.reading-card').count(), 7);
    await page.screenshot({ path: path.join(dir, 'hosting/preview-public-desktop.png') });
    result.checks.push('Infográfico com 110 frentes e índice preservado com sete caminhos de leitura no HTTPS publicado');
    await page.locator('.reading-card[href="cadeia-de-valor.html"]').click();
    await page.waitForFunction(() => window.valueChainApi);
    assert.equal(await page.locator('.capability-card').count(), 37);
    await page.locator('[data-stage-link="4"]').click();
    assert.equal(new URL(page.url()).hash, '#dinheiro');
    await page.locator('#value-present').click();
    await page.locator('[data-stage-link="4"]').click();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#continuidade').isVisible(), true);
    assert.equal(await page.locator('.value-stage:visible').count(), 1);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.value-stage:visible').count(), 6);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: path.join(dir, 'hosting/preview-public-cadeia-mobile.png') });
    await page.setViewportSize({ width: 1440, height: 1100 });
    result.checks.push('Cadeia de valor: seis etapas, 37 frentes, navegação, apresentação e leitura no celular');
    await page.goto(publication.url + '/dashboard.html', { waitUntil: 'load' });
    assert.equal(await page.locator('.value-gateway-cta').getAttribute('href'), 'cadeia-de-valor.html');
    await page.waitForFunction(() => window.dashboardApi);
    assert.equal(await page.locator('.dash-chart').count(), 22);
    assert.equal(await page.evaluate(() => window.dashboardApi.getFiltered().length), 2978);
    await page.selectOption('#dash-repo', 'developy');
    assert.equal(await page.evaluate(() => window.dashboardApi.getFiltered().length), 335);
    assert.equal(await page.locator('#delivery-kpis .dash-kpi').nth(1).locator('b').innerText(), '328');
    await page.selectOption('#dash-from', '2026-09');
    await page.selectOption('#dash-to', '2026-09');
    assert.equal(await page.locator('#delivery-kpis .dash-kpi').nth(1).locator('b').innerText(), '128');
    await page.locator('#dash-reset').click();
    await page.screenshot({ path: path.join(dir, 'hosting/preview-public-dashboard.png') });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.locator('[data-chart="1"] .chart-data summary').click();
    assert.equal(await page.locator('[data-chart="1"] table').isVisible(), true);
    await page.screenshot({ path: path.join(dir, 'hosting/preview-public-dashboard-mobile.png') });
    await page.setViewportSize({ width: 1440, height: 1100 });
    result.checks.push('Dashboard: 22 gráficos, dados, filtro Developy, recorte mensal e leitura no celular');
    await page.goto(publication.url + '/timeline.html', { waitUntil: 'load', timeout: 90000 });
    await page.waitForFunction(() => window.reportApi?.getFiltered().length === 34);
    await page.locator('#records-view').click();
    await page.waitForFunction(() => window.reportApi.getFiltered().length === 2978);
    await page.evaluate(async () => window.reportApi.setState({ repo: 'developy' }));
    await page.waitForFunction(() => window.reportApi.getFiltered().length === 335);
    await page.screenshot({ path: path.join(dir, 'hosting/preview-public-timeline.png') });
    result.checks.push('Acervo comprimido e filtro dos 335 PRs Developy funcionando pela rede');
    await page.goto(publication.url + '/developy.html#D04', { waitUntil: 'load', timeout: 90000 });
    assert.equal(await page.locator('.infrastructure-case').count(), 9);
    assert.equal(await page.locator('#D04').count(), 1);
    result.checks.push('Dossiê Developy e link direto para o caso de proteção de credenciais');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(publication.url, { waitUntil: 'load', timeout: 90000 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: path.join(dir, 'hosting/preview-public-mobile.png') });
    result.checks.push('Leitura no celular sem transbordamento horizontal');
    assert.deepEqual(result.pageErrors, []);
    result.passed = true;
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(dir, 'hosting/verificacao-publicacao.json'), JSON.stringify(result, null, 2));
  }
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  process.stdout.write(JSON.stringify(await verifyPublication(dir)) + '\n');
}
