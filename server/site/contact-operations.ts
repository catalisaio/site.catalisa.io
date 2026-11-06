import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { includeHumanReview, IntegrationError, validateConcept } from './concept';
import { ApiError, fields, text, version } from './input';
import type { Concept, ConceptJob, Handoff, HandoffChannel, HandoffEvent, OperationError } from './concept-types';
import type { ConceptGenerator, HandoffPacket, HandoffTransport, Receipt, SessionState, SessionStore, StoredSession } from './types';
import type {SiteMarketInsights} from './site-market-insights';
import {stageMarketEvent} from './site-market-outbox';
import {conceptLocaleCopy} from '../../shared/site-concept-locale';
import type {ConceptLocale} from '../../shared/site-concept-locale';

export interface ContactOperationOptions { generator?: ConceptGenerator; handoff?: HandoffTransport; webhookSecret?: string; timeoutMs?: number;generationTimeoutMs?:number;insights?:SiteMarketInsights }
const sha = (value: string) => createHash('sha256').update(value).digest('hex');
const rank: Record<Handoff['status'], number> = { accepted: 0, queued: 1, delivered: 2, assigned: 3, failed: 4 };
const unavailable = () => new ApiError(503, 'service_not_configured', 'Esta etapa ainda está sendo conectada. Sua conversa está salva.');
async function bounded<T>(work:Promise<T>,signal:AbortSignal):Promise<T>{
  let abort:()=>void=()=>{};
  try{return await Promise.race([work,new Promise<never>((_,reject)=>{abort=()=>reject(new IntegrationError('operation_timeout','O serviço excedeu o tempo de espera. Sua conversa está salva.',true));if(signal.aborted)abort();else signal.addEventListener('abort',abort,{once:true});})]);}
  finally{signal.removeEventListener('abort',abort);}
}

export class ContactOperations {
  private timeout: number;
  private handoffTimeout: number;
  constructor(private store: SessionStore, private options: ContactOperationOptions) {
    if(options.generationTimeoutMs!==undefined&&!Number.isFinite(options.generationTimeoutMs))throw Error('Invalid site generation timeout');
    this.timeout = Math.max(100, Math.min(options.timeoutMs ?? options.generationTimeoutMs ?? 45000,options.generationTimeoutMs===undefined?45000:60000));
    this.handoffTimeout = Math.max(100, Math.min(options.timeoutMs ?? 25000, 25000));
  }
  channels() { return this.options.handoff?.channels ?? []; }
  snapshot(state: SessionState) {
    const concepts = (state.concepts ?? []).filter(concept => concept.briefVersion === state.session.briefVersion);
    const latestConcept = concepts.at(-1);
    const pendingJob = Object.values(state.jobs ?? {}).find(entry => entry.job.status === 'running' && Date.parse(entry.deadline) > Date.now());
    const latest = Object.values(state.handoffs ?? {}).filter(entry=>entry.packet.briefVersion===state.session.briefVersion).at(-1);
    return { availableChannels: this.channels(), generationAvailable: !!this.options.generator,
      ...(latestConcept ? { latestConcept } : {}), ...(pendingJob ? { pendingJob: pendingJob.job } : {}),
      ...(latest ? { latestHandoff: latest.receipt, handoffSelection: { channel: latest.packet.channel, ...(latest.packet.address ? { address: latest.packet.address } : {}),concept:latest.packet.concept?{conceptRef:latest.packet.concept.conceptRef,version:latest.packet.concept.version,title:latest.packet.concept.content.title}:null } } : {}) };
  }
  async read(path: string, state: SessionState): Promise<ConceptJob | Handoff | undefined> {
    const jobMatch = path.match(/^\/api\/site\/jobs\/([\w-]{1,100})$/);
    if (jobMatch) {
      const entry = state.jobs && Object.hasOwn(state.jobs,jobMatch[1]) ? state.jobs[jobMatch[1]] : undefined;
      if (!entry) throw new ApiError(404, 'job_not_found', 'Essa geração não pertence a esta conversa.');
      return entry.job.status === 'running' && Date.parse(entry.deadline) <= Date.now() ? { ...entry.job, status: 'expired' } : entry.job;
    }
    const handoffMatch = path.match(/^\/api\/site\/handoffs\/([\w-]{1,100})$/);
    if (handoffMatch) {
      const entry = state.handoffs && Object.hasOwn(state.handoffs,handoffMatch[1]) ? state.handoffs[handoffMatch[1]] : undefined;
      if (!entry) throw new ApiError(404, 'handoff_not_found', 'Esse encaminhamento não pertence a esta conversa.');
      return this.observedReceipt(entry);
    }
  }
  private async observedReceipt(entry:NonNullable<SessionState['handoffs']>[string]):Promise<Handoff>{
    let receipt=entry.receipt;
    if(receipt.status==='queued'&&this.options.handoff?.readThread&&entry.packet.channel==='here'){
      try{
        const thread=await this.options.handoff.readThread({handoffRef:receipt.handoffRef,contactRef:entry.packet.contact.contactRef,leadRef:entry.packet.contact.leadRef},AbortSignal.timeout(12000));
        receipt={...receipt,status:thread.status,updatedAt:thread.updatedAt};
      }catch(reason){if(!(reason instanceof ApiError&&reason.status===404))throw reason;}
    }
    const events=await this.options.handoff?.observe?.(entry.receipt.handoffRef,AbortSignal.timeout(12000));
    const latest=events?.sort((a,b)=>a.sequence-b.sequence).at(-1);
    return latest&&rank[latest.status]>=rank[receipt.status]?{...receipt,status:latest.status,updatedAt:latest.occurredAt}:receipt;
  }
  async refresh(state:SessionState){
    const entry=Object.values(state.handoffs??{}).filter(value=>value.packet.briefVersion===state.session.briefVersion).at(-1);
    if(entry)entry.receipt=await this.observedReceipt(entry);
  }
  async thread(path:string,state:SessionState,body?:unknown){
    const match=path.match(/^\/api\/site\/handoffs\/([\w-]{1,100})\/messages$/);
    if(!match)return undefined;
    const entry=state.handoffs&&Object.hasOwn(state.handoffs,match[1])?state.handoffs[match[1]]:undefined;
    if(!entry||!state.identity||entry.packet.channel!=='here')throw new ApiError(404,'handoff_not_found','Esse atendimento não pertence a esta conversa.');
    const transport=this.options.handoff;
    if(!transport?.readThread||!transport.appendVisitorMessage)throw new ApiError(404,'thread_unavailable','Este canal não possui conversa aqui no site.');
    const access={handoffRef:entry.receipt.handoffRef,contactRef:state.identity.contactRef,leadRef:state.identity.leadRef},signal=AbortSignal.timeout(15000);
    if(body===undefined)return transport.readThread(access,signal);
    const input=fields(body,['clientMessageId','text']);
    return transport.appendVisitorMessage(access,{clientMessageId:text(input.clientMessageId,100),text:text(input.text,2000)},signal);
  }
  matches(path: string) { return path === '/api/site/concepts' || path === '/api/site/handoffs' || /^\/api\/site\/concepts\/[\w-]{1,100}\/revisions$/.test(path); }
  private requireIdentity(state: SessionState) {
    if (!state.identity || !state.name || !state.briefing.idea || !state.briefing.context || !state.briefing.goal) throw new ApiError(409, 'brief_incomplete', 'Responda às três perguntas e informe seu nome antes de continuar.');
    if(!state.contactDetails?.email&&!state.contactDetails?.phone)throw new ApiError(409,'contact_required','Informe um e-mail ou telefone para continuar.');
  }
  private checkCommit(result: Awaited<ReturnType<SessionStore['commit']>>) {
    if (result.kind === 'conflict') throw new ApiError(409, 'brief_conflict', 'A conversa mudou em outra aba. Atualize as respostas antes de continuar.');
    if (result.kind === 'mismatch') throw new ApiError(409, 'idempotency_mismatch', 'Esta tentativa já foi usada para outra resposta.');
    if (result.kind === 'missing') throw new ApiError(401, 'session_required', 'Sua sessão expirou. Comece uma nova conversa.');
    return result as { kind: 'committed' | 'replay'; receipt: Receipt };
  }
  private async complete(hash: string, ref: string, update: (state: SessionState) => void,deadline:number) {
    const key = 'internal:complete:' + ref;
    for (let attempt = 0; attempt < 8; attempt++) {
      if(Date.now()+10000>deadline)throw new ApiError(503,'completion_pending','O resultado ainda está sendo salvo. Consulte a conversa novamente.');
      const saved = await this.store.read(hash); if (!saved) return;
      update(saved.state);
      const result = await this.store.commit(hash, saved.revision, saved.state, key, { digest: sha(key), status: 200, body: {} });
      if (result.kind !== 'conflict') { this.checkCommit(result); return; }
    }
    throw new ApiError(503, 'completion_pending', 'O resultado ainda está sendo salvo. Consulte a conversa novamente.');
  }
  async create(path: string, body: unknown, hash: string, saved: StoredSession, key: string, payloadDigest: string, requestId: string,requestDeadline=Date.now()+55000,locale:ConceptLocale='pt-BR'): Promise<Receipt> {
    this.requireIdentity(saved.state);
    if (path === '/api/site/handoffs') return this.createHandoff(body, hash, saved, key, payloadDigest, requestId,requestDeadline);
    const revision = path.match(/^\/api\/site\/concepts\/([\w-]{1,100})\/revisions$/);
    const input = fields(body, revision ? ['briefVersion', 'baseConceptVersion', 'text', 'adjustment'] : ['briefVersion']);
    version(input.briefVersion, saved.state.session.briefVersion);
    let previous: Concept | undefined, refinement: string | undefined;
    const humanReview = input.adjustment === 'human-review';
    if (input.adjustment !== undefined && (!humanReview || input.text !== undefined)) throw new ApiError(422, 'invalid_adjustment', 'Escolha um ajuste válido para o conceito.');
    if (!humanReview && !this.options.generator) throw unavailable();
    if (revision) {
      previous = saved.state.concepts?.filter(concept => concept.conceptRef === revision[1]).at(-1);
      if (!previous || previous.briefVersion !== saved.state.session.briefVersion || previous.version !== input.baseConceptVersion) throw new ApiError(409, 'concept_conflict', 'Este conceito foi atualizado. Reabra a versão atual antes de ajustar.');
      refinement = humanReview ? conceptLocaleCopy[previous.locale??'pt-BR'].reviewRequest : text(input.text, 2000);
      if(saved.state.messages.length>=500)throw new ApiError(429,'history_limit','Esta conversa chegou ao limite de respostas.');
    }
    if (Object.values(saved.state.jobs ?? {}).some(entry => entry.job.status === 'running' && Date.parse(entry.deadline) > Date.now())) throw new ApiError(409, 'generation_in_progress', 'Já existe uma geração em andamento nesta conversa.');
    if (Object.keys(saved.state.jobs ?? {}).length >= 30) throw new ApiError(429, 'generation_limit', 'Esta conversa chegou ao limite de gerações.');
    const hour = Math.floor(Date.now() / 3600000);
    if (!humanReview && !await this.store.quota('generation-' + hash + '-' + hour, 10, new Date((hour + 1) * 3600000).toISOString())) throw new ApiError(429, 'generation_limit', 'Aguarde um pouco antes de gerar outro conceito.');
    delete saved.state.session.entryMode;
    if(humanReview&&previous){
      // A deterministic edit has no external work to reserve. One CAS persists the
      // succeeded job, version, request history, idempotency receipt and outbox.
      const conceptLocale=previous.locale??'pt-BR';
      const at=new Date().toISOString(),concept:Concept={conceptRef:previous.conceptRef,version:previous.version+1,briefVersion:saved.state.session.briefVersion,...(conceptLocale==='pt-BR'?{}:{locale:conceptLocale}),content:includeHumanReview(previous.content,conceptLocale)};
      const job:ConceptJob={jobRef:'job_'+randomUUID(),status:'succeeded',requestId,concept};
      saved.state.jobs??={};saved.state.jobs[job.jobRef]={job,startedAt:at,deadline:at};
      saved.state.concepts??=[];saved.state.concepts.push(concept);
      saved.state.messages.push({messageRef:randomUUID(),role:'visitor',step:'refinement',text:refinement!,occurredAt:at,briefVersion:saved.state.session.briefVersion});
      stageMarketEvent(this.options.insights,saved.state,'concept.requested',job.jobRef,requestId,at,{outcome:'requested'});
      stageMarketEvent(this.options.insights,saved.state,'concept.ready',job.jobRef,requestId,at,{outcome:'ready'});
      stageMarketEvent(this.options.insights,saved.state,'concept.refined',job.jobRef,requestId,at,{outcome:'ready'});
      const receipt:Receipt={digest:payloadDigest,status:202,body:{jobRef:job.jobRef,status:'succeeded',requestId}};
      return this.checkCommit(await this.store.commit(hash,saved.revision,saved.state,key,receipt)).receipt;
    }
    const job: ConceptJob = { jobRef: 'job_' + randomUUID(), status: 'running', requestId };
    const generationDeadline=Math.min(Date.now()+this.timeout,requestDeadline-11000);
    if(generationDeadline<=Date.now())throw new ApiError(503,'service_timeout','A conexão demorou mais que o esperado. Suas respostas estão salvas; tente novamente.');
    saved.state.jobs ??= {};
    saved.state.jobs[job.jobRef] = { job, startedAt: new Date().toISOString(), deadline: new Date(requestDeadline).toISOString() };
    stageMarketEvent(this.options.insights,saved.state,'concept.requested',job.jobRef,requestId,saved.state.jobs[job.jobRef].startedAt,{outcome:'requested'});
    if(refinement)saved.state.messages.push({messageRef:randomUUID(),role:'visitor',step:'refinement',text:refinement,occurredAt:new Date().toISOString(),briefVersion:saved.state.session.briefVersion});
    const receipt: Receipt = { digest: payloadDigest, status: 202, body: structuredClone(job) };
    const committed = this.checkCommit(await this.store.commit(hash, saved.revision, saved.state, key, receipt));
    if (committed.kind === 'replay') return committed.receipt;
    let concept: Concept | undefined, error: OperationError | undefined,failureDiagnostic:{stage:string;httpStatus?:number}|undefined;
    try {
      const signal = AbortSignal.timeout(Math.max(1,generationDeadline-Date.now()));
      const output = await bounded(this.options.generator!.generate({ briefing: saved.state.briefing,locale, ...(previous ? { previous: previous.content, refinement } : {}) }, signal),signal);
      signal.throwIfAborted();
      concept = { conceptRef: previous?.conceptRef ?? 'concept_' + randomUUID(), version: (previous?.version ?? 0) + 1, briefVersion: saved.state.session.briefVersion,...(locale==='pt-BR'?{}:{locale}), content: validateConcept(output,locale) };
    } catch (reason) {
      const known = reason instanceof IntegrationError;
      if(known)failureDiagnostic=reason.diagnostic;
      error = { code: known ? reason.code : 'generation_unavailable', message: known ? reason.message : 'Não foi possível gerar agora. Suas respostas estão salvas.', requestId, retryable: known ? reason.retryable : true };
    }
    // Await bounded execution within this request; no untracked serverless background task.
    await this.complete(hash, job.jobRef, state => {
      const entry = state.jobs?.[job.jobRef]; if (!entry) return;
      entry.job = concept ? { ...job, status: 'succeeded', concept } : { ...job, status: 'failed', error };
      if(failureDiagnostic)entry.failureDiagnostic=failureDiagnostic;
      if (concept) { state.concepts ??= []; state.concepts.push(concept); }
      stageMarketEvent(this.options.insights,state,concept?'concept.ready':'concept.failed',job.jobRef,requestId,undefined,{outcome:concept?'ready':'failed'},saved.state.session.briefVersion);
      if(concept&&previous)stageMarketEvent(this.options.insights,state,'concept.refined',job.jobRef,requestId,undefined,{outcome:'ready'},saved.state.session.briefVersion);
    },requestDeadline);
    return receipt;
  }
  private async createHandoff(body: unknown, hash: string, saved: StoredSession, key: string, payloadDigest: string, requestId: string,requestDeadline:number) {
    if (!this.options.handoff) throw unavailable();
    const input = fields(body, ['channel', 'address', 'confirmed', 'contextVersion', 'conceptRef', 'conceptVersion']);
    version(input.contextVersion, saved.state.session.briefVersion);
    if (input.confirmed !== true) throw new ApiError(422, 'confirmation_required', 'Confirme o envio do contexto antes de continuar.');
    const channel = input.channel as HandoffChannel;
    if (!this.channels().includes(channel)) throw new ApiError(422, 'channel_unavailable', 'Este canal ainda não está habilitado.');
    let address: string | undefined;
    if (channel === 'here' && input.address !== undefined) throw new ApiError(422, 'invalid_address', 'Esse canal não precisa de endereço.');
    if (channel !== 'here') {
      address = text(input.address, 320);
      if (channel === 'email' ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) : !/^\+[1-9]\d{9,14}$/.test(address)) throw new ApiError(422, 'invalid_address', channel === 'email' ? 'Informe um e-mail válido.' : 'Informe WhatsApp com país e DDD, como +5511999999999.');
    }
    let concept: Concept | undefined;
    if (input.conceptRef !== undefined || input.conceptVersion !== undefined) {
      concept = saved.state.concepts?.find(candidate => candidate.conceptRef === input.conceptRef && candidate.version === input.conceptVersion);
      const latest = saved.state.concepts?.filter(candidate => candidate.conceptRef === input.conceptRef).at(-1);
      if (!concept || concept.version !== latest?.version || concept.briefVersion !== saved.state.session.briefVersion) throw new ApiError(409, 'concept_conflict', 'Confira a versão atual do conceito antes de encaminhar.');
    }
    if (Object.keys(saved.state.handoffs ?? {}).length >= 5) throw new ApiError(429, 'handoff_limit', 'Esta conversa chegou ao limite de encaminhamentos.');
    const existing = Object.values(saved.state.handoffs ?? {}).find(entry => entry.packet.briefVersion === saved.state.session.briefVersion && entry.receipt.status !== 'failed');
    if (existing) throw new ApiError(409, 'handoff_exists', 'Esta conversa já possui um encaminhamento. Consulte seu estado antes de solicitar outro.');
    const handoff: Handoff = { handoffRef: 'handoff_' + randomUUID(), status: 'queued', requestId, updatedAt: new Date().toISOString() };
    const handoffDeadline=Math.min(Date.now()+this.handoffTimeout,requestDeadline-11000);
    if(handoffDeadline<=Date.now())throw new ApiError(503,'service_timeout','A conexão demorou mais que o esperado. Sua conversa está salva; tente novamente.');
    const packet: HandoffPacket = { schemaVersion: '1.0', handoffRef: handoff.handoffRef, channel, ...(address ? { address } : {}), contact: { contactRef:saved.state.identity!.contactRef,leadRef:saved.state.identity!.leadRef,name: saved.state.name!,...saved.state.contactDetails }, briefing: saved.state.briefing, briefVersion: saved.state.session.briefVersion, messages: saved.state.messages, ...(concept ? { concept } : {}), confirmation: { confirmed: true, occurredAt: new Date().toISOString() },...(this.options.insights?{marketContext:{subjectKey:this.options.insights.subjectKey(saved.state.session.sessionRef),policyVersion:this.options.insights.policy.version}}:{}) };
    saved.state.handoffs ??= {};
    saved.state.handoffs[handoff.handoffRef] = { receipt: handoff, packet, deadline: new Date(requestDeadline).toISOString(), lastSequence: 0, events: {} };
    stageMarketEvent(this.options.insights,saved.state,'handoff.requested',handoff.handoffRef,requestId,packet.confirmation.occurredAt,{channel,outcome:'requested'});
    const receipt: Receipt = { digest: payloadDigest, status: 202, body: structuredClone(handoff) };
    const committed = this.checkCommit(await this.store.commit(hash, saved.revision, saved.state, key, receipt));
    if (committed.kind === 'replay') return committed.receipt;
    let accepted = false,rejected=false;
    try { const signal = AbortSignal.timeout(Math.max(1,handoffDeadline-Date.now())); await bounded(this.options.handoff.send(packet, signal),signal); signal.throwIfAborted(); accepted = true; } catch(reason) { rejected=reason instanceof IntegrationError&&reason.code==='handoff_rejected'; /* Ambiguous errors remain queued; never resend automatically. */ }
    if (accepted||rejected) await this.complete(hash, handoff.handoffRef, state => {
      const entry = state.handoffs?.[handoff.handoffRef];
      if (entry && entry.lastSequence === 0) entry.receipt = { ...entry.receipt, status: accepted?'accepted':'failed', updatedAt: new Date().toISOString() };
    },requestDeadline);
    return receipt;
  }
  async webhook(request: Request): Promise<Handoff> {
    if (!this.options.webhookSecret) throw unavailable();
    const timestamp = request.headers.get('x-catalisa-timestamp') || '', signature = request.headers.get('x-catalisa-signature') || '';
    if (!/^\d{10}$/.test(timestamp) || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300 || !/^[a-f0-9]{64}$/.test(signature)) throw new ApiError(401, 'invalid_signature', 'Assinatura inválida.');
    if (Number(request.headers.get('content-length') || 0) > 16000) throw new ApiError(413, 'body_too_large', 'Evento acima do limite.');
    const reader=request.body?.getReader(),chunks:Uint8Array[]=[];let size=0;
    if(reader)while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.byteLength;if(size>16000){await reader.cancel();throw new ApiError(413,'body_too_large','Evento acima do limite.');}chunks.push(chunk.value);}
    const raw=Buffer.concat(chunks).toString('utf8');
    const expected = createHmac('sha256', this.options.webhookSecret).update(timestamp + '.' + raw).digest();
    if (!timingSafeEqual(expected, Buffer.from(signature, 'hex'))) throw new ApiError(401, 'invalid_signature', 'Assinatura inválida.');
    let value: unknown; try { value = JSON.parse(raw); } catch { throw new ApiError(400, 'invalid_json', 'Evento inválido.'); }
    const input = fields(value, ['eventId', 'handoffRef', 'sequence', 'status', 'occurredAt']);
    const event: HandoffEvent = { eventId: text(input.eventId, 100), handoffRef: text(input.handoffRef, 100), sequence: input.sequence as number, status: input.status as HandoffEvent['status'], occurredAt: text(input.occurredAt, 40) };
    if (!/^[\w-]{1,100}$/.test(event.eventId)||['__proto__','constructor','prototype'].includes(event.eventId)||!Number.isSafeInteger(event.sequence) || event.sequence < 1 || !['queued', 'delivered', 'assigned', 'failed'].includes(event.status) || !Number.isFinite(Date.parse(event.occurredAt)) || Math.abs(Date.parse(event.occurredAt) - Date.now()) > 86400000) throw new ApiError(422, 'invalid_event', 'Evento inválido.');
    if (!/^[\w-]{1,100}$/.test(event.handoffRef)) throw new ApiError(422, 'invalid_event', 'Referência inválida.');
    const hash = await this.store.findHandoff(event.handoffRef);
    if (!hash) throw new ApiError(404, 'handoff_not_found', 'Encaminhamento não encontrado.');
    const fingerprint = sha(JSON.stringify(event));
    for (let attempt = 0; attempt < 8; attempt++) {
      const saved = await this.store.read(hash), entry = saved?.state.handoffs?.[event.handoffRef];
      if (!saved || !entry) throw new ApiError(404, 'handoff_not_found', 'Encaminhamento não encontrado.');
      if (Object.hasOwn(entry.events,event.eventId)) {
        if (entry.events[event.eventId] !== fingerprint) throw new ApiError(409, 'event_mismatch', 'Evento já recebido com outros dados.');
        return entry.receipt;
      }
      if (event.sequence <= entry.lastSequence || rank[event.status] < rank[entry.receipt.status] || entry.receipt.status === 'failed') throw new ApiError(409, 'event_out_of_order', 'Evento fora da sequência atual.');
      if (Object.keys(entry.events).length >= 100) throw new ApiError(429, 'event_limit', 'Limite de eventos atingido.');
      entry.events[event.eventId] = fingerprint; entry.lastSequence = event.sequence;
      entry.receipt = { ...entry.receipt, status: event.status, updatedAt: event.occurredAt };
      if(event.status==='delivered'||event.status==='assigned')stageMarketEvent(this.options.insights,saved.state,event.status==='delivered'?'handoff.delivered':'human.assigned',event.eventId,entry.receipt.requestId,event.occurredAt,{channel:entry.packet.channel,outcome:event.status},entry.packet.briefVersion);
      const result = await this.store.commit(hash, saved.revision, saved.state, 'internal:event:' + sha(event.eventId), { digest: fingerprint, status: 200, body: entry.receipt });
      if (result.kind !== 'conflict') { return this.checkCommit(result).receipt.body as Handoff; }
    }
    throw new ApiError(503, 'event_retry', 'Tente o evento novamente.');
  }
}
