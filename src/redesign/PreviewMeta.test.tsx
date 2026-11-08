import{afterEach,describe,expect,it,vi}from'vitest';
import{cleanup,render}from'@testing-library/react';
import{MemoryRouter}from'react-router-dom';
import{PreviewMeta}from'./PreviewMeta';
import{getRedesignPage}from'../seo/redesign';
import{enabledSiteLocales,siteLocaleInfo}from'../../shared/site-locale';
import{localizeSitePath}from'./i18n/routes';
import{installSiteMessages}from'./i18n/runtime';
const mode=vi.hoisted(()=>({release:true,indexing:true}));
vi.mock('./preview',()=>({get redesignRelease(){return mode.release;},get redesignIndexing(){return mode.indexing;}}));
afterEach(()=>{cleanup();document.head.innerHTML='';document.documentElement.lang='';mode.release=true;mode.indexing=true;});
function meta(name:string){return document.head.querySelector<HTMLMetaElement>(`meta[${name.startsWith('og:')?'property':'name'}="${name}"]`)?.content;}
function mount(path:string){return render(<MemoryRouter initialEntries={[path]}><PreviewMeta title="Fallback"/></MemoryRouter>);}

describe('localized native document metadata',()=>{
 it.each([
  ['/perspectivas/construir-por-composicao','pt-BR'],
  ['/en/perspectives/building-by-composition','en-US'],
 ])('keeps %s canonical and emits the syndicated BlogPosting in the document head',(path,locale)=>{
  mount(path);
  const canonical='https://catalisa.io'+path;
  expect(document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(canonical);
  const graph=JSON.parse(document.head.querySelector('script[type="application/ld+json"]')!.textContent!);
  const postings=graph['@graph'].filter((node:Record<string,unknown>)=>node['@type']==='BlogPosting');
  expect(postings).toHaveLength(1);
  expect(postings[0]).toMatchObject({
   url:canonical,mainEntityOfPage:canonical,inLanguage:locale,
   author:{'@type':'Person',name:'Klederson Bueno'},publisher:{'@id':'https://catalisa.io/#organization'},
   sameAs:[
    'https://www.linkedin.com/feed/update/urn:li:activity:7524442037891543041/',
    'https://www.linkedin.com/feed/update/urn:li:share:7524441529097281537/?actorCompanyId=88375615',
    'https://x.com/catalisaio/status/2118678368094744899',
   ],
  });
  expect(graph['@graph'].find((node:Record<string,unknown>)=>node['@id']===postings[0].publisher['@id'])).toMatchObject({'@type':'Organization',name:'Catalisa'});
 });
 it.each(['/perspectivas/autonomia-responsabilidade','/en/perspectives/autonomy-and-responsibility'])('does not invent syndication for %s',path=>{
  mount(path);
  const graph=JSON.parse(document.head.querySelector('script[type="application/ld+json"]')!.textContent!);
  const posting=graph['@graph'].find((node:Record<string,unknown>)=>node['@type']==='BlogPosting');
  expect(posting).toBeDefined();expect(posting).not.toHaveProperty('sameAs');
 });
 it('uses the actual localized route, language, OG image and reciprocal same-page alternates',()=>{
  const source=getRedesignPage('/contato')!;installSiteMessages('de-DE',{[source.title]:'Kontakt | Catalisa',[source.description]:'Sprechen Sie mit Catalisa.'});
  mount('/de/kontakt');expect(document.title).toBe('Kontakt | Catalisa');expect(document.documentElement.lang).toBe('de-DE');expect(meta('description')).toBe('Sprechen Sie mit Catalisa.');expect(meta('og:locale')).toBe('de_DE');expect(meta('og:image')).toBe('https://catalisa.io/og/redesign/de/contato.png');expect(meta('robots')).toContain('index, follow');
  expect(document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe('https://catalisa.io/de/kontakt');
  expect(document.head.querySelectorAll('link[hreflang]')).toHaveLength(enabledSiteLocales.length+1);
  for(const locale of enabledSiteLocales)expect(document.head.querySelector<HTMLLinkElement>(`link[hreflang="${siteLocaleInfo[locale].hreflang}"]`)?.href).toBe('https://catalisa.io'+localizeSitePath('/contato',locale));
  expect(document.head.querySelector<HTMLLinkElement>('link[hreflang="x-default"]')?.href).toBe('https://catalisa.io/contato');
  const graph=JSON.parse(document.head.querySelector('script[type="application/ld+json"]')!.textContent!);
  expect(graph['@graph'].find((node:Record<string,unknown>)=>node['@type']==='WebPage')).toMatchObject({inLanguage:'de-DE',url:'https://catalisa.io/de/kontakt'});
 });
 it('keeps a real translated staging page noindex without advertising alternates',()=>{
  mode.indexing=false;mount('/es/contacto');expect(document.documentElement.lang).toBe('es-ES');expect(meta('robots')).toBe('noindex, nofollow');expect(document.head.querySelectorAll('link[hreflang]')).toHaveLength(0);
 });
 it('keeps the localized design system and unknown routes noindex',()=>{
  const first=mount('/de/designsystem');expect(meta('robots')).toBe('noindex, nofollow');expect(document.head.querySelectorAll('link[hreflang]')).toHaveLength(0);first.unmount();
  mount('/de/unknown');expect(document.documentElement.lang).toBe('de-DE');expect(meta('robots')).toBe('noindex, nofollow');expect(document.head.querySelectorAll('link[hreflang]')).toHaveLength(0);
 });
 it('restores the exact previous head nodes, document language and title on unmount',()=>{
  document.title='Previous title';document.documentElement.lang='nl-NL';const previous=document.createElement('meta');previous.name='description';previous.content='Previous description';document.head.append(previous);
  const view=mount('/contato');expect(previous.isConnected).toBe(false);view.unmount();expect(document.head.querySelector('meta[name="description"]')).toBe(previous);expect(document.title).toBe('Previous title');expect(document.documentElement.lang).toBe('nl-NL');
 });
});
