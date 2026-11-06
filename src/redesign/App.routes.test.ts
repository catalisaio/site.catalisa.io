import{describe,expect,it}from'vitest';
import{getPageLoader}from'./App';
import{localizeSitePath,parseSitePath,siteBasePaths,supportedSiteLocales}from'./i18n/routes';
describe('native public page loaders',()=>{
 it('has one loader for every implemented base, including the independent product directory',()=>{
  for(const basePath of siteBasePaths)expect(getPageLoader(basePath),basePath).toBeTypeOf('function');
  expect(getPageLoader('/produtos')).not.toBe(getPageLoader('/ecossistema'));
  for(const locale of supportedSiteLocales){const parsed=parseSitePath(localizeSitePath('/produtos',locale))!;expect(getPageLoader(parsed.basePath)).toBe(getPageLoader('/produtos'));}
 });
 it('leaves archive/private/unknown pages outside the native loader map',()=>{
  for(const path of['/insights','/treinamento','/en/training','/unknown'])expect(getPageLoader(path)).toBeUndefined();
 });
});
