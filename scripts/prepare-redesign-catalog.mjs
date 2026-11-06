/** Extract reviewed data and compile original vector art to JSX. No reference JS ships to the browser. */
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { referenceContext, referenceAssets, svgToJsx, writeScopedCss } from './redesign-source.mjs';

const source = referenceAssets;
const ctx = await referenceContext();
const blocks = JSON.parse(await fs.readFile(`${source}/blocks.json`, 'utf8')).map(({ slug, name, category, status, tagline, source }) => ({ slug, name, category, status, tagline, source }));
const domains = JSON.parse(vm.runInContext('JSON.stringify(B_DOMAINS)', ctx));
const stories = JSON.parse(vm.runInContext('JSON.stringify(B_STORIES)', ctx));
const products = JSON.parse(vm.runInContext('JSON.stringify(C_PRODUCTS)', ctx)).map(({ slug, name, category, principle, title, blocks }) => ({ slug, name, category, principle, title, blocks }));
if (blocks.length !== 39 || blocks.some(block => !stories[block.slug])) throw new Error('Catalog coverage differs from the reviewed baseline.');
await fs.mkdir('src/redesign/data', { recursive: true });
await fs.writeFile('src/redesign/data/catalog.json', JSON.stringify({ source: 'N01 / v1.1 / 2026-10-22; editorial snapshot, not live service verification', blocks, domains, stories, products }, null, 2) + '\n');

const jsx = svgToJsx;
const glyphs = Object.keys(domains).map(domain => `${JSON.stringify(domain)}: () => (${jsx(vm.runInContext(`bGlyph(${JSON.stringify(domain)})`, ctx))})`);
await fs.writeFile('src/redesign/CatalogArt.tsx', `// Generated from N01 by scripts/prepare-redesign-catalog.mjs. Preserve the original geometry.\nconst glyphs = {\n${glyphs.join(',\n')}\n};\nexport function CatalogGlyph({ domain }: { domain: string }) { const Glyph = glyphs[domain as keyof typeof glyphs] ?? glyphs.Plataforma; return <Glyph />; }\nexport function LibraryArt() { return (${jsx(vm.runInContext('bLibraryArt()', ctx))}); }\n`);

await writeScopedCss({ file: 'platform', output: 'src/redesign/catalog-reference.css', prefix: 'c-catalog', owner: /\.(building-blocks-page|building-detail|business-detail|bd-[\w-]+)\b/, ownerRoot: ':where(.building-blocks-page,.building-detail)' });
await writeScopedCss({ file: 'mobile', output: 'src/redesign/catalog-mobile-reference.css', prefix: 'c-catalog-mobile', owner: /\.(building-blocks-page|building-detail|business-detail|bd-[\w-]+)\b/, ownerRoot: ':where(.building-blocks-page,.building-detail)' });
console.log(JSON.stringify({ blocks: blocks.length, stories: Object.keys(stories).length, domains: Object.keys(domains).length, products: products.length }));
