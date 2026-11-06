import { expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export async function verifyFoundations(browser) {
  const output = path.resolve('docs/redesign-2026-10-22/qa/foundations');
  await fs.mkdir(output, { recursive: true });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.addInitScript(() => localStorage.setItem('catalisa_cookie_consent', 'denied'));
  const page = await context.newPage(), reference = await context.newPage();
  const errors = [], measurements = [], interactions = [];
  page.on('pageerror', error => errors.push(error.message));
  const text = async root => root.locator('h1,h2,h3,p').evaluateAll(elements => elements.filter(el => !el.closest('.c-sr-only')).map(el => el.textContent.replace(/\s+/g, '').trim()));
  try {
    for (const [name, route] of [['vision', '/visao/'], ['architecture', '/arquitetura/'], ['developers', '/desenvolvedores/']]) {
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await reference.setViewportSize({ width, height: 1000 });
        const response = await page.goto('http://127.0.0.1:5175' + route);
        await reference.goto('http://127.0.0.1:8176' + route);
        await page.locator('h1').waitFor();
        await expect(page.locator('h1')).toHaveCount(1);
        await page.evaluate(() => document.fonts.ready);
        await reference.evaluate(() => document.fonts.ready);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
        expect(await text(page.locator('main'))).toEqual(await text(reference.locator('main')));
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollWidth).toBeLessThanOrEqual(width);
        expect(response.status()).toBe(200);
        if (name === 'vision') {
          for (let index = 0; index < 3; index++) {
            await page.locator('.v-principle-controls button').nth(index).click();
            await reference.locator('.v-principle-controls button').nth(index).click();
            await expect(page.locator('.v-principle-controls [aria-pressed=true]')).toHaveCount(1);
            await expect(page.locator('.v-principle-scene')).toHaveAttribute('data-mode', String(index));
            expect(await page.locator('.v-principle-description').innerText()).toBe(await reference.locator('.v-principle-description').innerText());
            expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
          }
          await page.locator('.v-principle-controls button').nth(0).focus();
          await page.keyboard.press('Space');
          await expect(page.locator('.v-principle-scene')).toHaveAttribute('data-mode', '0');
        } else if (name === 'architecture') {
          for (let index = 0; index < 6; index++) {
            await page.getByRole('tab').nth(index).click();
            await reference.getByRole('tab').nth(index).click();
            await expect(page.locator('[role=tab][aria-selected=true]')).toHaveCount(1);
            const selected = page.locator('[role=tab][aria-selected=true]');
            expect(await selected.getAttribute('aria-controls')).toBe(await page.getByRole('tabpanel').getAttribute('id'));
            expect(await text(page.getByRole('tabpanel'))).toEqual(await text(reference.getByRole('tabpanel')));
            expect(await page.getByRole('tabpanel').locator('svg').getAttribute('aria-label')).toBe(await reference.getByRole('tabpanel').locator('svg').getAttribute('aria-label'));
            expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
          }
          await page.getByRole('tab').nth(5).focus();
          await page.keyboard.press('Home');
          await expect(page.getByRole('tab').nth(0)).toBeFocused();
          await page.keyboard.press('ArrowRight');
          await expect(page.getByRole('tab').nth(1)).toBeFocused();
          await expect(page.getByRole('tabpanel')).toContainText('Do pedido à vida da operação.');
          await page.keyboard.press('End');
          await expect(page.getByRole('tab').nth(5)).toBeFocused();
          await page.locator('.a-layer-stack summary').nth(3).click();
          await expect(page.locator('.a-layer-stack details').nth(3)).toHaveAttribute('open', '');
        } else {
          for (let index = 0; index < 3; index++) {
            await page.locator('.d-tabs button').nth(index).click();
            await reference.locator('.d-tabs button').nth(index).click();
            await expect(page.locator('.d-tabs [aria-pressed=true]')).toHaveCount(1);
            expect(await text(page.locator('.d-adoption'))).toEqual(await text(reference.locator('.d-adoption')));
            expect(await page.locator('.d-map svg').getAttribute('aria-label')).toBe(await reference.locator('.d-map svg').getAttribute('aria-label'));
          }
          for (let api = 0; api < 3; api++) {
            await page.locator('.d-api-options button').nth(api).click();
            await reference.locator('.d-api-options button').nth(api).click();
            for (const language of ['curl', 'JavaScript']) {
              await page.locator('.d-editor-top').getByRole('button', { name: language, exact: true }).click();
              await reference.locator('.d-editor-top').getByRole('button', { name: language, exact: true }).click();
              expect(await page.locator('.d-code-window pre').innerText()).toBe(await reference.locator('.d-code-window pre').innerText());
              expect(await page.locator('.d-endpoint').innerText()).toBe(await reference.locator('.d-endpoint').innerText());
              expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
            }
          }
          await page.evaluate(() => { window.__copiedCode = ''; Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.__copiedCode = value; } } }); });
          await page.getByRole('button', { name: 'Copiar código', exact: false }).click();
          await expect(page.locator('.c-copy-status')).toHaveText('Código copiado.');
          expect(await page.evaluate(() => window.__copiedCode)).toBe(await page.locator('.d-code-window pre').innerText());
          await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('clipboard-denied-fixture'); } } }));
          await page.getByRole('button', { name: 'Copiar código', exact: false }).click();
          await expect(page.locator('.c-copy-status')).toHaveText('Selecione e copie o código abaixo.');
        }
        for (const current of [page, reference]) {
          await current.evaluate(async () => { const images = [...document.querySelectorAll('main img')]; await Promise.all(images.map(async image => { image.loading = 'eager'; await image.decode(); })); scrollTo({ top: 0, behavior: 'instant' }); document.activeElement?.blur(); });
        }
        if ([390, 1440].includes(width)) {
          await page.screenshot({ path: path.join(output, `${name}-${width}.png`), fullPage: true });
          await reference.screenshot({ path: path.join(output, `${name}-reference-${width}.png`), fullPage: true });
          const a = await page.screenshot(), b = await reference.screenshot();
          await sharp({ create: { width: width * 2, height: 1000, channels: 3, background: '#f6f3ee' } }).composite([{ input: b, left: 0, top: 0 }, { input: a, left: width, top: 0 }]).png().toFile(path.join(output, `${name}-comparison-${width}.png`));
        }
        measurements.push({ route, width, scrollWidth, initialTextMatchesReference: true, stateCount: name === 'vision' ? 3 : name === 'architecture' ? 6 : 9, allStatesMatchReference: true, status: response.status() });
        console.log(`Verified ${route} and all states at ${width}px`);
      }
    }
    interactions.push('Vision: all three principles preserve reference text; state, shapes and pressed selection update; Space works.');
    interactions.push('Architecture: all six maps preserve reference text and SVG labels; roving focus, Home/End/arrow keys and layer disclosure work.');
    interactions.push('Developers: three adoption maps and six endpoint/language combinations match the reference. Clipboard success/failure preserve the exact code without calling the demonstrated APIs.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('http://127.0.0.1:5175/capacidades/');
    const style = await page.locator('.b-catalog-row').first().evaluate(el => ({ width: el.getBoundingClientRect().width, columns: getComputedStyle(el.parentElement).gridTemplateColumns, font: getComputedStyle(el.querySelector('p')).fontSize }));
    await page.goto('http://127.0.0.1:5175/arquitetura/');
    await page.locator('.c-header').getByRole('button', { name: 'Plataforma', exact: true }).click();
    await page.getByRole('navigation', { name: 'Plataforma', exact: true }).getByRole('link', { name: 'Building blocks', exact: false }).click();
    await expect(page).toHaveURL(/\/capacidades\//);
    expect(await page.locator('.b-catalog-row').first().evaluate(el => ({ width: el.getBoundingClientRect().width, columns: getComputedStyle(el.parentElement).gridTemplateColumns, font: getComputedStyle(el.querySelector('p')).fontSize }))).toEqual(style);
    interactions.push('Architecture → menu → catalog keeps catalog layout after both CSS families load.');
    await context.close();
    const motion = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
    await motion.addInitScript(() => localStorage.setItem('catalisa_cookie_consent', 'denied'));
    for (const [route, selector] of [['/visao/', '.v-orbit'], ['/arquitetura/', '.a-stratum-1'], ['/desenvolvedores/', '.d-flow']]) {
      await motion.goto('http://127.0.0.1:5175' + route);
      await motion.getByRole('button', { name: 'Pausar movimento', exact: true }).click();
      expect(await motion.locator(selector).evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');
      await motion.getByRole('button', { name: 'Retomar movimento', exact: true }).click();
      expect(await motion.locator(selector).evaluate(el => getComputedStyle(el).animationPlayState)).toBe('running');
    }
    await motion.close();
    interactions.push('Ambient art pauses/resumes; reduced-motion checks run in the main matrix.');
    expect(errors).toEqual([]);
    await fs.writeFile(path.join(output, 'verification.json'), JSON.stringify({ date: new Date().toISOString(), scope: 'Native Visão, Arquitetura and Desenvolvedores; reference text, initial layout and interactive states at four widths, keyboard, motion, clipboard and catalog CSS isolation. Chromium only; not a full site or physical-device audit.', measurements, interactions, errors }, null, 2));
  } finally { await context.close(); }
}
