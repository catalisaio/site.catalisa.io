import type{SiteLocale}from'../../../shared/site-locale';
import{getLoadedSiteLocale}from'./runtime';
/** Fictitious demo units only: no rates, conversions or geographic inference. */
const illustrativeCurrencies:Record<SiteLocale,string>={
 'pt-BR':'BRL','en-US':'USD','de-DE':'EUR','es-ES':'EUR','da-DK':'DKK','nl-NL':'EUR','fr-FR':'EUR','lb-LU':'EUR',
};
export function illustrativeCurrency(locale:SiteLocale=getLoadedSiteLocale()){return illustrativeCurrencies[locale];}
export function formatIllustrativeMoney(value:number,locale:SiteLocale=getLoadedSiteLocale()){
 return new Intl.NumberFormat(locale,{style:'currency',currency:illustrativeCurrency(locale),currencyDisplay:locale==='en-US'?'code':'symbol',minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
}
/** Real Brazilian figures retain BRL; display formatting never changes their value. */
export function formatBrazilianMoney(value:number,locale:SiteLocale=getLoadedSiteLocale(),options:Intl.NumberFormatOptions={}){
 return new Intl.NumberFormat(locale,{...options,style:'currency',currency:'BRL',currencyDisplay:locale==='pt-BR'?'symbol':'code'}).format(value);
}
