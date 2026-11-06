import fs from'node:fs/promises';import path from'node:path';import{createHash}from'node:crypto';import{tsImport}from'tsx/esm/api';
const option=(name,fallback)=>process.argv.find(value=>value.startsWith('--'+name+'='))?.slice(name.length+3)||fallback;
const catalogPath=option('source','docs/redesign-2026-10-22/qa/localization/source-catalog.json'),directory=path.resolve(option('dir','src/redesign/i18n/locales'));
const raw=await fs.readFile(catalogPath,'utf8'),catalog=JSON.parse(raw),{enabledSiteLocales}=await tsImport('../shared/site-locale.ts',import.meta.url);
const extra=option('extra',''),sourceDirectory=path.dirname(catalogPath);
const additionsPaths=extra?extra.split(','):(await fs.readdir(sourceDirectory)).filter(file=>/^source(?:-[a-z]+)*-additions\.json$/.test(file)).sort().map(file=>path.join(sourceDirectory,file));
for(const additionsPath of additionsPaths){const additions=JSON.parse(await fs.readFile(additionsPath,'utf8'));catalog.messages=[...new Map([...catalog.messages,...additions.messages].map(message=>[message.source,message])).values()];}
const requested=option('locales','').split(',').filter(Boolean),locales=requested.length?requested:enabledSiteLocales.filter(locale=>locale!=='pt-BR');
const placeholders=value=>[...value.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map(match=>match[1]).sort();
const urls=value=>[...value.matchAll(/https?:\/\/[^\s"'<>]+/g)].map(match=>match[0].replace(/[.,;:)]*$/,'')).sort();
const emails=value=>[...value.matchAll(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g)].map(match=>match[0]).sort();
const tags=value=>[...value.matchAll(/<\/?[A-Za-z][^>]*>/g)].map(match=>match[0]).sort();
const results=[];
for(const locale of locales){
 let dictionary;try{dictionary=JSON.parse(await fs.readFile(path.join(directory,locale+'.json'),'utf8'));}catch{results.push({locale,passed:false,missingDictionary:true,required:catalog.messages.length});continue;}
 if(dictionary.messages)dictionary=dictionary.messages;
 const failures=[];let translated=0;
 for(const{source}of catalog.messages){const target=dictionary[source];if(typeof target!=='string'||!target.trim()){failures.push({check:'missing',source});continue;}translated++;
  if(JSON.stringify(placeholders(source))!==JSON.stringify(placeholders(target)))failures.push({check:'placeholder_mismatch',source});
  if(JSON.stringify(urls(source))!==JSON.stringify(urls(target)))failures.push({check:'url_changed',source});
  const illustrativeEmail=source==='voce@empresa.com'&&/^[\w.+-]+@example\.com$/.test(target);
  if(!illustrativeEmail&&JSON.stringify(emails(source))!==JSON.stringify(emails(target)))failures.push({check:'email_changed',source});
  if(JSON.stringify(tags(source))!==JSON.stringify(tags(target)))failures.push({check:'html_markup_changed',source});
  if(source.includes('Catalisa')&&!target.includes('Catalisa'))failures.push({check:'brand_name_changed',source});
 }
 results.push({locale,passed:failures.length===0,required:catalog.messages.length,translated,coverage:translated/catalog.messages.length,failures:failures.length,examples:failures.slice(0,25)});
}
const report={generatedAt:new Date().toISOString(),passed:results.every(result=>result.passed),scope:'Dictionary completeness and placeholders/URLs/Catalisa checks against the frozen source catalog. Does not certify translation quality, rendered dynamic text, visual fit, legal approval or hreflang/indexing.',sourceSha256:createHash('sha256').update(raw).digest('hex'),results};const output=option('output','docs/redesign-2026-10-22/qa/localization/coverage.json');await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));if(!report.passed)process.exitCode=1;
