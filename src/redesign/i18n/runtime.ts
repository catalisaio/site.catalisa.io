/// <reference types="vite/client" />
import{enabledSiteLocales}from'../../../shared/site-locale';
import type{SiteLocale}from'../../../shared/site-locale';
import technicalTerms from'./technical-terms.json';
import portugueseEditorial from'./locales/pt-BR.json';

export type SiteMessages=Readonly<Record<string,string>>;
export interface SiteDictionary{locale?:SiteLocale;sourceLocale?:'pt-BR';messages:SiteMessages}
type DictionaryFile=SiteMessages|SiteDictionary;
// Vite replaces the glob at build time; pure Node metadata scripts can import
// this module and install dictionaries themselves without a browser or node:fs
// being pulled into the frontend graph.
const loaders=import.meta.env?import.meta.glob<DictionaryFile>('./locales/*.json',{import:'default'}):{};
const dictionaries=new Map<SiteLocale,SiteMessages>([['pt-BR',portugueseEditorial.messages]]);
const pending=new Map<SiteLocale,Promise<SiteMessages>>();
const missing=new Map<SiteLocale,Set<string>>();
let activeLocale:SiteLocale='pt-BR';
let activation=0;
const preserveValues=new Set(technicalTerms);

export function getLoadedSiteLocale(){return activeLocale;}

export function installSiteMessages(locale:SiteLocale,value:DictionaryFile):void{
 const envelope=value as Partial<SiteDictionary>;
 if(envelope.locale&&envelope.locale!==locale)throw new Error('Site translation dictionary locale mismatch');
 const entries=(envelope.messages&&typeof envelope.messages==='object'?envelope.messages:value)as SiteMessages;
 if(!entries||Array.isArray(entries)||Object.values(entries).some(text=>typeof text!=='string'||!text.trim()))throw new Error('Site translation dictionary contains invalid messages: '+locale);
 dictionaries.set(locale,Object.freeze({...entries}));
}

/** Load BEFORE importing/preparing a localized page. No fetch to translation vendors. */
export async function loadSiteLocale(locale:SiteLocale):Promise<void>{
 if(!enabledSiteLocales.includes(locale))throw new Error('Site locale is not enabled: '+locale);
 const sequence=++activation;
 if(locale==='pt-BR'){activeLocale=locale;return;}
 let messages=dictionaries.get(locale);
 if(!messages){
  let request=pending.get(locale);
  if(!request){
   const loader=loaders['./locales/'+locale+'.json'];
   if(!loader)throw new Error('Site translation dictionary is missing: '+locale);
   request=loader().then(value=>{installSiteMessages(locale,value);return dictionaries.get(locale)!;}).catch(reason=>{pending.delete(locale);throw reason;});pending.set(locale,request);
  }
  messages=await request;
 }
 if(sequence===activation)activeLocale=locale;
}

/** Source text is the stable lookup key. Interpolated values never become keys. */
export function t(source:string,values?:Readonly<Record<string,string|number|null|undefined>>):string{
 return translateForLocale(activeLocale,source,values);
}

/** Node metadata/OG generation can translate explicitly without global locale races. */
export function translateForLocale(locale:SiteLocale,source:string,values?:Readonly<Record<string,string|number|null|undefined>>):string{
 if(preserveValues.has(source.trim()))return source;
 let result=source;
 if(source.trim()){
  const messages=dictionaries.get(locale),key=source.trim();
  const translated=messages?.[source]??messages?.[key];
  if(translated!==undefined)result=(source.match(/^\s*/)?.[0]??'')+translated+(source.match(/\s*$/)?.[0]??'');
  else if(locale!=='pt-BR'){let absent=missing.get(locale);if(!absent){absent=new Set();missing.set(locale,absent);}absent.add(key);}
 }
 if(values)result=result.replace(/\{([a-zA-Z0-9_]+)\}/g,(token,key:string)=>Object.hasOwn(values,key)?String(values[key]??''):token);
 return result;
}

/** Read by QA; never forwards missing text to analytics or an external service. */
export function getMissingSiteTranslations(locale:SiteLocale=activeLocale){return[...(missing.get(locale)??[])];}
export function clearMissingSiteTranslations(locale:SiteLocale=activeLocale){missing.delete(locale);}

const displayKeys=new Set(['label','labels','title','description','desc','intro','heading','headline','tagline','hint','reply','question','focus','note','notes','caption','alt','summary','hypothesis','limitations','limit','principle','problem','action','value','caseTitle','features','body','content','copy','text','detail','details','disclaimer','context','goal','examples','choices','tags','tag','items','steps','benefits','subhead','kicker','empty','message','lead','footnote','input','output','outcome','shared','nodes','tour','blocks','tools','result','specific','keep','failure','shot','roles','tab','missing','person','capabilities','heroIntro','add','middle','badge','quote','start','role','who','evolutionLimits','subtitle','closingCopy','channels','evolutionIntro','linkText','idea','closingTitle','end','expandAll','provider','headingGradient','collapseAll','contactCta','state','lastUpdated','branches']);
const machineKeys=new Set(['id','slug','path','route','referenceRoute','href','src','file','url','origin','method','source','sourceSection','sourceRoute','sourceFile','selector','className','tone','kind','code','schema','request','response','contract','contracts','bodySchema','nextScreenId','blockSlugs','ref','statusCode','checksum','mimeType','category','status','domain','name']);
const localizedCache=new WeakMap<object,Map<SiteLocale,unknown>>();
export interface LocalizeDataOptions{translateKeys?:readonly string[];preserveKeys?:readonly string[]}

/** Explicitly localize frozen display data while preserving structural keys.
 * category/status/name remain stable by default because the catalog uses them
 * as logic keys or product names; use t(value) only where those labels render.
 * Never pass visitor messages, generated concepts, API payloads or user input.
 */
export function localizeData<T>(data:T,options?:LocalizeDataOptions):T{
 if(!data||typeof data!=='object')return data;
 if(!options){const cached=localizedCache.get(data)?.get(activeLocale);if(cached)return cached as T;}
 const translate=new Set([...displayKeys,...options?.translateKeys??[]]),preserve=new Set([...machineKeys,...options?.preserveKeys??[]]);
 for(const key of options?.translateKeys??[])if(!options?.preserveKeys?.includes(key))preserve.delete(key);
 const walk=(value:unknown,key='',blocked=false):unknown=>{
  if(blocked)return value;
  if(typeof value==='string')return translate.has(key)&&/[\p{L}]/u.test(value)&&!preserveValues.has(value.trim())?t(value):value;
  if(Array.isArray(value))return value.map(entry=>walk(entry,key));
  if(value&&typeof value==='object'&&[Object.prototype,null].includes(Object.getPrototypeOf(value)))return Object.fromEntries(Object.entries(value).map(([child,entry])=>[child,walk(entry,child,preserve.has(child)||(child==='body'&&!!entry&&typeof entry==='object'))]));
  return value;
 };
 const result=walk(data)as T;
 if(!options){let cache=localizedCache.get(data);if(!cache){cache=new Map();localizedCache.set(data,cache);}cache.set(activeLocale,result);}
 return result;
}
