import fs from 'node:fs/promises';
import vm from 'node:vm';
import { referenceContext, svgToJsx, writeScopedCss } from './redesign-source.mjs';

const ctx = await referenceContext(['connection/architecture.js', 'connection/about.js', 'connection/experience.js']);
const verticals = JSON.parse(vm.runInContext('JSON.stringify(A_VERTICALS)', ctx));
await fs.writeFile('src/redesign/data/architecture.json', JSON.stringify(verticals, null, 2) + '\n');
const functions = [
  ['VisionSculpture', 'vSculpture()'], ['ArchitectureAssembly', 'aSvg("hero")'],
  ['ReuseArt', 'aSvg("reuse")'], ['AdapterArt', 'aSvg("adapter")'], ['LabInvitationArt', 'lArt()'],
  ...verticals.map((_, index) => [`Composition${index}`, `aCompositionMap(${index})`]),
].map(([name, expression]) => `export function ${name}() { return (${svgToJsx(vm.runInContext(expression, ctx))}); }`);
await fs.writeFile('src/redesign/FoundationArt.tsx', `// Generated from the reviewed N01 vector art. No reference JavaScript runs in the browser.\nimport type { CSSProperties } from 'react';\n${functions.join('\n\n')}\nexport const compositionArt = [${verticals.map((_, index) => `Composition${index}`).join(', ')}];\n`);
await writeScopedCss({ file: 'about', output: 'src/redesign/vision-reference.css', prefix: 'c-vision', owner: /\.v-page\b/, ownerRoot: '.v-page' });
await writeScopedCss({ file: 'architecture', output: 'src/redesign/architecture-reference.css', prefix: 'c-architecture', owner: /\.a-page\b/, ownerRoot: '.a-page' });
console.log(JSON.stringify({ verticals: verticals.length, art: functions.length, families: ['Visão', 'Arquitetura'] }));
