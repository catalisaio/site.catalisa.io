import {installBuildSiteLocales, assertBuildSiteLocaleCoverage, expectedPublicSnapshotHeading} from './site-locales';
import { anonymousSnapshotApi } from './anonymous-snapshot-api.mjs';
import { publicSnapshotIssue, snapshotShellName } from './public-snapshot-contract.mjs';
import {withRouteResourceHints} from './route-resource-hints.mjs';
import { getArtifactBuildMode } from './site-build-mode';
import puppeteer from 'puppeteer';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, extname, sep } from 'node:path';
import { getBuildPages } from '../src/seo/build-pages';
import type {BuildPage} from '../src/seo/build-pages';
import { getRedesignPage } from '../src/seo/redesign';
import { resolveRoute, BASE_URL } from '../src/seo/routes';

const dist = resolve(process.argv.find(arg => arg.startsWith('--dist='))?.slice(7) || process.env.SITE_DIST_DIR || 'dist');
const buildMode = getArtifactBuildMode(dist);
if (buildMode.redesign) installBuildSiteLocales();
const requestedPaths = process.argv.flatMap((argument, index) => argument === '--route' ? [process.argv[index + 1]] : []);
if (requestedPaths.some(path => !path)) throw new Error('--route needs a pathname');
const shellPath = process.argv.find(arg => arg.startsWith('--shell='))?.slice(8);
const shellFile = shellPath ? resolve(shellPath) : resolve(dist, snapshotShellName({partial:requestedPaths.length>0,hasSpa:existsSync(resolve(dist,'spa.html'))}));
const shell = readFileSync(shellFile, 'utf8');
if (!shellPath && /<div[^>]+id=["']root["'][^>]*>\s*<(?:div|main)/.test(shell)) throw new Error('Prerender requires an empty SPA shell; pass --shell explicitly.');
// Keep the empty SPA shell separate from the pre-rendered Home for authenticated routes.
writeFileSync(resolve(dist, 'spa.html'), shell);
const mime: Record<string, string> = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp4': 'video/mp4' };
const server = createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname);
  const api = anonymousSnapshotApi(pathname, req.method);
  if (api) { res.writeHead(api.status, api.headers); res.end(req.method === 'HEAD' ? undefined : JSON.stringify(api.body)); return; }
  const file = resolve(dist, '.' + pathname);
  if (file.startsWith(dist + sep) && existsSync(file) && statSync(file).isFile() && !file.endsWith('.html')) {
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file)); return;
  }
  // Always render from a fresh shell, never from an HTML snapshot generated earlier in this run.
  res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(shell);
});

async function main() {
  await new Promise<void>(done => server.listen(0, '127.0.0.1', done));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Missing prerender address');
  const origin = `http://127.0.0.1:${address.port}`;
  const workers = Number(process.argv.find(arg => arg.startsWith('--workers='))?.slice(10) || process.env.PRERENDER_WORKERS || 1);
  if (!Number.isInteger(workers) || workers < 1 || workers > 3) throw new Error('Prerender workers must be 1–3.');
  const browser = await puppeteer.launch({ headless: true, ...((process.argv.find(arg => arg.startsWith('--browser='))?.slice(10) || process.env.PUPPETEER_EXECUTABLE_PATH) ? { executablePath: process.argv.find(arg => arg.startsWith('--browser='))?.slice(10) || process.env.PUPPETEER_EXECUTABLE_PATH } : {}), args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'] });
  const inventory: BuildPage[] = [...getBuildPages(buildMode), { path: '/404', lang: 'pt-BR', noIndex: true }];
  const entries = requestedPaths.length === 0 ? inventory : inventory.filter(entry => requestedPaths.includes(entry.path));
  const previousReport = requestedPaths.length && existsSync(resolve(dist, 'prerender-report.json')) ? JSON.parse(readFileSync(resolve(dist, 'prerender-report.json'), 'utf8')) : undefined;
  if (!entries.length) throw new Error('No routes selected');
  const results: Record<string, unknown>[] = [];
  const failures: string[] = [];
  let cursor = 0;
  try {
    await Promise.all(Array.from({ length: workers }, async () => {
      const page = await browser.newPage();
      const pageErrors: string[] = [];
      const requestErrors: string[] = [];
      page.on('pageerror', error => pageErrors.push(String(error)));
      page.on('requestfailed', request => { if(request.url().startsWith(origin+'/')) requestErrors.push(request.url().slice(origin.length)+': '+request.failure()?.errorText); });
      await page.evaluateOnNewDocument(() => {localStorage.setItem('catalisa_cookie_consent', 'denied');localStorage.setItem('catalisa_site_locale','pt-BR');});
      await page.setRequestInterception(true);
      page.on('request', request => {
        // Build snapshots never submit leads, fire analytics, or depend on third-party networks.
        if (request.url().startsWith(origin + '/') && ['GET', 'HEAD'].includes(request.method())) void request.continue();
        else void request.abort();
      });
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      while (cursor < entries.length) {
        const entry = entries[cursor++];
        const basePath = entry.basePath ?? entry.path;
        pageErrors.length = 0;
        requestErrors.length = 0;
        try {
          const definition = resolveRoute(entry.path);
          const expectedTitle = entry.staged ? getRedesignPage(entry.path)?.title : definition ? JSON.parse(readFileSync(resolve('src/i18n/locales', entry.lang, 'seo.json'), 'utf8'))[definition.pageKey]?.title : undefined;
          await page.goto(origin + entry.path, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await page.waitForFunction(({ canonical, noIndex, expectedTitle }) => {
            const main = document.querySelector('main');
            const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content || '';
            return !!main?.querySelector('h1') && (main.textContent?.trim().length || 0) > (canonical.endsWith('/404') ? 20 : 80) &&
              document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href === canonical &&
              robots.includes(noIndex ? 'noindex' : 'index') && (!expectedTitle || document.title === expectedTitle);
          }, { timeout: 20000, polling: 100 }, { canonical: BASE_URL + entry.path, noIndex: entry.noIndex, expectedTitle });
          if (['/contato','/lab'].includes(basePath)) await page.waitForFunction(path => {
            const root = document.querySelector(path === '/contato' ? '.c-contact' : '.c-lab');
            const control = document.querySelector<HTMLTextAreaElement>(path === '/contato' ? '#z-input' : '#l-prompt');
            const errors = [...(root?.querySelectorAll('.z-error,.l-error,.l-global-error') ?? [])].some(node => node.textContent?.trim());
            return !!root && (errors || (!!control && !control.disabled && !root.querySelector('[aria-busy="true"]')));
          }, {timeout:10000,polling:50}, basePath);
          await page.waitForNetworkIdle({ idleTime: 150, timeout: 10000 });
          if (pageErrors.length) throw new Error('Browser exception(s): ' + pageErrors.join(' | '));
          const audit = await page.evaluate(path => {
            const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].map(node => JSON.parse(node.textContent || '{}'));
            const root = document.querySelector(path === '/contato' ? '.c-contact' : '.c-lab');
            const control = document.querySelector<HTMLTextAreaElement>(path === '/contato' ? '#z-input' : '#l-prompt');
            const publicSnapshot = {path,h1:document.querySelector('main h1')?.textContent ?? '',busy:!!root?.querySelector('[aria-busy="true"]'),controlReady:!!control && !control.disabled,errors:[...(root?.querySelectorAll('.z-error,.l-error,.l-global-error') ?? [])].map(node => node.textContent?.trim()).filter(Boolean)};
            return { publicSnapshot, title: document.title, lang: document.documentElement.lang, descriptions: [...document.querySelectorAll<HTMLMetaElement>('meta[name="description"]')].map(node => node.content), robots: [...document.querySelectorAll<HTMLMetaElement>('meta[name="robots"]')].map(node => node.content), canonicals: [...document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')].map(node => node.href), headings: [...document.querySelectorAll('main h1')].map(node => node.textContent), schemas: schemas.length, textLength: document.querySelector('main')?.textContent?.trim().length || 0 };
          }, basePath);
          const snapshotIssue = publicSnapshotIssue({...audit.publicSnapshot, expectedHeading: expectedPublicSnapshotHeading(basePath,entry.lang)});
          if (snapshotIssue) throw new Error(snapshotIssue);
          if (audit.descriptions.length !== 1 || !audit.descriptions[0] || audit.canonicals.length !== 1 || audit.robots.length !== 1 || audit.lang !== entry.lang || /(?:\.title|\.description)$/.test(audit.title)) throw new Error('Invalid metadata: ' + JSON.stringify(audit));
          if (!entry.noIndex && (audit.robots[0].includes('noindex') || audit.schemas < 1)) throw new Error('Public route is noindex or lacks structured data');
          await page.evaluate(() => {
            // Do not persist runtime third-party script nodes into the hydrated document.
            document.querySelectorAll('script[src^="http"],link[href^="http"][rel="prefetch"]').forEach(node => node.remove());
          });
          const file = entry.path === '/404' ? resolve(dist, '404.html') : resolve(dist, entry.path === '/' ? 'index.html' : `${entry.path.slice(1)}/index.html`);
          mkdirSync(dirname(file), { recursive: true });
          const html=await page.content();
          writeFileSync(file, entry.staged ? withRouteResourceHints(html,basePath) : html);
          results.push({ path: entry.path, ...audit, noIndex: entry.noIndex });
          if (results.length % 20 === 0) console.log(`Pre-rendered ${results.length}/${entries.length}`);
        } catch (error) {
          const state = await page.evaluate(() => ({ title: document.title, expectedTitle: document.querySelector('title')?.textContent, robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'), mainLength: document.querySelector('main')?.textContent?.trim().length, canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'), rootText: document.querySelector('#root')?.textContent?.slice(0, 200), h1: document.querySelector('main h1')?.textContent })).catch(() => null);
          failures.push(`${entry.path}: ${String(error)} ${JSON.stringify({ state, pageErrors, requestErrors })}`); console.error(failures.at(-1));
        }
      }
      await page.close();
    }));
  } finally { await browser.close(); server.close(); }
  const updatedPaths = new Set(entries.map(entry => entry.path));
  const reportRoutes = previousReport ? [...previousReport.routes.filter((entry: {path:string}) => !updatedPaths.has(entry.path)), ...results] : results;
  const reportFailures = previousReport ? [...previousReport.failures.filter((failure:string) => !entries.some(entry => failure.startsWith(entry.path + ':'))), ...failures] : failures;
  writeFileSync(resolve(dist, 'prerender-report.json'), JSON.stringify({ generatedAt: new Date().toISOString(), buildMode, shell:{file:shellFile,moduleScript:shell.match(/<script\b[^>]*type="module"[^>]*src="([^"]+)"/)?.[1]}, scope: 'Static HTML and metadata with read-only anonymous API contract; not staging integration or ranking', ...(requestedPaths.length ? {lastPartialUpdate:requestedPaths} : {}), routes: reportRoutes, failures:reportFailures }, null, 2));
  if (failures.length) throw new Error(`${failures.length} route(s) failed prerender; publication must stop`);
  if (buildMode.redesign) assertBuildSiteLocaleCoverage();
  console.log(`Pre-render complete: ${results.length}/${entries.length}; no external requests or form submissions`);
}
main().catch(error => { server.close(); console.error(error); process.exitCode = 1; });
