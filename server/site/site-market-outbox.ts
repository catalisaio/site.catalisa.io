import {createHash,randomUUID} from 'node:crypto';
import type {SessionState,SessionStore} from './types';
import type {SiteMarketInsights} from './site-market-insights';
import type {MarketCategories,MarketEventName,PreparedMarketEvent,MarketOutboxEntry,MarketOutboxOwner,MarketOutboxSource} from '../../shared/site-market';
export type {MarketOutboxEntry,MarketOutbox,MarketOutboxOwner,MarketOutboxSource} from '../../shared/site-market';
export function marketOutboxMetadata(owner:MarketOutboxOwner){
 if(owner.marketOutbox===undefined)return {};
 const due=Object.values(owner.marketOutbox).filter(entry=>entry.attempts<8).map(entry=>entry.nextAttemptAt).sort();
 return {marketPending:due.length>0,marketNextAt:due[0]??'9999-12-31T23:59:59.999Z'};
}
const digest=(value:string)=>createHash('sha256').update(value).digest('hex');
export function enqueueMarketEvent(owner:MarketOutboxOwner,event:PreparedMarketEvent){
 owner.marketOutbox??={};if(Object.hasOwn(owner.marketOutbox,event.eventKey))return;
 if(Object.keys(owner.marketOutbox).length>=800)throw Error('Market outbox maximum exceeded');
 owner.marketOutbox[event.eventKey]={event,attempts:0,nextAttemptAt:new Date().toISOString()};
}
/** Called before the same business-state CAS. It never performs analytics network I/O. */
export function stageMarketEvent(insights:SiteMarketInsights|undefined,state:SessionState,name:MarketEventName,eventId:string,requestId:string,occurredAt=new Date().toISOString(),categories:MarketCategories={},briefVersion=state.session.briefVersion){
 if(!insights)return;
 const event=insights.prepare({name,eventId,requestId,occurredAt,sessionRef:state.session.sessionRef,briefVersion,categories:{sectorCategory:'unknown',problemCategory:'unknown',productCategory:'unknown',intentCategory:'unknown',...categories}});
 enqueueMarketEvent(state,event);
}
/** CAS preserves concurrent visitor edits while adding only bounded, minimized delivery bookkeeping. */
export class SessionMarketSource implements MarketOutboxSource {
 constructor(private store:SessionStore){}
 pending(limit:number){if(!this.store.pendingMarketSessions)throw Error('Selected store does not support durable market outbox discovery');return this.store.pendingMarketSessions(limit);}
 async update(hash:string,change:(owner:MarketOutboxOwner)=>boolean){
  const operation='internal:market:'+randomUUID();
  for(let attempt=0;attempt<8;attempt++){
   const saved=await this.store.read(hash);if(!saved||!change(saved.state))return false;
   const result=await this.store.commit(hash,saved.revision,saved.state,operation,{digest:digest(operation),status:200,body:{}});
   if(result.kind==='committed'||result.kind==='replay')return true;if(result.kind!=='conflict')return false;
  }
  return false;
 }
}
/** At-least-once delivery, durable leases and receiver dedup; never retries AI or a handoff. */
export class SiteMarketWorker {
 private running=false;
 private nextSource=0;
 readonly last={cycles:0,stored:0,expired:0,suppressed:0,failed:0,deadLetters:0,backoffUntil:null as string|null};
 constructor(private insights:SiteMarketInsights,private sources:MarketOutboxSource[]){}
 private backoff(reason:unknown){
  const delay=(reason as {retryAfterMs?:number})?.retryAfterMs;if(!delay||!Number.isFinite(delay))return false;
  this.last.backoffUntil=new Date(Date.now()+Math.min(3600000,Math.max(1000,delay))).toISOString();return true;
 }
 async run(maxEvents=3,budgetMs=20000){
  if(this.last.backoffUntil&&Date.parse(this.last.backoffUntil)>Date.now())return {...this.last,busy:false};this.last.backoffUntil=null;
  maxEvents=Math.max(1,Math.min(maxEvents,5));
  if(this.running)return {...this.last,busy:true};this.running=true;const deadline=Date.now()+budgetMs;let processed=0;
  try{
   for(let n=0;n<this.sources.length&&processed<maxEvents&&Date.now()<deadline;n++){
    const index=(this.nextSource+n)%this.sources.length,source=this.sources[index],keys=await source.pending(Math.min(maxEvents,20));
    for(const key of keys){
     if(processed>=maxEvents||Date.now()>=deadline)break;
     let selected:MarketOutboxEntry|undefined,eventKey='',leaseId='';
     const leased=await source.update(key,owner=>{
      const due=Object.entries(owner.marketOutbox??{}).find(([,entry])=>entry.attempts<8&&Date.parse(entry.nextAttemptAt)<=Date.now());if(!due)return false;
      [eventKey,selected]=due;leaseId=randomUUID();selected.attempts++;selected.leaseId=leaseId;selected.nextAttemptAt=new Date(Date.now()+60000).toISOString();selected=structuredClone(selected);return true;
     });
     const reserved=selected as MarketOutboxEntry|undefined;
     if(!leased||!reserved||!leaseId)continue;processed++;let result:'stored'|'expired'|'suppressed'|'failed'='failed';
     try{result=await this.insights.recordPrepared(reserved.event);}catch(reason){if(this.backoff(reason)){this.last.failed++;return {...this.last,busy:false};} /* No provider body, subject or business text is logged. */ }
     await source.update(key,owner=>{
      const entry=owner.marketOutbox?.[eventKey];if(!entry||entry.leaseId!==leaseId)return false;
      if(result!=='failed')delete owner.marketOutbox![eventKey];
      else{entry.lastError='delivery_unavailable';delete entry.leaseId;entry.nextAttemptAt=new Date(Date.now()+Math.min(3600000,30000*2**Math.min(reserved.attempts,7))).toISOString();}
      return true;
     });
     this.last[result]++;if(result==='failed'&&reserved.attempts>=8)this.last.deadLetters++;
    }
   }
   this.nextSource=(this.nextSource+1)%Math.max(1,this.sources.length);this.last.cycles++;return {...this.last,busy:false};
  }catch(reason){if(this.backoff(reason)){this.last.failed++;return {...this.last,busy:false};}throw reason;}finally{this.running=false;}
 }
 async cleanup(){await this.insights.cleanup();}
}
