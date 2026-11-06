import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { diligencePages } from './render-diligencia.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const read = name => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
const model = read('diligencia-dados.json');
const corpus = read('dados.json');
const narrative = read('narrativa.json');
const sourceProof = read('diligencia-fontes.json');
const proof = { checkedAt: new Date().toISOString(), version: model.version, checks: [], browser: [], pdfs: [], pageErrors: [], externalRequests: [], passed: false };
const check = (name, assertion) => { assertion(); proof.checks.push(name); };
const unique = (rows, count) => { assert.equal(rows.length, count); assert.equal(new Set(rows.map(item => item.id)).size, count); };
check('8 arquivos do corpus permanecem byte a byte iguais ao início da diligência', () => {
  for (const [name, sha] of Object.entries(sourceProof.baseline)) assert.equal(createHash('sha256').update(fs.readFileSync(path.join(dir, name))).digest('hex'), sha, name);
});
check('12 domínios, 60 questões/pedidos, 16 riscos e 32 controles únicos e relacionados', () => {
  unique(model.domains, 12); unique(model.findings, 60); unique(model.requests, 60); unique(model.risks, 16); unique(model.vendorControls, 32);
  for (const domain of model.domains) assert.equal(model.findings.filter(item => item.domain === domain.id).length, 5);
  for (const item of model.findings) {
    assert.equal(model.requests.filter(request => request.finding === item.id).length, 1);
    for (const key of ['observed', 'gap', 'impact', 'deliverable', 'acceptance']) assert(item[key].length > 20, `${item.id}: ${key}`);
    assert(item.owner.length > 5, `${item.id}: função sugerida`);
    for (const id of item.evidence) assert(model.sources.some(source => source.id === id), `${item.id}: ${id}`);
  }
  for (const item of [...model.risks, ...model.vendorControls]) for (const id of item.findings) assert(model.findings.some(finding => finding.id === id), id);
  for (const request of model.requests) for (const field of ['dueDate', 'assignee', 'acceptedBy', 'closedAt']) assert.equal(request[field], null);
  for (const control of model.vendorControls) assert.equal(control.approved, false);
});
check('110 frentes relacionadas sem duplicação ou alteração de estado dos PRs', () => {
  unique(model.capabilities, 110);
  assert.deepEqual(model.capabilities.map(item => item.id).sort(), narrative.stories.map(item => item.id).sort());
  for (const item of model.capabilities) {
    assert(item.lens.length);
    for (const id of item.lens) assert(model.findings.some(finding => finding.id === id), id);
    const original = narrative.stories.find(story => story.id === item.id);
    assert.deepEqual(item.refs, original.refs);
    assert.equal(item.limit, original.limit);
  }
  for (const source of model.sources) for (const reference of source.references) {
    const pr = corpus.prs.find(item => item.id === reference.id);
    assert.equal(reference.stateAtCutoff, pr.state);
    assert.equal(reference.integratedAtCutoff, pr.integrated);
  }
});
check('146 fontes e 14 documentos com blobs do snapshot reconciliados ao inventário', () => {
  unique(model.sources, 146); unique(sourceProof.documents, 14);
  for (const doc of sourceProof.documents) {
    const file = corpus.files.find(item => item.repo === doc.repo && item.path === doc.path);
    assert.equal(doc.blobSha, file.sha); assert.equal(doc.bytes, file.bytes);
    assert.equal(doc.snapshot, corpus.repositories.find(item => item.key === doc.repo).sha);
    assert.equal(doc.sha256.length, 64);
    assert(doc.url.includes(doc.snapshot));
  }
  for (const source of model.sources.filter(item => /^(CODE|INF)-/.test(item.id))) assert(corpus.files.some(file => source.href === file.url), source.id);
});
check('Documentação desatualizada e autodeclaração não são tratadas como certificação', () => {
  const item = model.findings.find(row => row.id === 'DD-021');
  assert.equal(item.status, 'declaracao'); assert(item.observed.includes('DigitalOcean')); assert(item.observed.includes('OpenAI/Grok'));
  assert(model.findings.find(row => row.id === 'DD-015').gap.includes('independente'));
  assert(model.accessModel.includes('não implementa permissões por documento'));
});
check('A síntese separa fortalezas, fragilidades, provas pendentes e documentos; 8 ações cobrem os 16 riscos', () => {
  unique(model.executive.strengths, 6); unique(model.executive.weaknesses, 3); unique(model.executive.actions, 8);
  assert.equal(model.executive.domainConclusions.length, 12);
  assert.deepEqual(model.executive.riskAssessments.map(item => item.id).sort(), model.risks.map(item => item.id).sort());
  assert.equal(model.executive.validationGaps.length, 4); assert.equal(model.executive.documentGaps.length, 3);
  for (const item of [...model.executive.strengths, ...model.executive.weaknesses, ...model.executive.validationGaps, ...model.executive.documentGaps, ...model.executive.actions]) {
    for (const id of item.evidence || []) assert(model.sources.some(source => source.id === id), id);
    for (const id of item.questions) assert(model.findings.some(finding => finding.id === id), id);
  }
  assert.deepEqual(model.executive.weaknesses.map(item => item.id), ['FRA-01', 'FRA-02', 'FRA-03']);
  assert(model.executive.weaknesses.find(item => item.id === 'FRA-03').evidence.includes('E032'));
  for (const risk of model.executive.riskAssessments) {
    assert(risk.origin && risk.basis && risk.consequence && risk.actions.length);
    for (const id of risk.actions) assert(model.executive.actions.find(item => item.id === id)?.risks.includes(risk.id), `${risk.id}: ${id}`);
  }
  for (const action of model.executive.actions) {
    assert(action.work && action.owner && action.when && action.deliverable && action.acceptance);
    for (const field of ['assignee', 'dueDate', 'completedAt']) assert.equal(action[field], null);
  }
});
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, acceptDownloads: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => proof.pageErrors.push(String(error)));
  page.on('request', request => { if (/^https?:/.test(request.url())) proof.externalRequests.push(request.url()); });
  const open = async (name, fragment = '') => {
    await page.goto(pathToFileURL(path.join(dir, `${name}.html`)).href + fragment, { waitUntil: 'load' });
    await page.waitForFunction(() => window.diligenceApi);
    await page.evaluate(() => document.fonts.ready);
  };
  for (const [name, label] of diligencePages) {
    await open(name);
    assert.equal(await page.locator('body').getAttribute('data-identity'), 'catalisa-transitoria-2026-10');
    assert.equal(await page.locator('.due-paths [aria-current="page"]').count(), 1);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.getByRole('navigation', { name: 'Encontrar conclusões e ações' }).getByRole('link').count(), 6);
    if (name === 'diligencia') {
      for (const id of ['sumario-analises', 'pontos-fortes', 'pontos-fracos', 'riscos', 'plano-de-acao', 'analise-por-area']) assert.equal(await page.locator(`#${id}`).isVisible(), true, id);
      assert.equal(await page.locator('.due-strength-grid > article').count(), 6);
      assert.equal(await page.locator('.due-weakness-list > article').count(), 3);
      assert.equal(await page.locator('.due-risk-summary > article').count(), 16);
      assert.equal(await page.locator('.due-actions > li').count(), 8);
      assert.equal(await page.locator('.due-domain-conclusions > article').count(), 12);
      assert.equal(await page.locator('#pontos-fracos').evaluate(node => Boolean(node.closest('details'))), false);
      assert.equal(await page.locator('#plano-de-acao').evaluate(node => Boolean(node.closest('details'))), false);
    }
    assert(await page.locator('a.brand svg.brand-logo').count() > 1);
    const broken = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map(a => a.hash.slice(1)).filter(id => !document.getElementById(id)));
    assert.deepEqual(broken, [], name);
    await page.evaluate(() => { for (const item of document.querySelectorAll('details')) item.open = true; });
    const text = await page.locator('body').innerText();
    assert(!/med[\s_-]*fund|\bpine\b|p[aá]ssaro[\s_-]*marr[oó][mn]|yarok|\bfiduc\b|chria|alper|facila|medpay|pega[\s_-]*plant[aã]o|marcelo/iu.test(text), `${name}: nome de cliente visível`);
    await page.evaluate(() => { for (const item of document.querySelectorAll('details')) item.open = false; });
    const widths = [];
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width < 600 ? 844 : 1100 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${name}: overflow ${width}px`);
      widths.push(width);
      if ([390, 1440].includes(width)) await page.screenshot({ path: path.join(dir, `preview-${name}-${width}.png`) });
    }
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.emulateMedia({ media: 'print' });
    const logoTop = await page.locator('.print-brand .brand-logo').evaluate(element => element.getBoundingClientRect().top);
    assert(logoTop < await page.locator('h1').evaluate(element => element.getBoundingClientRect().top));
    await page.pdf({ path: path.join(dir, `${name}.pdf`), format: 'A4', preferCSSPageSize: true, printBackground: true, displayHeaderFooter: true,
      headerTemplate: '<span></span>', footerTemplate: `<div style="font:8px Arial;width:100%;margin:0 15mm;display:flex;justify-content:space-between;color:#5a5468"><span>Catalisa · ${label} · edição 21/10/2026</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>` });
    const pdf = path.join(dir, `${name}.pdf`);
    const pdfText = execFileSync('pdftotext', [pdf, '-'], { encoding: 'utf8' });
    const pages = Number(execFileSync('pdfinfo', [pdf], { encoding: 'utf8' }).match(/Pages:\s+(\d+)/)[1]);
    assert(pages > 1);
    const fonts = execFileSync('pdffonts', [pdf], { encoding: 'utf8' });
    assert(fonts.includes('Inter-Bold')); assert(fonts.includes('Inter-Regular'));
    const ids = name === 'diligencia-tecnica' ? [...model.findings.filter(item => model.domains.find(domain => domain.id === item.domain).section === 'tecnica').map(item => item.id), ...model.capabilities.map(item => item.id)]
      : name === 'diligencia-corporativa' ? model.findings.filter(item => model.domains.find(domain => domain.id === item.domain).section === 'corporativa').map(item => item.id)
      : name === 'homologacao' ? model.vendorControls.map(item => item.id)
      : name === 'diligencia-evidencias' ? [...model.risks, ...model.requests, ...model.sources].map(item => item.id)
      : [...model.executive.strengths, ...model.executive.weaknesses, ...model.executive.actions, ...model.executive.riskAssessments].map(item => item.id);
    for (const id of ids) assert(pdfText.includes(id), `${name}: ${id} ausente do PDF`);
    for (const [index, pageText] of pdfText.split('\f').filter(value => value.trim()).entries()) assert(new RegExp(`\\b${index + 1}\\s*/\\s*${pages}\\b`).test(pageText), `${name}: paginação ${index + 1}`);
    proof.pdfs.push({ file: `${name}.pdf`, pages, bytes: fs.statSync(pdf).size, identifiersChecked: ids.length, pageNumbers: true, fontsEmbedded: true });
    await page.emulateMedia({ media: 'screen' });
    proof.browser.push({ name, widthsWithoutOverflow: widths, printLogo: true, brokenAnchors: broken, privacyChecked: true });
  }
  await open('diligencia-evidencias');
  await page.locator('[data-filter-form="requests"] select').selectOption('engenharia');
  assert.equal(await page.locator('[data-filter-item="requests"]:visible').count(), 5);
  await page.locator('[data-filter-form="requests"] input').fill('DD-031');
  assert.equal(await page.locator('[data-filter-item="requests"]:visible').count(), 1);
  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-export="requests"]').click();
  const download = await downloadPromise;
  const exportText = fs.readFileSync(await download.path(), 'utf8');
  assert(exportText.includes('REQ-031')); assert(!exportText.includes('REQ-032'));
  await page.locator('[data-filter-form="requests"] input').fill('sem-resultado-xyz');
  assert.equal(await page.locator('[data-filter-item="requests"]:visible').count(), 0);
  assert((await page.locator('[data-filter-count="requests"]').innerText()).includes('nenhum resultado'));
  await page.evaluate(() => { location.hash = 'REQ-001'; });
  await page.waitForFunction(() => document.getElementById('REQ-001').open && !document.getElementById('REQ-001').hidden);
  assert.equal(await page.locator('#REQ-001').isVisible(), true);
  await page.locator('[data-filter-form="risks"] select').selectOption('P1');
  assert.equal(await page.locator('[data-filter-item="risks"]:visible').count(), 4);
  await page.locator('[data-filter-form="sources"] input').fill('DigitalOcean');
  assert.equal(await page.locator('[data-filter-item="sources"]:visible').count(), 1);
  await open('homologacao');
  await page.locator('[data-filter-form="vendor"] select').selectOption('controle');
  assert.equal(await page.locator('[data-filter-item="vendor"]:visible').count(), 8);
  const vendorDownload = page.waitForEvent('download');
  await page.locator('[data-export="vendor"]').click();
  const vendorText = fs.readFileSync(await (await vendorDownload).path(), 'utf8');
  assert(vendorText.includes('HOM-09')); assert(vendorText.includes('HOM-16')); assert(!vendorText.includes('HOM-17'));
  await open('diligencia-tecnica');
  await page.locator('[data-filter-form="capabilities"] select').selectOption('ia');
  assert.equal(await page.locator('[data-filter-item="capabilities"]:visible').count(), 18);
  await page.locator('[data-filter-form="capabilities"] input').fill('E062');
  assert.equal(await page.locator('[data-filter-item="capabilities"]:visible').count(), 1);
  const summary = page.locator('#capacidade-E062 summary');
  await summary.focus(); await page.keyboard.press('Enter');
  assert.equal(await page.locator('#capacidade-E062').getAttribute('open'), '');
  await open('homologacao');
  await page.getByRole('navigation', { name: 'Encontrar conclusões e ações' }).getByRole('link', { name: 'Pontos fracos', exact: true }).click();
  await page.waitForURL('**/diligencia.html#pontos-fracos');
  assert.equal(await page.locator('#FRA-03').isVisible(), true);
  await page.screenshot({ path: '/tmp/catalisa-pontos-fracos.png' });
  await page.getByRole('navigation', { name: 'Encontrar conclusões e ações' }).getByRole('link', { name: 'Plano de ação', exact: true }).click();
  await page.waitForURL('**/diligencia.html#plano-de-acao');
  assert.equal(await page.locator('#acao-AC-08').isVisible(), true);
  await page.screenshot({ path: '/tmp/catalisa-plano-de-acao.png' });
  const actionsDownloadPromise = page.waitForEvent('download');
  await page.locator('a[href="diligencia-acoes.csv"]').click();
  const actionCsv = fs.readFileSync(await (await actionsDownloadPromise).path(), 'utf8');
  assert(actionCsv.includes('AC-01') && actionCsv.includes('AC-08'));
  proof.checks.push('Busca com acentos normalizados, filtros combinados, estado vazio, teclado, links profundos e CSV do recorte verificados');
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noJs.newPage();
  await staticPage.goto(pathToFileURL(path.join(dir, 'diligencia-evidencias.html')).href);
  await staticPage.locator('#REQ-060 summary').click();
  assert.equal(await staticPage.locator('#REQ-060 .due-record-body').isVisible(), true);
  await staticPage.locator('#fonte-DOC-03 summary').click();
  assert((await staticPage.locator('#fonte-DOC-03 .due-record-body').innerText()).includes('percentuais'));
  assert.equal(await staticPage.locator('.due-filters:visible').count(), 0);
  await staticPage.goto(pathToFileURL(path.join(dir, 'diligencia.html')).href);
  for (const id of ['sumario-analises', 'pontos-fortes', 'pontos-fracos', 'riscos', 'plano-de-acao']) assert.equal(await staticPage.locator(`#${id}`).isVisible(), true);
  proof.checks.push('Conclusões, pontos fortes/fracos, riscos e ações visíveis sem expansão; atalhos entre páginas e CSV de ações verificados');
  await noJs.close();
  proof.checks.push('Leitura dos pedidos e fontes disponível sem JavaScript; controles inativos não são exibidos');
  assert.deepEqual(proof.pageErrors, []); assert.deepEqual(proof.externalRequests, []);
  proof.passed = true;
} finally {
  await browser.close();
  fs.writeFileSync(path.join(dir, 'verificacao-diligencia.json'), JSON.stringify(proof, null, 2));
}
process.stdout.write(JSON.stringify(proof) + '\n');
