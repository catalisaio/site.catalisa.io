import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { buildInfographic, infrastructureLinks } from './infografico-model.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const dashboard = JSON.parse(fs.readFileSync(path.join(dir, 'dashboard-data.json'), 'utf8'));
const narrative = JSON.parse(fs.readFileSync(path.join(dir, 'narrativa.json'), 'utf8'));
const model = buildInfographic(dashboard);
const publicUrl = process.argv.includes('--public') ? 'https://entregas.interno.catalisa.app/' : undefined;
const base = publicUrl || pathToFileURL(path.join(dir, 'index.html')).href;
const proof = { design: 'bauhaus-infographic-v1', url: base, checkedAt: new Date().toISOString(), passed: false, checks: [], viewports: [], pageErrors: [] };
const record = (name, check) => { check(); proof.checks.push(name); };
record('Todas as 110 frentes estão representadas uma vez, nas oito áreas.', () => {
  assert.equal(model.groups.length, 8);
  assert.deepEqual(model.groups.flatMap(group => group.stories.map(story => story.id)).sort(), narrative.stories.map(story => story.id).sort());
});
record('Contagem mensal particiona os 2.840 PRs integrados e conserva cada base.', () => {
  assert.equal(model.months.reduce((sum, month) => sum + month.total, 0), dashboard.summary.integratedPrs);
  for (const repo of model.repositories) assert.equal(model.months.reduce((sum, month) => sum + month.counts[repo.key], 0), repo.integrated);
});
record('Nove efeitos de infraestrutura apontam para os casos corretos.', () => {
  assert.equal(infrastructureLinks.length, 9);
  assert.equal(new Set(infrastructureLinks.map(link => link[2])).size, 9);
  for (const link of infrastructureLinks) assert(dashboard.infrastructure.some(item => item.id === link[2]));
});

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce', ...(publicUrl ? { httpCredentials: JSON.parse(fs.readFileSync('/tmp/entregas-site-auth.json', 'utf8')) } : {}) });
  const page = await context.newPage();
  page.on('pageerror', error => proof.pageErrors.push(String(error)));
  const externalRequests = [];
  page.on('request', request => { if (/^https?:/.test(request.url()) && (!publicUrl || !request.url().startsWith(publicUrl))) externalRequests.push(request.url()); });
  const response = await page.goto(base, { waitUntil: 'load', timeout: 90000 });
  if (publicUrl) assert.equal(response.status(), 200);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('[data-story]').count(), 110);
  assert.equal(await page.locator('.domain').count(), 8);
  assert.equal(await page.locator('.operation-step').count(), 6);
  assert.equal(await page.locator('.phase-list li').count(), 7);
  assert.equal(await page.locator('.gain').count(), 4);
  assert.equal(await page.locator('.infra-effect').count(), 9);
  for (const observation of dashboard.observations) {
    const bars = await page.locator(`[data-observation="${observation.id}"] .comparison i`).evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().width));
    assert(Math.abs(bars[1] / bars[0] - observation.after / observation.before) < .01, `${observation.id}: barras fora da proporção antes/depois`);
  }
  proof.checks.push('Página contém oito áreas, 110 frentes, seis etapas, sete capítulos, quatro ensaios e nove casos Developy.');
  for (const group of model.groups) {
    const section = page.locator(`[data-domain="${group.id}"]`);
    await section.locator('summary').click();
    for (const story of group.stories) {
      const element = section.locator(`[data-story="${story.id}"]`);
      assert.equal(await element.isVisible(), true);
      assert((await element.innerText()).includes(story.summary));
      assert((await element.innerText()).includes(story.value));
      if (story.limit) assert((await element.innerText()).includes(story.limit));
    }
    await section.locator('summary').click();
  }
  proof.checks.push('Todas as frentes abrem na própria página, com síntese, valor, alcance e link específico.');
  await page.goto(base + '#frente-E062', { waitUntil: 'load' });
  assert.equal(await page.locator('#frente-E062').isVisible(), true);
  assert.equal(await page.locator('[data-domain="ia"] details').getAttribute('open'), '');
  await page.locator('[data-domain="ia"] summary').click();
  await page.locator('.data-table summary').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.data-table table').isVisible(), true);
  const tableRows = await page.locator('.data-table tbody tr').allTextContents();
  assert.equal(tableRows.length, 12);
  await page.locator('.data-table summary').click();
  proof.checks.push('Âncora de frente abre o catálogo correspondente; tabela do gráfico abre pelo teclado.');

  const localLinks = await page.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(Boolean).filter(href => !/^https?:/.test(href)));
  const targetCache = new Map();
  for (const href of localLinks) {
    const target = new URL(href, pathToFileURL(path.join(dir, 'index.html')).href);
    const filename = fileURLToPath(target);
    if (filename.endsWith('infografico.pdf') && !fs.existsSync(filename) && !publicUrl) continue;
    assert(fs.existsSync(filename), href);
    if (target.hash && !target.hash.includes('=')) {
      if (!targetCache.has(filename)) targetCache.set(filename, fs.readFileSync(filename, 'utf8'));
      const id = decodeURIComponent(target.hash.slice(1));
      assert(targetCache.get(filename).includes(`id="${id}"`) || targetCache.get(filename).includes(`id='${id}'`), href);
    }
  }
  proof.checks.push(`${new Set(localLinks).size} destinos locais conferidos, incluindo âncoras das 110 frentes e seis etapas.`);
  const fonts = await page.evaluate(() => ({ regular: document.fonts.check('400 16px Inter'), bold: document.fonts.check('700 16px Inter'), loaded: [...document.fonts].every(font => font.status === 'loaded'), brand: getComputedStyle(document.documentElement).getPropertyValue('--brand-500').trim(), accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() }));
  assert.equal(fonts.loaded, true);
  assert.equal(fonts.brand, '#734b9c');
  assert.equal(fonts.accent, '#fe8342');
  proof.fonts = fonts;
  proof.checks.push('Inter local carregada e tokens de marca preservados.');

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1100 });
    await page.goto(base, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForFunction(() => !document.querySelector('.chapter-nav a[aria-current]'));
    const dimensions = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }));
    assert.equal(dimensions.content > dimensions.viewport, false, `Overflow em ${width}px`);
    const overlaps = await page.locator('.chapter-nav a').evaluateAll(nodes => nodes.slice(1).flatMap((node, index) => {
      const previous = nodes[index].getBoundingClientRect(); const current = node.getBoundingClientRect();
      return current.top === previous.top && current.left < previous.right ? [node.textContent] : [];
    }));
    assert.deepEqual(overlaps, [], `Navegação sobreposta em ${width}px`);
    proof.viewports.push(dimensions);
    if ([390, 1440].includes(width)) {
      const suffix = publicUrl ? '-public' : '';
      await page.screenshot({ path: path.join(dir, `preview-infografico-${width}${suffix}.png`), fullPage: true });
      await page.screenshot({ path: path.join(dir, `preview-infografico-hero-${width}${suffix}.png`) });
      for (const [name, selector] of [['arquitetura', '#arquitetura'], ['operacao', '#operacao'], ['entregas', '#entregas'], ['ganhos', '#ganhos']]) {
        await page.locator(selector).evaluate(node => node.scrollIntoView({ block: 'start', behavior: 'instant' }));
        await page.screenshot({ path: path.join(dir, `preview-infografico-${name}-${width}${suffix}.png`) });
      }
    }
    await page.locator('.chapter-nav a[href="#ganhos"]').click();
    await page.waitForFunction(() => document.querySelector('.chapter-nav a[href="#ganhos"]').hasAttribute('aria-current'));
  }
  proof.checks.push('Cinco larguras de 320 a 1440 px sem overflow; navegação, progresso e links internos funcionam.');
  const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, ...(publicUrl ? { httpCredentials: JSON.parse(fs.readFileSync('/tmp/entregas-site-auth.json', 'utf8')) } : {}) });
  const staticPage = await noScript.newPage();
  await staticPage.goto(base, { waitUntil: 'load' });
  assert.equal(await staticPage.locator('.domain').count(), 8);
  await staticPage.locator('[data-domain="credito"] summary').click();
  assert.equal(await staticPage.locator('#frente-E001').isVisible(), true);
  await noScript.close();
  proof.checks.push('A leitura e os catálogos nativos funcionam com JavaScript desativado.');
  if (!publicUrl) {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto(base, { waitUntil: 'load' });
    await page.emulateMedia({ media: 'print' });
    const printHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.pdf({ path: path.join(dir, 'infografico.pdf'), width: '1440px', height: `${printHeight + 8}px`, printBackground: true, margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }, preferCSSPageSize: false });
    const info = execFileSync('pdfinfo', [path.join(dir, 'infografico.pdf')], { encoding: 'utf8' });
    assert(/Pages:\s+1\b/.test(info), info);
    const text = execFileSync('pdftotext', [path.join(dir, 'infografico.pdf'), '-'], { encoding: 'utf8' });
    for (const token of ['Complexidade', 'Continuidade', '2.840', '2.978', 'Developy', 'Construção de Klederson Bueno.']) assert(text.includes(token), `PDF omite ${token}`);
    proof.pdf = { file: 'infografico.pdf', pages: 1, heightPx: printHeight + 8, bytes: fs.statSync(path.join(dir, 'infografico.pdf')).size };
    proof.checks.push('PDF de uma página gerado com texto selecionável e conteúdo até o rodapé.');
  } else {
    await page.goto(publicUrl + 'dossie.html', { waitUntil: 'load' });
    assert.equal(await page.locator('.reading-card').count(), 9);
    await page.goto(publicUrl + 'relatorio-completo.html', { waitUntil: 'load' });
    assert.equal(await page.locator('.story').count(), 110);
    proof.checks.push('Índice anterior e relatório de 110 frentes continuam disponíveis no HTTPS.');
  }
  assert.deepEqual(proof.pageErrors, []);
  assert.deepEqual(externalRequests, []);
  proof.checks.push('Nenhum erro de página ou dependência externa; leitura disponível offline.');
  proof.passed = true;
} finally {
  await browser.close();
  fs.writeFileSync(path.join(dir, publicUrl ? 'hosting/verificacao-infografico.json' : 'verificacao-infografico.json'), JSON.stringify(proof, null, 2));
}
process.stdout.write(JSON.stringify(proof) + '\n');
