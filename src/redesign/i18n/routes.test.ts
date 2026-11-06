import{describe,expect,it}from'vitest';
import{enabledSiteLocales}from'../../../shared/site-locale';
import{getSiteLocale,localizeSitePath,parseSitePath,siteBasePaths,supportedSiteLocales}from'./routes';

describe('new public site language routes',()=>{
 it('round-trips every public subject in each of the seven enabled languages',()=>{
  expect(supportedSiteLocales).toEqual(enabledSiteLocales);expect(supportedSiteLocales).toHaveLength(7);
  for(const locale of supportedSiteLocales){const paths=siteBasePaths.map(base=>localizeSitePath(base,locale));expect(new Set(paths).size).toBe(siteBasePaths.length);for(const[at,basePath]of siteBasePaths.entries()){expect(parseSitePath(paths[at])).toMatchObject({locale,basePath,canonicalPath:paths[at]});expect(getSiteLocale(paths[at])).toBe(locale);}}
 });
 it('preserves the exact subject and technical identifier from an English alias',()=>{
  expect(parseSitePath('/en/building-blocks/?utm_source=test#library')).toEqual({locale:'en-US',basePath:'/capacidades',canonicalPath:'/en/capabilities'});
  const base='/capacidades/decision-engine';for(const locale of supportedSiteLocales)expect(localizeSitePath(base,locale)).toMatch(/\/decision-engine$/);
  expect(parseSitePath('/en/ai-agents')).toMatchObject({basePath:'/agentes'});
 });
 it('gives the product directory its own translated path while keeping the ecosystem and old composition bookmarks',()=>{
  const paths={'pt-BR':'/produtos','en-US':'/en/products','de-DE':'/de/produkte','es-ES':'/es/productos','da-DK':'/da/produkter','nl-NL':'/nl/producten','fr-FR':'/fr/produits'} as const;
  for(const locale of supportedSiteLocales){expect(localizeSitePath('/produtos',locale)).toBe(paths[locale as keyof typeof paths]);expect(parseSitePath(paths[locale as keyof typeof paths])).toMatchObject({locale,basePath:'/produtos'});expect(parseSitePath(localizeSitePath('/ecossistema',locale))?.basePath).toBe('/ecossistema');expect(parseSitePath(localizeSitePath('/composicoes',locale))?.basePath).toBe('/composicoes');}
 });
 it('does not invent translations for archives, private pages, unknown URLs or disabled locales',()=>{
  for(const path of['/insights','/en/training/course','/treinamento','/unknown','/lb','https://example.com/','//example.com/'])expect(parseSitePath(path)).toBeUndefined();
  expect(()=>localizeSitePath('/contato','lb-LU')).toThrow(RangeError);expect(()=>localizeSitePath('/insights','en-US')).toThrow(RangeError);
 });
});
