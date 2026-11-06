import {createHmac,timingSafeEqual} from 'node:crypto';
import {MARKET_EVENT_NAMES,MARKET_TAXONOMY} from '../../shared/site-market';
import type {MarketActor,MarketCategories,MarketEventName,MarketFrame,MarketPolicyApproval,MarketReview,MarketStorage,PreparedMarketEvent} from '../../shared/site-market';
export * from '../../shared/site-market';
import {ApiError,fields,text} from './input';

const day=(value:string)=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value)throw new ApiError(422,'invalid_day','Escolha uma data válida.');return value;};
const canonical=(value:unknown):string=>Array.isArray(value)?'['+value.map(canonical).join(',')+']':value&&typeof value==='object'?'{'+Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,value])=>JSON.stringify(key)+':'+canonical(value)).join(',')+'}':JSON.stringify(value);
export function marketCategories(value:unknown):MarketCategories {
 const input=fields(value,['sectorCategory','problemCategory','productCategory','intentCategory','outcome','channel','capabilitySlug']),result:MarketCategories={};
 for(const[key,value]of Object.entries(input)){
  const values=MARKET_TAXONOMY[key as keyof MarketCategories] as readonly string[];
  if(typeof value!=='string'||!values.includes(value))throw new ApiError(422,'invalid_category','Escolha uma categoria da taxonomia autorizada.');
  result[key as keyof MarketCategories]=value;
 }
 return result;
}
/** Server-only instrumentation. No cookies, text, raw IDs, IPs or credentials are persisted. */
export class SiteMarketInsights {
 constructor(private storage:MarketStorage,private secret:string,readonly policy:MarketPolicyApproval){
  if(secret.length<32||policy.status!=='approved'||policy.approvedBy!=='admin@catalisa.app'||!Number.isFinite(Date.parse(policy.approvedAt))||Date.parse(policy.approvedAt)>Date.now()||!/^\w[\w.-]{0,79}$/.test(policy.version)||!/^[a-f0-9]{64}$/.test(policy.publishedPolicySha256)||policy.taxonomyRevision!==MARKET_TAXONOMY.revision||!Number.isInteger(policy.retentionDays)||policy.retentionDays<1||policy.retentionDays>90||!Number.isInteger(policy.minimumSubjects)||policy.minimumSubjects<5||policy.minimumSubjects>100)throw Error('Approved published market policy and taxonomy required');
 }
 private key(purpose:string,value:string){return createHmac('sha256',this.secret).update(purpose+'\0'+value).digest('hex');}
 subjectKey(sessionRef:string){return this.key('market-subject',text(sessionRef,100));}
 private actor(actor:MarketActor){if(actor.email!=='admin@catalisa.app'||!actor.id)throw new ApiError(403,'market_forbidden','A conta não pode acessar os indicadores deste site.');}
 private expiry(){return new Date(Date.now()+this.policy.retentionDays*86400000).toISOString();}
 async review(actor:MarketActor,subjectKey:string){
  this.actor(actor);if(!/^[a-f0-9]{64}$/.test(subjectKey))throw new ApiError(422,'invalid_market_review','Referência de categorização inválida.');
  return await this.storage.readReview(subjectKey)??{subjectKey,categories:{},revision:0};
 }
 prepare(value:unknown):PreparedMarketEvent{
  const input=fields(value,['name','eventId','occurredAt','requestId','sessionRef','briefVersion','categories']);
  const name=text(input.name,40) as MarketEventName,eventId=text(input.eventId,160),sessionRef=text(input.sessionRef,100);text(input.requestId,100);
  if(!MARKET_EVENT_NAMES.includes(name)||!Number.isSafeInteger(input.briefVersion)||(input.briefVersion as number)<0)throw new ApiError(422,'invalid_market_event','Evento de funil inválido.');
  const occurredAt=text(input.occurredAt,40),at=Date.parse(occurredAt);
  if(!Number.isFinite(at)||Math.abs(at-Date.now())>86400000)throw new ApiError(422,'invalid_market_event','Data de evento inválida.');
  return this.prepareForSubject({name,eventId,subjectKey:this.subjectKey(sessionRef),briefVersion:input.briefVersion as number,occurredAt,categories:marketCategories(input.categories??{})});
 }
 prepareForSubject(input:{name:MarketEventName;eventId:string;subjectKey:string;briefVersion:number;occurredAt:string;categories?:MarketCategories}):PreparedMarketEvent{
  if(!MARKET_EVENT_NAMES.includes(input.name)||!/^[a-f0-9]{64}$/.test(input.subjectKey)||!input.eventId||input.eventId.length>160||!Number.isSafeInteger(input.briefVersion)||input.briefVersion<0||!Number.isFinite(Date.parse(input.occurredAt)))throw new ApiError(422,'invalid_market_event','Evento de funil inválido.');
  const frame:MarketFrame={name:input.name,subjectKey:input.subjectKey,briefVersion:input.briefVersion,eventDay:new Date(input.occurredAt).toISOString().slice(0,10),taxonomyRevision:MARKET_TAXONOMY.revision,policyVersion:this.policy.version,categories:marketCategories(input.categories??{}),classification:{origin:'server-event',confidence:'observed-state-unclassified-demand'}};
  const eventKey=this.key('market-event',input.subjectKey+'\0'+input.eventId+'\0'+input.name),expiresAt=new Date(Date.parse(input.occurredAt)+this.policy.retentionDays*86400000).toISOString();
  return {eventKey,frame,expiresAt,proof:this.key('market-proof',canonical({eventKey,frame,expiresAt}))};
 }
 async recordPrepared(input:PreparedMarketEvent):Promise<'stored'|'expired'|'suppressed'>{
  if(!/^[a-f0-9]{64}$/.test(input.eventKey)||!/^[a-f0-9]{64}$/.test(input.proof)||!Number.isFinite(Date.parse(input.expiresAt)))throw new ApiError(422,'invalid_market_proof','Evento de funil inválido.');
  const proof=this.key('market-proof',canonical({eventKey:input.eventKey,frame:input.frame,expiresAt:input.expiresAt}));if(!timingSafeEqual(Buffer.from(proof,'hex'),Buffer.from(input.proof,'hex')))throw new ApiError(422,'invalid_market_proof','Evento de funil inválido.');
  if(Date.parse(input.expiresAt)<=Date.now())return 'expired';const result=await this.storage.append(input.eventKey,input.frame,input.expiresAt);return result==='suppressed'?'suppressed':'stored';
 }
 async record(value:unknown){await this.recordPrepared(this.prepare(value));}
 async cleanup(){await this.storage.cleanup?.();}
 async erase(actor:MarketActor,subjectKey:string){
  this.actor(actor);if(!/^[a-f0-9]{64}$/.test(subjectKey))throw new ApiError(422,'invalid_market_review','Referência de categorização inválida.');
  if(!this.storage.eraseSubject)throw new ApiError(503,'market_erase_unavailable','A exclusão de indicadores está temporariamente indisponível.');
  return this.storage.eraseSubject(subjectKey,this.expiry());
 }
 async revise(actor:MarketActor,value:unknown){
  this.actor(actor);const input=fields(value,['subjectKey','expectedRevision','categories']),subjectKey=text(input.subjectKey,64);
  if(!/^[a-f0-9]{64}$/.test(subjectKey)||!Number.isSafeInteger(input.expectedRevision)||(input.expectedRevision as number)<0)throw new ApiError(422,'invalid_market_review','Revisão inválida.');
  const previous=await this.storage.readReview(subjectKey);if((previous?.revision??0)!==input.expectedRevision)throw new ApiError(409,'market_review_conflict','A categorização foi atualizada. Reabra antes de corrigir.');
  if((previous?.history?.length??0)>=49)throw new ApiError(429,'market_review_limit','Esta referência atingiu o limite de revisões. Consulte o responsável pelos dados.');
  const history=previous?[...(previous.history??[]),Object.fromEntries(Object.entries(previous).filter(([key])=>key!=='history')) as Omit<MarketReview,'history'>]:[];
  const review:MarketReview={subjectKey,categories:marketCategories(input.categories),revision:(input.expectedRevision as number)+1,reviewerKey:this.key('market-reviewer',actor.id),reviewedAt:new Date().toISOString(),origin:'operator',confidence:'human-reviewed',history};
  await this.storage.writeReview(review,input.expectedRevision as number,this.expiry());return review;
 }
 async report(actor:MarketActor,fromDay:string,toDay:string){
  this.actor(actor);day(fromDay);day(toDay);
  if(fromDay>toDay||(Date.parse(toDay)-Date.parse(fromDay))/86400000>6||Date.parse(fromDay)<Date.now()-(this.policy.retentionDays+1)*86400000||Date.parse(toDay)>Date.now())throw new ApiError(422,'invalid_market_range','Escolha até sete dias dentro do período de retenção.');
  const frames=await this.storage.events(fromDay,toDay),subjects=[...new Set(frames.map(frame=>frame.subjectKey))],reviews=this.storage.reviews?await this.storage.reviews(subjects):new Map<string,MarketReview|null>();
  if(!this.storage.reviews)for(const subject of subjects)reviews.set(subject,await this.storage.readReview(subject));
  return aggregateMarketFrames(frames,reviews,this.policy.minimumSubjects,{fromDay,toDay,policyVersion:this.policy.version});
 }
}
/** Independent suppression per bucket; small groups expose no count or subject identifiers. */
export function aggregateMarketFrames(frames:MarketFrame[],reviews:Map<string,MarketReview|null>,minimumSubjects:number,context:{fromDay:string;toDay:string;policyVersion:string}){
 const buckets=new Map<string,{dimension:string;value:string;events:number;subjects:Set<string>}>();
 for(const frame of frames){
  const categories={...frame.categories,...reviews.get(frame.subjectKey)?.categories};
  for(const[dimension,value]of [['event',frame.name],...Object.entries(categories)]){
   const key=dimension+'\0'+value,bucket=buckets.get(key)??{dimension,value,events:0,subjects:new Set<string>()};bucket.events++;bucket.subjects.add(frame.subjectKey);buckets.set(key,bucket);
  }
 }
 const rows=[...buckets.values()].filter(bucket=>bucket.subjects.size>=minimumSubjects).map(bucket=>({dimension:bucket.dimension,value:bucket.value,events:bucket.events,subjects:bucket.subjects.size})).sort((a,b)=>a.dimension.localeCompare(b.dimension)||a.value.localeCompare(b.value));
 return {...context,taxonomyRevision:MARKET_TAXONOMY.revision,minimumSubjects,rows,smallGroupsSuppressed:true};
}
/** A flag alone never enables collection. Approval must match the published policy hash. */
export function configuredMarketInsights(env:Record<string,string|undefined>,storage:MarketStorage,approval?:MarketPolicyApproval){
 if(env.SITE_MARKET_INSIGHTS_ENABLED!=='1')return undefined;
 if(!approval||env.SITE_MARKET_POLICY_SHA256!==approval.publishedPolicySha256)throw Error('Market insights require explicit matching published policy approval');
 return new SiteMarketInsights(storage,env.SITE_SESSION_SECRET??'',approval);
}
