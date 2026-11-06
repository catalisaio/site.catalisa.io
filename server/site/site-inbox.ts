import {createHash, randomUUID} from 'node:crypto';
import {ApiError, text} from './input';
import {IntegrationError} from './concept';
import type {HandoffPacket, HandoffTransport} from './types';
import type {HandoffChannel, HandoffEvent} from './concept-types';
import type {SiteMarketInsights} from './site-market-insights';
import {enqueueMarketEvent,marketOutboxMetadata} from './site-market-outbox';
import type {MarketOutbox,MarketOutboxSource} from './site-market-outbox';
import {upstreamPressure} from './upstream-pressure';

export const SITE_INBOX_COLLECTION = 'site_catalisa_inbox_v1';
export const SITE_INBOX_PURPOSE = 'catalisa-site-inbox-v1';
export interface SiteInboxConfig {origin:string; token:string; ownerEmail:string; collection?:string; local?:boolean; fetch?:typeof fetch; retentionMs?:number;insights?:SiteMarketInsights}
/** Only the team API may construct this identity, from a successful Catalisa /auth/me. */
export interface SiteStaffActor {id:string; email:string; displayName:string}
export interface SiteStaffSession {token:string; actor:SiteStaffActor; createdAt:string; expiresAt:string}
/** Construct from the root's already-authorized visitor session, never from a request body. */
export interface SiteVisitorAccess {handoffRef:string; contactRef:string; leadRef:string}
export interface SiteThreadMessage {messageId:string; clientMessageId:string; sequence:number; role:'visitor'|'team'; text:string; occurredAt:string; actorId?:string; displayName?:string}
interface Observation {event:HandoffEvent; basis:'team-context-opened'|'team-claim'; actorId:string}
interface InboxPacket {
  marketOutbox?:MarketOutbox;
  original:HandoffPacket; acceptedAt:string; messages:SiteThreadMessage[];
  openedBy:{actorId:string; at:string}[];
  owner?:{actorId:string; displayName:string; claimedAt:string};
  observations:{delivered?:Observation; assigned?:Observation};
  visitorReadSequence:number;
}
interface Attributes {
  purpose:typeof SITE_INBOX_PURPOSE; kind:'handoff'|'staff'|'quota'|'erased'; expiresAt:string;
  handoffRef?:string; digest?:string; status?:'accepted'|'assigned'; createdAt?:string; updatedAt?:string;
  packet?:InboxPacket|Record<string,never>; staffSession?:SiteStaffSession|Record<string,never>; count?:number;
  marketPending?:boolean;marketNextAt?:string;
}
interface Document {id:string; docKey:string; version:number; attributes:Attributes}
export interface SiteVisitorThread {
  handoffRef:string; channel:'here'; status:'accepted'|'assigned'; updatedAt:string;
  owner?:{displayName:string; claimedAt:string}; messages:Omit<SiteThreadMessage,'actorId'>[]; lastSequence:number;
}
export interface SiteTeamRequest {
  handoffRef:string; status:'accepted'|'assigned'; acceptedAt:string; updatedAt:string;
  contact:{name:string; email?:string; phone?:string}; summary:string; messageCount:number;
  owner?:{actorId:string; displayName:string; claimedAt:string};
}
export interface SiteTeamDetail extends SiteTeamRequest {packet:HandoffPacket; messages:SiteThreadMessage[]; events:HandoffEvent[]}
const sha=(value:string)=>createHash('sha256').update(value).digest('hex');
function canonical(value:unknown):string {
  if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
  if(value&&typeof value==='object')return '{'+Object.entries(value).filter(([,v])=>v!==undefined).sort(([a],[b])=>a.localeCompare(b)).map(([key,v])=>JSON.stringify(key)+':'+canonical(v)).join(',')+'}';
  return JSON.stringify(value);
}
const record=(v:unknown):Record<string,unknown>=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const refPattern=/^handoff_[A-Za-z0-9_-]{1,90}$/;
const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const unavailable=(operation:string,status?:number)=>Object.assign(new ApiError(503,'inbox_unavailable','Não foi possível acessar o atendimento agora. Tente novamente.'),{diagnostic:{operation,httpStatus:status}});
const notFound=()=>new ApiError(404,'thread_not_found','Este atendimento não pertence à conversa ou expirou.');
const now=()=>new Date().toISOString();
function checkedRef(ref:string){if(!refPattern.test(ref))throw notFound();return ref;}
function messageInput(input:{clientMessageId:string;text:string}) {
  if(!uuidPattern.test(input.clientMessageId))throw new ApiError(422,'invalid_message_id','Identifique a mensagem com um UUID válido.');
  return {clientMessageId:input.clientMessageId.toLowerCase(),text:text(input.text,2000)};
}

/** Exclusive site queue. It never calls leads, workflows, chats, e-mail or WhatsApp. */
export class SiteInboxTransport implements HandoffTransport {
  readonly channels:HandoffChannel[]=['here'];
  readonly origin:string;
  private readonly base:string;
  private readonly fetcher:typeof fetch;
  private ready?:Promise<void>;
  private readonly retentionMs:number;
  constructor(private readonly config:SiteInboxConfig){
    const origin=new URL(config.origin);
    if(origin.username||origin.password||origin.search||origin.hash||origin.pathname!=='/'||(origin.protocol!=='https:'&&!(config.local&&origin.protocol==='http:'&&['127.0.0.1','localhost'].includes(origin.hostname))))throw Error('Invalid inbox origin');
    if(!config.token||config.ownerEmail!=='admin@catalisa.app'||(config.collection??SITE_INBOX_COLLECTION)!==SITE_INBOX_COLLECTION)throw Error('Invalid dedicated inbox configuration');
    this.origin=origin.origin;this.base='/data-store/collections/'+SITE_INBOX_COLLECTION;this.fetcher=config.fetch??fetch;
    this.retentionMs=config.retentionMs??30*86400000;
    if(!Number.isSafeInteger(this.retentionMs)||this.retentionMs<86400000||this.retentionMs>90*86400000)throw Error('Invalid inbox retention');
  }
  private async call(path:string,signal:AbortSignal,method='GET',body?:unknown){
    signal.throwIfAborted();
    const encoded=body===undefined?undefined:JSON.stringify(body);
    if(encoded&&Buffer.byteLength(JSON.stringify(record(body).data??body))>480000)throw new ApiError(429,'thread_limit','O atendimento chegou ao limite de armazenamento. Converse com a equipe sobre a continuidade.');
    let response:Response;
    try{response=await this.fetcher(this.origin+path,{method,headers:{Authorization:'Bearer '+this.config.token,Accept:'application/json',...(encoded?{'Content-Type':'application/json'}:{})},...(encoded?{body:encoded}:{}),redirect:'error',signal:AbortSignal.any([signal,AbortSignal.timeout(8000)])});}catch{throw unavailable('storage-request');}
    const pressure=upstreamPressure(response);if(pressure)throw pressure;
    if(response.status===204)return {status:204,body:{} as Record<string,unknown>};
    const reader=response.body?.getReader(),parts:Uint8Array[]=[];let size=0;
    if(reader)while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>6000000){await reader.cancel();throw unavailable('storage-response-size');}parts.push(part.value);}
    let decoded:unknown={};try{if(size)decoded=JSON.parse(Buffer.concat(parts).toString('utf8'));}catch{throw unavailable('storage-json');}
    return {status:response.status,body:record(decoded)};
  }
  private async verify(signal:AbortSignal){
    const me=await this.call('/auth/me',signal),user=record(me.body.user??me.body);
    if(me.status!==200||user.email!==this.config.ownerEmail)throw unavailable('owner-check',me.status);
    const meta=await this.call(this.base,signal),collection=record(meta.body.data??meta.body),properties=record(record(collection.jsonSchema).properties);
    if(meta.status!==200||collection.pii!==true||record(properties.packet).encrypted!==true||record(properties.staffSession).encrypted!==true||!(record(properties.purpose).enum as unknown[]|undefined)?.includes(SITE_INBOX_PURPOSE))throw unavailable('inbox-schema',meta.status);
  }
  private ensureReady(signal:AbortSignal){return this.ready??=this.verify(signal).catch(reason=>{this.ready=undefined;throw reason;});}
  private document(value:unknown):Document {
    const doc=value as Document;
    if(!doc?.id||typeof doc.docKey!=='string'||!Number.isSafeInteger(doc.version)||doc.attributes?.purpose!==SITE_INBOX_PURPOSE||!['handoff','staff','quota','erased'].includes(doc.attributes.kind)||!Number.isFinite(Date.parse(doc.attributes.expiresAt)))throw unavailable('inbox-document');
    return doc;
  }
  private async query(where:Record<string,{op:string;value:unknown}>,signal:AbortSignal,page=1,pageSize=2){
    await this.ensureReady(signal);const result=await this.call(this.base+'/query',signal,'POST',{where,page,pageSize});
    if(![200,201].includes(result.status)||!Array.isArray(result.body.data))throw unavailable('inbox-query',result.status);
    return result.body.data.map(value=>this.document(value));
  }
  private async find(key:string,signal:AbortSignal){
    const docs=await this.query({$docKey:{op:'eq',value:key}},signal);
    if(docs.length>1||docs[0]&&docs[0].docKey!==key)throw unavailable('inbox-key');
    return docs[0]??null;
  }
  private packet(doc:Document|null):InboxPacket {
    const packet=doc?.attributes.packet as InboxPacket|undefined;
    if(!doc||doc.attributes.kind!=='handoff'||doc.attributes.expiresAt<=now())throw notFound();
    if(!packet?.original||!Array.isArray(packet.messages)||!Array.isArray(packet.openedBy)||!packet.observations||doc.docKey!=='handoff:'+doc.attributes.handoffRef||packet.original.handoffRef!==doc.attributes.handoffRef)throw unavailable('inbox-packet');
    if(sha(canonical(packet.original))!==doc.attributes.digest)throw unavailable('inbox-packet-integrity');
    return packet;
  }
  private actor(actor:SiteStaffActor){
    if(actor.email!==this.config.ownerEmail||!actor.id||actor.id.length>160||!actor.displayName||actor.displayName.length>160)throw new ApiError(403,'staff_forbidden','A conta não tem acesso à equipe deste site.');
  }
  private async mutate(ref:string,signal:AbortSignal,change:(packet:InboxPacket)=>boolean,technical=false){
    checkedRef(ref);
    for(let attempt=0;attempt<8;attempt++){
      const doc=await this.find('handoff:'+ref,signal),packet=this.packet(doc);
      if(!change(packet))return doc!;
      const updatedAt=technical?doc!.attributes.updatedAt!:now(),data:Attributes={...doc!.attributes,packet,updatedAt,status:packet.owner?'assigned':'accepted',...marketOutboxMetadata(packet)};
      const result=await this.call(this.base+'/documents/'+encodeURIComponent(doc!.id),signal,'PUT',{expectedVersion:doc!.version,data});
      if(result.status===200)return {...doc!,version:doc!.version+1,attributes:data};
      if(result.status===404)throw notFound();
      if(result.status!==409)throw unavailable('inbox-write',result.status);
    }
    throw new ApiError(503,'inbox_retry','O atendimento foi atualizado ao mesmo tempo. Tente novamente com a mesma identificação da mensagem.');
  }
  async send(packet:HandoffPacket,signal:AbortSignal):Promise<void>{
    if(!refPattern.test(packet.handoffRef)||packet.schemaVersion!=='1.0'||packet.channel!=='here'||packet.address!==undefined||packet.confirmation?.confirmed!==true||!Number.isFinite(Date.parse(packet.confirmation.occurredAt))||!packet.contact?.name?.trim()||!packet.contact.contactRef||!packet.contact.leadRef)throw new IntegrationError('handoff_rejected','Confira o contato e confirme o envio para atendimento aqui no site.');
    const {email,phone}=packet.contact;
    if((!email&&!phone)||(email!==undefined&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))||(phone!==undefined&&!/^\+[1-9]\d{9,14}$/.test(phone)))throw new IntegrationError('handoff_rejected','Informe um e-mail ou telefone válido. Não é necessário informar os dois.');
    if(Buffer.byteLength(JSON.stringify(packet))>200000)throw new IntegrationError('handoff_rejected','Este contexto ultrapassou o limite de encaminhamento. Reduza o histórico antes de tentar novamente.');
    await this.ensureReady(signal);const digest=sha(canonical(packet)),key='handoff:'+packet.handoffRef;
    let doc=await this.find(key,signal);
    if(!doc){
      const acceptedAt=now(),data:Attributes={purpose:SITE_INBOX_PURPOSE,kind:'handoff',handoffRef:packet.handoffRef,digest,status:'accepted',createdAt:acceptedAt,updatedAt:acceptedAt,expiresAt:new Date(Date.now()+this.retentionMs).toISOString(),packet:{original:structuredClone(packet),acceptedAt,messages:[],openedBy:[],observations:{},visitorReadSequence:0}};
      const created=await this.call(this.base+'/documents',signal,'POST',{docKey:key,data});
      if(created.status===201){doc=await this.find(key,signal);if(!doc)throw unavailable('inbox-create-readback');}
      else if(created.status===409)doc=await this.find(key,signal);
      else throw unavailable('inbox-create',created.status);
    }
    if(!doc||doc.attributes.digest!==digest)throw new ApiError(409,'handoff_mismatch','A referência já foi usada para outro contexto. Nenhum pacote existente foi alterado.');
    this.packet(doc); // ACK means durable acceptance only, never delivery/assignment.
  }
  private events(packet:InboxPacket){return [packet.observations.delivered?.event,packet.observations.assigned?.event].filter((event):event is HandoffEvent=>!!event).map(event=>({...event}));}
  private marketEvent(packet:InboxPacket,event:HandoffEvent){
    const context=packet.original.marketContext,insights=this.config.insights;
    if(!context||!insights||context.policyVersion!==insights.policy.version)return;
    const name=event.status==='delivered'?'handoff.delivered':event.status==='assigned'?'human.assigned':undefined;if(!name)return;
    enqueueMarketEvent(packet,insights.prepareForSubject({name,eventId:event.eventId,subjectKey:context.subjectKey,briefVersion:packet.original.briefVersion,occurredAt:event.occurredAt,categories:{sectorCategory:'unknown',problemCategory:'unknown',productCategory:'unknown',intentCategory:'unknown',channel:packet.original.channel,outcome:event.status}}));
  }
  marketSource():MarketOutboxSource{
    if(!this.config.insights)throw Error('Market source requires approved instrumentation');
    return {
      pending:async(limit:number)=>{const docs=await this.query({kind:{op:'eq',value:'handoff'},marketPending:{op:'eq',value:true},marketNextAt:{op:'lte',value:now()},expiresAt:{op:'gt',value:now()}},AbortSignal.timeout(15000),1,Math.min(2,Math.max(1,limit)));return docs.map(doc=>this.packet(doc).original.handoffRef);},
      update:async(ref,change)=>{let changed=false;try{await this.mutate(ref,AbortSignal.timeout(20000),packet=>{changed=change(packet);return changed;},true);return changed;}catch(reason){if(reason instanceof ApiError&&reason.status===404)return false;throw reason;}},
    };
  }
  async observe(ref:string,signal:AbortSignal):Promise<HandoffEvent[]>{
    const doc=await this.find('handoff:'+checkedRef(ref),signal);if(!doc||doc.attributes.kind==='erased'||doc.attributes.expiresAt<=now())return [];
    return this.events(this.packet(doc));
  }
  private visitor(packet:InboxPacket,access:SiteVisitorAccess){
    if(packet.original.handoffRef!==access.handoffRef||packet.original.contact.contactRef!==access.contactRef||packet.original.contact.leadRef!==access.leadRef)throw notFound();
  }
  private thread(doc:Document):SiteVisitorThread {
    const packet=this.packet(doc);
    return {handoffRef:packet.original.handoffRef,channel:'here',status:packet.owner?'assigned':'accepted',updatedAt:doc.attributes.updatedAt!,...(packet.owner?{owner:{displayName:packet.owner.displayName,claimedAt:packet.owner.claimedAt}}:{}),messages:packet.messages.map(({actorId:_,...message})=>({...message})),lastSequence:packet.messages.at(-1)?.sequence??0};
  }
  async readThread(access:SiteVisitorAccess,signal:AbortSignal,acknowledgeReplies=false):Promise<SiteVisitorThread>{
    let doc=await this.find('handoff:'+checkedRef(access.handoffRef),signal);this.visitor(this.packet(doc),access);
    if(acknowledgeReplies)doc=await this.mutate(access.handoffRef,signal,packet=>{this.visitor(packet,access);const sequence=packet.messages.filter(m=>m.role==='team').at(-1)?.sequence??0;if(sequence<=packet.visitorReadSequence)return false;packet.visitorReadSequence=sequence;return true;});
    return this.thread(doc!);
  }
  private append(packet:InboxPacket,role:'visitor'|'team',input:{clientMessageId:string;text:string},actor?:SiteStaffActor){
    const previous=packet.messages.find(m=>m.role===role&&m.clientMessageId===input.clientMessageId);
    if(previous){if(previous.text!==input.text||(role==='team'&&previous.actorId!==actor?.id))throw new ApiError(409,'message_mismatch','Essa identificação já foi usada para outra mensagem.');return false;}
    if(packet.messages.length>=80)throw new ApiError(429,'thread_limit','Este atendimento chegou ao limite de mensagens. Combine a continuidade com a equipe.');
    packet.messages.push({messageId:'site_message_'+randomUUID(),clientMessageId:input.clientMessageId,sequence:(packet.messages.at(-1)?.sequence??0)+1,role,text:input.text,occurredAt:now(),...(actor?{actorId:actor.id,displayName:actor.displayName}:{})});return true;
  }
  async appendVisitorMessage(access:SiteVisitorAccess,input:{clientMessageId:string;text:string},signal:AbortSignal):Promise<SiteVisitorThread>{
    const message=messageInput(input),doc=await this.mutate(access.handoffRef,signal,packet=>{this.visitor(packet,access);return this.append(packet,'visitor',message);});return this.thread(doc);
  }
  private summary(doc:Document):SiteTeamRequest {
    const packet=this.packet(doc);return {handoffRef:packet.original.handoffRef,status:packet.owner?'assigned':'accepted',acceptedAt:packet.acceptedAt,updatedAt:doc.attributes.updatedAt!,contact:{name:packet.original.contact.name,...(packet.original.contact.email?{email:packet.original.contact.email}:{}),...(packet.original.contact.phone?{phone:packet.original.contact.phone}:{})},summary:(packet.original.briefing.idea??'').slice(0,300),messageCount:packet.messages.length,...(packet.owner?{owner:{...packet.owner}}:{})};
  }
  private detail(doc:Document):SiteTeamDetail {const packet=this.packet(doc);return {...this.summary(doc),packet:structuredClone(packet.original),messages:structuredClone(packet.messages),events:this.events(packet)};}
  async listRequests(actor:SiteStaffActor,signal:AbortSignal,page=1){
    this.actor(actor);if(!Number.isSafeInteger(page)||page<1||page>200)throw new ApiError(422,'invalid_page','Página inválida.');
    const docs=await this.query({kind:{op:'eq',value:'handoff'},expiresAt:{op:'gt',value:now()}},signal,page,5);
    return {items:docs.map(doc=>this.summary(doc)),page,nextPage:docs.length===5?page+1:null};
  }
  async openRequest(ref:string,actor:SiteStaffActor,signal:AbortSignal):Promise<SiteTeamDetail>{
    this.actor(actor);const doc=await this.mutate(ref,signal,packet=>{
      if(packet.openedBy.some(open=>open.actorId===actor.id))return false;
      if(packet.openedBy.length>=20)throw new ApiError(429,'operator_limit','Este atendimento atingiu o limite de operadores.');
      const at=now();packet.openedBy.push({actorId:actor.id,at});
      if(!packet.observations.delivered){packet.observations.delivered={event:{eventId:ref+'-site-delivered',handoffRef:ref,sequence:2,status:'delivered',occurredAt:at},basis:'team-context-opened',actorId:actor.id};this.marketEvent(packet,packet.observations.delivered.event);}return true;
    });return this.detail(doc);
  }
  async claim(ref:string,actor:SiteStaffActor,signal:AbortSignal):Promise<SiteTeamDetail>{
    this.actor(actor);const doc=await this.mutate(ref,signal,packet=>{
      if(!packet.openedBy.some(open=>open.actorId===actor.id))throw new ApiError(409,'context_required','Abra o contexto antes de assumir o atendimento.');
      if(packet.owner){if(packet.owner.actorId!==actor.id)throw new ApiError(409,'already_assigned','Outro operador já assumiu este atendimento.');return false;}
      const at=now();packet.owner={actorId:actor.id,displayName:actor.displayName,claimedAt:at};
      packet.observations.assigned={event:{eventId:ref+'-site-assigned',handoffRef:ref,sequence:3,status:'assigned',occurredAt:at},basis:'team-claim',actorId:actor.id};this.marketEvent(packet,packet.observations.assigned.event);return true;
    });return this.detail(doc);
  }
  async reply(ref:string,actor:SiteStaffActor,input:{clientMessageId:string;text:string},signal:AbortSignal):Promise<SiteTeamDetail>{
    this.actor(actor);const message=messageInput(input),doc=await this.mutate(ref,signal,packet=>{
      if(packet.owner?.actorId!==actor.id)throw new ApiError(409,'claim_required','Assuma o atendimento antes de responder.');
      return this.append(packet,'team',message,actor);
    });return this.detail(doc);
  }
  async saveStaffSession(hash:string,session:SiteStaffSession,signal:AbortSignal){
    if(!/^[a-f0-9]{64}$/.test(hash)||!session.token||session.token.length>16000||session.expiresAt<=now()||Date.parse(session.expiresAt)>Date.now()+3600000)throw Error('Invalid staff session');this.actor(session.actor);
    await this.ensureReady(signal);const result=await this.call(this.base+'/documents',signal,'POST',{docKey:'staff:'+hash,data:{purpose:SITE_INBOX_PURPOSE,kind:'staff',expiresAt:session.expiresAt,staffSession:session}});
    if(result.status!==201)throw unavailable('staff-session-create',result.status);
  }
  async readStaffSession(hash:string,signal:AbortSignal):Promise<SiteStaffSession|null>{
    if(!/^[a-f0-9]{64}$/.test(hash))return null;const doc=await this.find('staff:'+hash,signal);
    if(!doc||doc.attributes.kind!=='staff'||doc.attributes.expiresAt<=now())return null;
    const session=doc.attributes.staffSession as SiteStaffSession|undefined;
    if(!session?.token||session.expiresAt!==doc.attributes.expiresAt)throw unavailable('staff-session-data');this.actor(session.actor);return session;
  }
  private async erase(key:string,signal:AbortSignal){
    for(let attempt=0;attempt<8;attempt++){
      const doc=await this.find(key,signal);if(!doc)return;
      if(doc.attributes.kind!=='erased'){
        const cleared=await this.call(this.base+'/documents/'+encodeURIComponent(doc.id),signal,'PUT',{expectedVersion:doc.version,data:{purpose:SITE_INBOX_PURPOSE,kind:'erased',expiresAt:now(),packet:{},staffSession:{},count:0}});
        if(cleared.status===409)continue;if(cleared.status===404)return;if(cleared.status!==200)throw unavailable('inbox-erase',cleared.status);
      }
      const deleted=await this.call(this.base+'/documents/'+encodeURIComponent(doc.id),signal,'DELETE');if(![200,204,404].includes(deleted.status))throw unavailable('inbox-delete',deleted.status);return;
    }
    throw unavailable('inbox-erase-conflict');
  }
  async revokeStaffSession(hash:string,signal:AbortSignal){if(/^[a-f0-9]{64}$/.test(hash))await this.erase('staff:'+hash,signal);}
  /** Persistent CAS quota, including failed login attempts; no IP or password is stored. */
  async quota(key:string,limit:number,expiresAt:string,signal:AbortSignal=AbortSignal.timeout(15000)){
    if(!/^[a-f0-9]{64}$/.test(key)||!Number.isSafeInteger(limit)||limit<1||!Number.isFinite(Date.parse(expiresAt)))throw Error('Invalid quota');
    for(let attempt=0;attempt<8;attempt++){
      const doc=await this.find('quota:'+key,signal);
      if(!doc){const created=await this.call(this.base+'/documents',signal,'POST',{docKey:'quota:'+key,data:{purpose:SITE_INBOX_PURPOSE,kind:'quota',count:1,expiresAt}});if(created.status===201)return true;if(created.status===409)continue;throw unavailable('inbox-quota',created.status);}
      if(doc.attributes.kind!=='quota')throw unavailable('inbox-quota-kind');
      const count=doc.attributes.expiresAt>now()?doc.attributes.count??0:0;if(count>=limit)return false;
      const updated=await this.call(this.base+'/documents/'+encodeURIComponent(doc.id),signal,'PUT',{expectedVersion:doc.version,data:{purpose:SITE_INBOX_PURPOSE,kind:'quota',count:count+1,expiresAt}});
      if(updated.status===200)return true;if([404,409].includes(updated.status))continue;throw unavailable('inbox-quota',updated.status);
    }
    throw unavailable('inbox-quota-conflict');
  }
  async cleanup(signal:AbortSignal,maxRecords=5){
    const docs=await this.query({expiresAt:{op:'lte',value:now()}},signal,1,Math.min(20,Math.max(1,maxRecords)));
    for(const doc of docs)await this.erase(doc.docKey,signal);
    return {removed:docs.length};
  }
}

export function siteInbox(env:Record<string,string|undefined>,local:boolean,insights?:SiteMarketInsights){
  if(env.SITE_HANDOFF_BACKEND!=='site-inbox')return undefined;
  const {SITE_CATALISA_ORIGIN:origin,SITE_CATALISA_TOKEN:token,SITE_CATALISA_OWNER_EMAIL:ownerEmail}=env;
  if(!origin||!token||!ownerEmail)throw Error('Site inbox configuration missing');
  return new SiteInboxTransport({origin,token,ownerEmail,collection:env.SITE_INBOX_COLLECTION??SITE_INBOX_COLLECTION,local,insights});
}
