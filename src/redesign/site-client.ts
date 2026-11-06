import {t as __siteT} from "./i18n/runtime";
import{getSiteLocale}from'./i18n/routes';
import type { Briefing, Identity, Message, Session } from '../../server/site/types';
import type {Concept,ConceptJob,Handoff,HandoffChannel} from '../../server/site/concept-types';
import type {ContactDetails}from'../../shared/site-contact';
export interface ContactSnapshot { session: Session; briefing: Briefing; messages: Message[]; identity?: Identity; displayName?: string;contactDetails?:ContactDetails; availableChannels: HandoffChannel[]; generationAvailable?:boolean;latestConcept?:Concept;pendingJob?:ConceptJob;latestHandoff?:Handoff;handoffSelection?:{channel:HandoffChannel;address?:string;concept:{conceptRef:string;version:number;title:string}|null} }
export class SiteApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
export async function siteRequest<T>(path: string, method = 'GET', body?: unknown, idempotencyKey?: string, signal?:AbortSignal): Promise<T> {
  let response: Response;
  const options:RequestInit={method,credentials:'same-origin',headers:{'X-Site-Locale':getSiteLocale(typeof location==='undefined'?'/':location.pathname),...(body===undefined?{}:{'Content-Type':'application/json'}),...(idempotencyKey?{'Idempotency-Key':idempotencyKey}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})};
  // A browser network change can lose a response after its mutation was saved.
  // These exact routes persist their receipt with the same session CAS, while
  // concept creation reserves its job before invoking the provider. Replaying
  // the identical body/key recovers that result; it does not create a new one.
  const receiptProtected=method==='POST'&&(/^(?:messages|identity|contact|lab\/briefing|direct\/briefing)$/.test(path)||/^concepts(?:\/[\w-]+\/revisions)?$/.test(path))||method==='PUT'&&path==='briefing';
  const recoverable=method==='GET'||!!idempotencyKey&&receiptProtected;
  for(let attempt=0;;attempt++){
    try {const timeout=AbortSignal.timeout(method==='GET'?20000:100000);response=await fetch('/api/site/'+path,{...options,signal:signal?AbortSignal.any([signal,timeout]):timeout});break;}
    catch(reason) {
      const timedOut=!!reason&&typeof reason==='object'&&'name'in reason&&['TimeoutError','AbortError'].includes(String(reason.name));
      if(recoverable&&attempt===0&&!timedOut&&!signal?.aborted){await new Promise(resolve=>setTimeout(resolve,400));if(!signal?.aborted)continue;}
      throw new SiteApiError(0,timedOut?'network_timeout':'network_error',timedOut?__siteT("A conexão demorou mais que o esperado. Sua conversa está salva; consulte novamente antes de tentar outra vez."):__siteT("Não foi possível conectar. Sua resposta continua aqui; tente novamente."));
    }
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new SiteApiError(response.status, data?.code || 'request_failed', typeof data?.message==='string'?__siteT(data.message):__siteT("Não foi possível continuar agora. Tente novamente."));
  return data as T;
}
