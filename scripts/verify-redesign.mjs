import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const output = path.resolve('docs/redesign-2026-10-22/qa/native');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, ...(process.argv.includes('--menus')?{ignoreDefaultArgs:['--hide-scrollbars']}:{}), args: ['--no-sandbox'] });
const results = [];
const checks = [];
const errors = [];
try {
  if (process.argv.includes('--contact')) {
    const { verifyContact } = await import('./verify-contact.mjs');
    await verifyContact(browser);
  } else if (process.argv.includes('--menus')) {
    const { verifyNewSiteMenus } = await import('./verify-new-site-menus.mjs');
    await verifyNewSiteMenus(browser);
  } else if (process.argv.includes('--visual-review')) {
    const { inspectNewSite } = await import('./inspect-new-site-visual.mjs');
    await inspectNewSite(browser);
  } else if (process.argv.includes('--financial')) {
    const { verifyFinancial } = await import('./verify-financial.mjs');
    await verifyFinancial(browser);
  } else if (process.argv.includes('--ecosystem')) {
    const { verifyEcosystem } = await import('./verify-ecosystem.mjs');
    await verifyEcosystem(browser);
  } else if (process.argv.includes('--operations')) {
    const { verifyOperations } = await import('./verify-operations.mjs');
    await verifyOperations(browser);
  } else if (process.argv.includes('--seo')) {
    const { verifySeoBrowser } = await import('./verify-seo-browser.mjs');
    await verifySeoBrowser(browser);
  } else if (process.argv.includes('--foundations')) {
    const { verifyFoundations } = await import('./verify-foundations.mjs');
    await verifyFoundations(browser);
  } else if (process.argv.includes('--contrast-only')) {
    const page = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
    await page.addInitScript(() => localStorage.setItem('catalisa_cookie_consent', 'denied'));
    const audit = [];
    const { blocks } = JSON.parse(await fs.readFile('src/redesign/data/catalog.json', 'utf8'));
    const ecosystem = JSON.parse(await fs.readFile('src/redesign/data/ecosystem.json', 'utf8'));
    for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['/design-system', '/design-system/home', '/visao/', '/arquitetura/', '/desenvolvedores/', '/studio/', '/workflows/', '/agentes/', '/governanca/', '/capacidades/', '/ecossistema/banking/', '/ecossistema/credit/', ...ecosystem.map(page => page.path+'/'), ...blocks.map(block => `/capacidades/${block.slug}/`)]) {
      await page.goto('http://127.0.0.1:5175' + route);
      await page.locator('.c-site h1').waitFor();
      const failures = await page.evaluate(() => {
        const rgb = value => value.match(/[\d.]+/g)?.map(Number) ?? [];
        const lum = color => { const [r, g, b] = color.slice(0, 3).map(value => { value /= 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; }); return r * .2126 + g * .7152 + b * .0722; };
        const output = [];
        const walker = document.createTreeWalker(document.querySelector('.c-site'), NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const text = walker.currentNode.textContent.trim(), el = walker.currentNode.parentElement;
          if (!text || !el?.getClientRects().length || el.closest('svg,[aria-hidden="true"],.c-sr-only,.c-skip,dialog:not([open])')) continue;
          const style = getComputedStyle(el), fg = rgb(style.color);
          let node = el, bg = [246, 243, 238];
          while (node) { const color = rgb(getComputedStyle(node).backgroundColor); if (color.length === 3 || color[3] === 1) { bg = color; break; } node = node.parentElement; }
          const a = lum(fg), b = lum(bg), ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
          const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && parseFloat(style.fontWeight) >= 700);
          if (ratio + .01 < (large ? 3 : 4.5)) output.push({ text: text.slice(0, 100), element: `${el.tagName}.${el.className}`, color: style.color, background: bg, ratio: Number(ratio.toFixed(2)) });
        }
        return output;
      });
      audit.push({ route, width, failures });
    }
    }
    await fs.writeFile(path.join(output, 'contrast.json'), JSON.stringify({ date: new Date().toISOString(), scope: 'Computed solid-background HTML text on implemented native routes at 390/1440px. Ignores SVG, imagery/gradient contrast, hidden content and pseudo-elements; not a complete WCAG audit.', audit }, null, 2));
    const failures = audit.flatMap(item => item.failures);
    console.log(JSON.stringify({ routeMeasurements: audit.length, failures: failures.length, examples: failures.slice(0, 5) }, null, 2));
    expect(failures.length).toBe(0);
  } else {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.addInitScript(() => localStorage.setItem('catalisa_cookie_consent', 'denied'));
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  for (const [name, route] of [['styleguide', '/design-system'], ['home', '/design-system/home']]) {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto('http://127.0.0.1:5175' + route);
      await page.locator('.c-site h1').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
      await expect(page.locator('h1')).toHaveCount(1);
      // Trigger below-the-fold lazy images before measuring media failures.
      await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 800) { scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 25)); } scrollTo(0, 0); });
      await page.evaluate(async () => { const images = [...document.querySelectorAll('.c-site img')].filter(el => el.getClientRects().length); await Promise.all(images.map(async el => { el.loading = 'eager'; await el.decode(); })); });
      const metrics = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, font: getComputedStyle(document.querySelector('.c-site h1')).fontFamily, brokenImages: [...document.images].filter(el => el.getAttribute('src') && el.complete && !el.naturalWidth).map(el => el.src) }));
      expect(response.status()).toBe(200);
      expect(metrics.scrollWidth).toBeLessThanOrEqual(width);
      expect(metrics.font).toContain('Catalisa Inter');
      expect(metrics.brokenImages).toEqual([]);
      await page.screenshot({ path: path.join(output, `${name}-${width}.png`), fullPage: true });
      results.push({ route, status: response.status(), ...metrics });
    }
  }
  await page.goto('http://127.0.0.1:5175/design-system');
  await page.getByRole('button', { name: 'Validar exemplo', exact: true }).click();
  await expect(page.getByLabel('Nome no exemplo')).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Nome no exemplo').fill('Pessoa de teste');
  await expect(page.getByRole('status')).toHaveText('Exemplo válido. Nenhum dado foi enviado.');
  checks.push('Field validation preserves input and associates accessible error.');
  await page.getByRole('tab', { name: 'Identidade', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Decisão', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('Qual regra orienta.');
  checks.push('Tabs: arrow key updates focus, selection, shape and panel.');
  const imageTrigger = page.getByRole('button', { name: /Ampliar.*cidade financeira/ });
  await imageTrigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(imageTrigger).toBeFocused();
  checks.push('Media dialog: opens, Escape closes, focus returns.');
  await page.getByRole('button', { name: 'Pausar movimento', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Retomar movimento', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.locator('.c-guide-orbit i').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  checks.push('Pause control and reduced-motion preference work independently.');

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('http://127.0.0.1:5175/design-system/home');
    const menuTrigger = page.getByRole('button', { name: 'Abrir navegação', exact: true });
    await menuTrigger.click();
    await expect(page.getByRole('button', { name: 'Fechar navegação', exact: true })).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('navigation', { name: 'Produtos', exact: true })).toBeVisible();
    await page.getByRole('navigation', { name: 'Marca e recursos' }).getByRole('link').last().focus();
    await page.keyboard.press('Tab');
    await expect(page.locator('.c-header').getByRole('link', { name: 'Catalisa — início' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menuTrigger).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
    await page.locator('.architecture-accordion summary').filter({ hasText: 'Dados' }).click();
    await expect(page.locator('.architecture-accordion details[open]')).toHaveCount(1);
    await expect(page.locator('.architecture-accordion details[open]')).toContainText('Informações organizadas por contexto');
    await page.getByRole('button', { name: 'Filme conceitual', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Estudo de composição' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Filme conceitual', exact: true })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  checks.push('Home at 320/390/768/1440: menu, focus loop, Escape/return, restored scroll, controlled accordion and film dialog.');
  const { blocks } = JSON.parse(await fs.readFile('src/redesign/data/catalog.json', 'utf8'));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('http://127.0.0.1:5175/capacidades/');
    await expect(page.locator('.b-catalog-row:visible')).toHaveCount(12);
    await page.getByRole('button', { name: 'Ver mais capacidades', exact: false }).click();
    await expect(page.locator('.b-catalog-row:visible')).toHaveCount(24);
    await page.getByRole('searchbox', { name: 'Buscar building block' }).fill('zzzzinexistente');
    await expect(page.locator('.b-catalog-row')).toHaveCount(0);
    await expect(page.getByText('Nenhuma capacidade encontrada.', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Limpar filtros' }).click();
    await expect(page.locator('.b-catalog-row:visible')).toHaveCount(12);
    await page.getByRole('button', { name: /Decisão.*capacidades/ }).click();
    await expect(page.locator('.b-catalog-row')).toHaveCount(2);
    await page.getByLabel('Estágio do building block').selectOption('Beta');
    await expect(page.locator('.b-catalog-row')).toHaveCount(1);
    await expect(page.locator('.b-catalog-row')).toContainText('Decision Platform');
    await page.getByRole('button', { name: 'Limpar filtros' }).click();
    await page.getByRole('searchbox', { name: 'Buscar building block' }).fill('decisao');
    await expect(page.locator('.b-catalog-row')).toHaveCount(2);
    await page.getByRole('button', { name: 'Limpar filtros' }).click();
    const catalogWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(catalogWidth).toBeLessThanOrEqual(width);
    results.push({ route: '/capacidades/', width, scrollWidth: catalogWidth, filters: 'load, empty, clear, domain, status, accent-insensitive search passed' });
    if (width === 390 || width === 1440) { await page.evaluate(() => document.activeElement?.blur()); await page.screenshot({ path: path.join(output, `catalog-${width}.png`), fullPage: true }); }
    for (const block of blocks) {
      const response = await page.goto(`http://127.0.0.1:5175/capacidades/${block.slug}/`);
      await expect(page.locator('h1')).toHaveText(block.name);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('.b-detail-meta').getByRole('link', { name: 'Ver documentação' })).toHaveAttribute('href', block.source);
      await expect(page.locator('.b-detail-meta')).toContainText(block.status);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
      expect(response.status()).toBe(200);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(width);
      results.push({ route: `/capacidades/${block.slug}/`, width, scrollWidth, status: response.status(), h1: block.name, source: block.source });
      if (block.slug === 'iam' && [390, 1440].includes(width)) await page.screenshot({ path: path.join(output, `iam-${width}.png`), fullPage: true });
    }
    console.log(`Catalog and 39 details verified at ${width}px`);
  }
  checks.push('Catalog at four widths: load 12/24, search, accent normalization, empty, clear, domain/status intersection. All 39 native details: one matching H1, source, maturity and no overflow.');
  await page.goto('http://127.0.0.1:5175/capacidades/unknown-capability/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Vamos encontrar');
  checks.push('Unknown capability has a deliberate not-found screen; hosting HTTP status audit remains pending H13.');
  await context.close();
  const animated = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  await animated.addInitScript(() => localStorage.setItem('catalisa_cookie_consent', 'denied'));
  await animated.goto('http://127.0.0.1:5175/design-system/home');
  await animated.getByRole('button', { name: 'Filme conceitual', exact: true }).click();
  await animated.getByRole('button', { name: 'Pausar', exact: true }).click();
  expect(await animated.locator('.c-film-assembled').evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');
  await animated.getByRole('button', { name: 'Reproduzir', exact: true }).click();
  expect(await animated.locator('.c-film-assembled').evaluate(el => getComputedStyle(el).animationPlayState)).toBe('running');
  checks.push('Home film: native CSS animation pauses/resumes without fixed-time completion.');
  expect(errors).toEqual([]);

  const nativeHero = await sharp(path.join(output, 'home-1440.png')).extract({ left: 0, top: 0, width: 1440, height: 1000 }).resize(720, 500).toBuffer();
  const referenceHero = await sharp('docs/redesign-2026-10-22/qa/reference/00-1440.png').resize(720, 500).toBuffer();
  await sharp({ create: { width: 1440, height: 500, channels: 3, background: '#F6F3EE' } }).composite([{ input: referenceHero, left: 0, top: 0 }, { input: nativeHero, left: 720, top: 0 }]).png().toFile(path.join(output, 'home-comparison.png'));
  await fs.writeFile(path.join(output, 'verification.json'), JSON.stringify({ date: new Date().toISOString(), scope: 'Native styleguide, staged Home, catalog and all 39 capability details. Chromium, not physical devices or a full site/integration audit. Other families have separate reports.', results, checks, errors }, null, 2));
  console.log(JSON.stringify({ measurements: results.length, checks, errors }, null, 2));
  }
} finally { await browser.close(); }
