import{enabledSiteLocales,validSiteLocale}from'../../../shared/site-locale';
import type{SiteLocale}from'../../../shared/site-locale';
import{siteLocaleInfo}from'../../../shared/site-locale';

/** An explicit language preference is essential UI state, independent of analytics consent. */
export const siteLocaleStorageKey='catalisa_site_locale';
export interface AutoLocaleInput{pathname:string;search?:string;hash?:string;preference?:unknown;languages?:readonly string[];language?:string;intlLocale?:string;userAgent?:string}
export interface AutoLocalePolicy{locales:readonly{locale:SiteLocale;prefix:string;language:string}[];homeAnchors:readonly string[]}
export interface AutoLocaleDecision{locale:SiteLocale;destination?:string}
interface LocalePreferenceStorage{getItem(key:string):string|null;setItem(key:string,value:string):void}
interface LocaleBrowserWindow{localStorage:LocalePreferenceStorage;location:{pathname:string;search:string;hash:string};navigator:{languages?:readonly string[];language?:string;userAgent?:string}}
export const siteAutoLocalePolicy:AutoLocalePolicy={
 locales:enabledSiteLocales.map(locale=>({locale,prefix:siteLocaleInfo[locale].prefix,language:locale.split('-')[0].toLowerCase()})),
 homeAnchors:['c-main','arquitetura'],
};

/** Self-contained on purpose: the exact function is serialized into the head
 * gate, so the first paint and the application cannot disagree about policy.
 * No request, IP lookup, DOM mutation, storage write or external dependency. */
export function autoLocaleDecision(input:AutoLocaleInput,policy:AutoLocalePolicy):AutoLocaleDecision|undefined{
 if(input.pathname!=='/'||/bot|crawl|spider|slurp|bingpreview|facebookexternalhit|facebot|google-inspectiontool|google-extended|chatgpt-user|perplexity-user|whatsapp|telegrambot|linkedinbot|twitterbot/i.test(input.userAgent??''))return undefined;
 let selected:AutoLocalePolicy['locales'][number]|undefined;
 for(const option of policy.locales)if(input.preference===option.locale){selected=option;break;}
 if(!selected){
  const preferences=[...(input.languages??[]),input.language,input.intlLocale];
  for(const preference of preferences){
   if(typeof preference!=='string')continue;
   const normalized=preference.trim().toLowerCase().replace(/_/g,'-');
   if(!/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/.test(normalized))continue;
   const language=normalized.split('-')[0];
   for(const option of policy.locales)if(option.language===language){selected=option;break;}
   if(selected)break;
  }
 }
 if(!selected)for(const option of policy.locales)if(option.locale==='en-US'){selected=option;break;}
 if(!selected)return undefined;
 if(!selected.prefix)return{locale:selected.locale};
 const safeParameters=new URLSearchParams();
 for(const[key,value]of new URLSearchParams(input.search??''))if(/^(?:utm_(?:source|medium|campaign|term|content|id|source_platform|creative_format|marketing_tactic)|gclid|dclid|gbraid|wbraid|msclkid|fbclid)$/.test(key)&&value.length<=1024&&!/[\x00-\x1f\x7f]/.test(value))safeParameters.append(key,value);
 const query=safeParameters.toString();let fragment='';
 if(input.hash){try{const anchor=decodeURIComponent(input.hash.replace(/^#/,''));if(policy.homeAnchors.includes(anchor))fragment='#'+encodeURIComponent(anchor);}catch{/* A malformed fragment cannot become a redirect target. */}}
 return{locale:selected.locale,destination:'/'+selected.prefix+(query?'?'+query:'')+fragment};
}
export function rememberSiteLocale(locale:SiteLocale,storage?:Pick<LocalePreferenceStorage,'setItem'>):boolean{
 if(!validSiteLocale(locale))return false;
 try{const target=storage??(globalThis as unknown as{window?:LocaleBrowserWindow}).window?.localStorage;if(!target)return false;target.setItem(siteLocaleStorageKey,locale);return true;}catch{return false;}
}
export function browserAutoLocaleDecision():AutoLocaleDecision|undefined{
 const browser=(globalThis as unknown as{window?:LocaleBrowserWindow}).window;if(!browser)return undefined;
 let preference:unknown,intlLocale:string|undefined;
 try{preference=browser.localStorage.getItem(siteLocaleStorageKey);}catch{/* Private mode can block storage; machine negotiation still works. */}
 try{intlLocale=Intl.DateTimeFormat().resolvedOptions().locale;}catch{/* Navigator remains available if Intl resolution is unavailable. */}
 return autoLocaleDecision({pathname:browser.location.pathname,search:browser.location.search,hash:browser.location.hash,preference,languages:browser.navigator.languages,language:browser.navigator.language,intlLocale,userAgent:browser.navigator.userAgent},siteAutoLocalePolicy);
}
