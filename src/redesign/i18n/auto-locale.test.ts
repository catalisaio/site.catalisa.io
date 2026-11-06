import{afterEach,describe,expect,it,vi}from'vitest';
import{autoLocaleDecision,rememberSiteLocale,siteAutoLocalePolicy,siteLocaleStorageKey}from'./auto-locale';
import type{AutoLocaleInput}from'./auto-locale';
import type{SiteLocale}from'../../../shared/site-locale';
const decide=(input:Partial<AutoLocaleInput>={})=>autoLocaleDecision({pathname:'/',...input},siteAutoLocalePolicy);
afterEach(()=>vi.restoreAllMocks());
describe('home language negotiation',()=>{
 it.each([
  ['pt-PT','pt-BR',undefined],['en-GB','en-US','/en'],['de-CH','de-DE','/de'],['es-MX','es-ES','/es'],['da-DK','da-DK','/da'],['nl-BE','nl-NL','/nl'],['fr-CH','fr-FR','/fr'],
 ] as const)('maps machine variant %s to %s',(machine,locale,destination)=>{expect(decide({languages:[machine]})).toEqual({locale,...(destination?{destination}:{})});});
 it('respects language ordering and uses Intl only when navigator has no supported option',()=>{
  expect(decide({languages:['ja-JP','nl-BE','fr-CH'],language:'en-US',intlLocale:'de-CH'})?.locale).toBe('nl-NL');
  expect(decide({languages:['ja-JP'],intlLocale:'fr-CH'})?.locale).toBe('fr-FR');
  expect(decide({languages:[],language:'de_CH'})?.locale).toBe('de-DE');
 });
 it('uses English when the machine/region is unsupported or missing',()=>{
  for(const input of[{}, {languages:['ja-JP'],language:'ja',intlLocale:'zh-CN'},{languages:['<script>','en-US;q=0.9']},{preference:'lb-LU',languages:['lb-LU']}])expect(decide(input)).toEqual({locale:'en-US',destination:'/en'});
 });
 it('gives a valid manual choice priority and never turns the automatic choice into a stored preference',()=>{
  expect(decide({preference:'fr-FR',languages:['de-CH']})).toEqual({locale:'fr-FR',destination:'/fr'});
  expect(decide({preference:'pt-BR',languages:['en-US']})).toEqual({locale:'pt-BR'});
  expect(decide({preference:'javascript:alert(1)',languages:['de-CH']})).toEqual({locale:'de-DE',destination:'/de'});
 });
 it.each(['/en','/de','/fr/contact','/lab','/contato','/api/site/session','/api/internal/handoff-events','/treinamento/login','/en/presentation/private','/insights','/en/insights/example','/','//'])('redirects only the exact root; explicit/deep/private/archive %s remains authoritative',pathname=>{
  const value=decide({pathname,preference:'fr-FR',languages:['en-US']});if(pathname==='/')expect(value?.destination).toBe('/fr');else expect(value).toBeUndefined();
 });
 it.each(['Googlebot','bingbot','DuckDuckBot','GPTBot','OAI-SearchBot','ChatGPT-User','Google-InspectionTool','Perplexity-User','facebookexternalhit'])('keeps stable canonical/static URLs for %s',userAgent=>{expect(decide({userAgent,languages:['de-CH'],preference:'fr-FR'})).toBeUndefined();});
 it('preserves known public attribution and real Home anchors, without carrying session/auth/navigation parameters',()=>{
  expect(decide({languages:['de-CH'],search:'?utm_source=search&utm_campaign=lan%C3%A7amento&gclid=public-click&session=private&token=secret&next=%2F%2Fevil.example',hash:'#arquitetura'})?.destination).toBe('/de?utm_source=search&utm_campaign=lan%C3%A7amento&gclid=public-click#arquitetura');
  for(const hash of['#token=secret','#unknown','#%E0%A4','#%3Cscript%3E'])expect(decide({languages:['fr-CH'],hash})?.destination).toBe('/fr');
  expect(decide({languages:['nl-BE'],search:'?utm_source=%0D%0Asecret'})?.destination).toBe('/nl');
 });
});
describe('essential explicit language preference',()=>{
 it('stores only supported explicit choices under the essential preference key',()=>{
  const storage={setItem:vi.fn()};expect(rememberSiteLocale('da-DK',storage)).toBe(true);expect(storage.setItem).toHaveBeenCalledExactlyOnceWith(siteLocaleStorageKey,'da-DK');
  expect(rememberSiteLocale('lb-LU',storage)).toBe(false);expect(rememberSiteLocale('invalid' as SiteLocale,storage)).toBe(false);expect(storage.setItem).toHaveBeenCalledTimes(1);
 });
 it('keeps manual navigation usable when browser storage is blocked',()=>{
  expect(rememberSiteLocale('fr-FR',{setItem:()=>{throw new DOMException('Blocked','SecurityError');}})).toBe(false);
 });
});
