/** Website languages. Optional additions stay inactive until requested. */
export const siteLocaleInfo={
 'pt-BR':{prefix:'',label:'Português',language:'Portuguese (Brazil)',hreflang:'pt-BR'},
 'en-US':{prefix:'en',label:'English',language:'English',hreflang:'en'},
 'de-DE':{prefix:'de',label:'Deutsch',language:'German',hreflang:'de'},
 'es-ES':{prefix:'es',label:'Español',language:'Spanish',hreflang:'es'},
 'da-DK':{prefix:'da',label:'Dansk',language:'Danish',hreflang:'da'},
 'nl-NL':{prefix:'nl',label:'Nederlands',language:'Dutch',hreflang:'nl'},
 'fr-FR':{prefix:'fr',label:'Français',language:'French',hreflang:'fr'},
 'lb-LU':{prefix:'lb',label:'Lëtzebuergesch',language:'Luxembourgish',hreflang:'lb'},
}as const;
export type SiteLocale=keyof typeof siteLocaleInfo;
export const enabledSiteLocales:readonly SiteLocale[]=['pt-BR','en-US','de-DE','es-ES','da-DK','nl-NL','fr-FR'];
export function validSiteLocale(value:unknown):value is SiteLocale{return typeof value==='string'&&enabledSiteLocales.includes(value as SiteLocale);}
