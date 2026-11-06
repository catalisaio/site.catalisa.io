import{useEffect,useId,useRef,useState}from'react';
import{useLocation}from'react-router-dom';
import{siteLocaleInfo}from'../../../shared/site-locale';
import type{SiteLocale}from'../../../shared/site-locale';
import{localeLabel,localizeSitePath,parseSitePath,supportedSiteLocales}from'./routes';
import{t}from'./runtime';
import{rememberSiteLocale}from'./auto-locale';
import'./language-picker.css';

const publicTrackingParameters=new Set(['utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id','utm_source_platform','utm_creative_format','utm_marketing_tactic']);
export interface LanguageSwitchLocation{pathname:string;search?:string;hash?:string}
/** Retain public campaign attribution and existing shared anchors. Session,
 * concept, preview and authentication parameters never cross language links. */
export function languageSwitchHref(location:LanguageSwitchLocation,locale:SiteLocale,hasAnchor:(id:string)=>boolean=()=>false):string|undefined{
 const parsed=parseSitePath(location.pathname);if(!parsed)return undefined;
 const parameters=new URLSearchParams();for(const[key,value]of new URLSearchParams(location.search))if(publicTrackingParameters.has(key))parameters.append(key,value);
 let hash='';if(location.hash){try{const id=decodeURIComponent(location.hash.replace(/^#/,''));if(id&&hasAnchor(id))hash='#'+encodeURIComponent(id);}catch{/* Invalid fragments are discarded. */}}
 const query=parameters.toString();return localizeSitePath(parsed.basePath,locale)+(query?'?'+query:'')+hash;
}

/** Full-document language navigation keeps module-initialized editorial data
 * aligned with the dictionary loaded during bootstrap. */
export function LanguagePicker({className='',onOpen}:{className?:string;onOpen?:()=>void}){
 const location=useLocation(),parsed=parseSitePath(location.pathname),id=useId();
 const[open,setOpen]=useState(false),root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null),list=useRef<HTMLElement>(null);
 const locale=parsed?.locale??'pt-BR';
 function close(returnFocus=false){setOpen(false);if(returnFocus)trigger.current?.focus();}
 useEffect(()=>{
  if(!open)return;
  list.current?.querySelector<HTMLAnchorElement>('a[aria-current="page"]')?.focus({preventScroll:true});
  function outside(event:PointerEvent){if(event.target instanceof Node&&!root.current?.contains(event.target))setOpen(false);}
  function keydown(event:KeyboardEvent){if(event.key==='Escape'){event.preventDefault();setOpen(false);trigger.current?.focus();}}
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',keydown);
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',keydown);};
 },[open]);
 useEffect(()=>{setOpen(false);},[location.pathname]);
 if(!parsed)return null;
 return <div className={'c-language-picker'+(className?' '+className:'')} ref={root} onBlur={event=>{if(event.relatedTarget instanceof Node&&!event.currentTarget.contains(event.relatedTarget))close();}}>
  <button ref={trigger} type="button" className="c-language-trigger" aria-label={t('Escolher idioma')+' ('+localeLabel(locale)+')'} aria-expanded={open} aria-controls={open?id:undefined} onClick={()=>{if(!open)onOpen?.();setOpen(value=>!value);}} onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();onOpen?.();setOpen(true);}}}><span aria-hidden="true">{siteLocaleInfo[locale].prefix.toUpperCase()||'PT'}</span><svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12"><path d="m3 4.5 3 3 3-3"/></svg></button>
  {open&&<nav id={id} className="c-language-options" aria-label={t('Idiomas disponíveis')} ref={list}><ul>{supportedSiteLocales.map(target=><li key={target}><a href={languageSwitchHref(location,target,id=>!!document.getElementById(id))} hrefLang={siteLocaleInfo[target].hreflang} lang={target} onClick={()=>rememberSiteLocale(target)} onAuxClick={event=>{if(event.button===1)rememberSiteLocale(target);}} aria-current={target===locale?'page':undefined}><span>{localeLabel(target)}</span><span className="c-language-check" aria-hidden="true">{target===locale?'✓':''}</span></a></li>)}</ul></nav>}
 </div>;
}
