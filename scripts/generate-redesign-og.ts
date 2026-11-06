import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { redesignPages, getRedesignImage, getRedesignPage } from '../src/seo/redesign';
import {getBuildPages} from '../src/seo/build-pages';
import {getArtifactBuildMode} from './site-build-mode';
import {installBuildSiteLocales,assertBuildSiteLocaleCoverage} from './site-locales';

const dist = resolve(process.env.SITE_DIST_DIR || 'dist');
const mode = getArtifactBuildMode(dist);
if(mode.redesign)installBuildSiteLocales();
const pages = mode.redesign ? getBuildPages(mode).filter(page=>page.staged).map(page=>{const localized=getRedesignPage(page.path);if(!localized)throw new Error('Missing localized OG definition: '+page.path);return localized;}) : redesignPages;
const logo = await sharp(readFileSync('public/redesign/brand/catalisa-logo-principal.svg')).resize({ width: 245 }).png().toBuffer();
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function lines(value: string, max = 36) {
  const output: string[] = []; let line = '';
  for (const word of value.split(/\s+/)) { if ((line + ' ' + word).trim().length > max && line) { output.push(line); line = word; } else line = (line + ' ' + word).trim(); }
  if (line) output.push(line); return output;
}
for (const page of pages) {
  const title = page.title.replace(/ \| Catalisa$/, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#F4F0E8"/><rect x="1040" width="160" height="630" fill="#734B9C"/><circle cx="1120" cy="520" r="42" fill="#FDC234"/><path d="M1060 160h120M1120 100v120" stroke="#F4F0E8" stroke-width="2"/><text fill="#171320" font-family="sans-serif" font-size="54" font-weight="700">${lines(title).slice(0, 4).map((line, i) => `<tspan x="64" y="${240 + i * 68}">${escape(line)}</tspan>`).join('')}</text><text x="64" y="565" fill="#734B9C" font-family="monospace" font-size="22">catalisa.io</text></svg>`;
  const output = resolve(dist, '.' + getRedesignImage(page)); mkdirSync(resolve(output, '..'), { recursive: true });
  writeFileSync(output, await sharp(Buffer.from(svg)).composite([{ input: logo, left: 64, top: 62 }]).png().toBuffer());
}
console.log(`Social images: ${pages.length} localized pages, official Catalisa mark, 1200×630`);

if(mode.redesign)assertBuildSiteLocaleCoverage();
