// @vitest-environment node
import {afterEach,describe,expect,it,vi} from 'vitest';
import {createHash,randomUUID} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {createSiteApi} from './api';
import {SqliteSessionStore} from './sqlite-store';
import {SiteInboxTransport} from './site-inbox';
import {createSiteTeamApi} from './site-team-api';
import {MARKET_EVENT_NAMES,MARKET_TAXONOMY,SiteMarketInsights} from './site-market-insights';
import type {MarketFrame,MarketPolicyApproval,MarketReview,MarketStorage} from './site-market-insights';
import {SessionMarketSource,SiteMarketWorker} from './site-market-outbox';
import {fixtureSitePanel} from './__fixtures__/site-panel';
import {CatalisaMarketStorage} from './site-market-store';
import {upstreamPressure} from './upstream-pressure';
const secret='fixture-market-session-secret-with-more-than-32-characters',origin='http://localhost:5175';
const approval:MarketPolicyApproval={status:'approved',version:'fixture-only',publishedPolicySha256:'a'.repeat(64),approvedBy:'admin@catalisa.app',approvedAt:'2026-01-01T00:00:00Z',retentionDays:90,minimumSubjects:5,taxonomyRevision:MARKET_TAXONOMY.revision};
const example=JSON.parse(readFileSync('docs/redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/contracts/concept.example.json','utf8'));example.journey.forEach((step:{humanReview:boolean})=>{step.humanReview=false;});
const contractNames=JSON.parse(readFileSync('docs/redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/contracts/events.json','utf8')).events.map((event:{name:string})=>event.name);
const stores:SqliteSessionStore[]=[];afterEach(()=>{for(const store of stores.splice(0))store.close();vi.useRealTimers();vi.restoreAllMocks();});
class MemoryMetrics implements MarketStorage {
 frames=new Map<string,MarketFrame>();reviewsBySubject=new Map<string,MarketReview>();append=vi.fn(async(key:string,frame:MarketFrame)=>{const previous=this.frames.get(key);if(previous&&JSON.stringify(previous)!==JSON.stringify(frame))throw Error('Changed duplicate');this.frames.set(key,structuredClone(frame));});
 async readReview(key:string){return this.reviewsBySubject.get(key)??null;}
 async writeReview(review:MarketReview,expectedRevision:number){if((this.reviewsBySubject.get(review.subjectKey)?.revision??0)!==expectedRevision)throw Error('CAS conflict');this.reviewsBySubject.set(review.subjectKey,review);}
 async events(from:string,to:string){return [...this.frames.values()].filter(frame=>frame.eventDay>=from&&frame.eventDay<=to);}
}
function fixture(){
 const store=new SqliteSessionStore(':memory:');stores.push(store);const storage=new MemoryMetrics(),insights=new SiteMarketInsights(storage,secret,approval),panel=fixtureSitePanel();
 const inbox=new SiteInboxTransport({origin:'https://fixture.invalid',token:'fixture-only',ownerEmail:'admin@catalisa.app',insights,fetch:panel.fetch});
 const worker=new SiteMarketWorker(insights,[new SessionMarketSource(store),inbox.marketSource()]);
 const generator={generate:vi.fn(async()=>structuredClone(example))};
 const visitor=createSiteApi({store,secret,origins:[origin],secure:false,generator,handoff:inbox,insights});
 const team=createSiteTeamApi({inbox,secret,origin:'https://fixture.invalid',ownerEmail:'admin@catalisa.app',secure:false,origins:[origin],insights,marketWorker:worker,fetch:panel.fetch});
 async function call(route:string,method='GET',body?:unknown,cookie='',key=randomUUID()){
  const request=new Request(origin+'/api/site/'+route,{method,headers:{Origin:origin,Cookie:cookie,'Content-Type':'application/json','Idempotency-Key':key},...(body===undefined?{}:{body:JSON.stringify(body)})});return await team(request,'127.0.0.1')??visitor(request,'127.0.0.1');
 }
 async function start(complete=false){const response=await call('sessions','POST'),cookie=response.headers.get('set-cookie')!.split(';')[0];if(complete){for(const[i,step]of ['idea','context','goal'].entries())expect((await call('messages','POST',{clientMessageId:randomUUID(),step,text:'Texto privado que não deve ir a analytics',briefVersion:i},cookie)).status).toBe(201);await call('identity','POST',{name:'Nome privado do teste',briefVersion:3},cookie);await call('contact','POST',{email:'private@example.invalid',briefVersion:3},cookie);}return cookie;}
 const saved=(cookie:string)=>store.read(createHash('sha256').update(cookie.split('=')[1]).digest('hex'));
 return {store,storage,insights,panel,inbox,worker,generator,call,start,saved};
}
describe('atomic site funnel outbox and authenticated operator',()=>{
 it('limits a normal worker cycle to three events to leave API capacity for Contact',async()=>{
  const f=fixture();for(let i=0;i<5;i++)await f.start();await f.worker.run();expect(f.storage.frames.size).toBe(3);expect(f.worker.last.stored).toBe(3);
 });
 it('opens a circuit on upstream 429, respects Retry-After and leaves the leased event durable',async()=>{
  vi.useFakeTimers();const f=fixture(),cookie=await f.start(),source=new SessionMarketSource(f.store),pending=vi.spyOn(source,'pending'),worker=new SiteMarketWorker(f.insights,[source]);
  const pressure=upstreamPressure(new Response('Never log this upstream body',{status:429,headers:{'Retry-After':'120'}}));f.storage.append.mockRejectedValueOnce(pressure);
  await worker.run();expect(f.storage.append).toHaveBeenCalledTimes(1);expect(worker.last.backoffUntil).toBe(new Date(Date.now()+120000).toISOString());expect(Object.values((await f.saved(cookie))!.state.marketOutbox!)[0].attempts).toBe(1);
  await worker.run();expect(pending).toHaveBeenCalledTimes(1);expect(f.storage.append).toHaveBeenCalledTimes(1);expect(JSON.stringify(worker.last)).not.toContain('Never log');
  vi.setSystemTime(Date.now()+120001);await worker.run();expect(f.storage.frames.size).toBe(1);expect((await f.saved(cookie))!.state.marketOutbox).toEqual({});
 });
 it('produces all ten contracts from committed real handlers, drains separately and protects aggregate/review routes',async()=>{
  const f=fixture(),cookie=await f.start(true),job=await(await f.call('concepts','POST',{briefVersion:3},cookie)).json();
  const initial=await(await f.call('jobs/'+job.jobRef,'GET',undefined,cookie)).json();
  const refined=await(await f.call('concepts/'+initial.concept.conceptRef+'/revisions','POST',{briefVersion:3,baseConceptVersion:1,adjustment:'human-review'},cookie)).json();expect(refined.status).toBe('succeeded');
  f.generator.generate.mockRejectedValueOnce(Error('Private provider payload must never become analytics'));
  await f.call('concepts/'+initial.concept.conceptRef+'/revisions','POST',{briefVersion:3,baseConceptVersion:2,text:'Outro texto privado'},cookie);
  const handoff=await(await f.call('handoffs','POST',{channel:'here',confirmed:true,contextVersion:3,conceptRef:initial.concept.conceptRef,conceptVersion:2},cookie)).json();
  expect((await f.call('team/metrics/report','GET',undefined,cookie)).status).toBe(401);
  const login=await f.call('team/login','POST',{email:'admin@catalisa.app',password:'fixture-password'}),staff=login.headers.get('set-cookie')!.split(';')[0];
  expect((await f.call('team/requests/'+handoff.handoffRef,'GET',undefined,staff)).status).toBe(200);
  expect((await f.call('team/requests/'+handoff.handoffRef+'/claim','POST',{},staff)).status).toBe(200);
  expect(f.storage.frames.size).toBe(0);const outbox=JSON.stringify((await f.saved(cookie))!.state.marketOutbox);for(const privateText of ['Texto privado','Nome privado','private@example.invalid','Private provider'])expect(outbox).not.toContain(privateText);
  for(let i=0;i<20;i++)await f.worker.run();expect(new Set(MARKET_EVENT_NAMES)).toEqual(new Set(contractNames));expect(new Set([...f.storage.frames.values()].map(frame=>frame.name))).toEqual(new Set(contractNames));expect(f.generator.generate).toHaveBeenCalledTimes(2);
  const small=await(await f.call('team/metrics/report','GET',undefined,staff)).json();expect(small.rows).toEqual([]);
  for(let i=0;i<4;i++)await f.start();for(let i=0;i<4;i++)await f.worker.run();
  const today=new Date().toISOString().slice(0,10),report=await(await f.call('team/metrics/report?fromDay='+today+'&toDay='+today,'GET',undefined,staff)).json();expect(report.rows.find((row:{value:string})=>row.value==='session.started')?.subjects).toBe(5);expect(JSON.stringify(report)).not.toContain('Nome privado');
  const subjectKey=f.insights.subjectKey((await f.saved(cookie))!.state.session.sessionRef),review=await f.call('team/metrics/reviews','POST',{subjectKey,expectedRevision:0,categories:{sectorCategory:'financial'}},staff);expect(review.status).toBe(200);expect((await review.json()).confidence).toBe('human-reviewed');
  const second=await(await f.call('team/metrics/reviews','POST',{subjectKey,expectedRevision:1,categories:{sectorCategory:'retail'}},staff)).json();expect(second.history).toHaveLength(1);expect(second.origin).toBe('operator');
  expect((await f.call('team/metrics/reviews','POST',{subjectKey,expectedRevision:0,categories:{}},staff)).status).toBe(409);
  expect((await f.call('team/logout','POST',{},staff)).status).toBe(200);expect((await f.call('team/metrics/report','GET',undefined,staff)).status).toBe(401);
 });
 it('keeps business state and minimized outbox together when human-review CAS conflicts',async()=>{
  const f=fixture(),cookie=await f.start(true),job=await(await f.call('concepts','POST',{briefVersion:3},cookie)).json(),concept=(await(await f.call('jobs/'+job.jobRef,'GET',undefined,cookie)).json()).concept,before=await f.saved(cookie);
  vi.spyOn(f.store,'commit').mockResolvedValueOnce({kind:'conflict'});
  expect((await f.call('concepts/'+concept.conceptRef+'/revisions','POST',{briefVersion:3,baseConceptVersion:1,adjustment:'human-review'},cookie)).status).toBe(409);
  const after=await f.saved(cookie);expect(after?.state.marketOutbox).toEqual(before?.state.marketOutbox);expect(after?.state.concepts).toEqual(before?.state.concepts);expect(f.storage.frames.size).toBe(0);
 });
 it('recovers a lost sink ACK idempotently, with no automatic retry of the business operation',async()=>{
  vi.useFakeTimers();const f=fixture(),cookie=await f.start();
  f.storage.append.mockImplementationOnce(async(key,frame)=>{f.storage.frames.set(key,structuredClone(frame));throw Error('ACK lost');});
  await f.worker.run();expect(f.storage.frames.size).toBe(1);expect(Object.values((await f.saved(cookie))!.state.marketOutbox!)[0].attempts).toBe(1);expect(f.worker.last.failed).toBe(1);
  await f.worker.run();expect(f.storage.append).toHaveBeenCalledTimes(1);
  vi.setSystemTime(Date.now()+61000);await f.worker.run();expect(f.storage.frames.size).toBe(1);expect((await f.saved(cookie))!.state.marketOutbox).toEqual({});expect(f.generator.generate).not.toHaveBeenCalled();
 });
 it('stops after eight failed attempts and retains a minimized dead letter',async()=>{
  vi.useFakeTimers();const f=fixture(),cookie=await f.start();f.storage.append.mockRejectedValue(Error('Private upstream body'));
  for(let i=0;i<10;i++){await f.worker.run();vi.setSystemTime(Date.now()+3600001);}
  expect(f.storage.append).toHaveBeenCalledTimes(8);const entry=Object.values((await f.saved(cookie))!.state.marketOutbox!)[0];expect(entry.attempts).toBe(8);expect(entry.lastError).toBe('delivery_unavailable');expect(JSON.stringify(entry)).not.toContain('Private upstream');expect(f.worker.last.deadLetters).toBe(1);
 });
 it('coordinates competing workers through source CAS without duplicate metric rows',async()=>{
  const f=fixture(),cookie=await f.start(),second=new SiteMarketWorker(f.insights,[new SessionMarketSource(f.store),f.inbox.marketSource()]);await Promise.all([f.worker.run(),second.run()]);expect(f.storage.frames.size).toBe(1);expect((await f.saved(cookie))!.state.marketOutbox).toEqual({});
 });
 it('uses the dedicated encrypted storage contract, checks duplicate bodies, and excludes erased subjects from retries',async()=>{
  const panel=fixtureSitePanel(),storage=new CatalisaMarketStorage({origin:'https://fixture.invalid',token:'fixture-only',ownerEmail:'admin@catalisa.app',fetch:panel.fetch}),insights=new SiteMarketInsights(storage,secret,approval),event={name:'session.started',eventId:'fixture-event',requestId:'fixture-request',sessionRef:'fixture-session',briefVersion:0,occurredAt:new Date().toISOString(),categories:{sectorCategory:'financial'}};
  await insights.record(event);await insights.record(event);expect([...panel.collections.get('site_catalisa_metrics_v1')!.values()].filter(doc=>doc.attributes.kind==='event')).toHaveLength(1);
  const subject=insights.subjectKey('fixture-session');expect(await insights.erase({id:'fixture-operator',email:'admin@catalisa.app'},subject)).toEqual({removed:1,remaining:0});
  expect(await insights.recordPrepared(insights.prepare(event))).toBe('suppressed');const today=new Date().toISOString().slice(0,10);expect(await storage.events(today,today)).toEqual([]);
 });
});
