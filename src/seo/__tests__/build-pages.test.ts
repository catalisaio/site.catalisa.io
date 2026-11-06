import { describe, expect, it } from 'vitest';
import { getBuildPages, getPublicPages, renderSitemap } from '../build-pages';
import { getRedesignGraph, getRedesignImage, getRedesignPage, redesignPages } from '../redesign';
import {enabledSiteLocales,siteLocaleInfo} from '../../../shared/site-locale';
import {localizeSitePath,siteBasePaths} from '../../redesign/i18n/routes';
import {installSiteMessages} from '../../redesign/i18n/runtime';
import { normalizePath, resolveRoute } from '../routes';
import { getBlogPostingSchema } from '../schemas/article';
import { getSoftwareApplicationSchema } from '../schemas/software';
import { getSiteBuildMode } from '../release';
import { redesignRedirects, isLegacyCompatibilityPath } from '../migration';
import { articles } from '../../data/articles';

describe('Search publication inventory', () => {
  it('contains only unique paths and keeps previews out of the sitemap', () => {
    const all = getBuildPages();
    expect(new Set(all.map(page => page.path)).size).toBe(all.length);
    expect(all.filter(page => page.staged)).toHaveLength(redesignPages.filter(page => page.path !== '/contato'&&!page.nativeLegal).length);
    expect(getPublicPages().some(page => page.path.startsWith('/capacidades'))).toBe(false);
    expect(getPublicPages().some(page => page.path.includes('apresentacao') || page.path.includes('training'))).toBe(false);
  });
  it('overrides only migrated paths and stops advertising noindex translation alternates', () => {
    const pages = getBuildPages();
    expect(pages.find(page => page.path === '/studio')?.noIndex).toBe(true);
    expect(pages.find(page => page.path === '/en/studio')?.noIndex).toBe(false);
    expect(pages.find(page => page.path === '/en/studio')?.alternate).toBeUndefined();
    const sitemap = renderSitemap('https://catalisa.io');
    expect(sitemap).not.toContain('href="https://catalisa.io/studio"');
  });
  it('publishes actual specialist pages and omits the unmounted pricing page', () => {
    const paths = getPublicPages().map(page => page.path);
    expect(paths).toContain('/agentes-ia-whatsapp'); expect(paths).toContain('/transparencia-ia');
    expect(paths).toContain('/determinismo'); expect(paths).not.toContain('/precos');
  });
  it('does not invent an English translation for a Portuguese-only event', () => {
    const xml = new DOMParser().parseFromString(renderSitemap('https://catalisa.io'), 'text/xml');
    const event = [...xml.querySelectorAll('url')].find(node => node.querySelector('loc')?.textContent?.endsWith('/vtex-day-2026'))!;
    expect(event.querySelector('[hreflang="en-US"]')).toBeNull();
    expect(xml.querySelector('lastmod')).toBeNull();
  });
  it('keeps all bilingual alternates reciprocal and in the sitemap', () => {
    const pages = getPublicPages();
    for (const page of pages.filter(item => item.alternate)) expect(pages.find(other => other.path === page.alternate)?.alternate).toBe(page.path);
  });
  it('resolves trailing slashes without canonical duplicates', () => {
    expect(normalizePath('/')).toBe('/'); expect(resolveRoute('/studio/')).toBe(resolveRoute('/studio'));
    expect(getRedesignPage('/capacidades/ai-engine/')?.path).toBe('/capacidades/ai-engine');
  });
  it('assigns unique metadata to all implemented redesign pages', () => {
    expect(new Set(redesignPages.map(page => page.title)).size).toBe(redesignPages.length);
    expect(new Set(redesignPages.map(page => page.description)).size).toBe(redesignPages.length);
    const graph = getRedesignGraph(getRedesignPage('/capacidades')!);
    expect(graph['@graph'].find(node => node['@type'] === 'ItemList')?.numberOfItems).toBe(39);
  });
  it('identifies the actual article language and never fabricates a word count', () => {
    const schema = getBlogPostingSchema(articles[0], 'Title', 'Description', [], 'en-US');
    expect(schema.mainEntityOfPage['@id']).toContain('/en/insights/');
    expect(schema.inLanguage).toBe('en-US'); expect(schema).not.toHaveProperty('wordCount');
  });
  it('does not describe a free demo as a free software price', () => {
    expect(getSoftwareApplicationSchema()).not.toHaveProperty('offers');
  });
  it('attributes the five provided editorials to the organization without inventing publication dates',()=>{
    const articles=redesignPages.filter(page=>page.article);expect(articles).toHaveLength(5);
    for(const page of articles){const article=getRedesignGraph(page)['@graph'].find(item=>item['@type']==='Article')!;expect(article.headline).toBe(page.article?.headline);expect(article.author).toEqual({'@id':'https://catalisa.io/#organization'});expect(article).not.toHaveProperty('datePublished');expect(article).not.toHaveProperty('dateModified');}
  });
});


describe('Controlled redesign release', () => {
  const staging = getSiteBuildMode({VITE_SITE_RELEASE: 'redesign'});
  const production = getSiteBuildMode({VITE_SITE_RELEASE: 'redesign', VITE_SITE_INDEXING: 'enabled', CONTEXT: 'production'});
  it('keeps the default build and unapproved release indexing closed', () => {
    expect(getSiteBuildMode({})).toEqual({redesign: false, indexing: false});
    expect(getSiteBuildMode({VITE_SITE_RELEASE: 'redesign', VITE_SITE_INDEXING: 'enabled', CONTEXT: 'deploy-preview'}).indexing).toBe(false);
    expect(getPublicPages(staging)).toEqual([]);
    expect(getBuildPages(staging).find(page => page.path === '/')?.staged).toBe(true);
  });
  it('indexes native content only in the explicitly enabled production artifact', () => {
    const pages = getPublicPages(production);
    for (const path of ['/', '/contato', '/lab', '/capacidades', '/perspectivas']) expect(pages.some(page => page.path === path)).toBe(true);
    expect(pages.some(page => page.path.startsWith('/design-system'))).toBe(false);
    for (const source of Object.keys(redesignRedirects)) expect(pages.some(page => page.path === source)).toBe(false);
    expect(renderSitemap('https://catalisa.io', production)).not.toContain('/design-system/home');
  });
  it('preserves bilingual archives and specialist content while legal/institutional pages become native', () => {
    const pages = getBuildPages(production);
    for (const path of ['/en/insights', '/insights', '/agentes-ia-whatsapp']) expect(pages.some(page => page.path === path && !page.staged)).toBe(true);
    for (const path of ['/en','/en/studio','/politica-privacidade','/termos'])expect(pages.some(page=>page.path===path&&page.staged)).toBe(true);
    for (const path of ['/en/training/intro', '/treinamento/login', '/apresentacao/i/invite', '/en/presentation/commercial']) expect(isLegacyCompatibilityPath(path)).toBe(true);
    expect(isLegacyCompatibilityPath('/contato')).toBe(false);
    expect(isLegacyCompatibilityPath('/rota-desconhecida')).toBe(false);
  });
  it('redirects only to native destinations, with no chains or loops', () => {
    const pages = getBuildPages(production);
    for (const [source, target] of Object.entries(redesignRedirects)) {
      expect(target).not.toBe(source); expect(redesignRedirects[target]).toBeUndefined();
      expect(pages.find(page => page.path === target)?.staged).toBe(true);
    }
  });
  it('advertises only same-subject authored native translations and retains reciprocal archive pairs', () => {
    const pages = getPublicPages(production);
    expect(pages.some(page=>page.path==='/en/building-blocks')).toBe(false);
    for(const path of['/en','/en/studio','/en/capabilities','/en/contact'])expect(pages.find(page=>page.path===path)?.alternates?.['pt-BR']).toBeDefined();
    for (const page of pages.filter(page => page.alternate)) expect(pages.find(other => other.path === page.alternate)?.alternate).toBe(page.path);
    const home = getRedesignGraph(getRedesignPage('/')!);
    expect(home['@graph'].find(node => node['@type'] === 'WebPage')?.url).toBe('https://catalisa.io/');
  });
  it('includes exactly one native route per implemented base and enabled language, with reciprocal hreflang',()=>{
    const native=getBuildPages(production).filter(page=>page.staged);
    expect(native).toHaveLength(siteBasePaths.length*enabledSiteLocales.length);
    for(const base of siteBasePaths)for(const locale of enabledSiteLocales){
      const path=localizeSitePath(base,locale),page=native.find(item=>item.path===path)!;
      expect(page).toMatchObject({lang:locale,basePath:base,noIndex:base==='/design-system'});
      if(page.noIndex){expect(page.alternates).toBeUndefined();continue;}
      expect(page.alternates?.['x-default']).toBe(localizeSitePath(base,'pt-BR'));
      for(const target of enabledSiteLocales){const other=native.find(item=>item.path===page.alternates?.[siteLocaleInfo[target].hreflang]);expect(other?.basePath).toBe(base);expect(other?.alternates).toEqual(page.alternates);}
    }
    expect(native.some(page=>page.path==='/design-system/home')).toBe(false);
    expect(getBuildPages(production).some(page=>/^\/(de|es|da|nl|fr)\/(insights|playbooks)/.test(page.path))).toBe(false);
  });
  it('keeps all native translations noindex and without alternates in a staging artifact',()=>{
    const native=getBuildPages(staging).filter(page=>page.staged);
    expect(native).toHaveLength(siteBasePaths.length*enabledSiteLocales.length);
    expect(native.every(page=>page.noIndex&&!page.alternates)).toBe(true);
  });
  it('writes native sitemap alternates for the same subject and omits every localized design system',()=>{
    const xml=new DOMParser().parseFromString(renderSitemap('https://catalisa.io',production),'text/xml');
    const urls=[...xml.querySelectorAll('url')];
    for(const locale of enabledSiteLocales){const path=localizeSitePath('/contato',locale),node=urls.find(node=>node.querySelector('loc')?.textContent==='https://catalisa.io'+path)!;expect(node.querySelectorAll('[rel="alternate"]')).toHaveLength(enabledSiteLocales.length+1);expect(node.querySelector('[hreflang="x-default"]')?.getAttribute('href')).toBe('https://catalisa.io/contato');expect(urls.some(node=>node.querySelector('loc')?.textContent==='https://catalisa.io'+localizeSitePath('/design-system',locale))).toBe(false);}
  });
});

describe('Explicit locale native metadata',()=>{
 it('resolves localized paths and aliases without translating an archive',()=>{
  expect(getRedesignPage('/en/building-blocks/')).toMatchObject({path:'/en/capabilities',basePath:'/capacidades',locale:'en-US'});
  expect(getRedesignPage('/en/insights')).toBeUndefined();
  expect(getRedesignPage('/de/unknown')).toBeUndefined();
  expect(getRedesignPage('/politica-privacidade')).toMatchObject({nativeLegal:true,locale:'pt-BR'});
  expect(getRedesignPage('/en/terms')).toMatchObject({nativeLegal:true,basePath:'/termos',locale:'en-US'});
  expect(getRedesignPage('/ecossistema/med')?.title).toMatch(/^Saúde:/);
  expect(getRedesignPage('/ecossistema/biometrics')?.title).toMatch(/^Biometria:/);
 });
 it('uses explicitly installed translations in page metadata, articles and localized graph links',()=>{
  const source=getRedesignPage('/perspectivas/regra-legivel')!;
  installSiteMessages('de-DE',{[source.title]:'Lesbare Regeln | Catalisa',[source.description]:'Beschreibung der dokumentierten Regeln.',[source.article!.headline]:'Lesbare Regeln','Perspectivas':'Perspektiven','Building blocks':'Bausteine'});
  const path=localizeSitePath(source.basePath!,'de-DE'),page=getRedesignPage(path)!;
  expect(page).toMatchObject({path,basePath:source.basePath,locale:'de-DE',title:'Lesbare Regeln | Catalisa',article:{headline:'Lesbare Regeln'}});
  const graph=getRedesignGraph(page)['@graph'];
  expect(graph.find(node=>node['@type']==='WebPage')).toMatchObject({url:'https://catalisa.io'+path,inLanguage:'de-DE',name:page.title,description:page.description});
  expect(graph.find(node=>node['@type']==='Article')).toMatchObject({headline:'Lesbare Regeln',inLanguage:'de-DE'});
  const crumbs=graph.find(node=>node['@type']==='BreadcrumbList')!.itemListElement as {item:string}[];
  expect(crumbs.map(crumb=>crumb.item)).toEqual(['https://catalisa.io/de','https://catalisa.io/de/perspektiven','https://catalisa.io'+path]);
  expect(graph.find(node=>node['@type']==='Organization')).toEqual(getRedesignGraph(source)['@graph'].find(node=>node['@type']==='Organization'));
 });
 it('localizes every catalog URL and image path while preserving technical names and the original PT asset paths',()=>{
  const page=getRedesignPage('/de/faehigkeiten')!,graph=getRedesignGraph(page)['@graph'];
  const list=graph.find(node=>node['@type']==='ItemList')!;expect(list.numberOfItems).toBe(39);
  expect((list.itemListElement as {url:string}[]).every(item=>item.url.startsWith('https://catalisa.io/de/faehigkeiten/'))).toBe(true);
  expect(getRedesignImage(getRedesignPage('/')!)).toBe('/og/redesign/design-system-home.png');
  expect(getRedesignImage(getRedesignPage('/capacidades/ai-engine')!)).toBe('/og/redesign/capacidades-ai-engine.png');
  expect(getRedesignImage(getRedesignPage('/de/faehigkeiten/ai-engine')!)).toBe('/og/redesign/de/capacidades-ai-engine.png');
 });
 it('includes the product directory in every native-language inventory without adding availability or offer claims',()=>{
  expect(siteBasePaths.length).toBe(redesignPages.length);
  for(const locale of enabledSiteLocales){const path=localizeSitePath('/produtos',locale),page=getRedesignPage(path)!;expect(page).toMatchObject({basePath:'/produtos',locale,type:'CollectionPage'});const graph=getRedesignGraph(page)['@graph'],list=graph.find(node=>node['@type']==='ItemList')!;expect(list.numberOfItems).toBe(6);expect((list.itemListElement as {url:string}[]).every(item=>item.url.startsWith('https://catalisa.io'+localizeSitePath('/ecossistema',locale)+'/'))).toBe(true);expect(JSON.stringify(graph)).not.toMatch(/"(?:offers|availability|price)"/);}
 });
});
