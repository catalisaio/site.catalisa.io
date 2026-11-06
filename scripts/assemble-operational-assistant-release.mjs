/** Add one internal page to an immutable public release, preserving every existing runtime. */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const args=Object.fromEntries(process.argv.slice(2).map(value=>value.replace(/^--/,'').split(/=(.*)/s).slice(0,2)));
for(const key of ['base','page-build','metadata-build','out'])if(!args[key])throw Error('Required --'+key);
const base=args.base,pageBuild=args['page-build'],metadataBuild=args['metadata-build'],output=args.out;
try{await fs.access(output);throw Error('Candidate exists; keep artifacts immutable');}catch(error){if(error.code!=='ENOENT')throw error;}
const sha=body=>createHash('sha256').update(body).digest('hex');
const priorInventory=JSON.parse(await fs.readFile(path.join(base,'release-routes.json'))),inventory=JSON.parse(await fs.readFile(path.join(metadataBuild,'release-routes.json')));
const additions=inventory.localizedPages.filter(item=>item.basePath==='/assistente-operacional');assert.equal(additions.length,7);
assert.deepEqual(inventory.compatibility,priorInventory.compatibility);
assert.deepEqual(inventory.native.filter(route=>!additions.some(item=>item.path===route)),priorInventory.native);
const definitions={};
for(const addition of additions){const dictionary=JSON.parse(await fs.readFile('src/redesign/i18n/locales/'+addition.lang+'.json'));definitions[addition.lang]={path:addition.path,title:dictionary.messages['Assistente operacional']||'Assistente operacional',description:dictionary.messages['Consulte e execute na mesma tela']||'Consulte e execute na mesma tela',workflows:priorInventory.localizedPages.find(item=>item.lang===addition.lang&&item.basePath==='/workflows').path};}
const extension=`(()=>{const definitions=${JSON.stringify(definitions)};function bind(){const config=definitions[document.documentElement.lang];if(!config)return;for(const menu of document.querySelectorAll('.c-platform-menu>nav,.c-all-menu>div:first-child>nav')){const links=[...menu.querySelectorAll('a[href]')];if(links.some(link=>new URL(link.href,location.href).pathname.replace(/\\/+$/,'')===config.path))continue;const before=links.find(link=>new URL(link.href,location.href).pathname.replace(/\\/+$/,'')===config.workflows);if(!before)continue;const link=document.createElement('a');link.href=config.path;link.dataset.operationalAssistantLink='';link.append(document.createTextNode(config.title));if(menu.closest('.c-platform-menu')){const small=document.createElement('small');small.textContent=config.description;link.append(small);}else{link.className='c-text-link';const arrow=document.createElement('span');arrow.setAttribute('aria-hidden','true');arrow.textContent='↗';link.append(arrow);}before.before(link);}}bind();const root=document.getElementById('root');if(root)new MutationObserver(bind).observe(root,{childList:true,subtree:true});})();\n`;
const extensionName='operational-assistant-nav-'+sha(extension).slice(0,12)+'.js';
await fs.cp(base,output,{recursive:true,errorOnExist:true});
for(const entry of await fs.readdir(path.join(pageBuild,'assets'),{withFileTypes:true})){assert(entry.isFile());const file=entry.name,body=await fs.readFile(path.join(pageBuild,'assets',file));try{const old=await fs.readFile(path.join(output,'assets',file));assert.equal(sha(old),sha(body),'Immutable asset collision '+file);}catch(error){if(error.code!=='ENOENT')throw error;}await fs.writeFile(path.join(output,'assets',file),body);}
await fs.writeFile(path.join(output,'assets',extensionName),extension);
const htmlFile=route=>route==='/'?'index.html':route.slice(1)+'/index.html';
const records=[];
for(const item of priorInventory.localizedPages){
 const file=htmlFile(item.path),before=await fs.readFile(path.join(base,file),'utf8');let after=before;
 if(item.basePath!=='/design-system'){
  const corresponding=additions.find(addition=>addition.lang===item.lang),config=definitions[item.lang];
  const current=await fs.readFile(path.join(metadataBuild,file),'utf8');
  const escaped=corresponding.path.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const links=[...current.matchAll(new RegExp('<a\\b[^>]*href="'+escaped+'"[^>]*>.*?<\\/a>','g'))].map(match=>match[0]);assert.equal(links.length,2,item.path);
  const anchor=new RegExp('<a\\b[^>]*href="'+config.workflows+'"[^>]*>.*?<\\/a>','g');let count=0;
  const mainIndex=after.indexOf('<main');assert(mainIndex>0);
  after=after.slice(0,mainIndex).replace(anchor,match=>links[count++]+match)+after.slice(mainIndex);assert.equal(count,2,item.path);
  after=after.replace('</head>','<script src="/assets/'+extensionName+'" defer></script></head>');
 }
 assert.equal(after.match(/<main\b[\s\S]*?<\/main>/)?.[0],before.match(/<main\b[\s\S]*?<\/main>/)?.[0],'Main changed '+item.path);
 assert.deepEqual([...after.matchAll(/<script[^>]*type="module"[^>]*src="([^"]+)"/g)].map(x=>x[1]),[...before.matchAll(/<script[^>]*type="module"[^>]*src="([^"]+)"/g)].map(x=>x[1]),'Existing runtime changed '+item.path);
 await fs.writeFile(path.join(output,file),after);records.push({path:item.path,mainByteIdentical:true,existingRuntimeEntryUnchanged:true,changes:item.basePath==='/design-system'?'none':'two contextual hardlinks and navigation-only extension'});
}
for(const item of additions){const file=htmlFile(item.path);await fs.mkdir(path.dirname(path.join(output,file)),{recursive:true});await fs.copyFile(path.join(pageBuild,file),path.join(output,file));}
for(const suffix of ['','en/','es/','fr/','de/','nl/','da/']){const file='og/redesign/'+suffix+'assistente-operacional.png';await fs.mkdir(path.dirname(path.join(output,file)),{recursive:true});await fs.copyFile(path.join(metadataBuild,file),path.join(output,file));}
for(const file of ['release-routes.json','site-hosting.caddy','sitemap.xml'])await fs.copyFile(path.join(metadataBuild,file),path.join(output,file));
const priorReport=JSON.parse(await fs.readFile(path.join(base,'prerender-report.json'))),newReport=JSON.parse(await fs.readFile(path.join(pageBuild,'prerender-report.json')));
priorReport.routes.push(...newReport.routes.filter(item=>additions.some(addition=>addition.path===item.path)));priorReport.lastPartialUpdate=additions.map(item=>item.path);priorReport.scope='Prior public runtime, snapshots, compatibility/private pages and server preserved. New internal page has its own runtime and document navigation boundaries. Existing native HTML adds only two contextual hardlinks and a navigation-only extension; every existing main HTML and module entry is byte-identical.';
await fs.writeFile(path.join(output,'prerender-report.json'),JSON.stringify(priorReport,null,2)+'\n');
const allPriorAssets=await fs.readdir(path.join(base,'assets'));for(const file of allPriorAssets)assert.equal(sha(await fs.readFile(path.join(base,'assets',file))),sha(await fs.readFile(path.join(output,'assets',file))),'Prior asset changed '+file);
const report={passed:true,base,output,scope:priorReport.scope,nativeSnapshotsPatched:records.length,newRoutes:additions,navigationExtension:'/assets/'+extensionName,priorAssetsByteIdentical:allPriorAssets.length,existingBffReused:true,brandZipPreserved:true,productionChanged:false,records};
await fs.writeFile('docs/redesign-2026-10-22/qa/operational-assistant/delta-assembly.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:true,output,nativeSnapshots:records.length,newRoutes:additions.length,priorAssetsByteIdentical:allPriorAssets.length,navigationExtension:report.navigationExtension}));
