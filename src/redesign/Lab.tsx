import{localizeData as __siteData}from"./i18n/runtime";
import{localizedHref as __siteHref}from"./i18n/navigation";
import {t as __siteT} from "./i18n/runtime";
import {useEffect,useRef,useState} from 'react';
import type {Concept,ConceptJob} from '../../server/site/concept-types';
import {parseLocalizedContactDetails as parseContactDetails} from './i18n/contact-validation';
import {RedesignFrame} from './foundation-components';
import {LabShell} from './LabViews';
import {LabResult} from './LabResult';
import {ConceptPendingPreview,ConceptProgress} from './ConceptProgress';
import type {ConceptProgressPhase} from './ConceptProgress';
import type {LabExample} from './LabResult';
import {siteRequest,SiteApiError} from './site-client';
import {trackSiteEvent,trackSiteOutcome}from'../analytics/site-analytics';
import type {ContactSnapshot} from './site-client';
import __siteBase_scenarios from './data/lab.json';
import './lab-reference.css';
import './lab.css';
const scenarios=__siteData(__siteBase_scenarios);


const examples:Record<string,LabExample>=scenarios;
const prompts:Record<string,string>={vet:__siteT("Quero uma clínica veterinária em que o tutor consiga marcar consultas e a recepção acompanhe o atendimento."),repair:__siteT("Quero organizar uma oficina com pedido por WhatsApp, fotos do veículo e agendamento de avaliação."),credit:__siteT("Quero uma jornada de crédito com cadastro, análise, política e assinatura de documentos."),hiring:__siteT("Quero conectar candidatos, recrutadores e agendas para marcar e acompanhar entrevistas.")};
const delay=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));

export default function Lab(){
  const [draft,setDraft]=useState(''),[idea,setIdea]=useState(''),[submittedIdea,setSubmittedIdea]=useState(''),[example,setExample]=useState('vet'),[concept,setConcept]=useState<Concept>(),[busy,setBusy]=useState(false),[status,setStatus]=useState(''),[error,setError]=useState(''),[needsIdentity,setNeedsIdentity]=useState(false),[name,setName]=useState(''),[email,setEmail]=useState(''),[phone,setPhone]=useState(''),[selection,setSelection]=useState('');
  const [restoring,setRestoring]=useState(true);
  const [generationPhase,setGenerationPhase]=useState<ConceptProgressPhase|null>(null);
  const identityDialog=useRef<HTMLDialogElement>(null),demoDialog=useRef<HTMLDialogElement>(null),opener=useRef<HTMLElement|null>(null),saved=useRef<ContactSnapshot|null>(null),active=useRef(true),working=useRef(false),attempts=useRef(new Map<string,string>());
  function keyFor(signature:string){let key=attempts.current.get(signature);if(!key){key=crypto.randomUUID();attempts.current.set(signature,key);}return key;}
  function restore(snapshot:ContactSnapshot){saved.current=snapshot;setName(snapshot.displayName||'');setEmail(snapshot.contactDetails?.email||'');setPhone(snapshot.contactDetails?.phone||'');if(snapshot.briefing.idea&&(snapshot.latestConcept||snapshot.messages.some(message=>message.step==='lab-context'))){setDraft(snapshot.briefing.idea);setSubmittedIdea(snapshot.briefing.idea);if(!snapshot.latestConcept)setStatus(__siteT("Sua ideia está salva. Gere a composição para explorar."));}if(snapshot.latestConcept){setConcept(snapshot.latestConcept);setIdea(snapshot.briefing.idea||'');setDraft(snapshot.briefing.idea||'');}}
  async function watch(initial:ConceptJob){
    let job=initial;if(job.status==='running')setGenerationPhase('generating');
    for(let index=0;index<80&&job.status==='running';index++){
      if(!active.current)return;
      if(index)await delay(750);
      job=await siteRequest<ConceptJob>('jobs/'+encodeURIComponent(job.jobRef));
    }
    if(job.status!=='succeeded')throw new Error(job.error?.message||__siteT("A composição ainda não foi concluída. Sua ideia está salva; tente novamente."));
    setGenerationPhase('opening');
    const snapshot=await siteRequest<ContactSnapshot>('session');if(!active.current)return;
    if(!snapshot.latestConcept)throw new Error(__siteT("A ideia mudou durante a geração. Confira o texto antes de continuar."));
    restore(snapshot);setStatus(__siteT("Seu conceito está pronto para explorar. Nenhuma operação foi executada."));
    trackSiteOutcome('concept_ready',snapshot.latestConcept.conceptRef+':'+snapshot.latestConcept.version,{source:'lab'});
    document.getElementById('laboratorio')?.scrollIntoView({behavior:'instant',block:'start'});
  }
  useEffect(()=>{
    active.current=true;let cancelled=false;
    siteRequest<ContactSnapshot>('session').then(async snapshot=>{
      if(cancelled)return;restore(snapshot);
      if(snapshot.pendingJob){working.current=true;setBusy(true);setStatus(__siteT("Retomando a composição da sua ideia…"));try{await watch(snapshot.pendingJob);}catch(reason){if(!cancelled)setError(reason instanceof Error?reason.message:__siteT("Não foi possível retomar."));}finally{working.current=false;if(!cancelled){setBusy(false);setGenerationPhase(null);}}}
    }).catch(reason=>{if(!cancelled&&!(reason instanceof SiteApiError&&reason.status===401))setError(reason.message);}).finally(()=>{if(!cancelled)setRestoring(false);});
    return()=>{cancelled=true;active.current=false;};
  },[]);
  useEffect(()=>{if(needsIdentity){opener.current=document.activeElement as HTMLElement;identityDialog.current?.showModal();}},[needsIdentity]);
  async function run(knownSnapshot?:ContactSnapshot){
    if(working.current||restoring)return;
    const proposed=draft.trim();if(!proposed){setError(__siteT("Conte a ideia que você quer explorar."));return;}
    setGenerationPhase(null);working.current=true;setBusy(true);setError('');setStatus(__siteT("Salvando sua ideia…"));let generationRequested=false;
    try{
      // The identity flow already read back this exact saved session. Avoid
      // creating/re-reading it again immediately; the generation endpoint still
      // validates the cookie, contact and briefing version on every request.
      let snapshot:ContactSnapshot;
      if(knownSnapshot)snapshot=knownSnapshot;
      else{await siteRequest('sessions','POST');snapshot=await siteRequest<ContactSnapshot>('session');}
      const isSameLabIdea=snapshot.briefing.idea===proposed&&snapshot.messages.some(message=>message.step==='lab-context'&&message.briefVersion===snapshot.session.briefVersion);
      if(!isSameLabIdea){const body={idea:proposed,expectedVersion:snapshot.session.briefVersion};await siteRequest('lab/briefing','POST',body,keyFor(JSON.stringify({operation:'lab',...body})));snapshot=await siteRequest<ContactSnapshot>('session');}
      saved.current=snapshot;setSubmittedIdea(proposed);
      if(!snapshot.identity||!snapshot.contactDetails?.email&&!snapshot.contactDetails?.phone){
        setName(snapshot.displayName||name);setEmail(snapshot.contactDetails?.email||email);setPhone(snapshot.contactDetails?.phone||phone);setNeedsIdentity(true);setStatus(__siteT("Sua ideia está salva. Informe seu nome e um contato para gerar a composição."));return;
      }
      if(snapshot.pendingJob){setGenerationPhase('generating');setStatus(__siteT("Criando seu conceito com IA…"));await watch(snapshot.pendingJob);return;}
      if(snapshot.latestConcept){restore(snapshot);setStatus(__siteT("Sua composição salva está pronta para explorar."));document.getElementById('laboratorio')?.scrollIntoView({behavior:'instant'});return;}
      setGenerationPhase('generating');setStatus(__siteT("Criando seu conceito com IA…"));
      generationRequested=true;trackSiteEvent('concept_requested',{source:'lab'});
      const signature=JSON.stringify({operation:'lab-concept',briefVersion:snapshot.session.briefVersion});
      const job=await siteRequest<ConceptJob>('concepts','POST',{briefVersion:snapshot.session.briefVersion},keyFor(signature));
      try{await watch(job);attempts.current.delete(signature);}catch(reason){if(!(reason instanceof SiteApiError))attempts.current.delete(signature);throw reason;}
    }catch(reason){if(generationRequested)trackSiteEvent('concept_failed',{source:'lab',error_code:reason instanceof SiteApiError?reason.code:'generation_failed'});if(active.current){const message=reason instanceof Error?reason.message:__siteT("Não foi possível preparar a composição.");setError(message+(concept?__siteT(" A prévia anterior foi mantida."):''));setStatus(message+(concept?__siteT(" A prévia anterior foi mantida."):''));}}
    finally{working.current=false;if(active.current){setBusy(false);setGenerationPhase(null);}}
  }
  async function saveIdentity(){
    if(working.current||!saved.current)return;
    if(!name.trim()){setError(__siteT("Informe seu nome para continuar."));return;}
    const contact=parseContactDetails({email,phone});if(!contact.ok){setError(contact.message);return;}
    working.current=true;setBusy(true);setError('');setStatus(__siteT("Salvando seu contato…"));let complete=false;
    try{
      const snapshot=await siteRequest<ContactSnapshot>('session'),body={name:name.trim(),briefVersion:snapshot.session.briefVersion};
      if(!snapshot.identity||snapshot.displayName!==name.trim())await siteRequest('identity','POST',body,keyFor(JSON.stringify({operation:'identity',...body})));
      const details={...contact.value,briefVersion:snapshot.session.briefVersion};await siteRequest('contact','POST',details,keyFor(JSON.stringify({operation:'contact',...details})));
      saved.current=await siteRequest<ContactSnapshot>('session');identityDialog.current?.close();complete=true;
    }catch(reason){setError(reason instanceof Error?reason.message:__siteT("Não foi possível salvar seu contato."));}
    finally{working.current=false;if(active.current){setBusy(false);setGenerationPhase(null);}}
    if(complete&&active.current)await run(saved.current??undefined);
  }
  function chooseExample(key:string){if(working.current||!examples[key])return;setExample(key);setConcept(undefined);setDraft(prompts[key]||'');setIdea(prompts[key]||'');setSubmittedIdea(prompts[key]||'');setStatus(__siteT("Exemplo demonstrativo. Gere sua ideia para criar uma composição por IA."));setError('');}
  const demoOptions=example==='credit'?[__siteT("Conferir os dados"),__siteT("Revisar os documentos"),__siteT("Preparar o próximo passo")]:[__siteT("Amanhã, às 10h"),__siteT("Amanhã, às 14h"),__siteT("Sexta, às 9h")];
  const dialog=<>
    <dialog ref={identityDialog} className="l-demo-dialog l-identity-dialog" aria-labelledby="l-identity-title" onClose={()=>{setNeedsIdentity(false);opener.current?.focus({preventScroll:true});}}><button className="l-dialog-close" aria-label={__siteT("Fechar")} onClick={()=>identityDialog.current?.close()}>{__siteT("Fechar ×")}</button><span className="c-eyebrow">{__siteT("Sua ideia, com continuidade")}</span><h2 id="l-identity-title">{__siteT("Como podemos")}<br/>{__siteT("falar com você?")}</h2><p>{__siteT("Seu nome e pelo menos um e-mail ou telefone vinculam o conceito à sua conversa. A ideia será processada por IA; nenhum envio ou atendimento começa sem sua confirmação.")}</p><p><a href={__siteHref("/politica-privacidade")}>{__siteT("Política de Privacidade")}</a></p><form onSubmit={event=>{event.preventDefault();void saveIdentity();}} noValidate><label htmlFor="l-name">{__siteT("Seu nome")}</label><input id="l-name" autoComplete="name" maxLength={160} value={name} onChange={event=>setName(event.currentTarget.value)} disabled={busy}/><label htmlFor="l-email">{__siteT("E-mail")}</label><input id="l-email" type="email" autoComplete="email" maxLength={254} value={email} onChange={event=>setEmail(event.currentTarget.value)} disabled={busy}/><label htmlFor="l-phone">{__siteT("Telefone ou WhatsApp")}</label><input id="l-phone" type="tel" autoComplete="tel" maxLength={40} value={phone} onChange={event=>setPhone(event.currentTarget.value)} disabled={busy}/><small>{__siteT("Preencha pelo menos um: e-mail ou telefone. Brasil +55; para outro país, inclua o código internacional.")}</small><p className="l-error" role="alert">{error}</p><button type="submit" disabled={busy}>{busy?__siteT("Salvando seu contato…"):__siteT("Gerar meu conceito")} <span aria-hidden="true">↗</span></button></form></dialog>
    <dialog ref={demoDialog} className="l-demo-dialog" aria-labelledby="l-demo-title"><button className="l-dialog-close" onClick={()=>demoDialog.current?.close()} aria-label={__siteT("Fechar demonstração")}>{__siteT("Fechar ×")}</button><span className="c-eyebrow">{__siteT("Experimente / Dados de exemplo")}</span><h2 id="l-demo-title">{__siteT("Escolha um próximo passo.")}</h2><p>{__siteT("Simule uma escolha para ver a interface responder.")}</p><div className="l-slot-options">{demoOptions.map(option=><button key={option} aria-pressed={selection===option} onClick={()=>setSelection(option)}>{option}</button>)}</div><p id="l-booking-status" role="status">{selection?__siteT("Escolha registrada nesta demonstração: ")+selection+'.':__siteT("Nenhuma opção selecionada.")}</p><small>{__siteT("Simulação local. Nenhum agendamento ou operação é realizado.")}</small></dialog>
  </>;
  const conversation=submittedIdea?<><div className="l-chat-message l-chat-user"><span>{__siteT("Você")}</span><p>{submittedIdea}</p></div><div className="l-chat-message"><span>catalisa.</span><p>{generationPhase?__siteT("Sua ideia está salva. Estamos criando seu conceito."):busy?__siteT("Preparando sua ideia para continuar."):concept?concept.content.summary:__siteT("Sua ideia está salva. Gere o conceito para explorar uma composição criada para ela.")}</p></div></>:<div className="l-chat-message"><span>catalisa.</span><p>{__siteT("Que tal uma clínica veterinária em que marcar a consulta da Luna seja tão simples quanto mandar uma mensagem?")}</p></div>;
  return <RedesignFrame title={__siteT("Lab")}><div className="c-lab"><LabShell {...{draft,setDraft,conversation,dialog}} processing={!!generationPhase} progress={generationPhase?<ConceptProgress phase={generationPhase} compact reveal/>:undefined} busy={busy||restoring} status={restoring?'Retomando sua conversa…':status} onGenerate={()=>void run()} onExample={chooseExample} result={generationPhase?<ConceptPendingPreview/>:<LabResult key={concept?concept.conceptRef+':'+concept.version:example} example={examples[example]} outdated={!!concept&&idea!==submittedIdea} {...{concept,idea}} onTry={()=>{opener.current=document.activeElement as HTMLElement;setSelection('');demoDialog.current?.showModal();}}/>}/>{error&&!needsIdentity&&<p className="l-global-error" role="alert">{error}</p>}{busy&&!generationPhase&&<div className="l-operation" role="status" aria-live="polite"><span className="l-spinner" aria-hidden="true"/>{status}</div>}</div></RedesignFrame>;
}
