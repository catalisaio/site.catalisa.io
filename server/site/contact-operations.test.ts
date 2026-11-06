// @vitest-environment node
import {afterEach,describe,expect,it,vi} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash,createHmac,randomUUID} from 'node:crypto';
import {createSiteApi} from './api';
import {SqliteSessionStore} from './sqlite-store';
import type {ConceptGenerator,GenerationInput,HandoffPacket,HandoffTransport} from './types';
import {includeHumanReview,IntegrationError,validateConcept} from './concept';
import {conceptLocaleCopy} from '../../shared/site-concept-locale';
import type {ConceptLocale} from '../../shared/site-concept-locale';
const fixture=JSON.parse(readFileSync('docs/redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/contracts/concept.example.json','utf8'));
const stores:SqliteSessionStore[]=[];
afterEach(()=>{for(const store of stores.splice(0))store.close();vi.useRealTimers();vi.restoreAllMocks();});
function setup(generator:ConceptGenerator={generate:vi.fn(async()=>structuredClone(fixture))},handoff:HandoffTransport={channels:['here','email','whatsapp'],send:vi.fn(async()=>{})},timeoutMs?:number,budgets?:{requestBudgetMs?:number;generationTimeoutMs?:number}){
  const store=new SqliteSessionStore(':memory:');stores.push(store);
  const secret='callback-test-secret-more-than-32-characters';
  const api=createSiteApi({store,secret:'session-test-secret-more-than-32-characters',origins:['http://localhost:5175'],secure:false,generator,handoff,webhookSecret:secret,timeoutMs,...budgets});
  const call=(path:string,method='GET',body?:unknown,cookie='',key=randomUUID(),locale?:string)=>api(new Request('http://localhost:5175/api/site/'+path,{method,headers:{Origin:'http://localhost:5175',Cookie:cookie,'Content-Type':'application/json','Idempotency-Key':key,...(locale===undefined?{}:{'X-Site-Locale':locale})},...(body===undefined?{}:{body:JSON.stringify(body)})}),'127.0.0.1');
  async function begin(complete=true){const response=await call('sessions','POST');const cookie=response.headers.get('set-cookie')!.split(';')[0];if(complete){for(const[index,step]of['idea','context','goal'].entries())await call('messages','POST',{clientMessageId:randomUUID(),step,text:'Exemplo fictício',briefVersion:index},cookie);await call('identity','POST',{name:'Pessoa fictícia',briefVersion:3},cookie);await call('contact','POST',{email:'pessoa.teste@example.invalid',briefVersion:3},cookie);}return cookie;}
  async function generate(cookie:string,key?:string){const response=await call('concepts','POST',{briefVersion:3},cookie,key);expect(response.status).toBe(202);const job=await response.json();return (await call('jobs/'+job.jobRef,'GET',undefined,cookie)).json();}
  async function event(value:unknown,valid=true,timestamp=String(Math.floor(Date.now()/1000))){const body=JSON.stringify(value),signature=createHmac('sha256',secret).update(timestamp+'.'+body).digest('hex');return api(new Request('http://localhost:5175/api/internal/handoff-events',{method:'POST',headers:{'Content-Type':'application/json','X-Catalisa-Timestamp':timestamp,'X-Catalisa-Signature':valid?signature:'0'.repeat(64)},body}),'127.0.0.1');}
  return{call,begin,generate,event,generator,handoff,store};
}
describe('Contact concept generation and handoff',()=>{
  it('keeps enabled concurrent request locales isolated on the same API instance and persists each selected contract',async()=>{
    const locales=Object.keys(conceptLocaleCopy) as ConceptLocale[],finish=new Map<ConceptLocale,(value:unknown)=>void>();
    const generator={generate:vi.fn((input:GenerationInput)=>new Promise<unknown>(resolve=>{finish.set(input.locale!,resolve);}))},s=setup(generator),cookies=await Promise.all(locales.map(()=>s.begin()));
    const pending=locales.map((locale,index)=>s.call('concepts','POST',{briefVersion:3},cookies[index],randomUUID(),locale));
    await vi.waitFor(()=>expect(generator.generate).toHaveBeenCalledTimes(locales.length));
    for(const locale of [...locales].reverse())finish.get(locale)!({...structuredClone(fixture),title:'Controlled '+locale,disclaimer:conceptLocaleCopy[locale].disclaimer});
    const responses=await Promise.all(pending);
    for(const[index,locale]of locales.entries()){
      expect(responses[index].status).toBe(202);const ack=await responses[index].json(),job=await(await s.call('jobs/'+ack.jobRef,'GET',undefined,cookies[index])).json();
      expect(job.status).toBe('succeeded');expect(job.concept.locale??'pt-BR').toBe(locale);expect(job.concept.content.title).toBe('Controlled '+locale);expect(validateConcept(job.concept.content,locale)).toEqual(job.concept.content);
    }
  });
  it('keeps Portuguese legacy digests unchanged and distinguishes only non-PT concept requests by locale',async()=>{
    const generator={generate:vi.fn(async(input:GenerationInput)=>({...structuredClone(fixture),disclaimer:conceptLocaleCopy[input.locale??'pt-BR'].disclaimer}))},s=setup(generator),cookie=await s.begin(),key=randomUUID(),body={briefVersion:3};
    const initial=await s.call('concepts','POST',body,cookie,key),ack=await initial.json();expect(initial.status).toBe(202);
    expect(await(await s.call('concepts','POST',body,cookie,key,'pt-BR')).json()).toEqual(ack);
    const hash=createHash('sha256').update(cookie.split('=')[1]).digest('hex'),receipt=await s.store.receipt(hash,key);
    expect(receipt?.digest).toBe(createHash('sha256').update('POST/api/site/concepts'+JSON.stringify(body)).digest('hex'));
    const mismatch=await s.call('concepts','POST',body,cookie,key,'en-US');expect(mismatch.status).toBe(409);expect((await mismatch.json()).code).toBe('idempotency_mismatch');expect(generator.generate).toHaveBeenCalledTimes(1);
    const second=await s.begin(),localizedKey=randomUUID(),localized=await s.call('concepts','POST',body,second,localizedKey,'de-DE'),localizedAck=await localized.json();
    expect(await(await s.call('concepts','POST',body,second,localizedKey,'de-DE')).json()).toEqual(localizedAck);
    expect((await s.call('concepts','POST',body,second,localizedKey,'nl-NL')).status).toBe(409);expect(generator.generate).toHaveBeenCalledTimes(2);
  });
  it('validates the locale header but leaves visitor history and existing concepts unchanged when only navigation language changes',async()=>{
    const s=setup(),cookie=await s.begin();await s.generate(cookie);const before=await(await s.call('session','GET',undefined,cookie)).json();
    for(const locale of ['lb-LU','en','en-US, de-DE','invalid']){const rejected=await s.call('session','GET',undefined,cookie,randomUUID(),locale);expect(rejected.status).toBe(422);expect((await rejected.json()).code).toBe('invalid_locale');}
    expect(await(await s.call('session','GET',undefined,cookie,randomUUID(),'da-DK')).json()).toEqual(before);expect(s.generator.generate).toHaveBeenCalledTimes(1);
    const key=randomUUID(),body={name:'Pessoa fictícia',briefVersion:3};expect((await s.call('identity','POST',body,cookie,key,'de-DE')).status).toBe(201);expect((await s.call('identity','POST',body,cookie,key,'nl-NL')).status).toBe(201);
  });
  it('keeps deterministic review in the existing concept language despite a different current locale, with zero extra inference and one CAS',async()=>{
    const original=structuredClone(fixture);original.journey.forEach((step:{humanReview:boolean})=>{step.humanReview=false;});original.disclaimer=conceptLocaleCopy['de-DE'].disclaimer;
    const generator={generate:vi.fn(async()=>structuredClone(original))},s=setup(generator),cookie=await s.begin(),response=await s.call('concepts','POST',{briefVersion:3},cookie,randomUUID(),'de-DE'),ack=await response.json(),first=await(await s.call('jobs/'+ack.jobRef,'GET',undefined,cookie)).json();
    expect(first.status).toBe('succeeded');const before=await(await s.call('session','GET',undefined,cookie)).json(),commit=vi.spyOn(s.store,'commit'),route='concepts/'+first.concept.conceptRef+'/revisions';
    expect((await s.call(route,'POST',{briefVersion:3,baseConceptVersion:1,adjustment:'human-review'},cookie,randomUUID(),'nl-NL')).status).toBe(202);
    const after=await(await s.call('session','GET',undefined,cookie)).json();expect(after.latestConcept.locale).toBe('de-DE');expect(after.latestConcept.content.disclaimer).toBe(conceptLocaleCopy['de-DE'].disclaimer);
    expect(after.latestConcept.content.journey.at(-2).label).toBe(conceptLocaleCopy['de-DE'].reviewLabel);expect(after.latestConcept.content.screens).toEqual(original.screens);expect(after.messages.slice(0,before.messages.length)).toEqual(before.messages);expect(after.briefing).toEqual(before.briefing);
    expect(commit).toHaveBeenCalledTimes(1);expect(generator.generate).toHaveBeenCalledTimes(1);
  });
  it('passes the explicitly requested locale and unchanged visitor text to a normal refinement',async()=>{
    const generator={generate:vi.fn(async(input:GenerationInput)=>({...structuredClone(fixture),disclaimer:conceptLocaleCopy[input.locale??'pt-BR'].disclaimer}))},s=setup(generator),cookie=await s.begin(),first=await s.generate(cookie),text='Preserve WhatsApp; solo cambiar los avisos.';
    const route='concepts/'+first.concept.conceptRef+'/revisions',body={briefVersion:3,baseConceptVersion:1,text},key=randomUUID(),response=await s.call(route,'POST',body,cookie,key,'es-ES'),ack=await response.json(),job=await(await s.call('jobs/'+ack.jobRef,'GET',undefined,cookie)).json();
    expect(job.status).toBe('succeeded');expect(job.concept.locale).toBe('es-ES');expect(generator.generate).toHaveBeenLastCalledWith(expect.objectContaining({locale:'es-ES',previous:fixture,refinement:text}),expect.any(AbortSignal));expect((await(await s.call('session','GET',undefined,cookie)).json()).messages.at(-1).text).toBe(text);
    expect(await(await s.call(route,'POST',body,cookie,key,'es-ES')).json()).toEqual(ack);expect((await s.call(route,'POST',body,cookie,key,'en-US')).status).toBe(409);expect(generator.generate).toHaveBeenCalledTimes(2);
  });
  it('keeps the immutable handoff concept descriptor at v1 after the visitor refines a separate v2',async()=>{
    const s=setup(),cookie=await s.begin(),first=await s.generate(cookie),before=await(await s.call('session','GET',undefined,cookie)).json();
    expect((await s.call('direct/briefing','POST',{expectedVersion:3},cookie)).status).toBe(200);let snapshot=await(await s.call('session','GET',undefined,cookie)).json();expect(snapshot.session.briefVersion).toBe(3);expect(snapshot.latestConcept).toEqual(first.concept);expect(snapshot.identity).toEqual(before.identity);
    const receipt=await(await s.call('handoffs','POST',{channel:'here',confirmed:true,contextVersion:3,conceptRef:first.concept.conceptRef,conceptVersion:1},cookie)).json();
    await s.call('concepts/'+first.concept.conceptRef+'/revisions','POST',{briefVersion:3,baseConceptVersion:1,text:'Ajuste posterior ao encaminhamento'},cookie);
    snapshot=await(await s.call('session','GET',undefined,cookie)).json();expect(snapshot.latestConcept.version).toBe(2);expect(snapshot.handoffSelection.concept).toEqual({conceptRef:first.concept.conceptRef,version:1,title:first.concept.content.title});expect(snapshot.latestHandoff.handoffRef).toBe(receipt.handoffRef);expect(snapshot.session.entryMode).toBeUndefined();expect(s.handoff.send).toHaveBeenCalledTimes(1);
  });
  it('keeps the generation lease through a delayed completion commit so reload cannot start a second inference',async()=>{
    vi.useFakeTimers();const generator={generate:vi.fn(async()=>{vi.setSystemTime(Date.now()+60000);return structuredClone(fixture);})},s=setup(generator,undefined,undefined,{requestBudgetMs:90000,generationTimeoutMs:60000}),cookie=await s.begin();
    const commit=s.store.commit.bind(s.store);let release!:()=>void,entered!:()=>void;
    const saving=new Promise<void>(resolve=>{release=resolve;}),completionEntered=new Promise<void>(resolve=>{entered=resolve;});
    vi.spyOn(s.store,'commit').mockImplementation(async(...args)=>{if(args[3].startsWith('internal:complete:')){entered();await saving;}return commit(...args);});
    const startedAt=Date.now(),request=s.call('concepts','POST',{briefVersion:3},cookie);
    await completionEntered;vi.setSystemTime(startedAt+66000);
    const resumed=await(await s.call('session','GET',undefined,cookie)).json();expect(resumed.pendingJob.status).toBe('running');
    expect((await(await s.call('jobs/'+resumed.pendingJob.jobRef,'GET',undefined,cookie)).json()).status).toBe('running');
    const concurrent=await s.call('concepts','POST',{briefVersion:3},cookie);expect(concurrent.status).toBe(409);expect((await concurrent.json()).code).toBe('generation_in_progress');expect(generator.generate).toHaveBeenCalledTimes(1);
    release();expect((await request).status).toBe(202);const finished=await(await s.call('jobs/'+resumed.pendingJob.jobRef,'GET',undefined,cookie)).json();expect(finished.status).toBe('succeeded');expect(finished.concept.version).toBe(1);expect(generator.generate).toHaveBeenCalledTimes(1);
  });
  it('allows a 50-second Node inference with persistence room while retaining the short default request budget',async()=>{
    vi.useFakeTimers();const generator={generate:vi.fn(async()=>{vi.setSystemTime(Date.now()+50000);return structuredClone(fixture);})};
    const node=setup(generator,undefined,undefined,{requestBudgetMs:90000,generationTimeoutMs:60000}),nodeCookie=await node.begin();expect((await node.generate(nodeCookie)).status).toBe('succeeded');
    const legacy=setup(generator),legacyCookie=await legacy.begin();expect((await legacy.call('concepts','POST',{briefVersion:3},legacyCookie)).status).toBe(503);vi.useRealTimers();
  });
  it('caps the request budget at 90 seconds and preserves explicit short timeout tests',async()=>{
    vi.useFakeTimers();const generator={generate:vi.fn(async()=>{vi.setSystemTime(Date.now()+81000);return structuredClone(fixture);})},capped=setup(generator,undefined,undefined,{requestBudgetMs:200000,generationTimeoutMs:60000}),cookie=await capped.begin();expect((await capped.call('concepts','POST',{briefVersion:3},cookie)).status).toBe(503);vi.useRealTimers();
    const short=setup({generate:()=>new Promise(()=>{})},undefined,100,{requestBudgetMs:90000,generationTimeoutMs:60000}),shortCookie=await short.begin();expect((await short.generate(shortCookie)).error.code).toBe('operation_timeout');
  });
  it('commits human review as a succeeded job and concept in one atomic write, with no inference or intermediate job poll',async()=>{
    const original=structuredClone(fixture);original.journey.forEach((step:{humanReview:boolean})=>{step.humanReview=false;});
    const generator={generate:vi.fn(async()=>structuredClone(original))},s=setup(generator),cookie=await s.begin(),first=await s.generate(cookie);
    const commit=vi.spyOn(s.store,'commit'),key=randomUUID(),route='concepts/'+first.concept.conceptRef+'/revisions',input={briefVersion:3,baseConceptVersion:1,adjustment:'human-review'};
    const response=await s.call(route,'POST',input,cookie,key),ack=await response.json();expect(response.status).toBe(202);expect(ack.status).toBe('succeeded');expect(ack.concept).toBeUndefined();
    expect(commit).toHaveBeenCalledTimes(1);const persisted=commit.mock.calls[0][2];expect(persisted.jobs?.[ack.jobRef].job.status).toBe('succeeded');expect(persisted.concepts?.at(-1)?.version).toBe(2);
    const snapshot=await(await s.call('session','GET',undefined,cookie)).json();expect(snapshot.latestConcept.version).toBe(2);expect(snapshot.pendingJob).toBeUndefined();expect(snapshot.latestConcept.content.journey.some((step:{humanReview:boolean})=>step.humanReview)).toBe(true);
    expect(await(await s.call(route,'POST',input,cookie,key)).json()).toEqual(ack);expect(commit).toHaveBeenCalledTimes(1);expect(generator.generate).toHaveBeenCalledTimes(1);
  });
  it('leaves no partial human review job or version when the single CAS conflicts',async()=>{
    const s=setup(),cookie=await s.begin(),first=await s.generate(cookie),commit=vi.spyOn(s.store,'commit').mockResolvedValueOnce({kind:'conflict'});
    const response=await s.call('concepts/'+first.concept.conceptRef+'/revisions','POST',{briefVersion:3,baseConceptVersion:1,adjustment:'human-review'},cookie);expect(response.status).toBe(409);expect(commit).toHaveBeenCalledTimes(1);
    const snapshot=await(await s.call('session','GET',undefined,cookie)).json();expect(snapshot.latestConcept.version).toBe(1);expect(snapshot.pendingJob).toBeUndefined();expect(s.generator.generate).toHaveBeenCalledTimes(1);
  });
  it('distinguishes an explicit receiver rejection from an ambiguous transport timeout',async()=>{const send=vi.fn(async()=>{throw new IntegrationError('handoff_rejected','Rejected');}),s=setup(undefined,{channels:['here'],send}),cookie=await s.begin();const response=await(await s.call('handoffs','POST',{channel:'here',confirmed:true,contextVersion:3},cookie)).json();expect((await(await s.call('handoffs/'+response.handoffRef,'GET',undefined,cookie)).json()).status).toBe('failed');expect(send).toHaveBeenCalledTimes(1);});
  it('bounds a generation even when an integration ignores its abort signal',async()=>{const s=setup({generate:()=>new Promise(()=>{})},undefined,100),cookie=await s.begin();const job=await s.generate(cookie);expect(job.status).toBe('failed');expect(job.error.code).toBe('operation_timeout');});
  it('requires persisted briefing and identity before invoking generation',async()=>{const s=setup(),cookie=await s.begin(false);expect((await s.call('concepts','POST',{briefVersion:0},cookie)).status).toBe(409);expect(s.generator.generate).not.toHaveBeenCalled();});
  it('persists validated concepts and authorizes job reads by cookie',async()=>{const s=setup(),one=await s.begin(),two=await s.begin();const job=await s.generate(one);expect(job.status).toBe('succeeded');expect(job.concept.content.title).toBe(fixture.title);expect((await s.call('jobs/'+job.jobRef,'GET',undefined,two)).status).toBe(404);expect((await s.call('jobs/__proto__','GET',undefined,two)).status).toBe(404);const snapshot=await(await s.call('session','GET',undefined,one)).json();expect(snapshot.latestConcept).toEqual(job.concept);expect(snapshot.generationAvailable).toBe(true);});
  it('reserves the job before the provider call and replays without generating twice',async()=>{
    let finish!:(value:unknown)=>void;const generator={generate:vi.fn(()=>new Promise(resolve=>{finish=resolve;}))};const s=setup(generator),cookie=await s.begin(),key=randomUUID();
    const pending=s.call('concepts','POST',{briefVersion:3},cookie,key);await vi.waitFor(()=>expect(generator.generate).toHaveBeenCalledTimes(1));
    const replay=await s.call('concepts','POST',{briefVersion:3},cookie,key);expect(replay.status).toBe(202);expect((await s.call('concepts','POST',{briefVersion:3},cookie)).status).toBe(409);
    finish(structuredClone(fixture));expect((await pending).status).toBe(202);expect(generator.generate).toHaveBeenCalledTimes(1);
  });
  it('fails malformed output without publishing a concept',async()=>{const s=setup({generate:vi.fn(async()=>({...fixture,html:'<script>bad</script>'}))}),cookie=await s.begin(),job=await s.generate(cookie);expect(job.status).toBe('failed');expect(job.error.code).toBe('invalid_concept');expect(job.concept).toBeUndefined();expect((await(await s.call('session','GET',undefined,cookie)).json()).latestConcept).toBeUndefined();});
  it('rejects unknown blocks, duplicate IDs and broken screen references',()=>{for(const modify of[(x:typeof fixture)=>{x.blocks[0].slug='not-a-block';},(x:typeof fixture)=>{x.screens.push(x.screens[0]);},(x:typeof fixture)=>{x.screens[0].action.nextScreenId='absent';},(x:typeof fixture)=>{x.journey[0].blockSlugs=['payments'];}]){const value=structuredClone(fixture);modify(value);expect(()=>validateConcept(value)).toThrow();}});
  it('preserves previous versions and records refinement in the handoff history',async()=>{const s=setup(),cookie=await s.begin(),first=await s.generate(cookie);const response=await s.call('concepts/'+first.concept.conceptRef+'/revisions','POST',{briefVersion:3,baseConceptVersion:1,text:'Incluir revisão humana'},cookie);expect(response.status).toBe(202);const second=await(await s.call('jobs/'+(await response.json()).jobRef,'GET',undefined,cookie)).json();expect(second.concept.version).toBe(2);expect(second.concept.conceptRef).toBe(first.concept.conceptRef);expect(s.generator.generate).toHaveBeenLastCalledWith(expect.objectContaining({previous:fixture,refinement:'Incluir revisão humana'}),expect.any(AbortSignal));expect((await(await s.call('session','GET',undefined,cookie)).json()).messages.at(-1).text).toBe('Incluir revisão humana');expect((await s.call('concepts/'+first.concept.conceptRef+'/revisions','POST',{briefVersion:3,baseConceptVersion:1,text:'Revisão antiga'},cookie)).status).toBe(409);});
  it('includes human review without another inference, preserves versions and replays the same adjustment',async()=>{
    const original=structuredClone(fixture);original.journey.forEach((step:{humanReview:boolean})=>{step.humanReview=false;});
    const generator={generate:vi.fn(async()=>structuredClone(original))},s=setup(generator),cookie=await s.begin(),first=await s.generate(cookie);
    generator.generate.mockRejectedValue(new Error('Provider unavailable'));
    const key=randomUUID(),input={briefVersion:3,baseConceptVersion:1,adjustment:'human-review'},route='concepts/'+first.concept.conceptRef+'/revisions';
    const response=await s.call(route,'POST',input,cookie,key);expect(response.status).toBe(202);
    const job=await(await s.call('jobs/'+(await response.json()).jobRef,'GET',undefined,cookie)).json();
    expect(job.status).toBe('succeeded');expect(job.concept.version).toBe(2);expect(job.concept.conceptRef).toBe(first.concept.conceptRef);
    const content=job.concept.content;expect(content.screens).toEqual(original.screens);expect(content.blocks).toEqual(original.blocks);expect(content.summary).toBe(original.summary);
    expect(content.journey.at(-2)).toMatchObject({label:'Revisão humana',humanReview:true});expect(content.journey.at(-1)).toEqual(original.journey.at(-1));
    expect(validateConcept(content)).toEqual(content);expect(generator.generate).toHaveBeenCalledTimes(1);
    expect((await s.call(route,'POST',input,cookie,key)).status).toBe(202);expect(generator.generate).toHaveBeenCalledTimes(1);
    const snapshot=await(await s.call('session','GET',undefined,cookie)).json();expect(snapshot.latestConcept).toEqual(job.concept);
    expect((await s.call(route,'POST',input,cookie)).status).toBe(409);
    expect((await s.call(route,'POST',{...input,baseConceptVersion:2,adjustment:'unrecognized'},cookie)).status).toBe(422);
    expect((await s.call(route,'POST',{...input,baseConceptVersion:2,text:'Overwrite everything'},cookie)).status).toBe(422);
  });
  it('keeps existing review steps and supports a full journey without dropping steps',()=>{
    expect(includeHumanReview(fixture)).toEqual(fixture);
    const full=structuredClone(fixture);full.journey=Array.from({length:8},(_,index)=>({...fixture.journey[0],id:index===0?'human-review':'step-'+index,humanReview:false}));
    const adjusted=includeHumanReview(full);expect(adjusted.journey).toHaveLength(8);expect(adjusted.journey.slice(0,7)).toEqual(full.journey.slice(0,7));expect(adjusted.journey[7].humanReview).toBe(true);
    expect(full.journey.every((step:{humanReview:boolean})=>!step.humanReview)).toBe(true);
    full.journey=full.journey.slice(0,2);const inserted=includeHumanReview(full);expect(new Set(inserted.journey.map(step=>step.id)).size).toBe(3);expect(inserted.journey[1].id).toBe('human-review-1');
  });
  it('keeps a finished old-brief job out of the current snapshot',async()=>{
    let finish!:(value:unknown)=>void;const generator={generate:vi.fn(()=>new Promise(resolve=>{finish=resolve;}))};const s=setup(generator),cookie=await s.begin();const pending=s.call('concepts','POST',{briefVersion:3},cookie);await vi.waitFor(()=>expect(generator.generate).toHaveBeenCalled());await s.call('briefing','PUT',{expectedVersion:3,briefing:{idea:'Nova ideia'}},cookie);finish(structuredClone(fixture));await pending;const snapshot=await(await s.call('session','GET',undefined,cookie)).json();expect(snapshot.session.briefVersion).toBe(4);expect(snapshot.latestConcept).toBeUndefined();
  });
  it('requires confirmation, valid channel/address and matching concept version',async()=>{const s=setup(),cookie=await s.begin(),job=await s.generate(cookie);for(const input of[{channel:'here',confirmed:false,contextVersion:3},{channel:'email',confirmed:true,address:'invalid',contextVersion:3},{channel:'whatsapp',confirmed:true,address:'11999999999',contextVersion:3},{channel:'other',confirmed:true,contextVersion:3},{channel:'here',confirmed:true,contextVersion:3,conceptRef:job.concept.conceptRef}])expect((await s.call('handoffs','POST',input,cookie)).status).toBeGreaterThanOrEqual(400);expect(s.handoff.send).not.toHaveBeenCalled();});
  it('sends the persisted context once, then waits for signed delivery and assignment evidence',async()=>{const s=setup(),one=await s.begin(),two=await s.begin(),job=await s.generate(one),key=randomUUID(),input={channel:'here',confirmed:true,contextVersion:3,conceptRef:job.concept.conceptRef,conceptVersion:1};const response=await s.call('handoffs','POST',input,one,key),receipt=await response.json();expect(response.status).toBe(202);expect((await s.call('handoffs','POST',input,one,key)).status).toBe(202);expect(s.handoff.send).toHaveBeenCalledTimes(1);const packet=(s.handoff.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as HandoffPacket;expect(packet.messages).toHaveLength(3);expect(packet.concept).toEqual(job.concept);expect(packet.confirmation.confirmed).toBe(true);expect((await s.call('handoffs/'+receipt.handoffRef,'GET',undefined,two)).status).toBe(404);expect((await(await s.call('handoffs/'+receipt.handoffRef,'GET',undefined,one)).json()).status).toBe('accepted');const delivered={eventId:randomUUID(),handoffRef:receipt.handoffRef,sequence:1,status:'delivered',occurredAt:new Date().toISOString()};expect((await s.event(delivered,false)).status).toBe(401);expect((await s.event(delivered)).status).toBe(200);expect((await s.event({...delivered,eventId:randomUUID(),sequence:2,status:'queued'})).status).toBe(409);expect((await s.event({...delivered,eventId:randomUUID(),sequence:2,status:'assigned'})).status).toBe(200);expect((await(await s.event(delivered)).json()).status).toBe('assigned');expect((await s.event({...delivered,status:'failed'})).status).toBe(409);expect((await s.event(delivered,true,String(Math.floor(Date.now()/1000)-1000))).status).toBe(401);});
  it('keeps transport timeouts queued and does not automatically send again',async()=>{const send=vi.fn(async()=>{throw Error('timeout');}),s=setup(undefined,{channels:['here'],send}),cookie=await s.begin(),key=randomUUID(),input={channel:'here',confirmed:true,contextVersion:3};const receipt=await(await s.call('handoffs','POST',input,cookie,key)).json();expect((await(await s.call('handoffs/'+receipt.handoffRef,'GET',undefined,cookie)).json()).status).toBe('queued');await s.call('handoffs','POST',input,cookie,key);expect(send).toHaveBeenCalledTimes(1);});
  it('recovers durable inbox acceptance after a lost ACK without resending or inventing delivery',async()=>{
    let received:HandoffPacket|undefined;
    const send=vi.fn(async(packet:HandoffPacket)=>{received=structuredClone(packet);throw Error('ACK lost after durable inbox write');});
    const readThread=vi.fn(async(access:{handoffRef:string;contactRef:string;leadRef:string})=>{
      expect(access).toEqual({handoffRef:received!.handoffRef,contactRef:received!.contact.contactRef,leadRef:received!.contact.leadRef});
      return {handoffRef:received!.handoffRef,channel:'here' as const,status:'accepted' as const,updatedAt:new Date().toISOString(),messages:[],lastSequence:0};
    });
    const s=setup(undefined,{channels:['here'],send,observe:async()=>[],readThread}),cookie=await s.begin(),key=randomUUID(),input={channel:'here',confirmed:true,contextVersion:3};
    const receipt=await(await s.call('handoffs','POST',input,cookie,key)).json();
    expect((await(await s.call('handoffs/'+receipt.handoffRef,'GET',undefined,cookie)).json()).status).toBe('accepted');
    expect((await(await s.call('session','GET',undefined,cookie)).json()).latestHandoff.status).toBe('accepted');
    expect((await s.call('handoffs','POST',input,cookie,key)).status).toBe(202);expect(send).toHaveBeenCalledTimes(1);expect(readThread).toHaveBeenCalled();
  });
});
