// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {ApiError} from './input';
import {aggregateMarketFrames,configuredMarketInsights,MARKET_EVENT_NAMES,MARKET_TAXONOMY,SiteMarketInsights} from './site-market-insights';
import type {MarketFrame,MarketPolicyApproval,MarketReview,MarketStorage} from './site-market-insights';
import {marketTeamRequest,marketTeamView} from './site-market-api';
import {Script} from 'node:vm';
const secret='test-only-market-secret-32-characters-long',hash='a'.repeat(64),actor={id:'operator-test',email:'admin@catalisa.app'};
const approval:MarketPolicyApproval={status:'approved',version:'test-fixture-only',publishedPolicySha256:hash,approvedBy:actor.email,approvedAt:'2026-01-01T00:00:00Z',retentionDays:90,minimumSubjects:5,taxonomyRevision:MARKET_TAXONOMY.revision};
class Memory implements MarketStorage {
 frames=new Map<string,MarketFrame>();review=new Map<string,MarketReview>();
 async append(key:string,value:MarketFrame){const old=this.frames.get(key);if(old&&JSON.stringify(old)!==JSON.stringify(value))throw new ApiError(409,'market_event_mismatch','Mismatch');this.frames.set(key,structuredClone(value));}
 async readReview(key:string){return this.review.get(key)??null;}
 async writeReview(review:MarketReview,expectedRevision:number){if((this.review.get(review.subjectKey)?.revision??0)!==expectedRevision)throw new ApiError(409,'market_review_conflict','Conflict');this.review.set(review.subjectKey,review);}
 async events(from:string,to:string){return [...this.frames.values()].filter(frame=>frame.eventDay>=from&&frame.eventDay<=to);}
}
const input=(name:string='session.started',sessionRef='private-session-reference')=>({name,eventId:'private-event-id',occurredAt:new Date().toISOString(),requestId:'private-request-id',sessionRef,briefVersion:1,categories:{sectorCategory:'financial'}});
describe('gated and minimized site market insights',()=>{
 it('keeps the operator portal syntactically valid and its disabled route closed',async()=>{
  const html=marketTeamView('test-nonce'),script=html.match(/<script nonce="test-nonce">([\s\S]*?)<\/script>/)?.[1];expect(script).toBeTruthy();expect(()=>new Script(script!)).not.toThrow();expect(script).not.toContain('innerHTML');
  const result=await marketTeamRequest(new Request('https://site-test.invalid/api/site/team/metrics/report'),actor,{mode:'STAFF',origins:['https://site-test.invalid']});expect(result?.status).toBe(503);
 });
 it('performs no collection with default flag and refuses an unapproved or mismatched published policy',()=>{
  const store=new Memory();expect(configuredMarketInsights({},store)).toBeUndefined();expect(store.frames.size).toBe(0);
  expect(()=>configuredMarketInsights({SITE_MARKET_INSIGHTS_ENABLED:'1'},store)).toThrow();expect(()=>configuredMarketInsights({SITE_MARKET_INSIGHTS_ENABLED:'1',SITE_MARKET_POLICY_SHA256:'b'.repeat(64),SITE_SESSION_SECRET:secret},store,approval)).toThrow();
 });
 it('records all ten contract events once and persists no source IDs or raw text',async()=>{
  const store=new Memory(),service=new SiteMarketInsights(store,secret,approval);
  for(const name of MARKET_EVENT_NAMES){const event=input(name);await service.record(event);await service.record(event);}
  expect(store.frames.size).toBe(10);const stored=JSON.stringify([...store.frames]);for(const raw of ['private-session-reference','private-event-id','private-request-id'])expect(stored).not.toContain(raw);
  expect([...store.frames.values()].every(frame=>/^[a-f0-9]{64}$/.test(frame.subjectKey))).toBe(true);
 });
 it('rejects free text, unknown categories and unknown capability slugs before storage',async()=>{
  const store=new Memory(),service=new SiteMarketInsights(store,secret,approval);
  for(const value of [{...input(),email:'person@example.invalid'},{...input(),categories:{sectorCategory:'a customer free-text sector'}},{...input(),categories:{capabilitySlug:'made-up-capability'}},{...input(),categories:{sectorCategory:'financial',text:'conversation'}}])await expect(service.record(value)).rejects.toMatchObject({status:422});
  expect(store.frames.size).toBe(0);
 });
 it('requires five distinct subjects, not five repeated events from one visitor',()=>{
  const frame:MarketFrame={name:'concept.ready',subjectKey:'subject-one',briefVersion:1,eventDay:new Date().toISOString().slice(0,10),taxonomyRevision:MARKET_TAXONOMY.revision,categories:{sectorCategory:'financial'}};
  const report=aggregateMarketFrames(Array.from({length:10},()=>frame),new Map(),5,{fromDay:frame.eventDay,toDay:frame.eventDay,policyVersion:'fixture'});expect(report.rows).toEqual([]);expect(report.smallGroupsSuppressed).toBe(true);
 });
 it('applies reviewed taxonomy to aggregates with CAS and suppresses newly small categories',async()=>{
  const store=new Memory(),service=new SiteMarketInsights(store,secret,approval),today=new Date().toISOString().slice(0,10);
  for(let i=0;i<10;i++)await service.record({...input('session.started','visitor-'+i),categories:{sectorCategory:i<5?'financial':'health'}});
  let report=await service.report(actor,today,today);expect(report.rows.find(row=>row.value==='financial')?.subjects).toBe(5);
  const subjectKey=service.subjectKey('visitor-0');await service.revise(actor,{subjectKey,expectedRevision:0,categories:{sectorCategory:'health'}});
  await expect(service.revise(actor,{subjectKey,expectedRevision:0,categories:{sectorCategory:'financial'}})).rejects.toMatchObject({status:409});
  report=await service.report(actor,today,today);expect(report.rows.find(row=>row.value==='financial')).toBeUndefined();expect(report.rows.find(row=>row.value==='health')?.subjects).toBe(6);expect(JSON.stringify(report)).not.toContain(subjectKey);
 });
 it('authorizes reports and corrections and validates bounded report dates',async()=>{
  const service=new SiteMarketInsights(new Memory(),secret,approval),today=new Date().toISOString().slice(0,10);
  await expect(service.report({...actor,email:'other@example.invalid'},today,today)).rejects.toMatchObject({status:403});
  await expect(service.revise({...actor,email:'other@example.invalid'},{subjectKey:hash,expectedRevision:0,categories:{}})).rejects.toMatchObject({status:403});
  await expect(service.report(actor,'2026-02-31',today)).rejects.toMatchObject({status:422});
  await expect(service.report(actor,'2020-01-01',today)).rejects.toMatchObject({status:422});
 });
});
