import {installBuildSiteLocales, assertBuildSiteLocaleCoverage, expectedPublicSnapshotHeading} from './site-locales';
import { publicSnapshotIssue } from './public-snapshot-contract.mjs';
import { getArtifactBuildMode } from './site-build-mode';
const buildMode = getArtifactBuildMode();
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { getBuildPages, getPublicPages } from '../src/seo/build-pages';
import { redesignRedirects, authenticatedPrefixes } from '../src/seo/migration';
import { getRedesignPage } from '../src/seo/redesign';
import { BASE_URL, resolveRoute } from '../src/seo/routes';
import {localizeSitePath} from '../src/redesign/i18n/routes';

if (buildMode.redesign) installBuildSiteLocales();
const dist = resolve(process.env.SITE_DIST_DIR || 'dist');
const failures: string[] = [];
const warnings: string[] = [];
const summaries: Record<string, unknown>[] = [];
const sitemap = new JSDOM(readFileSync(resolve(dist, 'sitemap.xml'), 'utf8'), { contentType: 'text/xml' }).window.document;
const locations = [...sitemap.querySelectorAll('loc')].map(node => node.textContent);
const expected = getPublicPages(buildMode).map(page => BASE_URL + page.path);
if (locations.length !== new Set(locations).size || JSON.stringify([...locations].sort()) !== JSON.stringify([...expected].sort())) failures.push('Sitemap must contain exactly the canonical public routes');
let brandOriginals = 0;
const brandSource = resolve('public/redesign/brand');
for (const name of readdirSync(brandSource)) {
  const source = resolve(brandSource, name);
  if (!statSync(source).isFile()) continue;
  const built = resolve(dist, 'redesign/brand', name);
  const hash = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex');
  if (!existsSync(built) || hash(source) !== hash(built)) failures.push(`Brand original modified or missing: /redesign/brand/${name}`);
  brandOriginals++;
}
const titles = new Map<string, string>();
for (const page of getBuildPages(buildMode)) {
  const doc = new JSDOM(readFileSync(resolve(dist, page.path === '/' ? 'index.html' : `${page.path.slice(1)}/index.html`), 'utf8')).window.document;
  const check = (condition: boolean, message: string) => { if (!condition) failures.push(`${page.path}: ${message}`); };
  if (buildMode.redesign) check(![...doc.querySelectorAll('script,iframe')].some(node => /googletagmanager\.com|clarity\.ms\/tag\//i.test(node.outerHTML)), 'optional analytics must stay disabled until the new site has a preferences flow');
  const definition = resolveRoute(page.path);
  if(buildMode.redesign&&page.staged)check(![...doc.querySelectorAll('link[rel="modulepreload"]')].some(node=>/\/assets\/(?:chakra|icons|motion|presentation|playbooks|i18n)-/.test(node.getAttribute('href')||'')), 'native entry must not preload legacy framework/content chunks');
  if (page.staged) check(doc.title === getRedesignPage(page.path)?.title, 'native title mismatch');
  if (definition && !page.staged) {
    const expectedTitle = JSON.parse(readFileSync(resolve('src/i18n/locales', page.lang, 'seo.json'), 'utf8'))[definition.pageKey]?.title;
    if (expectedTitle) check(doc.title === expectedTitle, 'title must match the actual document language');
  }
  const basePath = page.basePath ?? page.path;
  const publicRoot = doc.querySelector(basePath === '/contato' ? '.c-contact' : '.c-lab');
  const publicControl = doc.querySelector(basePath === '/contato' ? '#z-input' : '#l-prompt');
  const snapshotIssue = publicSnapshotIssue({path:basePath,expectedHeading:expectedPublicSnapshotHeading(basePath,page.lang),h1:doc.querySelector('main h1')?.textContent ?? '',busy:!!publicRoot?.querySelector('[aria-busy="true"]'),controlReady:!!publicControl && !publicControl.hasAttribute('disabled'),errors:[...(publicRoot?.querySelectorAll('.z-error,.l-error,.l-global-error') ?? [])].map(node => node.textContent?.trim()).filter(Boolean)});
  if (snapshotIssue && page.staged) check(false,snapshotIssue);
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const robots = doc.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  check(doc.querySelectorAll('link[rel="canonical"]').length === 1 && canonical === BASE_URL + page.path, 'one self canonical required');
  check(doc.querySelectorAll('meta[name="description"]').length === 1 && !!doc.querySelector('meta[name="description"]')?.getAttribute('content'), 'one nonempty description required');
  check(doc.querySelectorAll('meta[name="robots"]').length === 1 && robots.includes('noindex') === page.noIndex, 'indexing directive mismatch');
  check(doc.documentElement.lang === page.lang, 'incorrect document language');
  check(doc.querySelectorAll('main h1').length === 1, 'exactly one main H1 required');
  check((doc.querySelector('main')?.textContent?.trim().length || 0) > 80, 'content missing without JavaScript');
  check(doc.querySelectorAll('script[type="application/ld+json"]').length > 0, 'structured data missing');
  for (const script of doc.querySelectorAll('script[type="application/ld+json"]')) {
    try { JSON.parse(script.textContent || ''); } catch { check(false, 'invalid JSON-LD'); }
  }
  const expectedAlternates: Record<string,string> = page.alternates ?? {
    [page.lang]: page.path,
    ...(page.alternate ? {[page.lang === 'pt-BR' ? 'en-US' : 'pt-BR']: page.alternate} : {}),
    'x-default': page.lang === 'pt-BR' ? page.path : page.alternate ?? page.path,
  };
  if (!page.noIndex) {
    const actualAlternates = [...doc.querySelectorAll('link[rel="alternate"][hreflang]')];
    check(actualAlternates.length === Object.keys(expectedAlternates).length, 'exact language alternate set required');
    for (const [lang,target] of Object.entries(expectedAlternates)) {
      check(actualAlternates.filter(node=>node.getAttribute('hreflang')===lang).length===1 && doc.querySelector(`link[hreflang="${lang}"]`)?.getAttribute('href') === BASE_URL + target, `missing or wrong ${lang} alternate`);
    }
    const xmlEntry = [...sitemap.querySelectorAll('url')].find(node=>node.querySelector('loc')?.textContent===BASE_URL+page.path);
    const xmlAlternates = [...(xmlEntry?.querySelectorAll('[hreflang]') ?? [])];
    check(xmlAlternates.length === Object.keys(expectedAlternates).length, 'sitemap alternate set mismatch');
    for(const [lang,target] of Object.entries(expectedAlternates))check(xmlAlternates.some(node=>node.getAttribute('hreflang')===lang&&node.getAttribute('href')===BASE_URL+target),`sitemap missing or wrong ${lang} alternate`);
  }
  if (titles.has(doc.title)) warnings.push(`${page.path}: duplicate title with ${titles.get(doc.title)}`);
  titles.set(doc.title, page.path);
  if (basePath === '/capacidades') {
    const catalogPath = page.staged ? localizeSitePath('/capacidades',page.lang) : '/capacidades';
    const detailLinks = new Set([...doc.querySelectorAll('main a[href]')].map(node=>node.getAttribute('href')?.replace(/\/$/, '')).filter(href=>href?.startsWith(catalogPath+'/')));
    check(detailLinks.size === 39, 'all 39 capabilities must be reachable without clicking a load button');
  }
  summaries.push({ path: page.path, title: doc.title, canonical, noIndex: page.noIndex, h1: doc.querySelector('main h1')?.textContent });
  doc.defaultView?.close();
}
const notFound = new JSDOM(readFileSync(resolve(dist, '404.html'), 'utf8')).window.document;
if (!notFound.querySelector('meta[name="robots"]')?.getAttribute('content')?.includes('noindex')) failures.push('404 must be noindex');
const caddy = readFileSync(resolve(dist, 'site-hosting.caddy'), 'utf8');
if (!caddy.includes('handle_errors 404') || !caddy.includes('status 404') || !caddy.includes('disable_canonical_uris')) failures.push('Caddy HTTP404/canonical handling missing');
if (buildMode.redesign && !buildMode.indexing && !caddy.includes('header X-Robots-Tag "noindex, nofollow"')) failures.push('Caddy candidate must be noindex');
const redirects = readFileSync(resolve(dist, '_redirects'), 'utf8');
if (buildMode.redesign) {
  const paths = new Set(getBuildPages(buildMode).map(page => page.path));
  for (const [source, destination] of Object.entries(redesignRedirects)) {
    if (!redirects.split('\n').includes(`${source} ${destination} 301`) || paths.has(source) || !paths.has(destination)) failures.push(`Invalid migration redirect: ${source}`);
  }
  const headers = readFileSync(resolve(dist, '_headers'), 'utf8');
  if (!buildMode.indexing && !headers.startsWith('/*\n  X-Robots-Tag: noindex, nofollow')) failures.push('Candidate release must have a site-wide noindex header');
}
for (const prefix of authenticatedPrefixes) if (!redirects.includes(`${prefix}/* /spa.html 200`)) failures.push(`Authenticated SPA route lost: ${prefix}`);
if (!redirects.trim().endsWith('/* /404.html 404')) failures.push('HTTP 404 fallback missing');
const report = { generatedAt: new Date().toISOString(), buildMode, scope: 'Built static HTML parsed with JavaScript disabled; hosting rules inspected, not a live CDN audit', publicUrls: expected.length, brandOriginals, stagedUrls: getBuildPages(buildMode).filter(page => page.noIndex).length, failures, warnings, routes: summaries };
writeFileSync(resolve(dist, 'seo-report.json'), JSON.stringify(report, null, 2));
console.log(`SEO static audit: ${summaries.length} pages, ${failures.length} failures, ${warnings.length} warnings`);
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }

if (buildMode.redesign) assertBuildSiteLocaleCoverage();
