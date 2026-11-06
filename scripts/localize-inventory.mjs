import fs from'node:fs/promises';import path from'node:path';import{createHash}from'node:crypto';
import{analyzeSource,humanText,preserveTechnicalNames,getPreservedTechnicalNames}from'./localize-source.mjs';
import{tsImport}from'tsx/esm/api';

const root=path.resolve('src/redesign'),output=path.resolve(process.argv.find(x=>x.startsWith('--output='))?.slice(9)||'docs/redesign-2026-10-22/qa/localization');
const technicalKeys=new Set(['id','slug','path','route','referenceRoute','href','src','file','url','origin','method','source','sourceSection','sourceRoute','sourceFile','selector','className','tone','kind','code','schema','request','response','contract','contracts','bodySchema','nextScreenId','blockSlugs','ref','statusCode','checksum','mimeType','sha','sha256','hash','provenance','stem','color','shape','product','topics','requestBody']);
const renderOnlyKeys=new Set(['category','status','domain','name']);
const sourceFiles=(await fs.readdir(root)).filter(file=>/\.(tsx?|jsx?)$/.test(file)&&!file.includes('.test.')&&file!=='preview.ts').map(file=>path.join(root,file));
const related=['src/analytics/AnalyticsConsent.tsx','src/seo/redesign.ts',...['privacy','terms'].flatMap(name=>['pt-BR','en-US'].map(locale=>'src/i18n/locales/'+locale+'/'+name+'.json'))];
const serverFiles=(await fs.readdir('server/site')).filter(file=>file.endsWith('.ts')&&!file.endsWith('.test.ts')).map(file=>'server/site/'+file);
const catalog=new Map(),files=[],review=[],preserved=[];
const sourceCatalog=JSON.parse(await fs.readFile(path.join(root,'data/catalog.json'),'utf8'));preserveTechnicalNames([...sourceCatalog.blocks.flatMap(block=>[block.name,block.slug]),...sourceCatalog.products.flatMap(product=>[product.name,product.slug])]);
function add(entry){if(!humanText(entry.text))return;const text=entry.text.trim();let record=catalog.get(text);if(!record){record={id:'text_'+createHash('sha256').update(text).digest('hex').slice(0,16),source:text,occurrences:[]};catalog.set(text,record);}record.occurrences.push({...entry,text:undefined});}
for(const file of [...sourceFiles,...related.filter(x=>/\.[jt]sx?$/.test(x)),...serverFiles]){
 const source=await fs.readFile(file,'utf8'),relative=path.relative(process.cwd(),file);const parsed=analyzeSource(source,relative,{allowTransform:!relative.startsWith('server/')});
 parsed.entries.forEach(add);review.push(...parsed.review);files.push({file:relative,sha256:createHash('sha256').update(source).digest('hex'),entries:parsed.entries.length,proposedEdits:parsed.edits.length,scope:relative.startsWith('server/')?'error-messages-inventory-only':'native-or-shared-display'});
}
const jsonFiles=[...(await fs.readdir(path.join(root,'data'))).filter(file=>file.endsWith('.json')).map(file=>path.join(root,'data',file)),...related.filter(x=>x.endsWith('.json')&&x.includes('/pt-BR/'))];
function inspectJson(value,file,segments=[],blocked=false){
 const key=segments.at(-1)??'',nextBlocked=blocked||technicalKeys.has(key)||(key==='blocks'&&Array.isArray(value)&&value.every(entry=>typeof entry==='string'))||(key==='body'&&value&&typeof value==='object');
 if(typeof value==='string'){
  if(nextBlocked||!humanText(value)){if(value.trim())preserved.push({file,path:segments.join('.'),reason:nextBlocked?'technical/provenance-or-contract':'nontext-or-proper-name'});return;}
  add({text:value,kind:renderOnlyKeys.has(key)?'json-render-only':'json-display',file,jsonPath:segments.join('.')});return;
 }
 if(Array.isArray(value)){for(let index=0;index<value.length;index++)inspectJson(value[index],file,[...segments,String(index)],nextBlocked);return;}
 if(value&&typeof value==='object')for(const[child,entry]of Object.entries(value))inspectJson(entry,file,[...segments,child],nextBlocked);
}
for(const file of jsonFiles){const source=await fs.readFile(file,'utf8');inspectJson(JSON.parse(source),path.relative(process.cwd(),file));files.push({file:path.relative(process.cwd(),file),sha256:createHash('sha256').update(source).digest('hex'),scope:'display-data'});}
// Include actual composed titles/descriptions, including the39 capability
// titles and editorial suffixes. This imports pure metadata only, never React.
const{redesignPages}=await tsImport('../src/seo/redesign.ts',import.meta.url);
for(const page of redesignPages)for(const key of ['title','description'])add({text:page[key],kind:'computed-seo',file:'src/seo/redesign.ts',route:page.path,field:key});
const messages=[...catalog.values()].sort((a,b)=>a.id.localeCompare(b.id));const occurrences=messages.reduce((sum,entry)=>sum+entry.occurrences.length,0);
const report={generatedAt:new Date().toISOString(),sourceLocale:'pt-BR',scope:'Native public site JSX/UI attributes/messages plus display JSON, native SEO and public legal text. Server files contribute user-facing error strings only. No live visitor content, panel/building-block application, private training/presentation translation, DOM mutation, build, browser or deployment.',uniqueMessages:messages.length,occurrences,wordCount:messages.reduce((sum,entry)=>sum+entry.source.split(/\s+/).length,0),files,messages,review,preservedCount:preserved.length,preserved,limits:['Literal coverage is a source inventory, not proof every rendered value is localized.','JSON category/status/domain/name values require translation at render time when used as logic keys or names.','Imported JSON must be localized explicitly; no existing import was modified.','Dynamic generated concepts and user messages retain their original content; generation language/error localization need integration.','Source sentence fragments around explicit line breaks require contextual translation and four-width visual review.','Locale dictionaries and legal translation review are not provided by this extraction.']};
await fs.mkdir(output,{recursive:true});await fs.writeFile(path.join(output,'source-catalog.json'),JSON.stringify(report,null,2)+'\n');await fs.writeFile(path.join(output,'source-messages.json'),JSON.stringify(Object.fromEntries(messages.map(entry=>[entry.source,''])),null,2)+'\n');
await fs.mkdir(path.join(root,'i18n'),{recursive:true});await fs.writeFile(path.join(root,'i18n/technical-terms.json'),JSON.stringify(getPreservedTechnicalNames(),null,2)+'\n');
console.log(JSON.stringify({output,uniqueMessages:messages.length,occurrences,wordCount:report.wordCount,files:files.length,manualReview:review.length,existingComponentsChanged:false}));
