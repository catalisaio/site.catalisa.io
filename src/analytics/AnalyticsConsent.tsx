import{localizedHref}from'../redesign/i18n/navigation';
import {t as __siteT} from "../redesign/i18n/runtime";
import{useEffect,useState}from'react';
import{bootstrapMeasurement,readConsent,setConsent}from'./site-analytics';
import'./consent.css';
export function AnalyticsConsent(){
 const[visible,show]=useState(()=>readConsent()===null);const en=location.pathname==='/en'||location.pathname.startsWith('/en/');
 useEffect(()=>{bootstrapMeasurement();show(readConsent()===null);const changed=()=>show(readConsent()===null);addEventListener('catalisa-consent-changed',changed);return()=>removeEventListener('catalisa-consent-changed',changed);},[]);
 const choose=(value:'granted'|'denied')=>{setConsent(value);show(false);};
 if(/^\/(?:api|apresentacao|treinamento|en\/(?:presentation|training))(?:\/|$)/.test(location.pathname))return null;
 return <>{visible?<section className="c-consent" aria-label={en?"Analytics preferences":__siteT("Preferências de cookies")}><div><h2>{en?"Your choice, your privacy.":__siteT("Sua escolha, sua privacidade.")}</h2><p>{en?"With your permission, Google Analytics and Microsoft Clarity help us understand visits and improve this site. Contact details and conversations stay out of analytics.":__siteT("Com sua permissão, Google Analytics e Microsoft Clarity ajudam a entender as visitas e melhorar este site. Dados de contato e conversas ficam fora do analytics.")} <a href={localizedHref(en?'/en/privacy-policy':'/politica-privacidade')}>{en?"Privacy policy":__siteT("Política de Privacidade")}</a></p></div><div className="c-consent-actions"><button onClick={()=>choose('denied')}>{en?"Decline":__siteT("Recusar")}</button><button onClick={()=>choose('granted')}>{en?"Accept analytics":__siteT("Aceitar analytics")}</button></div></section>:<button className="c-consent-settings" onClick={()=>show(true)}>{en?"Cookie preferences":__siteT("Preferências de cookies")}</button>}</>;
}
