import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'node:http';
import { expect } from '@playwright/test';

export async function verifySeoBrowser(browser) {
  let origin = process.env.SEO_ORIGIN || 'http://127.0.0.1:5175';
  const built = process.argv.find(arg => arg.startsWith('--built-dir='))?.slice(12);
  if (built) {
    const manifest = await fs.readFile(path.resolve(built, 'site-build.json'), 'utf8').then(JSON.parse).catch(() => null);
    if (manifest?.redesign) { const {verifyReleaseBrowser} = await import('./verify-release-browser.mjs'); return verifyReleaseBrowser(browser, built); }
  }
  let server;
  if (built) {
    const root = path.resolve(built);
    server = createServer(async (req, res) => {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let file = path.resolve(root, '.' + pathname);
      if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); res.end(); return; }
      try { if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html'); await fs.access(file); }
      catch { file = path.join(root, '404.html'); res.statusCode = 404; }
      const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg':'image/jpeg', '.woff2': 'font/woff2', '.ttf':'font/ttf', '.mp4':'video/mp4' };
      res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
      try { res.end(await fs.readFile(file)); } catch { res.statusCode = 404; res.end(); }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    origin = `http://127.0.0.1:${server.address().port}`;
  }
  const reportDir = process.argv.find(arg => arg.startsWith('--report-dir='))?.slice(13);
  const output = path.resolve(reportDir || 'docs/redesign-2026-10-22/qa/seo');
  await fs.mkdir(output, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('catalisa_cookie_consent', 'denied'));
  const errors = []; const checks = [];
  let passed=false;
  page.on('pageerror', error => errors.push(String(error)));
  await page.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/, route => route.abort());
  try {
    const newNativeRoutes=['/studio','/workflows','/agentes','/governanca','/composicoes','/ecossistema','/ecossistema/med','/ecossistema/juridico','/ecossistema/recrutamento','/ecossistema/biometrics','/ecossistema/decision','/ecossistema/banking','/ecossistema/credit'];
    for (const route of ['/agentes-ia-whatsapp', '/insights', '/insights/90-porcento-empresas-mais-clientes-whatsapp', '/en/insights/90-porcento-empresas-mais-clientes-whatsapp', '/design-system/home', '/capacidades', '/arquitetura', '/desenvolvedores', ...newNativeRoutes, '/']) {
      await page.goto(origin + route);
      await page.waitForTimeout(800);
      const state = await page.evaluate(() => ({ path: location.pathname, title: document.title, lang: document.documentElement.lang, canonicals: [...document.querySelectorAll('link[rel="canonical"]')].map(node => node.href), robots: [...document.querySelectorAll('meta[name="robots"]')].map(node => node.content), headings: [...document.querySelectorAll('main h1')].map(node => node.textContent), schemas: document.querySelectorAll('script[type="application/ld+json"]').length }));
      checks.push(state);
      expect(state.canonicals).toEqual(['https://catalisa.io' + route]);
      expect(state.robots).toHaveLength(1); expect(state.headings).toHaveLength(1);
      expect(state.lang).toBe(route.startsWith('/en/') ? 'en-US' : 'pt-BR');
      expect(state.schemas).toBeGreaterThan(0);
      if(newNativeRoutes.includes(route))expect(state.robots).toEqual(['noindex, nofollow']);
    }
    await page.goto(origin + '/design-system/home');
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.locator('.c-home .architecture-section').scrollIntoViewIfNeeded();
      await expect(page.locator('.c-home .architecture-accordion details')).toHaveCount(4);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({ path: path.join(output, `home-layout-${width}.png`) });
    }
    await page.locator('.c-header .c-brand').click();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://catalisa.io/');
    await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute('content', /noindex/);
    checks.push({ interaction: 'Native Home to legacy Home via SPA link', canonical: 'https://catalisa.io/' });
    if (built) {
      const noJs = await browser.newPage({ javaScriptEnabled: false });
      await noJs.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/, route => route.abort());
      for (const route of ['/design-system/home', '/capacidades', '/capacidades/ai-engine', '/en/insights/90-porcento-empresas-mais-clientes-whatsapp', ...newNativeRoutes]) {
        const response = await noJs.goto(origin + route);
        expect(response.status()).toBe(200);
        await expect(noJs.locator('main h1')).toBeVisible();
        if (route === '/design-system/home') await expect(noJs.locator('.c-home .architecture-accordion details')).toHaveCount(4);
        if (route.includes('/en/insights/')) {
          const hiddenByAnimation = await noJs.evaluate(() => [...document.querySelectorAll('main h1, main p')].filter(node => {
            if (!node.textContent.trim()) return false;
            for (let parent = node; parent && parent.tagName !== 'BODY'; parent = parent.parentElement) if (getComputedStyle(parent).opacity === '0') return true;
            return false;
          }).length);
          expect(hiddenByAnimation, 'Editorial text is readable without executing entrance animations').toBe(0);
        }
        if (route === '/capacidades') {
          await expect(noJs.locator('.b-catalog-row')).toHaveCount(39);
        }
        checks.push({ noJavaScript: route, status: response.status(), h1Visible: true });
      }
      expect((await noJs.goto(origin + '/rota-inexistente-qa-seo')).status()).toBe(404);
      await noJs.close();
    }
    expect(errors, 'No browser exceptions, including hydration errors').toEqual([]);
    passed=true;
    console.log(`SEO browser audit: ${checks.length} checks, ${errors.length} exceptions; ${built ? 'built HTML + JS disabled' : 'development server'}`);
  } catch(error) {errors.push(String(error));throw error;} finally {
    await fs.writeFile(path.join(output, built ? 'browser-built.json' : 'browser-dev.json'), JSON.stringify({ generatedAt: new Date().toISOString(), passed, scope: built ? 'Local static build, JS and no-JS; CDN not tested' : 'Development only', checks, errors }, null, 2));
    await page.close(); server?.close();
  }
}
