/** Actual consent UI and public navigation in an isolated synthetic browser session. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium, expect } from '@playwright/test';

const origin = 'https://catalisa.io';
const measurement = 'G-JYJWH17ZVX';
const headed = process.argv.includes('--headed');
const output = process.argv.find(arg => arg.startsWith('--output='))?.slice(9);
if (!output) throw Error('Explicit --output path required');
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome',
  headless: !headed, args: ['--no-sandbox'] });
const context = await browser.newContext({ locale: 'pt-BR', viewport: { width: 1440, height: 1000 } });
const receipts = [], failures = [], scriptsBeforeConsent = [];
let passed = false, failure;
const startedAt = new Date().toISOString();
try {
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === origin || url.hostname === 'www.googletagmanager.com'
      || /(?:^|\.)google-analytics\.com$/.test(url.hostname)) return route.continue();
    if (/(?:^|\.)clarity\.ms$/.test(url.hostname)) return route.fulfill({ status: 204, body: '' });
    return route.abort();
  });
  const page = await context.newPage();
  page.on('requestfailed', request => {
    if (/google-analytics|googletagmanager/.test(new URL(request.url()).hostname))
      failures.push({ hostname: new URL(request.url()).hostname, error: request.failure()?.errorText });
  });
  page.on('response', response => {
    const url = new URL(response.url());
    if (!/(?:^|\.)google-analytics\.com$/.test(url.hostname) || url.pathname !== '/g/collect') return;
    for (const line of response.request().postData()?.split(/\r?\n/) ?? ['']) {
      const query = new URLSearchParams(url.searchParams);
      for (const [key, value] of new URLSearchParams(line)) query.set(key, value);
      receipts.push({ measurementId: query.get('tid'), event: query.get('en'),
        status: response.status(), hasSessionId: !!query.get('sid'),
        engagementMs: Number(query.get('_et') || 0), debug: query.get('_dbg'),
        source: query.get('cs'), consent: query.get('gcs') });
    }
  });
  const response = await page.goto(origin + '/produtos?utm_source=ga_validation&utm_campaign=consent_session');
  expect(response?.status()).toBe(200);
  const release = response.headers()['x-catalisa-site-release'];
  await expect(page.getByRole('button', { name: 'Aceitar analytics', exact: true })).toBeVisible();
  scriptsBeforeConsent.push(...await page.locator('script[src*="googletagmanager"],script[src*="clarity.ms"]').evaluateAll(nodes => nodes.map(node => new URL(node.src).hostname)));
  expect(scriptsBeforeConsent).toEqual([]);
  await page.getByRole('button', { name: 'Aceitar analytics', exact: true }).click();
  await expect.poll(() => receipts.some(item => item.measurementId === measurement && item.event === 'page_view' && item.status === 204), { timeout: 30000 }).toBe(true);
  await page.waitForTimeout(12000);
  await page.evaluate(() => scrollTo(0, 600));
  await page.locator('[data-product=banking] .p-product-detail').click();
  await expect(page).toHaveURL(/\/ecossistema\/banking\/?$/);
  await expect(page.locator('.p-detail-expanded')).toBeVisible();
  await page.waitForTimeout(3000);
  await page.evaluate(id => window.gtag('event', 'qa_realtime_check', {
    send_to: id, qa_source: 'consent_session', debug_mode: false,
    page_location: 'https://catalisa.io/ecossistema/banking', engagement_time_msec: 12000,
  }), measurement);
  await expect.poll(() => receipts.some(item => item.measurementId === measurement
    && item.event === 'qa_realtime_check' && item.hasSessionId && item.status === 204),
    { timeout: 30000 }).toBe(true);
  expect(receipts.every(item => item.measurementId === measurement)).toBe(true);
  passed = true;
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify({ startedAt, checkedAt: new Date().toISOString(), passed,
    release, headed, scope: 'Actual public consent button and public product navigation in a fresh synthetic Chrome context; real Google SDK and collectors. Clarity collection blocked. No personal profile, cookies or tokens copied; no forms, leads, AI or messages.',
    scriptsBeforeConsent, receipts, failures,
    limits: ['HTTP204 and a session ID prove browser delivery, not account report ingestion.',
      'The browser is an automated QA browser; Google can exclude bot traffic.'] }, null, 2) + '\n');
} catch (error) { failure = error; }
finally { await context.close(); await browser.close(); }
if (failure) throw failure;
console.log(JSON.stringify({ passed, output, headed, receipts }));
