import fs from 'node:fs/promises';
import path from 'node:path';
import {init,parse} from 'es-module-lexer';
const argument=name=>process.argv.find(value=>value.startsWith('--'+name+'='))?.slice(name.length+3);
const directory=path.resolve(argument('dist')||'/tmp/catalisa-production-candidate');
const output=path.resolve(argument('output')||'docs/redesign-2026-10-22/qa/production-artifact/native-bundle.json');
await init;
const scripts=new Map();
for(const name of await fs.readdir(path.join(directory,'assets'))){if(!name.endsWith('.js'))continue;const file='assets/'+name,code=await fs.readFile(path.join(directory,file),'utf8');const [imports,exports]=parse(code);scripts.set(file,{code,imports,exports:exports.map(item=>typeof item==='string'?item:item.n)});}
const shell=await fs.readFile(path.join(directory,'spa.html'),'utf8');
const entry=shell.match(/<script\b[^>]*type="module"[^>]*src="([^"]+)"/)?.[1].replace(/^\//,'');
if(!entry||!scripts.has(entry))throw Error('Missing current HTML module entry');
// Prior immutable chunks may coexist for tabs opened before a release. Identify
// the native application imported by the CURRENT entry, not a retained one.
const entryImports=new Set(scripts.get(entry).imports.filter(item=>item.d>=0&&item.n?.startsWith('.')).map(item=>path.posix.normalize(path.posix.join(path.posix.dirname(entry),item.n))));
const native=[...scripts].filter(([file,data])=>entryImports.has(file)&&data.exports.includes('prepareInitialRoute')).map(([file])=>file);
if(native.length!==1)throw Error('Expected exactly one independently prepared native application');
const relative=(file,specifier)=>specifier?.startsWith('.')?path.posix.normalize(path.posix.join(path.posix.dirname(file),specifier)):undefined;
const pageRoots=scripts.get(native[0]).imports.filter(item=>item.d>=0&&item.n).map(item=>relative(native[0],item.n)).filter(Boolean);
function closure(roots){const visited=new Set(),pending=[...roots];while(pending.length){const file=pending.pop();if(visited.has(file))continue;const data=scripts.get(file);if(!data)throw Error('Missing JavaScript dependency: '+file);visited.add(file);for(const item of data.imports.filter(item=>item.d===-1)){const next=relative(file,item.n);if(next)pending.push(next);}}return [...visited].sort();}
const initial=closure([entry,native[0]]),allNative=closure([entry,native[0],...pageRoots]);
// Rollup can optimize a dynamically imported default to an internal namespace
// export. Identify the preserved App chunk by its emitted module and framework,
// rather than assuming that optimized namespace still exports the word default.
const legacy=[...scripts].filter(([file,data])=>/^assets\/App-/.test(file)&&!native.includes(file)&&data.code.includes('ChakraProvider')).map(([file])=>file);
if(!legacy.length)throw Error('Preserved compatibility app missing from the output');
const failures=[];
for(const file of allNative){if(legacy.includes(file))failures.push({file,issue:'Native static graph imports the compatibility application'});if(/ChakraProvider|@emotion\/react|framer-motion|react-i18next/.test(scripts.get(file).code))failures.push({file,issue:'Legacy framework marker in native static dependency graph'});}
const report={generatedAt:new Date().toISOString(),passed:failures.length===0,entry,nativeApp:native[0],preservedLegacyApps:legacy,initialStaticGraph:initial,nativeLazyPageRoots:pageRoots,allNativeStaticGraph:allNative,failures,scope:'ES module lexer traverses emitted static imports from bootstrap, independently prepared native app and its lazy page modules. Confirms preserved legacy app is outside that graph and checks framework markers. Browser network and measured transfer remain separate acceptance evidence.'};
await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,JSON.stringify(report,null,2));
console.info(JSON.stringify({passed:report.passed,initialChunks:initial.length,nativePageChunks:pageRoots.length,allNativeStaticChunks:allNative.length,failures}));if(failures.length)process.exitCode=1;
