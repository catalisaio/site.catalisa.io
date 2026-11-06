import { routes, normalizePath } from './routes';
import { getSiteBuildMode, type SiteBuildMode } from './release';
import { redesignRedirects } from './migration';
import { redesignPages, getRedesignAlternates } from './redesign';
import { articleSlugs } from '../data/articles';
import { playbookIds } from '../data/playbook-ids';
import {enabledSiteLocales} from '../../shared/site-locale';
import type {SiteLocale} from '../../shared/site-locale';
import {localizeSitePath,siteBasePaths} from '../redesign/i18n/routes';

export interface BuildPage {
  path: string;
  lang: SiteLocale;
  /** Existing bilingual archive partner, never a new-site translation. */
  alternate?: string;
  /** Reciprocal same-subject native translations keyed by hreflang. */
  alternates?: Record<string,string>;
  basePath?: string;
  noIndex: boolean;
  staged?: boolean;
}

/** One build inventory for HTML, sitemap and hosting. Dictionary installation
 * and completeness are separate required build gates before publication. */
export function getBuildPages(mode: SiteBuildMode = getSiteBuildMode({})): BuildPage[] {
  const pages: BuildPage[] = [];
  const addPair = (ptPath: string, enPath: string) => {
    pages.push({ path: ptPath, lang: 'pt-BR', alternate: ptPath === enPath ? undefined : enPath, noIndex: false });
    if (enPath !== ptPath) pages.push({ path: enPath, lang: 'en-US', alternate: ptPath, noIndex: false });
  };
  routes.filter(route => !route.noIndex).forEach(route => addPair(route.ptPath, route.enPath));
  articleSlugs.forEach(slug => addPair(`/insights/${slug}`, `/en/insights/${slug}`));
  playbookIds.forEach(id => addPair(`/playbooks/${id}`, `/en/playbooks/${id}`));
  const unique = new Map(pages.map(page => [normalizePath(page.path), page]));
  if (unique.size !== pages.length) throw new Error('Duplicate public SEO build paths');
  if (new Set(redesignPages.map(page => normalizePath(page.path))).size !== redesignPages.length) throw new Error('Duplicate redesign paths');
  if(mode.redesign){
    const sourceBases=new Set(redesignPages.map(page=>page.path==='/design-system/home'?'/':page.path));
    if(sourceBases.size!==siteBasePaths.length||siteBasePaths.some(base=>!sourceBases.has(base)))throw Error('Native SEO definitions differ from the implemented site route inventory');
    for(const basePath of siteBasePaths){
      const noIndex=!mode.indexing||basePath==='/design-system';
      for(const lang of enabledSiteLocales){const path=localizeSitePath(basePath,lang);unique.set(path,{path,lang,basePath,noIndex,staged:true,...(!noIndex?{alternates:getRedesignAlternates(basePath)}:{})});}
    }
    Object.keys(redesignRedirects).forEach(path=>unique.delete(path));
    if(!mode.indexing)unique.forEach((page,path)=>unique.set(path,{...page,noIndex:true,alternates:undefined}));
  }else{
    // Preview-only native routes do not replace the published legal/contact pages.
    redesignPages.filter(page=>page.path!=='/contato'&&!page.nativeLegal).forEach(page=>unique.set(page.path,{path:page.path,lang:'pt-BR',basePath:page.path==='/design-system/home'?'/':page.path,noIndex:true,staged:true}));
  }
  return [...unique.values()].map(page=>{
    const alternate=page.alternate?unique.get(page.alternate):undefined;
    return page.alternate&&(!alternate||alternate.noIndex||alternate.staged||page.staged)?{...page,alternate:undefined}:page;
  });
}

export function getPublicPages(mode?:SiteBuildMode){return getBuildPages(mode).filter(page=>!page.noIndex);}
const escapeXml=(value:string)=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
export function renderSitemap(baseUrl:string,mode?:SiteBuildMode){
  const entries=getPublicPages(mode).map(page=>{
    const pt=page.lang==='pt-BR'?page.path:page.alternate??page.path;
    const links=page.alternates?Object.entries(page.alternates):[[page.lang,page.path],...(page.alternate?[[page.lang==='pt-BR'?'en-US':'pt-BR',page.alternate]]:[]),['x-default',pt]];
    return `  <url><loc>${escapeXml(baseUrl+page.path)}</loc>${links.map(([lang,path])=>`<xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(baseUrl+path)}"/>`).join('')}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
}
