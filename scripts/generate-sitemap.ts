import {installBuildSiteLocales, assertBuildSiteLocaleCoverage} from './site-locales';
import { getArtifactBuildMode } from './site-build-mode';
const buildMode = getArtifactBuildMode();
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BASE_URL } from '../src/seo/routes';
import { getPublicPages, renderSitemap } from '../src/seo/build-pages';

if (buildMode.redesign) installBuildSiteLocales();
const outPath = resolve(process.env.SITE_DIST_DIR || 'dist', 'sitemap.xml');
writeFileSync(outPath, renderSitemap(BASE_URL, buildMode));
console.log(`Sitemap: ${getPublicPages(buildMode).length} public URLs, staged/private routes excluded (${outPath})`);

if (buildMode.redesign) assertBuildSiteLocaleCoverage();
