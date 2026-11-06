import{parseContactDetails}from'../../../shared/site-contact';
import{getLoadedSiteLocale,t}from'./runtime';
/** Only the shared validator's fixed messages are trusted translation keys.
 * Successful contact details keep the shared normalization and original values. */
export function parseLocalizedContactDetails(input:Parameters<typeof parseContactDetails>[0]):ReturnType<typeof parseContactDetails>{
 const result=parseContactDetails(input,{requireCountryCode:getLoadedSiteLocale()!=='pt-BR'});return result.ok?result:{...result,message:t(result.message)};
}
