import {anonymousSnapshotApi} from './anonymous-snapshot-api.mjs';
import {publicSnapshotIssue} from './public-snapshot-contract.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'node:http';
import { expect } from '@playwright/test';

/** Local hosting emulation only. CDN/staging remains a separate acceptance gate. */
export async function verifyReleaseBrowser(browser, directory) {
  const root = path.resolve(directory);
  const mode = JSON.parse(await fs.readFile(path.join(root, 'site-build.json'), 'utf8'));
  const inventory = JSON.parse(await fs.readFile(path.join(root, 'release-routes.json'), 'utf8'));
  if (!mode.redesign) throw new Error('Expected an explicit redesign release artifact');
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const pathname = decodeURIComponent(url.pathname);
      const api = anonymousSnapshotApi(pathname,req.method);
      if (api) { res.writeHead(api.status,api.headers); res.end(req.method === 'HEAD' ? undefined : JSON.stringify(api.body)); return; }
      const normalized = pathname.replace(/\/+$/, '') || '/';
      if (inventory.redirects[normalized]) { res.writeHead(301, {Location: inventory.redirects[normalized] + url.search}); res.end(); return; }
      let file = path.resolve(root, '.' + pathname);
      if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); res.end(); return; }
      try { if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html'); await fs.access(file); }
      catch {
        const authenticated = inventory.authenticatedPrefixes.some(prefix => normalized === prefix || normalized.startsWith(prefix + '/'));
        file = path.join(root, authenticated ? 'spa.html' : '404.html'); res.statusCode = authenticated ? 200 : 404;
      }
      const types = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2','.ttf':'font/ttf','.mp4':'video/mp4'};
      res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
      if (!mode.indexing) res.setHeader('X-Robots-Tag', 'noindex, nofollow');
      res.end(await fs.readFile(file));
    } catch { res.statusCode = 500; res.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const errors = [], checks = [];
  const requested=[];
  const localizedPages=inventory.localizedPages??[];
  const definitionFor=route=>localizedPages.find(page=>page.path===route)??{path:route,basePath:route,lang:route==='/en'||route.startsWith('/en/')?'en-US':'pt-BR'};
  const publicBase=route=>definitionFor(route).basePath??route;
  const dictionaries=new Map();
  async function expectedHeading(route){
    const {lang}=definitionFor(route),base=publicBase(route);
    const parts=base==='/contato'?['Converse sobre o que sua empresa precisa.']:base==='/lab'?['Descreva sua ideia e explore um conceito de produto.']:undefined;
    if(!parts)return undefined;
    if(lang==='pt-BR')return parts.join('');
    if(!dictionaries.has(lang))dictionaries.set(lang,JSON.parse(await fs.readFile(path.resolve('src/redesign/i18n/locales',lang+'.json'),'utf8')).messages);
    return parts.map(source=>{const translated=dictionaries.get(lang)[source]??dictionaries.get(lang)[source.trim()];if(typeof translated!=='string')throw Error('Missing public snapshot translation: '+lang);return(source.match(/^\s*/)?.[0]??'')+translated+(source.match(/\s*$/)?.[0]??'');}).join('');
  }
  const localizedSmoke=localizedPages.filter(page=>['/','/contato','/lab'].includes(page.basePath)).map(page=>page.path);
  const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await page.addInitScript(() => {localStorage.setItem('catalisa_cookie_consent', 'denied');localStorage.setItem('catalisa_site_locale','pt-BR');});
  await page.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/, route => route.abort());
  page.on('pageerror', error => errors.push(String(error)));
  page.on('request',request=>requested.push(new URL(request.url()).pathname));
  const output = path.resolve(process.argv.find(arg => arg.startsWith('--report-dir='))?.slice(13) || 'docs/redesign-2026-10-22/qa/release');
  let passed = false;
  try {
    for (const route of [...new Set(['/', '/capacidades', '/capacidades/ai-engine', '/contato', '/lab', '/ecossistema/banking', '/ecossistema/credit', '/arquitetura', '/perspectivas', '/press-kit', '/en', '/en/studio', '/insights', '/politica-privacidade',...localizedSmoke])]) {
      requested.length=0;
      const basePath=publicBase(route);
      const anonymousSession = ['/contato','/lab'].includes(basePath) ? page.waitForResponse(response => new URL(response.url()).pathname === '/api/site/session' && response.request().method() === 'GET', {timeout:15000}) : undefined;
      const response = await page.goto(origin + route);
      // Prove the interactive app actually performed its read. Static controls
      // alone could otherwise be accepted before React replaces the snapshot.
      if (anonymousSession) expect((await anonymousSession).status()).toBe(401);
      expect(response.status(), route).toBe(200);
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://catalisa.io' + route);
      const state = await page.evaluate(() => ({path:location.pathname,title:document.title,lang:document.documentElement.lang,robots:document.querySelector('meta[name="robots"]')?.content,native:!!document.querySelector('.c-site'),emotion:document.querySelectorAll('style[data-emotion]').length}));
      expect(state.robots.includes('noindex')).toBe(!mode.indexing);
      expect(state.native).toBe(inventory.native.includes(route));
      if(state.native)expect(state.lang).toBe(definitionFor(route).lang);
      if (state.native) expect(state.emotion, 'Native app must not load the legacy theme').toBe(0);
      if(state.native){await page.waitForLoadState('networkidle');expect(requested.filter(url=>/\/assets\/(?:chakra|icons|motion|presentation|playbooks|i18n)-/.test(url)),'Native route must not download legacy framework/content chunks').toEqual([]);}
      if (route === '/ecossistema/banking') await expect(page.locator('.bk-hero p')).toContainText('Ofereça contas, pagamentos e serviços financeiros com sua marca.');
      if (route === '/ecossistema/credit') await expect(page.locator('.cr-hero p')).toContainText('Crie produtos de crédito com suas políticas e condições.');
      if (route === '/arquitetura') await expect(page.locator('.a-hero-grid > div:first-child > p')).toContainText('modernize seus sistemas por etapas');
      if (['/contato','/lab'].includes(basePath)) {
        // The static heading may precede React's session read. Wait for its real
        // anonymous result; a loading frame is neither a failure nor acceptance.
        await page.waitForFunction(path => {
          const root = document.querySelector(path === '/contato' ? '.c-contact' : '.c-lab');
          const control = document.querySelector(path === '/contato' ? '#z-input' : '#l-prompt');
          const errors = [...(root?.querySelectorAll('.z-error,.l-error,.l-global-error') ?? [])].some(node => node.textContent?.trim());
          return !!root && (errors || (!!control && !control.disabled && !root.querySelector('[aria-busy="true"]')));
        },basePath,{timeout:10000,polling:50});
        const snapshot = await page.evaluate(path => { const root = document.querySelector(path === '/contato' ? '.c-contact' : '.c-lab'); const control = document.querySelector(path === '/contato' ? '#z-input' : '#l-prompt'); return {path,h1:document.querySelector('main h1')?.textContent ?? '',busy:!!root?.querySelector('[aria-busy="true"]'),controlReady:!!control && !control.disabled,errors:[...(root?.querySelectorAll('.z-error,.l-error,.l-global-error') ?? [])].map(node=>node.textContent?.trim()).filter(Boolean)}; },basePath);
        expect(publicSnapshotIssue({...snapshot,expectedHeading:await expectedHeading(route)})).toBeUndefined();
        checks.push({anonymousPublicSnapshot:route,...snapshot});
      }
      checks.push(state);
    }
    for (const [source, destination] of Object.entries(inventory.redirects)) {
      const response = await page.goto(origin + source + '?release_test=1');
      expect(response.status()).toBe(200);
      expect(new URL(page.url()).pathname).toBe(destination);
      expect(new URL(page.url()).search).toBe('?release_test=1');
      checks.push({redirect:source,destination,preservedQuery:true});
    }
    // The app boundary must replace the document, clearing the previous theme and global CSS.
    await page.goto(origin + '/');
    await expect(page.locator('.c-home')).toBeVisible();
    await page.evaluate(() => { window.__releaseDocument = 'native'; const link = document.createElement('a'); link.href = '/insights?release_boundary=1'; link.id = 'qa-compatibility-link'; link.textContent = 'Insights'; document.body.append(link); });
    await page.locator('#qa-compatibility-link').click();
    await page.waitForURL('**/insights?release_boundary=1');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://catalisa.io/insights');
    expect(await page.evaluate(() => window.__releaseDocument)).toBeUndefined();
    await page.evaluate(() => { window.__releaseDocument = 'legacy'; const link = document.createElement('a'); link.href = '/'; link.id = 'qa-native-link'; link.textContent = 'Catalisa'; document.body.append(link); });
    await page.locator('#qa-native-link').click();
    await page.waitForURL(origin + '/');
    await expect(page.locator('.c-home')).toBeVisible();
    expect(await page.evaluate(() => window.__releaseDocument)).toBeUndefined();
    expect(await page.locator('style[data-emotion]').count()).toBe(0);
    checks.push({navigation:'native → compatibility → native',fullDocumentNavigation:true,legacyThemeUnloaded:true});
    await page.goto(origin + '/en/studio');
    await expect(page.locator('main h1')).toHaveCount(1);
    await page.evaluate(() => { window.__releaseDocument = 'english'; });
    await page.locator('.c-language-trigger').first().click();
    await page.locator('.c-language-options a[lang="pt-BR"]').first().click();
    await page.waitForURL(origin + '/studio');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://catalisa.io/studio');
    await expect(page.locator('#root > div.c-site')).toBeVisible();
    expect(await page.evaluate(() => window.__releaseDocument)).toBeUndefined();
    expect(await page.locator('style[data-emotion]').count()).toBe(0);
    checks.push({navigation:'English language switch → native Studio',fullDocumentNavigation:true});
    for (const route of ['/treinamento/login', '/apresentacao/login', '/en/training/login', '/en/presentation/login']) {
      const response = await page.goto(origin + route);
      expect(response.status()).toBe(200);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      checks.push({authenticatedLogin:route,status:200,noIndex:true});
    }
    const noJs = await browser.newPage({javaScriptEnabled:false});
    await noJs.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/, route => route.abort());
    try {
      for (const route of [...new Set(['/', '/capacidades', '/contato', '/lab', '/ecossistema/banking', '/ecossistema/credit', '/arquitetura', '/en', '/insights',...localizedSmoke])]) {
        const basePath=publicBase(route);
        const response = await noJs.goto(origin + route);
        expect(response.status()).toBe(200);
        await expect(noJs.locator('main h1')).toBeVisible();
        if(inventory.native.includes(route))await expect(noJs.locator('html')).toHaveAttribute('lang',definitionFor(route).lang);
        if (route === '/ecossistema/banking') await expect(noJs.locator('.bk-hero p')).toContainText('Ofereça contas, pagamentos e serviços financeiros com sua marca.');
        if (route === '/ecossistema/credit') await expect(noJs.locator('.cr-hero p')).toContainText('Crie produtos de crédito com suas políticas e condições.');
        if (route === '/arquitetura') await expect(noJs.locator('.a-hero-grid > div:first-child > p')).toContainText('modernize seus sistemas por etapas');
        if (['/contato','/lab'].includes(basePath)) { const snapshot = await noJs.evaluate(path => { const root = document.querySelector(path === '/contato' ? '.c-contact' : '.c-lab'); const control = document.querySelector(path === '/contato' ? '#z-input' : '#l-prompt'); return {path,h1:document.querySelector('main h1')?.textContent ?? '',busy:!!root?.querySelector('[aria-busy="true"]'),controlReady:!!control && !control.disabled,errors:[...(root?.querySelectorAll('.z-error,.l-error,.l-global-error') ?? [])].map(node=>node.textContent?.trim()).filter(Boolean)}; },basePath); expect(publicSnapshotIssue({...snapshot,expectedHeading:await expectedHeading(route)})).toBeUndefined(); }
        checks.push({withoutJavaScript:route,status:200});
      }
      expect((await noJs.goto(origin + '/unknown-release-url')).status()).toBe(404);
      await expect(noJs.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    } finally { await noJs.close(); }
    expect(errors).toEqual([]); passed = true;
  } catch (error) { errors.push(String(error)); throw error; }
  finally {
    await fs.mkdir(output,{recursive:true});
    await fs.writeFile(path.join(output,'browser-release.json'),JSON.stringify({generatedAt:new Date().toISOString(),passed,mode,scope:'Local release artifact and hosting emulation; no CDN deployment or real auth/integration exercised',checks,errors},null,2));
    await page.close(); await new Promise(resolve => server.close(resolve));
  }
  console.log(`Release browser audit: ${checks.length} checks; ${errors.length} browser exceptions`);
}
