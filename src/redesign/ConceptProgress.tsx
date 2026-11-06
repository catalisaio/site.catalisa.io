import {t as __siteT} from "./i18n/runtime";
import {useEffect,useRef,useState} from 'react';
import './concept-progress.css';

export type ConceptProgressPhase='generating'|'opening';

/** Milestones follow request state. Elapsed time never advances a milestone or a percentage. */
export function ConceptProgress({phase,refinement=false,compact=false,reveal=false}:{phase:ConceptProgressPhase;refinement?:boolean;compact?:boolean;reveal?:boolean}){
  const started=useRef(Date.now()),element=useRef<HTMLElement>(null);
  const [elapsed,setElapsed]=useState(0);
  useEffect(()=>{const timer=setInterval(()=>setElapsed(Math.floor((Date.now()-started.current)/1000)),1000);return()=>clearInterval(timer);},[]);
  useEffect(()=>{if(reveal)element.current?.scrollIntoView?.({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});},[reveal]);
  const opening=phase==='opening';
  const title=opening?__siteT("Abrindo sua prévia"):refinement?__siteT("Criando a próxima versão"):__siteT("Criando seu conceito com IA");
  const detail=opening?__siteT("O conceito chegou. Estamos preparando as telas para você explorar."):elapsed>=30?__siteT("A resposta está levando mais tempo. Sua conversa está salva e a prévia abrirá quando estiver pronta."):refinement?__siteT("Aplicando o ajuste ao seu conceito. A versão anterior continua preservada."):__siteT("Sua conversa está salva. A IA está compondo telas, peças e jornada; pode levar cerca de um minuto.");
  return <section ref={element} className={'c-concept-progress'+(compact?' c-concept-progress-compact':'')} role="status" aria-live="polite" aria-atomic="false" data-generation-phase={phase}>
    <div className="c-concept-progress-head"><span className="c-concept-progress-mark" aria-hidden="true"><i/><i/><i/></span><div><strong>{title}</strong><p>{detail}</p></div><span className="c-concept-progress-time" aria-hidden="true">{Math.floor(elapsed/60)}:{String(elapsed%60).padStart(2,'0')}</span></div>
    <div className="c-concept-progress-track" role="progressbar" aria-label={title}><span/></div>
    <ol aria-label={__siteT("Preparação do conceito")}><li data-state="done"><span aria-hidden="true"/>{__siteT("Conversa salva")}</li><li data-state={opening?'done':'active'} aria-current={!opening?'step':undefined}><span aria-hidden="true"/>{refinement?__siteT("Ajuste com IA"):__siteT("Composição com IA")}</li><li data-state={opening?'active':'next'} aria-current={opening?'step':undefined}><span aria-hidden="true"/>{__siteT("Abrir a prévia")}</li></ol>
  </section>;
}

/** Clearly a pending composition, never a fake generated product or an interactive demo. */
export function ConceptPendingPreview(){
  return <div className="c-concept-pending-preview"><span className="c-eyebrow">{__siteT("Da ideia à primeira forma")}</span><h3>{__siteT("Seu conceito")}<br/>{__siteT("está tomando forma.")}</h3><p>{__siteT("Quando estiver pronto, você poderá explorar as telas, as peças e a jornada.")}</p><div className="c-concept-pending-cards" aria-hidden="true"><div><i/><span/><span/><b/></div><div><i/><span/><span/><b/></div><div><i/><span/><span/><b/></div></div></div>;
}
