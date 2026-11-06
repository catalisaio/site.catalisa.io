import { build } from 'esbuild';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const directory = resolve(process.env.SITE_SERVER_DIST_DIR || '.local/site/server-dist');
await mkdir(directory, { recursive: true });
// Bundle application code/JSON; only runtime packages are installed in the candidate.
const result = await build({ entryPoints: ['server/site/standalone.ts'], outfile: resolve(directory, 'site-server.mjs'), platform: 'node', target: 'node22', format: 'esm', bundle: true, packages: 'external', metafile: true, sourcemap: false });
const external = [...new Set(Object.values(result.metafile.outputs).flatMap(output => output.imports.filter(item => item.external && !item.path.startsWith('node:')).map(item => item.path.split('/').slice(0, item.path.startsWith('@') ? 2 : 1).join('/'))))];
const source = JSON.parse(await (await import('node:fs/promises')).readFile('package.json', 'utf8'));
const lock=JSON.parse(await readFile('package-lock.json','utf8'));
const dependencies = Object.fromEntries(external.map(name => { const range = source.dependencies[name]; if (!range) throw Error('Runtime dependency absent: ' + name); const pinned = lock.packages?.['node_modules/'+name]?.version; if (!pinned) throw Error('Runtime dependency absent from lock: '+name); return [name, pinned]; }));
await writeFile(resolve(directory, 'package.json'), JSON.stringify({ private: true, type: 'module', engines: { node: '>=22.16' }, dependencies }, null, 2) + '\n');
console.info(JSON.stringify({ directory, runtimeDependencies: external }));
