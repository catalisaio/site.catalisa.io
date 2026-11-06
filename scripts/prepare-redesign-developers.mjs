import fs from 'node:fs/promises';
import vm from 'node:vm';
import { referenceContext, svgToJsx, writeScopedCss } from './redesign-source.mjs';

const ctx = await referenceContext(['connection/developers.js']);
const modes = JSON.parse(vm.runInContext('JSON.stringify(D_MODES)', ctx));
const calls = JSON.parse(vm.runInContext('JSON.stringify(D_CALLS)', ctx));
const examples = calls.map((_, index) => ({ curl: vm.runInContext(`dCode(${index},"curl")`, ctx), JavaScript: vm.runInContext(`dCode(${index},"JavaScript")`, ctx) }));
await fs.writeFile('src/redesign/data/developers.json', JSON.stringify({ modes, calls, examples, source: 'N01 v1.1; examples from documentation, not requests exercised against an installed environment.' }, null, 2) + '\n');
const maps = modes.map((_, index) => `function DeveloperMap${index}() { return (${svgToJsx(vm.runInContext(`dMap(${index})`, ctx))}); }`);
await fs.writeFile('src/redesign/DeveloperArt.tsx', `// Generated from the N01 adoption diagrams.\n${maps.join('\n')}\nexport const developerMaps = [${modes.map((_, index) => `DeveloperMap${index}`).join(', ')}];\n`);
await writeScopedCss({ file: 'developers', output: 'src/redesign/developers-reference.css', prefix: 'c-developers', owner: /\.d-page\b/, ownerRoot: '.d-page' });
console.log(JSON.stringify({ modes: modes.length, endpointExamples: calls.length, languages: 2 }));
