import{RedesignFrame}from'./foundation-components';
import{useSiteLocation}from'./i18n/navigation';
import{localizeData}from'./i18n/runtime';
import privacy from'../i18n/locales/pt-BR/privacy.json';
import terms from'../i18n/locales/pt-BR/terms.json';
import'./legal.css';
interface LegalDocument{title:string;lastUpdated:string;sections:{title:string;content:string;items?:string[]}[]}
/** Same published policy/terms content; native disclosures also work without JavaScript. */
export default function Legal(){
 const{pathname}=useSiteLocation(),document=localizeData(pathname==='/politica-privacidade'?privacy:terms,{translateKeys:['content','lastUpdated']})as LegalDocument;
 return <RedesignFrame title={document.title}><article className="c-legal c-wrap"><header><h1>{document.title}</h1><p>{document.lastUpdated}</p></header><div className="c-legal-sections">{document.sections.map((section,index)=><section key={index} id={'legal-section-'+index}><h2>{section.title}</h2>{section.content.split('\n\n').map((paragraph,key)=><p key={key}>{paragraph}</p>)}{section.items&&<ul>{section.items.map((item,key)=><li key={key}>{item}</li>)}</ul>}</section>)}</div></article></RedesignFrame>;
}
