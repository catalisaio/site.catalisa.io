import {installBuildSiteLocales, assertBuildSiteLocaleCoverage} from './site-locales';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderCaddyHosting } from '../src/seo/hosting';
import { getBuildPages } from '../src/seo/build-pages';
import { authenticatedPrefixes, permanentAliases, redesignRedirects } from '../src/seo/migration';
import { getArtifactBuildMode } from './site-build-mode';

const dist = resolve(process.env.SITE_DIST_DIR || 'dist');
const mode = getArtifactBuildMode();
if (mode.redesign) installBuildSiteLocales();
const redirects = {...permanentAliases, ...(mode.redesign ? redesignRedirects : {})};
// No forced redirects: private/application paths retain their SPA shell and unknown paths return 404.
const rules = [
  ...Object.entries(redirects).flatMap(([from, to]) => [`${from} ${to} 301`, `${from}/ ${to} 301`]),
  ...authenticatedPrefixes.flatMap(path => [`${path} /spa.html 200`, `${path}/* /spa.html 200`]),
  '/* /404.html 404',
];
writeFileSync(resolve(dist, '_redirects'), rules.join('\n') + '\n');
const globalNoIndex = (mode.redesign && !mode.indexing) || (!!process.env.CONTEXT && process.env.CONTEXT !== 'production');
const headers = globalNoIndex ? '/*\n  X-Robots-Tag: noindex, nofollow\n' : getBuildPages(mode).filter(page => page.noIndex).flatMap(page => [page.path, ...(page.path === '/' ? [] : [page.path + '/'])]).map(path => `${path}\n  X-Robots-Tag: noindex, nofollow\n`).join('\n');
writeFileSync(resolve(dist, '_headers'), headers);
const inventory = getBuildPages(mode);
writeFileSync(resolve(dist, 'site-hosting.caddy'), renderCaddyHosting(mode, inventory, redirects, globalNoIndex));
writeFileSync(resolve(dist, 'release-routes.json'), JSON.stringify({
  mode, redirects,
  native: inventory.filter(page => page.staged).map(page => page.path),
  localizedPages: inventory.filter(page=>page.staged).map(({path,basePath,lang})=>({path,basePath,lang})),
  compatibility: inventory.filter(page => !page.staged).map(page => page.path),
  authenticatedPrefixes,
  strategy: 'Localized native site in enabled languages; authenticated applications and unmigrated PT/EN archives retain isolated compatibility navigation. No invented archive translations or archive-to-home redirects.',
}, null, 2) + '\n');
console.log(`Hosting: ${Object.keys(redirects).length} permanent aliases, isolated authenticated paths, HTTP 404; redesign=${mode.redesign}, indexing=${mode.indexing}`);

if (mode.redesign) assertBuildSiteLocaleCoverage();
