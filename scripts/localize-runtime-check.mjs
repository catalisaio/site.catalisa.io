/** Lightweight isolated runtime checks. No browser, application build or network. */
import fs from'node:fs/promises';import vm from'node:vm';import assert from'node:assert/strict';import{transform}from'esbuild';import{tsImport}from'tsx/esm/api';
const info=await tsImport('../shared/site-locale.ts',import.meta.url),terms=JSON.parse(await fs.readFile('src/redesign/i18n/technical-terms.json','utf8'));
const source=await fs.readFile('src/redesign/i18n/runtime.ts','utf8'),javascript=await transform(source,{loader:'ts',format:'esm',target:'es2022'});
let enLoads=0,finishGerman;const loaders={
 './locales/en-US.json':async()=>{enLoads++;return{'Uma ideia':'An idea','Olá, {value0}':'Hello, {value0}','Produção':'Production','Rótulo':'Label'};},
 './locales/de-DE.json':()=>new Promise(resolve=>{finishGerman=()=>resolve({'Uma ideia':'Eine Idee'});}),
};
const context=vm.createContext({});const runtime=new vm.SourceTextModule(javascript.code,{context,initializeImportMeta(meta){meta.env={MODE:'test'};meta.glob=()=>loaders;}});
await runtime.link(specifier=>{
 if(specifier.includes('shared/site-locale'))return new vm.SyntheticModule(['enabledSiteLocales'],function(){this.setExport('enabledSiteLocales',info.enabledSiteLocales);},{context});
 if(specifier==='./locales/pt-BR.json')return new vm.SyntheticModule(['default'],function(){this.setExport('default',{messages:{}});},{context});
 if(specifier==='./technical-terms.json')return new vm.SyntheticModule(['default'],function(){this.setExport('default',terms);},{context});
 throw Error('Unexpected runtime dependency '+specifier);
});await runtime.evaluate();const api=runtime.namespace,checks=[];
assert.equal(api.t('  Uma ideia  '),'  Uma ideia  ');assert.equal(api.getLoadedSiteLocale(),'pt-BR');checks.push('PT source preserves text and whitespace');
await Promise.all([api.loadSiteLocale('en-US'),api.loadSiteLocale('en-US')]);assert.equal(enLoads,1);assert.equal(api.t('  Uma ideia  '),'  An idea  ');assert.equal(api.t('Olá, {value0}',{value0:'Luna'}),'Hello, Luna');checks.push('Lazy dictionary loaded once; padding and interpolation preserved');
const data=vm.runInContext('({id:"wpp",name:"WPP",category:"Produção",status:"Produção",title:"Uma ideia",request:{title:"Uma ideia"},steps:["01","wpp","Rótulo"]})',context),before=JSON.stringify(data),localized=api.localizeData(data);
assert.equal(localized.title,'An idea');assert.equal(localized.id,'wpp');assert.equal(localized.category,'Produção');assert.equal(localized.status,'Produção');assert.equal(localized.name,'WPP');assert.equal(localized.request.title,'Uma ideia');assert.deepEqual(Array.from(localized.steps),['01','wpp','Label']);assert.equal(JSON.stringify(data),before);assert.equal(api.localizeData(data),localized);checks.push('Display data localized without mutation; logic keys, slugs, names and contracts stay exact');
assert.equal(api.t('wpp'),'wpp');assert.equal(api.getMissingSiteTranslations().length,0);api.t('Mensagem ausente');assert.deepEqual(Array.from(api.getMissingSiteTranslations()),['Mensagem ausente']);checks.push('Missing display message reported to QA; technical values are not false misses');
await assert.rejects(api.loadSiteLocale('lb-LU'),/not enabled/);assert.equal(api.getLoadedSiteLocale(),'en-US');await assert.rejects(api.loadSiteLocale('nl-NL'),/dictionary is missing/);assert.equal(api.getLoadedSiteLocale(),'en-US');checks.push('Disabled and missing dictionaries reject instead of activating a fake localized route');
const german=api.loadSiteLocale('de-DE');await api.loadSiteLocale('pt-BR');finishGerman();await german;assert.equal(api.getLoadedSiteLocale(),'pt-BR');checks.push('Late dictionary response cannot override a newer language selection');
api.installSiteMessages('nl-NL',{'Uma ideia':'Een idee'});assert.equal(api.translateForLocale('nl-NL','Uma ideia'),'Een idee');assert.equal(api.getLoadedSiteLocale(),'pt-BR');checks.push('Build metadata translates explicitly without changing the active browser locale');
const report={checkedAt:new Date().toISOString(),passed:true,scope:'Actual TypeScript runtime transpiled in an isolated VM with the Vite import.meta.glob boundary supplied by test dictionaries. No DOM mutation, browser, network, build, source-component change or deployment.',checks};await fs.writeFile('docs/redesign-2026-10-22/qa/localization/runtime-check.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
