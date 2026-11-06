import{useEffect}from'react';
import{useLocation}from'react-router-dom';
import{BASE_URL,normalizePath}from'../seo/routes';
import{getRedesignAlternates,getRedesignGraph,getRedesignImage,getRedesignPage}from'../seo/redesign';
import{redesignRelease,redesignIndexing}from'./preview';
import{getSiteLocale,parseSitePath}from'./i18n/routes';
import{translateForLocale}from'./i18n/runtime';

/** Native metadata never mounts the legacy app/theme. Staging stays noindex. */
export function PreviewMeta({title}:{title:string}){
 const{pathname}=useLocation();
 useEffect(()=>{
  const previousTitle=document.title,previousLang=document.documentElement.lang;
  const selector='meta[name="description"],meta[name="robots"],meta[name="keywords"],meta[name^="twitter:"],meta[property^="og:"],meta[property^="article:"],link[rel="canonical"],link[hreflang],script[type="application/ld+json"]';
  const previous=[...document.head.querySelectorAll(selector)];previous.forEach(node=>node.remove());
  const page=getRedesignPage(pathname),parsed=parseSitePath(pathname),locale=page?.locale??getSiteLocale(pathname);
  const resolvedTitle=page?.title??`${title} — Catalisa`;
  const description=page?.description??translateForLocale(locale,'Esta página não está disponível. Explore os caminhos da plataforma Catalisa.');
  const canonicalPath=redesignRelease?(page?.path??parsed?.canonicalPath??normalizePath(pathname)):normalizePath(pathname);
  const url=BASE_URL+canonicalPath,image=BASE_URL+(page?getRedesignImage(page):'/og/default.png');
  const nodes:HTMLElement[]=[];
  const meta=(name:string,content:string)=>{const node=document.createElement('meta');node.setAttribute(name.startsWith('og:')?'property':'name',name);node.content=content;node.dataset.redesignHead='';nodes.push(node);};
  document.title=resolvedTitle;document.documentElement.lang=locale;
  const indexable=redesignRelease&&redesignIndexing&&!!page&&page.basePath!=='/design-system';
  meta('robots',indexable?'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1':'noindex, nofollow');
  meta('description',description);
  for(const[name,value]of Object.entries({title:resolvedTitle,description,url,type:page?.article?'article':'website',site_name:'Catalisa',locale:locale.replace('-','_'),image,'image:alt':resolvedTitle}))meta(`og:${name}`,value);
  meta('twitter:card','summary_large_image');meta('twitter:title',resolvedTitle);meta('twitter:description',description);meta('twitter:image',image);meta('twitter:image:alt',resolvedTitle);meta('og:image:secure_url',image);meta('og:image:width','1200');meta('og:image:height','630');meta('og:image:type','image/png');
  const canonical=document.createElement('link');canonical.rel='canonical';canonical.href=url;canonical.dataset.redesignHead='';nodes.push(canonical);
  if(indexable&&page?.basePath){for(const[lang,path]of Object.entries(getRedesignAlternates(page.basePath))){const alternate=document.createElement('link');alternate.rel='alternate';alternate.hreflang=lang;alternate.href=BASE_URL+path;alternate.dataset.redesignHead='';nodes.push(alternate);}}
  if(page){const data=document.createElement('script');data.type='application/ld+json';data.textContent=JSON.stringify(getRedesignGraph(page));data.dataset.redesignHead='';nodes.push(data);}
  document.head.append(...nodes);
  return()=>{nodes.forEach(node=>node.remove());document.head.append(...previous);document.title=previousTitle;document.documentElement.lang=previousLang;};
 },[title,pathname]);
 return null;
}
