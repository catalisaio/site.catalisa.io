/** Keyboard regression on settled, explicit-language pages; no forms or optional vendors. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium, expect } from '@playwright/test';
const argument = name => process.argv.find(value => value.startsWith('--' + name + '='))?.slice(name.length + 3);
const origin = argument('origin'), output = argument('output');
if (!['https://catalisa.io', 'https://site-staging.catalisa.io', 'http://127.0.0.1:5175'].includes(origin) || !output)
  throw Error('Explicit allowlisted --origin and --output required');
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const checks = [], errors = [];
let passed = false;
try {
  for (const locale of ['pt-BR', 'en-US']) for (const width of [390, 1440]) {
    const context = await browser.newContext({ locale, viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    await context.addInitScript(() => localStorage.setItem('catalisa_cookie_consent', 'denied'));
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    try {
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(origin + (locale === 'en-US' ? '/en' : '/'));
      await page.waitForLoadState('networkidle');
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await page.evaluate(() => document.fonts.ready);
      for (const name of width === 1440 ? ['platform', 'all'] : ['all']) {
        const trigger = page.locator('[data-menu=' + name + ']');
        await trigger.focus();
        await expect(trigger).toBeFocused();
        const before = await page.locator('main h1').boundingBox();
        await page.keyboard.press('Enter');
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        const controlled = await trigger.getAttribute('aria-controls');
        await expect(page.locator('[id="' + controlled + '"]')).toBeVisible();
        const after = await page.locator('main h1').boundingBox();
        const shift = Math.max(...['x', 'y', 'width', 'height'].map(key => Math.abs(before[key] - after[key])));
        expect(shift).toBeLessThanOrEqual(1);
        await page.keyboard.press('Escape');
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expect(trigger).toBeFocused();
        checks.push({ locale, width, menu: name, enterOpens: true, escapeCloses: true, focusReturns: true, headingShiftPx: shift });
      }
    } finally { await context.close(); }
  }
  expect(errors).toEqual([]);
  passed = true;
} finally {
  await browser.close();
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify({ checkedAt: new Date().toISOString(), passed, origin,
    scope: 'Settled explicit Portuguese and English pages at390/1440px: real Enter/Escape, focus and heading stability. No forms, sessions, AI, leads, analytics or messages.', checks, errors }, null, 2) + '\n');
}
console.log(JSON.stringify({ passed, checks: checks.length, errors }));
