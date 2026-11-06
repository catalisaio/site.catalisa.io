import{localizeData as __siteData}from"./i18n/runtime";
import{LocalizedLink as Link}from"./i18n/navigation";
import {t as __siteT} from "./i18n/runtime";
import {useId,useRef,useState} from 'react';

import type {Concept} from '../../server/site/concept-types';
import __siteBase_catalog from './data/catalog.json';
const catalog=__siteData(__siteBase_catalog);


export interface LabExample {name:string;kind:string;title:string;description:string;roles:string[];steps:string[][];items:string[];action:string;note:string}
const tabs=[['journey',__siteT("A jornada")],['interface',__siteT("Uma tela possível")],['blocks',__siteT("As peças")]] as const;
export function LabResult({example,concept,idea,outdated=false,onTry}:{example:LabExample;concept?:Concept;idea:string;outdated?:boolean;onTry:()=>void}){
  const id=useId(),buttons=useRef<(HTMLButtonElement|null)[]>([]);
  const [tab,setTab]=useState(0),[selected,setSelected]=useState(0),[screenIndex,setScreenIndex]=useState(0);
  const content=concept?.content;
  const steps=content?content.journey.map(step=>({label:step.label,description:step.description,slug:step.blockSlugs[0],capability:catalog.blocks.find(block=>block.slug===step.blockSlugs[0])?.name,review:step.humanReview})):example.steps.map(step=>({label:step[0],description:step[1],capability:step[2],slug:step[3],review:false}));
  const current=steps[selected],name=content?.title||__siteT(example.name),screen=content?.screens[screenIndex];
  const blocks=content?content.blocks.map(block=>({slug:block.slug,name:catalog.blocks.find(item=>item.slug===block.slug)?.name||block.slug,description:block.role})):example.steps.map(step=>({slug:step[3],name:step[2],description:step[1]}));
  function chooseTab(index:number){setTab(index);}
  return <>
    <div className="l-result-title"><div><span className="c-eyebrow">{content?(outdated?__siteT("Prévia anterior / Conceito gerado por IA"):__siteT("Sua ideia / Conceito gerado por IA")):__siteT(example.kind)+" / "+__siteT("Composição demonstrativa")}</span><h3>{name}</h3></div><span className="l-result-seal">{concept?__siteT("Versão ")+concept.version:__siteT("Ideia em movimento")} <i/></span></div>
    {idea&&<p className="l-your-idea"><span>{__siteT("Seu briefing")}</span>{idea}</p>}
    <div className="l-result-lede"><h4>{content?.hypothesis||example.title}</h4><p>{content?.summary||example.description}</p></div>
    <div className="l-roles">{(content?.roles||example.roles).map((role,index)=><span key={index}><i>{index+1}</i>{role}</span>)}</div>
    <div role="tablist" aria-label={__siteT("Explore a composição")} className="l-result-tabs">{tabs.map(([key,label],index)=><button key={key} ref={node=>{buttons.current[index]=node;}} role="tab" data-l-tab={key} aria-selected={tab===index} aria-controls="l-panel" id={id+'-'+key} tabIndex={tab===index?0:-1} onClick={()=>chooseTab(index)} onKeyDown={event=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?2:(index+(event.key==='ArrowRight'?1:2))%3;chooseTab(next);buttons.current[next]?.focus();}}>{label}</button>)}</div>
    <div id="l-panel" role="tabpanel" aria-labelledby={id+'-'+tabs[tab][0]}>
      {tab===0&&<div className="l-journey"><div className="l-journey-track">{steps.map((step,index)=><button key={index} className={'l-station l-station-'+index%4} data-l-step={index} aria-pressed={selected===index} onClick={()=>setSelected(index)}><span className="l-station-art" aria-hidden="true"><i/><b>{String(index+1).padStart(2,'0')}</b></span><strong>{step.label}</strong><small>{step.review?__siteT("Revisão humana"):step.capability||__siteT("Etapa da jornada")}</small></button>)}</div><div className="l-step-detail" aria-live="polite"><span>{__siteT("PASSO ")}{selected+1} / {steps.length}</span><h4>{current.label}</h4><p>{current.description}</p>{current.review&&<p>{__siteT("Revisão humana prevista nesta etapa. Uma pessoa confere as informações antes de prosseguir; esta prévia não aciona atendimento.")}</p>}{current.slug&&<Link className="c-text-link" to={'/capacidades/'+current.slug+'/'}>{current.capability}{__siteT(" na plataforma ↗")}</Link>}</div></div>}
      {tab===1&&<div className="l-app"><aside><span className="l-app-logo">{name}<i/></span><span>{__siteT("Visão da equipe")}</span>{content?content.screens.map((item,index)=><button key={item.id} className={'l-app-nav'+(screenIndex===index?' active':'')} aria-current={screenIndex===index?'page':undefined} onClick={()=>setScreenIndex(index)}>{item.title}</button>):[__siteT("Visão geral"),__siteT("Atendimentos"),__siteT("Agenda"),__siteT("Pessoas")].map((label,index)=><span key={label} className={'l-app-nav'+(!index?' active':'')}>{label}</span>)}<small>{__siteT("Interface ilustrativa")}</small></aside><div><div className="l-app-top"><span>{content?__siteT("Prévia conceitual / dados ilustrativos"):__siteT("Seu espaço de trabalho")}</span><b>{content?__siteT("Tela ")+(screenIndex+1):__siteT("Hoje")}</b></div><h4>{screen?screen.title:<>{__siteT("O próximo passo")}<br/>{__siteT("está aqui.")}</>}</h4>{screen?<><p>{screen.description}</p><div className="l-app-items">{screen.items.map((item,index)=><div key={index}><span>{String(index+1).padStart(2,'0')}</span><strong>{item.label}</strong><small>{item.value}</small></div>)}</div><button disabled={screen.action.nextScreenId===null} onClick={()=>{const index=content!.screens.findIndex(item=>item.id===screen.action.nextScreenId);if(index>=0)setScreenIndex(index);}}>{screen.action.label} <span>↗</span></button><small className="l-screen-note">{screen.action.nextScreenId===null?__siteT("Fim desta prévia. Explore as outras telas pelo menu."):__siteT("A ação navega na prévia; nenhuma operação real é executada.")}</small></>:<><div className="l-app-count"><strong>03</strong><span>{__siteT("exemplos para acompanhar")}</span><i aria-hidden="true">↗</i></div><div className="l-app-items">{example.items.map((item,index)=><div key={index}><span>0{index+1}</span><strong>{item}</strong><small>{[__siteT("Novo"),__siteT("Em andamento"),__siteT("A confirmar")][index]}</small></div>)}</div><button data-l-try onClick={onTry}>{example.action} <span>↗</span></button></>}</div></div>}
      {tab===2&&<div className="l-blocks"><p>{__siteT("Uma seleção para explorar. As peças e os vínculos precisam ser validados no desenho do produto.")}</p>{blocks.map((block,index)=><Link key={index} to={'/capacidades/'+block.slug+'/'}><span>{String(index+1).padStart(2,'0')}</span><strong>{block.name}</strong><p>{block.description}</p><span>{__siteT("Conheça o building block ↗")}</span></Link>)}</div>}
    </div>
    <p className="l-result-note">{content?content.disclaimer+' '+content.limitations.join(' '):example.note}</p>
  </>;
}
