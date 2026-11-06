/** Read-only mobile loading timeline; no forms, authentication or vendor analytics. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
const argument = name => process.argv.find(value => value.startsWith('--' + name + '='))?.slice(name.length + 3);
const origin = argument('origin') || 'https://site-staging.catalisa.io';
const output = argument('output');
if (!['https://site-staging.catalisa.io', 'https://catalisa.io'].includes(origin) || !output)
  throw Error('Allowlisted origin and explicit output required');
const routes = ['/contato', '/lab', '/ecossistema/credit'];
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const results = [];
try {
  for (const route of routes) {
    const context = await browser.newContext({ locale: 'pt-BR', viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    try {
      await context.route('**/*', request => new URL(request.request().url()).origin === origin ? request.continue() : request.abort());
      await context.addInitScript(() => {
        const state = window.__catalisaLoadingQA = { paints: [], rootChanges: [], bootstrapChanges: [], domReadyAt: null, fontsReadyAt: null };
        try { new PerformanceObserver(list => {
          for (const entry of list.getEntries()) state.paints.push({ at: entry.startTime, renderTime: entry.renderTime, loadTime: entry.loadTime,
            element: entry.element?.tagName, className: entry.element?.getAttribute('class'), size: entry.size,
            resource: entry.url ? new URL(entry.url).pathname : null });
        }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
        new MutationObserver(records => {
          for (const change of records) {
            if (change.type === 'attributes' && change.attributeName === 'data-contact-bootstrap')
              state.bootstrapChanges.push({ at: performance.now(), hidden: document.documentElement.hasAttribute('data-contact-bootstrap') });
            if (change.type === 'childList' && change.target.id === 'root' && state.rootChanges.length < 16)
              state.rootChanges.push({ at: performance.now(), children: change.target.childElementCount });
          }
        }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-contact-bootstrap'] });
        document.addEventListener('DOMContentLoaded', () => {
          state.domReadyAt = performance.now();
          document.fonts.ready.then(() => { state.fontsReadyAt = performance.now(); });
        }, { once: true });
      });
      const page = await context.newPage();
      const client = await context.newCDPSession(page);
      await client.send('Network.enable');
      await client.send('Network.setCacheDisabled', { cacheDisabled: true });
      await client.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750, connectionType: 'cellular4g' });
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      const response = await page.goto(origin + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      await page.waitForTimeout(3000);
      const result = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');
        return { ...window.__catalisaLoadingQA,
          navigation: Object.fromEntries(['startTime', 'domainLookupStart', 'domainLookupEnd', 'connectStart', 'secureConnectionStart', 'connectEnd', 'requestStart', 'responseStart', 'responseEnd', 'domContentLoadedEventEnd', 'loadEventEnd'].map(key => [key, navigation[key]])),
          resources: resources.filter(resource => /\.(?:js|css|woff2)$/.test(new URL(resource.name).pathname) || new URL(resource.name).pathname === '/api/site/session')
            .map(resource => ({ path: new URL(resource.name).pathname, start: resource.startTime, end: resource.responseEnd,
              duration: resource.duration, transferBytes: resource.transferSize, encodedBytes: resource.encodedBodySize })),
          documentLanguage: document.documentElement.lang };
      });
      results.push({ route, status: response.status(), release: response.headers()['x-catalisa-site-release'], ...result });
      console.log(JSON.stringify({ route, responseStart: result.navigation.responseStart, lastLcp: result.paints.at(-1), bootstrap: result.bootstrapChanges }));
    } finally { await context.close(); }
  }
} finally {
  await browser.close();
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify({ checkedAt: new Date().toISOString(), origin,
    scope: 'Single cold-cache mobile emulation per route,4xCPU and constrained4g. Anonymous GET-only page load; no consent changes, forms, leads, AI or messages. Timelines diagnose this run and are not field Core Web Vitals.',
    results }, null, 2) + '\n');
}
