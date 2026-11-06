import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const output = path.resolve('docs/redesign-2026-10-22/qa/reference');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const routes = ['/', '/visao/', '/capacidades/', '/capacidades/iam/', '/arquitetura/', '/studio/', '/workflows/', '/agentes/', '/governanca/', '/desenvolvedores/', '/ecossistema/banking/', '/ecossistema/credit/', '/lab/', '/contato/'];
const results = [];
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const [index, route] of routes.entries()) {
    for (const width of [1440, 320, 390, 768]) {
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto('http://127.0.0.1:8176' + route);
      await page.evaluate(() => document.fonts.ready);
      await page.locator('h1').waitFor();
      const metrics = await page.evaluate(() => ({ title: document.title, h1: document.querySelector('h1')?.textContent, headings: [...document.querySelectorAll('h2')].map(el => el.textContent), overflow: document.documentElement.scrollWidth > innerWidth, imagesMissing: [...document.images].filter(el => el.getAttribute('src') && el.getClientRects().length && el.complete && !el.naturalWidth).map(el => el.src) }));
      const screenshot = `${String(index).padStart(2, '0')}-${width}.png`;
      if (width === 1440 || width === 390) await page.screenshot({ path: path.join(output, screenshot), fullPage: width === 390 });
      results.push({ route, width, status: response.status(), ...metrics, errors: errors.splice(0) });
    }
    console.log(`Inspecionada ${route}`);
  }
  const tiles = await Promise.all(routes.map(async (_, index) => ({ input: await sharp(path.join(output, `${String(index).padStart(2, '0')}-1440.png`)).resize(480, 334).toBuffer(), left: (index % 3) * 480, top: Math.floor(index / 3) * 334 })));
  await sharp({ create: { width: 1440, height: Math.ceil(routes.length / 3) * 334, channels: 3, background: '#F6F3EE' } }).composite(tiles).png().toFile(path.join(output, 'overview.png'));
  await fs.writeFile(path.join(output, 'inspection.json'), JSON.stringify({ date: new Date().toISOString(), scope: 'Initial states only, four widths, reduced motion. Screenshots of 14 representative routes.', results }, null, 2));
} finally {
  await browser.close();
}
