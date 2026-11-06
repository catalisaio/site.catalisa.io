import fs from'node:fs/promises';import path from'node:path';import{parse}from'@babel/parser';import traverseModule from'@babel/traverse';import{analyzeSource,applySourceEdits,humanText,preserveTechnicalNames}from'./localize-source.mjs';
const traverse=traverseModule.default??traverseModule,root='src/redesign';
// One-time migration: the current result and incremental catalog are already
// reviewed. Re-extract from source instead of replaying over translated arrays.
if(!process.argv.includes('--apply')){console.log('Static editorial migration already applied; inspect source-additions.json and run the runtime/coverage checks.');process.exit(0);}
try{await fs.access('docs/redesign-2026-10-22/qa/localization/source-additions.json');throw Error('Incremental catalog exists; refusing to replay this one-time migration.');}catch(error){if(error.code!=='ENOENT')throw error;}
const technical=JSON.parse(await fs.readFile(root+'/i18n/technical-terms.json','utf8'));preserveTechnicalNames([...technical,'c.','payments','credit']);
const frozen=JSON.parse(await fs.readFile('docs/redesign-2026-10-22/qa/localization/source-catalog.json','utf8')),known=new Set(frozen.messages.map(x=>x.source)),additions=new Map();
const add=(source,file,kind)=>{source=source.trim();if(!humanText(source)||known.has(source))return;if(!additions.has(source))additions.set(source,{source,occurrences:[]});additions.get(source).occurrences.push({file,kind});};
const arrays={Architecture:['buildSteps','layers'],Developers:['recipes','checks'],Vision:['principles'],components:['platformLinks'],Styleguide:['colors','families'],ContactConcept:['tabs'],LabResult:['tabs']};
const changes=[];
for(const file of(await fs.readdir(root)).filter(x=>/\.[tj]sx?$/.test(x)&&!/(\.test\.|^App\.|^PreviewMeta\.|^preview\.)/.test(x))){
 const full=root+'/'+file;let source=await fs.readFile(full,'utf8'),output=source;
 const fix=(from,to)=>{if(!output.includes(from))throw Error(file+' missing '+from);output=output.replaceAll(from,to);};
 if(file==='Contact.tsx'){fix('intro:__siteT("idea")',"intro:'idea'");fix('focus:__siteT("goal")',"focus:'goal'");}
 const analysis=analyzeSource(output,full);for(const e of analysis.entries)if(e.kind!=='already-translated')add(e.text,full,e.kind);output=applySourceEdits(output,analysis.edits,'./i18n/runtime');
 const ast=parse(output,{sourceType:'module',plugins:['typescript','jsx']}),edits=[];
 traverse(ast,{StringLiteral(p){if(!humanText(p.node.value))return;const declaration=p.findParent(x=>x.isVariableDeclarator()&&arrays[file.replace(/\.[^.]+$/,'')]?.includes(x.node.id.name));if(!declaration)return;if(p.findParent(x=>x.isCallExpression()&&x.node.callee.name==='__siteT'))return;
 // Tab tuples contain persistent UI identifiers in their first column.
 if(declaration.node.id.name==='tabs'&&p.parentPath.isArrayExpression()&&p.parentPath.node.elements[0]===p.node)return;
 edits.push({start:p.node.start,end:p.node.end,text:'__siteT('+JSON.stringify(p.node.value)+')'});add(p.node.value,full,'static-editorial-array');
 }});output=applySourceEdits(output,edits,'./i18n/runtime');
 if(file==='Capabilities.tsx'){
  fix("'production' : ''}`}>{value}","'production' : ''}`}>{__siteT(value)}");
  fix('${block.name} ${block.tagline} ${block.category}','${block.name} ${block.tagline} ${block.category} ${__siteT(block.category)}');
  fix('<strong>{name}</strong>','<strong>{__siteT(name)}</strong>');fix('<option key={name}>{name}</option>','<option key={name} value={name}>{__siteT(name)}</option>');
  fix('>{block.category}', '>{__siteT(block.category)}');fix('>{product.category}', '>{__siteT(product.category)}');
 }
 if(file==='Architecture.tsx'){fix('>{item.name}', '>{__siteT(item.name)}');fix('>{d.name} / Contexto de negócio', '>{__siteT(d.name)} / {__siteT("Contexto de negócio")}');add('Contexto de negócio',full,'render-label');}
 if(file==='Banking.tsx')fix('>{position.status}', '>{__siteT(position.status)}');
 if(file==='ContactConcept.tsx'){fix('{content.title} / conceito','{content.title} / {__siteT("conceito")}');fix("{entry?.status||__siteT(\"Consultar catálogo\")}","{entry?.status?__siteT(entry.status):__siteT(\"Consultar catálogo\")}");add('conceito',full,'render-label');}
 if(file==='LabResult.tsx'){fix("example.kind+' / Composição demonstrativa'",'__siteT(example.kind)+" / "+__siteT("Composição demonstrativa")');add('Composição demonstrativa',full,'render-label');}
 if(file==='operation-components.tsx'){fix('const captures=__siteData(__siteBase_captures);','const captures=__siteData(__siteBase_captures,{translateKeys:["type","origin"]});');fix('{current?.type} / Referência de interface','{current?.type} / {__siteT("Referência de interface")}');add('Referência de interface',full,'render-label');}
 if(['Banking.tsx','Credit.tsx'].includes(file))fix('const captures=__siteData(__siteBase_captures);','const captures=__siteData(__siteBase_captures,{translateKeys:["type","origin"]});');
 if(file==='Developers.tsx'){fix('aria-label={`Exemplo ${example.name} em ${language}`}','aria-label={__siteT("Exemplo {value0} em {value1}",{value0:example.name,value1:language})}');add('Exemplo {value0} em {value1}',full,'ui-template');}
 parse(output,{sourceType:'module',plugins:['typescript','jsx']});if(source!==output){await fs.writeFile(full,output);changes.push(file);}
}
for(const file of['operation-captures.json','financial-captures.json']){const data=JSON.parse(await fs.readFile(root+'/data/'+file,'utf8'));for(const item of data){if(item.origin)add(item.origin,root+'/data/'+file,'capture-origin');}}
for(const file of['lab.json']){const data=JSON.parse(await fs.readFile(root+'/data/'+file,'utf8'));const walk=x=>{if(!x||typeof x!=='object')return;if(typeof x.kind==='string')add(x.kind,root+'/data/'+file,'render-kind');for(const v of Object.values(x))walk(v);};walk(data);}
const messages=[...additions.values()].sort((a,b)=>a.source.localeCompare(b.source,'pt-BR'));const report={generatedAt:new Date().toISOString(),baseCatalogMessages:known.size,uniqueMessages:messages.length,scope:'Incremental native static editorial/UI source additions; frozen source-catalog.json unchanged.',messages};
await fs.writeFile('docs/redesign-2026-10-22/qa/localization/source-additions.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({changed:changes.length,files:changes,additions:messages.length}));
