import{localizeData as __siteData}from"./i18n/runtime";
import {t as __siteT} from "./i18n/runtime";
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import type {BriefStep} from '../../server/site/types';
import type {ConceptJob,Handoff,HandoffChannel} from '../../server/site/concept-types';
import {ContactDialogue,ContactShell} from './ContactViews';
import type {ContactStep} from './ContactViews';
import {ContactReachability} from './ContactReachability';
import {parseLocalizedContactDetails as parseContactDetails} from './i18n/contact-validation';
import type {ContactDetails} from '../../shared/site-contact';
import {ContactConcept} from './ContactConcept';
import {ConceptProgress} from './ConceptProgress';
import type {ConceptProgressPhase} from './ConceptProgress';
import {ContactAddress,ContactChannels,ContactConfirmation,ContactHandoff} from './ContactContinuation';
import {RedesignFrame} from './foundation-components';
import {siteRequest,SiteApiError} from './site-client';
import {trackSiteEvent,trackSiteOutcome}from'../analytics/site-analytics';
import type {ContactSnapshot} from './site-client';
import __siteBase_data from './data/contact.json';
import './contact-reference.css';
import './contact.css';
const data=__siteData(__siteBase_data);


const stepKey:Partial<Record<ContactStep,BriefStep>>={intro:'idea',context:'context',focus:'goal'};
const paths=data.paths as Record<string,typeof data.paths.custom>;
type Mode='contact'|'conversation'|'generating'|'concept'|'channels'|'address'|'confirm'|'handoff';
function nextStep(saved:ContactSnapshot):ContactStep{return !saved.briefing.idea?'intro':!saved.briefing.context?'context':!saved.briefing.goal?'focus':!saved.identity?'name':'summary';}
const pause=(duration:number)=>new Promise(resolve=>setTimeout(resolve,duration));
type InitialRestoration={kind:'anonymous'}|{kind:'saved';snapshot:ContactSnapshot}|{kind:'failed';message:string};
let initialRestoration:InitialRestoration|undefined;
/** One read before the first mount, shared by StrictMode renders; never generates or mutates. */
export async function prepareInitialSession(){
  try{
    const saved=await siteRequest<ContactSnapshot>('session');
    if(!saved?.session||!saved.briefing||!Array.isArray(saved.messages))throw Error(__siteT("Não foi possível retomar sua conversa. Tente novamente."));
    initialRestoration={kind:'saved',snapshot:saved};
  }catch(reason){initialRestoration=reason instanceof SiteApiError&&reason.status===401?{kind:'anonymous'}:{kind:'failed',message:reason instanceof Error?reason.message:__siteT("Não foi possível retomar sua conversa.")};}
}
function savedMode(saved:ContactSnapshot|null):Mode{
  if(saved?.identity&&!saved.contactDetails?.email&&!saved.contactDetails?.phone)return 'contact';
  if(saved?.latestHandoff)return 'handoff';
  if(saved?.session.entryMode==='direct'&&saved.identity)return saved.availableChannels.length===1&&saved.availableChannels[0]==='here'?'confirm':'channels';
  return saved?.latestConcept?'concept':'conversation';
}
function savedPath(saved:ContactSnapshot|null){return Object.entries(paths).find(([,value])=>value.label===saved?.briefing.idea)?.[0]||'custom';}

export default function Contact(){
  const bootstrap=useRef(initialRestoration).current,initial=bootstrap?.kind==='saved'?bootstrap.snapshot:null;
  const [snapshot,setSnapshot]=useState<ContactSnapshot|null>(initial),[step,setStep]=useState<ContactStep>(initial?nextStep(initial):'intro'),[path,setPath]=useState(savedPath(initial)),[draft,setDraft]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(bootstrap?.kind==='failed'?bootstrap.message:''),[paused,setPaused]=useState(false),[editing,setEditing]=useState(false),[modal,setModal]=useState(''),[mode,setMode]=useState<Mode>(savedMode(initial));
  const [channel,setChannel]=useState<HandoffChannel>('here'),[address,setAddress]=useState(''),[consent,setConsent]=useState(false),[handoff,setHandoff]=useState<Handoff|null>(initial?.latestHandoff??null);
  const dialog=useRef<HTMLDialogElement>(null),opener=useRef<HTMLElement|null>(null),attempts=useRef(new Map<string,{key:string;messageId:string}>()),active=useRef(true),working=useRef(false);
  const [showHumanReview,setShowHumanReview]=useState(false),[adjustingReview,setAdjustingReview]=useState(false),[startingDirect,setStartingDirect]=useState(false);
  const [restoring,setRestoring]=useState(!bootstrap),[restoreFailed,setRestoreFailed]=useState(bootstrap?.kind==='failed'),restoreAttempt=useRef(0),resumedInitialJob=useRef(false);
  const [generationPhase,setGenerationPhase]=useState<ConceptProgressPhase>('generating');
  const current=snapshot?.briefing||{};
  function applySaved(saved:ContactSnapshot){
    setSnapshot(saved);setStep(nextStep(saved));setPath(Object.entries(paths).find(([,value])=>value.label===saved.briefing.idea)?.[0]||'custom');
    const next=savedMode(saved);setMode(next);setConsent(false);
    if(saved.latestHandoff)setHandoff(saved.latestHandoff);
    if(next==='confirm'){setChannel('here');setAddress('');}
  }
  async function watchJob(initial:ConceptJob){
    let job=initial;if(job.status==='running')setGenerationPhase('generating');
    for(let i=0;i<120&&job.status==='running';i++){
      if(!active.current)throw new Error(__siteT("A geração continua vinculada à sua sessão."));
      if(i)await pause(750);
      job=await siteRequest<ConceptJob>('jobs/'+encodeURIComponent(job.jobRef));
    }
    if(job.status!=='succeeded')throw new Error(job.error?.message||(job.status==='expired'?__siteT("A geração excedeu o tempo limite. Suas respostas estão salvas."):__siteT("A geração ainda está em andamento. Reabra a conversa para consultar.")));
    setGenerationPhase('opening');
    const saved=await siteRequest<ContactSnapshot>('session');
    if(!active.current)return;
    applySaved(saved);
    if(!saved.latestConcept)throw new Error(__siteT("Suas respostas mudaram durante a geração. Confira o resumo antes de gerar outra versão."));
    trackSiteOutcome('concept_ready',saved.latestConcept.conceptRef+':'+saved.latestConcept.version,{source:'contact'});
  }
  async function restoreSession(){
    const attempt=++restoreAttempt.current;setRestoring(true);setRestoreFailed(false);setError('');
    try{
      const saved=await siteRequest<ContactSnapshot>('session');if(!active.current||attempt!==restoreAttempt.current)return;
      applySaved(saved);setRestoring(false);
      if(saved.pendingJob&&(saved.contactDetails?.email||saved.contactDetails?.phone)){setBusy(true);working.current=true;if(!saved.latestConcept)setMode('generating');try{await watchJob(saved.pendingJob);}catch(reason){if(active.current&&attempt===restoreAttempt.current){setError(reason instanceof Error?reason.message:__siteT("Não foi possível retomar."));setMode(saved.latestConcept?'concept':'conversation');}}finally{working.current=false;if(active.current&&attempt===restoreAttempt.current)setBusy(false);}}
    }catch(reason){if(active.current&&attempt===restoreAttempt.current&&!(reason instanceof SiteApiError&&reason.status===401)){setError(reason instanceof Error?reason.message:__siteT("Não foi possível retomar sua conversa."));setRestoreFailed(true);}}
    finally{if(active.current&&attempt===restoreAttempt.current)setRestoring(false);}
  }
  useLayoutEffect(()=>{document.documentElement.removeAttribute('data-contact-bootstrap');},[]);
  useEffect(()=>{
    active.current=true;
    if(bootstrap){
      // Consume after commit, so StrictMode's repeated initial render sees the
      // same result; a later SPA visit performs a fresh read of its own session.
      if(initialRestoration===bootstrap)initialRestoration=undefined;
      if(initial?.pendingJob&&(initial.contactDetails?.email||initial.contactDetails?.phone)&&!resumedInitialJob.current){
        resumedInitialJob.current=true;working.current=true;setBusy(true);if(!initial.latestConcept)setMode('generating');
        void watchJob(initial.pendingJob).catch(reason=>{if(active.current){setError(reason instanceof Error?reason.message:__siteT("Não foi possível retomar."));setMode(initial.latestConcept?'concept':'conversation');}}).finally(()=>{working.current=false;if(active.current)setBusy(false);});
      }
    }else void restoreSession();
    return()=>{active.current=false;restoreAttempt.current++;};
  },[]);
  useEffect(()=>{if(modal){opener.current=document.activeElement as HTMLElement;dialog.current?.showModal();}},[modal]);
  useEffect(()=>{document.querySelector<HTMLElement>('#z-title')?.focus({preventScroll:true});},[step,mode,restoring]);
  useEffect(()=>{
    if(mode!=='handoff'||!handoff||['assigned','failed'].includes(handoff.status))return;
    let cancelled=false,timer:ReturnType<typeof setTimeout>,polls=0;
    const poll=async()=>{try{const updated=await siteRequest<Handoff>('handoffs/'+encodeURIComponent(handoff.handoffRef));if(cancelled)return;setHandoff(updated);if(!['assigned','failed'].includes(updated.status)&&++polls<30)timer=setTimeout(poll,1500);}catch{ /* Manual refresh remains available; no invented delivery transition. */ }};
    timer=setTimeout(poll,1500);return()=>{cancelled=true;clearTimeout(timer);};
  },[mode,handoff?.handoffRef]);
  function attemptFor(signature:string){const attempt=attempts.current.get(signature)||{key:crypto.randomUUID(),messageId:crypto.randomUUID()};attempts.current.set(signature,attempt);return attempt;}
  async function ensureSession(){if(snapshot)return snapshot;await siteRequest('sessions','POST');const saved=await siteRequest<ContactSnapshot>('session');setSnapshot(saved);return saved;}
  async function beginDirect(){
    if(working.current)return;working.current=true;setBusy(true);setStartingDirect(true);setError('');
    try{
      const saved=await ensureSession();if(saved.latestHandoff){applySaved(saved);return;}
      const body={expectedVersion:saved.session.briefVersion,...(!saved.briefing.idea&&draft.trim()?{idea:draft.trim()}: {})},signature=JSON.stringify({operation:'direct',body}),attempt=attemptFor(signature);
      await siteRequest('direct/briefing','POST',body,attempt.key);const updated=await siteRequest<ContactSnapshot>('session');if(!active.current)return;
      applySaved(updated);setEditing(false);setDraft('');attempts.current.delete(signature);
    }catch(reason){if(active.current)setError(reason instanceof Error?reason.message:__siteT("Não foi possível preparar o atendimento. Sua conversa está salva."));}
    finally{working.current=false;if(active.current){setBusy(false);setStartingDirect(false);}}
  }
  async function submit(answer:string,selectedPath?:string){
    if(working.current)return;
    if(!answer.trim()){setError(__siteT("Conte sua resposta antes de continuar."));return;}
    working.current=true;setBusy(true);setError('');
    try{
      const saved=await ensureSession(),key=stepKey[step],signature=JSON.stringify({step,answer,version:saved.session.briefVersion,editing}),attempt=attemptFor(signature);
      if(step==='name')await siteRequest('identity','POST',{name:answer,briefVersion:saved.session.briefVersion},attempt.key);
      else if(key){if(editing)await siteRequest('briefing','PUT',{expectedVersion:saved.session.briefVersion,briefing:{[key]:answer}},attempt.key);else await siteRequest('messages','POST',{clientMessageId:attempt.messageId,step:key,text:answer,briefVersion:saved.session.briefVersion},attempt.key);}
      const updated=await siteRequest<ContactSnapshot>('session');if(!active.current)return;
      if(updated.session.entryMode==='direct')applySaved(updated);
      else{setSnapshot(updated);if(selectedPath)setPath(selectedPath);setStep(editing&&updated.identity?'summary':nextStep(updated));setMode(updated.identity&&!updated.contactDetails?.email&&!updated.contactDetails?.phone?'contact':'conversation');}
      setEditing(false);setDraft('');attempts.current.delete(signature);
    }catch(reason){if(active.current)setError(reason instanceof Error?reason.message:__siteT("Não foi possível salvar. Tente novamente."));}
    finally{working.current=false;if(active.current)setBusy(false);}
  }
  async function saveContact(details:ContactDetails){
    if(working.current||!snapshot)return;const parsed=parseContactDetails(details);if(!parsed.ok){setError(parsed.message);return;}
    const body={...parsed.value,briefVersion:snapshot.session.briefVersion},signature=JSON.stringify({operation:'contact',body}),attempt=attemptFor(signature);
    working.current=true;setBusy(true);setError('');
    try{await siteRequest('contact','POST',body,attempt.key);const saved=await siteRequest<ContactSnapshot>('session');if(!active.current)return;if(saved.session.entryMode==='direct')applySaved(saved);else{setSnapshot(saved);setMode('conversation');setStep('summary');}attempts.current.delete(signature);}
    catch(reason){setError(reason instanceof Error?reason.message:__siteT("Não foi possível salvar seu contato."));}
    finally{working.current=false;if(active.current)setBusy(false);}
  }
  async function generate(refinement?:string,adjustment?:'human-review'){
    if(working.current||!snapshot)return;
    if(!snapshot.contactDetails?.email&&!snapshot.contactDetails?.phone){setMode('contact');setError(__siteT("Informe um e-mail ou telefone para continuar."));return;}
    const previous=snapshot.latestConcept,signature=JSON.stringify({operation:'concept',briefVersion:snapshot.session.briefVersion,concept:previous?.conceptRef,version:previous?.version,refinement,adjustment}),attempt=attemptFor(signature);
    setGenerationPhase('generating');working.current=true;setBusy(true);setError('');setAdjustingReview(!!adjustment);setShowHumanReview(!!adjustment);if(!previous)setMode('generating');
    const generationStarted=Date.now();if(!adjustment)trackSiteEvent('concept_requested',{source:'contact'});
    try{
      const job=await siteRequest<ConceptJob>((refinement||adjustment)&&previous?'concepts/'+encodeURIComponent(previous.conceptRef)+'/revisions':'concepts','POST',(refinement||adjustment)&&previous?{briefVersion:snapshot.session.briefVersion,baseConceptVersion:previous.version,...(adjustment?{adjustment}:{text:refinement})}:{briefVersion:snapshot.session.briefVersion},attempt.key);
      try{await watchJob(job);attempts.current.delete(signature);if(previous)trackSiteOutcome(adjustment?'human_review_added':'concept_refined',attempt.key,{source:'contact',elapsed_ms:Date.now()-generationStarted});}catch(reason){if(!(reason instanceof SiteApiError))attempts.current.delete(signature);throw reason;}
    }catch(reason){if(!adjustment)trackSiteEvent('concept_failed',{source:'contact',error_code:reason instanceof SiteApiError?reason.code:'generation_failed',elapsed_ms:Date.now()-generationStarted});if(active.current){setError(reason instanceof Error?reason.message:__siteT("Não foi possível gerar agora."));setMode(previous?'concept':'conversation');}}
    finally{working.current=false;if(active.current){setBusy(false);setAdjustingReview(false);}}
  }
  function edit(target:string){const next=target as ContactStep;setEditing(true);setError('');setMode('conversation');setStep(next);setDraft(current[stepKey[next]!]||'');}
  function chooseChannel(value:HandoffChannel){const known=value==='email'?snapshot?.contactDetails?.email:value==='whatsapp'?snapshot?.contactDetails?.phone:undefined;setChannel(value);setAddress(known||'');setConsent(false);setError('');setMode(value==='here'||known?'confirm':'address');}
  function reviewAddress(){
    const value=channel==='whatsapp'?address.trim().replace(/[()\s-]/g,''):address.trim();
    if(channel==='email'?!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value):!/^\+[1-9]\d{9,14}$/.test(value)){setError(channel==='email'?__siteT("Informe um e-mail válido."):__siteT("Informe o WhatsApp com país e DDD."));return;}
    setAddress(value);setConsent(false);setError('');setMode('confirm');
  }
  async function confirmHandoff(){
    if(!snapshot||!consent||working.current)return;
    const concept=snapshot.latestConcept,body={channel,...(channel==='here'?{}:{address}),confirmed:true,contextVersion:snapshot.session.briefVersion,...(concept?{conceptRef:concept.conceptRef,conceptVersion:concept.version}:{})},signature=JSON.stringify({operation:'handoff',body}),attempt=attemptFor(signature);
    working.current=true;setBusy(true);setError('');
    try{const created=await siteRequest<Handoff>('handoffs','POST',body,attempt.key),updated=await siteRequest<Handoff>('handoffs/'+encodeURIComponent(created.handoffRef));const saved=await siteRequest<ContactSnapshot>('session');if(!active.current)return;setSnapshot(saved);setHandoff(updated);setMode('handoff');attempts.current.delete(signature);trackSiteOutcome('handoff_accepted',created.handoffRef,{source:'contact',channel});}
    catch(reason){if(active.current)setError(reason instanceof Error?reason.message:__siteT("Não foi possível registrar agora."));}
    finally{working.current=false;if(active.current)setBusy(false);}
  }
  async function refreshHandoff(){if(!handoff)return;setError('');try{setHandoff(await siteRequest<Handoff>('handoffs/'+encodeURIComponent(handoff.handoffRef)));}catch(reason){setError(reason instanceof Error?reason.message:__siteT("Não foi possível consultar agora."));}}
  function returnToConcept(){setError('');setMode(snapshot?.latestConcept?'concept':'conversation');if(!snapshot?.latestConcept)setStep(snapshot?.identity?'summary':nextStep(snapshot!));}
  function download(){if(!snapshot)return;const blob=new Blob([JSON.stringify({briefing:snapshot.briefing,messages:snapshot.messages,concept:snapshot.latestConcept},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='catalisa-conversa-e-conceito.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function action(name:string){
    if(name==='contact'){setMode('contact');setError('');return;}
    if(name==='motion'){setPaused(value=>!value);return;}
    if(name==='direct'){void beginDirect();return;}
    if(['about','history','sample'].includes(name)){setModal(name);return;}
    if(name==='skip'){void submit(__siteT("Para descobrir juntos na conversa."));return;}
    if(name==='back'){const previous:ContactStep=editing?'summary':({context:'intro',focus:'context',name:'focus',summary:'name'} as Partial<Record<ContactStep,ContactStep>>)[step]||'intro';setStep(previous);setEditing(!!current[stepKey[previous]!]&&previous!=='summary');setDraft(previous==='name'?snapshot?.displayName||'':current[stepKey[previous]!]||'');setError('');return;}
    if(name==='continue'){if(snapshot?.latestConcept)setMode('concept');else void generate();}
  }
  const phase=mode==='concept'||mode==='handoff'||['channels','address','confirm'].includes(mode)?2:step==='intro'?0:['context','focus','summary'].includes(step)?1:2;
  const modalContent=modal==='history'?<><h2 id="z-dialog-title">{__siteT("Nossa conversa.")}</h2><ol className="z-history">{snapshot?.messages.map(message=><li key={message.messageRef}><span>{message.role==='visitor'?__siteT("Você"):__siteT("Atualização")}</span>{message.step==='briefing-edited'?<p>{__siteT("Uma resposta do briefing foi atualizada. A conversa anterior permanece no histórico.")}</p>:message.step==='lab-context'?<p>{__siteT("Contexto automático da exploração no Lab; hipóteses a confirmar na conversa.")}</p>:message.step==='direct-context'?<p>{__siteT("Contexto automático para continuar com a equipe. As informações não fornecidas serão confirmadas na conversa.")}</p>:<p>{message.text}</p>}</li>)}</ol></>:modal==='sample'?<><h2 id="z-dialog-title">{__siteT("Outras ideias.")}<br/>{__siteT("Outras formas.")}</h2><p>{__siteT("Escolha um ponto de partida. A resposta será salva ao continuar.")}</p><div className="zd-samples">{data.samples.map(sample=><button key={sample.name} onClick={()=>{setDraft(sample.idea);dialog.current?.close();}}><span>{__siteT(sample.name)}</span><p>{sample.idea}</p><i>↗</i></button>)}</div></>:<><h2 id="z-dialog-title">{__siteT("Da conversa")}<br/>{__siteT("a uma primeira forma.")}</h2><p>{__siteT("Conte a ideia, o contexto e a direção. Suas respostas e seu nome ficam salvos nesta sessão para continuar de onde parou.")}</p><div className="z-modal-note">{__siteT("Suas respostas compõem um conceito que você pode explorar e ajustar. Se preferir, fale direto com a equipe. Seu contexto só é encaminhado após sua confirmação; a página mostra quando uma pessoa abre e assume a conversa.")}</div></>;
  const workspace=restoring||restoreFailed?undefined:mode==='concept'&&snapshot?.latestConcept?<ContactConcept key={snapshot.latestConcept.conceptRef+':'+snapshot.latestConcept.version} concept={snapshot.latestConcept} name={snapshot.displayName||''} briefing={current} busy={busy} error={error} showHumanReview={showHumanReview} busyLabel={adjustingReview?__siteT("Incluindo revisão na jornada…"):__siteT("Gerando uma nova versão…")} progress={busy&&!adjustingReview?<ConceptProgress phase={generationPhase} refinement compact reveal/>:undefined} onIncludeReview={()=>void generate(undefined,'human-review')} onRefine={text=>void generate(text)} onReview={()=>{setMode('conversation');setStep('summary');setError('');}} onHandoff={()=>{setMode('channels');setError('');}} onDownload={download}/>:mode==='handoff'&&handoff&&snapshot?<ContactHandoff {...{handoff,snapshot,error}} onRefresh={()=>void refreshHandoff()} onBack={returnToConcept} onDownload={download}/>:undefined;
  return <RedesignFrame title={__siteT("Contato")} paused={paused}><div className="c-contact"><ContactShell {...{paused,phase,action,workspace}} busy={busy||restoring||restoreFailed} processing={mode==='generating'} scene={phase===2?'connected':step==='intro'?'open':step==='context'?'approach':step==='focus'?'align':'connected'} tags={paths[path]?.tags||paths.custom.tags} hasHistory={!!snapshot?.messages.length} dialog={<dialog ref={dialog} className="z-modal" aria-labelledby="z-dialog-title" onClose={()=>{setModal('');opener.current?.focus({preventScroll:true});}} onClick={event=>{if(event.target===event.currentTarget){const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.currentTarget.close();}}}><div><button className="z-close" autoFocus onClick={()=>dialog.current?.close()} aria-label={__siteT("Fechar")}>{__siteT("Fechar ×")}</button>{modalContent}</div></dialog>}>
    {!restoring&&!restoreFailed&&mode==='conversation'&&<><ContactDialogue {...{step,path,draft,setDraft,error,busy,action,edit}} name={snapshot?.displayName||''} briefing={current} contactLabel={[snapshot?.contactDetails?.email,snapshot?.contactDetails?.phone].filter(Boolean).join(' · ')} submit={answer=>void submit(answer)} choosePath={selected=>void submit(paths[selected].label,selected)}/>{step==='summary'&&error&&<p className="z-error" role="status">{error}</p>}</>}
    {(restoring||restoreFailed)&&<div className="z-view" aria-busy={restoring}><span className="z-kicker">{__siteT("SUA CONVERSA")}</span><h1 id="z-title" tabIndex={-1}>{restoring?__siteT("Retomando sua conversa…"):__siteT("Vamos retomar de onde parou.")}</h1>{restoring?<p className="z-lead" role="status"><span className="z-spinner" aria-hidden="true"/>{__siteT(" Recuperando suas respostas e seu conceito.")}</p>:<><p className="z-error" role="alert">{error}</p><button className="z-primary" onClick={()=>void restoreSession()}>{__siteT("Tentar retomar")}</button></>}</div>}
    {!restoring&&!restoreFailed&&mode==='contact'&&<ContactReachability initial={snapshot?.contactDetails} busy={busy} error={error} onSave={details=>void saveContact(details)} onBack={()=>{setMode('conversation');setStep('name');setDraft(snapshot?.displayName||'');setError('');}}/>}
    {!restoring&&!restoreFailed&&mode==='generating'&&<div className="z-view z-view-preparing" aria-busy="true"><span className="z-kicker">{__siteT("SUA CONVERSA VIRA UM CONCEITO")}</span><h1 id="z-title" tabIndex={-1}>{__siteT("As peças começam")}<br/>{__siteT("a ")}<em>{__siteT("se encontrar.")}</em></h1><p className="z-lead">{__siteT("Estamos dando forma à sua ideia. Você acompanha o preparo aqui e explora a prévia assim que ela chegar.")}</p><ConceptProgress phase={generationPhase} reveal/></div>}
    {mode==='channels'&&<ContactChannels channels={snapshot?.availableChannels||[]} hasConcept={!!snapshot?.latestConcept} onChoose={chooseChannel} onBack={returnToConcept}/>}
    {mode==='address'&&<ContactAddress {...{channel,address,setAddress,error}} onContinue={reviewAddress} onBack={()=>{setMode('channels');setError('');}}/>}
    {mode==='confirm'&&snapshot&&<ContactConfirmation {...{snapshot,channel,address,consent,setConsent,busy,error}} onConfirm={()=>void confirmHandoff()} onBack={()=>{if(snapshot.session.entryMode==='direct'&&snapshot.availableChannels.length===1)returnToConcept();else setMode(channel==='here'?'channels':'address');setError('');}}/>}
  </ContactShell>{busy&&!(mode==='generating'||mode==='concept'&&!adjustingReview)&&<div className="z-operation-progress" role="status" aria-live="polite"><span className="z-spinner" aria-hidden="true"/><span>{startingDirect?__siteT("Preparando seu atendimento…"):adjustingReview?__siteT("Incluindo revisão na jornada…"):mode==='confirm'?__siteT("Registrando seu encaminhamento…"):mode==='contact'?__siteT("Salvando seu contato…"):__siteT("Salvando sua resposta…")}</span></div>}</div></RedesignFrame>;
}
