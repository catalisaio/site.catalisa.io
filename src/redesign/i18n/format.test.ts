import{describe,it,expect}from'vitest';
import{formatIllustrativeMoney,formatBrazilianMoney,illustrativeCurrency}from'./format';
import type{SiteLocale}from'../../../shared/site-locale';
const currencies:Partial<Record<SiteLocale,string>>={'pt-BR':'BRL','en-US':'USD','de-DE':'EUR','es-ES':'EUR','da-DK':'DKK','nl-NL':'EUR','fr-FR':'EUR'};
describe('illustrative monetary context',()=>{
 for(const[locale,currency]of Object.entries(currencies))it(locale+' formats illustrative units with '+currency,()=>{
  const language=locale as SiteLocale;expect(illustrativeCurrency(language)).toBe(currency);
  for(const value of[0,100,200,300])expect(formatIllustrativeMoney(value,language)).toBe(new Intl.NumberFormat(language,{style:'currency',currency,currencyDisplay:language==='en-US'?'code':'symbol',minimumFractionDigits:2,maximumFractionDigits:2}).format(value));
 });
 it('never converts factual Brazilian amounts to the illustrative currency',()=>{
  for(const locale of Object.keys(currencies)as SiteLocale[]){const value=formatBrazilianMoney(50_400_000_000,locale);expect(value).toBe(new Intl.NumberFormat(locale,{style:'currency',currency:'BRL',currencyDisplay:locale==='pt-BR'?'symbol':'code'}).format(50_400_000_000));if(locale!=='pt-BR')expect(value).toContain('BRL');}
 });
});
