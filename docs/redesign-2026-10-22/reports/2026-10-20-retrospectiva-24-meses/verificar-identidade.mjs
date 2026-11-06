import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const dir = path.dirname(fileURLToPath(import.meta.url));
const pages = ['index', 'infografico', 'dossie', 'dashboard', 'cadeia-de-valor', 'timeline', 'relatorio-completo', 'developy', 'investidores', 'entrevistas', 'diligencia', 'diligencia-tecnica', 'diligencia-corporativa', 'diligencia-evidencias', 'homologacao'];
const pdfs = ['infografico', 'dashboard', 'cadeia-de-valor', 'relatorio-completo', 'developy', 'investidores', 'entrevistas', 'diligencia', 'diligencia-tecnica', 'diligencia-corporativa', 'diligencia-evidencias', 'homologacao'];
const proof = { identity: 'catalisa-transitoria-2026-10', checkedAt: new Date().toISOString(), pages: [], pdfs: [], pageErrors: [], externalRequests: [], passed: false };
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => proof.pageErrors.push(String(error)));
  page.on('request', request => { if (/^https?:/.test(request.url())) proof.externalRequests.push(request.url()); });
  for (const name of pages) {
    await page.goto(pathToFileURL(path.join(dir, `${name}.html`)).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    if (name === 'timeline') await page.waitForFunction(() => window.reportApi);
    if (name === 'dashboard') await page.waitForFunction(() => window.dashboardApi);
    assert.equal(await page.locator('body').getAttribute('data-identity'), proof.identity, name);
    const style = await page.evaluate(() => {
      const css = getComputedStyle(document.documentElement);
      const title = getComputedStyle(document.querySelector('h1'));
      return { brand: css.getPropertyValue('--brand-500').trim(), secondary: css.getPropertyValue('--secondary').trim(), accent: css.getPropertyValue('--accent').trim(), paper: css.getPropertyValue('--paper').trim(), titleFont: title.fontFamily, titleWeight: title.fontWeight, fontsLoaded: [...document.fonts].every(font => font.status === 'loaded') };
    });
    assert.equal(style.brand, '#734b9c', name);
    assert.equal(style.accent, '#fe8342', name);
    assert.equal(style.secondary, '#fdc234', name);
    assert.equal(style.paper, '#f4f0e8', name);
    assert(style.titleFont.includes('Inter'), name);
    assert(Number(style.titleWeight) >= 700, name);
    assert(style.fontsLoaded, name);
    assert(await page.locator('a.brand svg.brand-logo').count() >= 1, name);
    for (const logo of await page.locator('a.brand svg.brand-logo').all()) {
      const fills = await logo.locator('[fill]').evaluateAll(nodes => nodes.map(node => node.getAttribute('fill').toLowerCase()));
      assert(fills.includes('#734b9c'), `${name}: letras roxas do SVG`);
      assert(fills.includes('#fdc234'), `${name}: ponto amarelo do SVG`);
      assert.equal(await logo.getAttribute('viewBox'), '355 180 440 120');
    }
    const widths = [];
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: width < 600 ? 844 : 1100 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${name}: ${width}px`);
      widths.push(width);
    }
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.screenshot({ path: path.join(dir, `preview-identidade-${name}.png`) });
    if (pdfs.includes(name)) {
      await page.emulateMedia({ media: 'print' });
      const marks = await page.locator('.brand-logo:visible').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top));
      const titleTop = await page.locator('h1').evaluate(node => node.getBoundingClientRect().top);
      assert(marks.some(top => top < titleTop), `${name}: assinatura oficial antes do título na impressão`);
      await page.emulateMedia({ media: 'screen' });
    }
    proof.pages.push({ name, ...style, officialPurpleLogoWithYellowDot: true, widthsWithoutOverflow: widths });
  }
  for (const name of pdfs) {
    const fontInfo = execFileSync('pdffonts', [path.join(dir, `${name}.pdf`)], { encoding: 'utf8' });
    assert(fontInfo.includes('Inter-Bold'), name);
    assert(fontInfo.includes('Inter-Regular'), name);
    assert(!/Georgia|TimesNewRoman|Times-Roman/.test(fontInfo), name);
    const info = execFileSync('pdfinfo', [path.join(dir, `${name}.pdf`)], { encoding: 'utf8' });
    const count = Number(info.match(/Pages:\s+(\d+)/)[1]);
    if (name === 'infografico') assert.equal(count, 1);
    proof.pdfs.push({ name, pages: count, interEmbedded: true, legacySerifAbsent: true });
  }
  const source = path.resolve(dir, '../../design/entregas-bauhaus');
  assert.equal(fs.readFileSync(path.join(source, 'identidade-transitoria.css'), 'utf8'), fs.readFileSync(path.join(dir, 'identidade-transitoria.css'), 'utf8'));
  const identity = JSON.parse(fs.readFileSync(path.join(source, 'identidade-transitoria.json'), 'utf8'));
  assert.equal(identity.version, proof.identity);
  assert.equal(identity.status, 'aprovada pelo usuário');
  assert.equal(identity.palette.secondary, '#FDC234');
  assert(fs.readFileSync(path.join(source, 'logo-full-color.svg')).equals(fs.readFileSync(path.join(dir, 'catalisa-logo.svg'))));
  assert(fs.readFileSync(path.resolve(dir, '../../AGENTS.md'), 'utf8').includes('identidade-transitoria.json'));
  proof.persistentGuidance = { tokensMatchSource: true, userApprovalRecorded: true, officialLogoPreserved: true, yellowCorrectionRecorded: true, agentsEntry: true };
  assert.deepEqual(proof.pageErrors, []);
  assert.deepEqual(proof.externalRequests, []);
  proof.passed = true;
} finally {
  await browser.close();
  fs.writeFileSync(path.join(dir, 'verificacao-identidade.json'), JSON.stringify(proof, null, 2));
}
process.stdout.write(JSON.stringify(proof) + '\n');
