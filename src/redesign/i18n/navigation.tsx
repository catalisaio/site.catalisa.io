import{Link as RouterLink,useLocation as useRouterLocation}from'react-router-dom';
import type{LinkProps,To}from'react-router-dom';
import type{SiteLocale}from'../../../shared/site-locale';
import{getSiteLocale,localizeSitePath,parseSitePath}from'./routes';

/** Translate only known public website paths. Assets, APIs, archives and external URLs keep their address. */
export function localizedHref(href:string,locale:SiteLocale=getSiteLocale(typeof location==='undefined'?'/':location.pathname)){
 if(!href.startsWith('/')||href.startsWith('//'))return href;
 const match=href.match(/^([^?#]*)([?#].*)?$/);if(!match)return href;
 const parsed=parseSitePath(match[1]);if(!parsed)return href;
 // Explicit non-default prefixes are intentional language/archive links.
 const targetLocale=parsed.locale==='pt-BR'?locale:parsed.locale;
 return localizeSitePath(parsed.basePath,targetLocale)+(match[2]??'');
}
function localizeTo(to:To,locale:SiteLocale):To{
 if(typeof to==='string')return localizedHref(to,locale);
 return to.pathname?{...to,pathname:localizedHref(to.pathname,locale)}:to;
}
export function LocalizedLink({to,...props}:LinkProps){const location=useRouterLocation();return <RouterLink {...props} to={localizeTo(to,getSiteLocale(location.pathname))}/>;}

/** Existing native content switches use stable Portuguese route keys; metadata owns the actual URL. */
export function useSiteLocation(){const location=useRouterLocation(),parsed=parseSitePath(location.pathname);return{...location,pathname:parsed?.basePath??location.pathname,actualPathname:location.pathname,locale:parsed?.locale??getSiteLocale(location.pathname)};}
