// @vitest-environment node
import {createHmac} from 'node:crypto';
import {afterEach,describe,expect,it,vi} from 'vitest';
import {CatalisaHandoffTransport,leadNotes,signHandoffEvent} from './catalisa-handoff';
import type {HandoffPacket} from './types';

afterEach(()=>vi.unstubAllGlobals());
const collection='site_catalisa_handoffs_v1',ref='handoff_00000000-0000-4000-8000-000000000001',phone='+5500000000000';
const config={origin:'https://panel-test.invalid',token:'test-only-token',ownerEmail:'admin@catalisa.app',collection,leadType:'SITE_CATALISA',stageId:'stage_site_new',channels:'whatsapp,email'};
const packet=(over:Partial<HandoffPacket>={}):HandoffPacket=>({schemaVersion:'1.0',handoffRef:ref,channel:'whatsapp',address:phone,contact:{contactRef:'contact_test',leadRef:'lead_test',name:'Visitante de Teste',email:'visitante@example.invalid'},briefing:{idea:'Ideia fictícia',context:'Contexto fictício',goal:'Objetivo fictício'},briefVersion:1,messages:[{messageRef:'m1',role:'visitor',step:'idea',text:'Ideia fictícia',occurredAt:'2026-10-24T10:00:00.000Z',briefVersion:1}],confirmation:{confirmed:true,occurredAt:'2026-10-24T10:05:00.000Z'},...over});
type Doc={id:string;docKey:string;version:number;attributes:Record<string,any>};
/** In-memory panel with the observed contracts: data-store proxy, leads (phone dedup 409), chats. */
function panel(ownerEmail='admin@catalisa.app'){
  const docs=new Map<string,Doc>(),leads=new Map<string,Record<string,any>>(),chats:Record<string,any>[]=[],messages=new Map<string,Record<string,any>[]>();
  const fetch=vi.fn(async(input:string|URL|Request,init:RequestInit={})=>{
    const url=new URL(String(input)),method=init.method??'GET',path=url.pathname,body=init.body?JSON.parse(String(init.body)):undefined;
    if(path==='/auth/me')return Response.json({email:ownerEmail});
    if(path==='/data-store/collections/'+collection)return Response.json({data:{pii:true,jsonSchema:{properties:{purpose:{enum:['catalisa-site-handoff-v1']},packet:{encrypted:true}}}}});
    if(path.endsWith('/query'))return Response.json({data:[...docs.values()].filter(doc=>doc.docKey===body.where.$docKey.value).map(doc=>structuredClone(doc))},{status:201});
    if(path.endsWith('/documents')&&method==='POST'){if([...docs.values()].some(doc=>doc.docKey===body.docKey))return Response.json({},{status:409});const doc={id:'doc_'+(docs.size+1),docKey:body.docKey,version:1,attributes:body.data};docs.set(doc.id,doc);return Response.json({data:doc},{status:201});}
    const document=path.match(/\/documents\/([^/]+)$/);
    if(document&&method==='PUT'){const doc=docs.get(document[1])!;if(doc.version!==body.expectedVersion)return Response.json({},{status:409});doc.version++;doc.attributes=body.data;return Response.json({data:doc});}
    if(path==='/leads/filter/custom-data')return Response.json([...leads.values()].filter(lead=>lead.customData?.[url.searchParams.get('field')!]===url.searchParams.get('value')));
    if(path==='/leads'&&method==='POST'){const digits=body.phone.replace(/\D/g,''),clash=[...leads.values()].find(lead=>lead.phone===digits);if(clash)return Response.json({message:'Já existe um lead com este telefone',existingLeadId:clash.id},{status:409});const lead={...body,id:'lead_'+(leads.size+1),phone:digits,assignedToId:null};leads.set(lead.id,lead);return Response.json(lead,{status:201});}
    const lead=path.match(/^\/leads\/([^/]+)$/);
    if(lead&&method==='GET')return leads.has(lead[1])?Response.json(leads.get(lead[1])):Response.json({},{status:404});
    if(path==='/chats')return Response.json({data:chats.filter(chat=>chat.leadId===url.searchParams.get('filter[leadId][eq]'))});
    const chat=path.match(/^\/chats\/([^/]+)\/messages$/);
    if(chat)return Response.json({data:messages.get(chat[1])??[]});
    return Response.json({},{status:501});
  });
  vi.stubGlobal('fetch',fetch);
  const calls=(method:string,path:string)=>fetch.mock.calls.filter(([input,init])=>((init as RequestInit|undefined)?.method??'GET')===method&&new URL(String(input)).pathname===path).length;
  return {docs,leads,chats,messages,fetch,calls};
}
const ledger=(p:ReturnType<typeof panel>)=>[...p.docs.values()].find(doc=>doc.docKey==='handoff:'+ref)!;
const signal=()=>AbortSignal.timeout(2000);

describe('Catalisa handoff transport',()=>{
  it('offers only channels that have a team destination in the product',()=>{
    expect(()=>new CatalisaHandoffTransport({...config,channels:'here'})).toThrow();expect(()=>new CatalisaHandoffTransport({...config,channels:'whatsapp,here'})).toThrow();
    expect(new CatalisaHandoffTransport(config).channels).toEqual(['whatsapp','email']);
  });
  it('rejects a packet without a typed phone before any request, never deriving one',async()=>{
    const p=panel();
    await expect(new CatalisaHandoffTransport(config).send(packet({channel:'email',address:'visitante@example.invalid'}),signal())).rejects.toMatchObject({code:'handoff_rejected'});
    expect(p.fetch).not.toHaveBeenCalled();
  });
  it('records one site lead in the dedicated stage and replays without a second lead',async()=>{
    const p=panel(),adapter=new CatalisaHandoffTransport(config);
    await adapter.send(packet(),signal());await adapter.send(packet(),signal());
    expect(p.calls('POST','/leads')).toBe(1);const [lead]=[...p.leads.values()];
    expect(lead).toMatchObject({name:'Visitante de Teste',phone:'5500000000000',email:'visitante@example.invalid',type:'SITE_CATALISA',stageId:'stage_site_new',customData:{source:'site-catalisa',siteHandoffRef:ref,siteChannel:'whatsapp',siteBriefVersion:1,siteConfirmedAt:'2026-10-24T10:05:00.000Z'}});
    expect(lead.notes).toContain('Referência: '+ref);expect(lead.notes).toContain('• Objetivo: Objetivo fictício');expect(lead.notes).toContain('Histórico (1 mensagens)');
    expect(ledger(p).attributes).toMatchObject({status:'lead_created',leadId:lead.id,channel:'whatsapp'});expect(ledger(p).attributes.packet.handoffRef).toBe(ref);
  });
  it('reuses the lead of a lost response instead of creating another',async()=>{
    const p=panel();p.leads.set('lead_lost',{id:'lead_lost',phone:'5500000000000',customData:{siteHandoffRef:ref}});
    await new CatalisaHandoffTransport(config).send(packet(),signal());
    expect(p.calls('POST','/leads')).toBe(0);expect(ledger(p).attributes.leadId).toBe('lead_lost');
  });
  it('never touches a pre-existing lead with the same phone and holds the handoff',async()=>{
    const p=panel(),foreign={id:'lead_customer',name:'Cliente existente',phone:'5500000000000',customData:{}};p.leads.set(foreign.id,structuredClone(foreign));
    const adapter=new CatalisaHandoffTransport(config);
    await expect(adapter.send(packet(),signal())).rejects.toMatchObject({code:'handoff_unconfirmed',diagnostic:{stage:'existing-lead'}});
    await expect(adapter.send(packet(),signal())).rejects.toMatchObject({code:'handoff_unconfirmed'});
    expect(p.leads.get(foreign.id)).toEqual(foreign);expect(p.calls('POST','/leads')).toBe(1);expect(ledger(p).attributes.status).toBe('blocked_existing_lead');
    expect(p.fetch.mock.calls.filter(([input,init])=>new URL(String(input)).pathname.startsWith('/leads/')&&!['GET',undefined].includes((init as RequestInit|undefined)?.method))).toHaveLength(0);
  });
  it('fails closed before any write when the token belongs to another account',async()=>{
    const p=panel('other@example.invalid');
    await expect(new CatalisaHandoffTransport(config).send(packet(),signal())).rejects.toMatchObject({code:'handoff_unconfirmed',diagnostic:{stage:'owner-check'}});
    expect(p.docs.size).toBe(0);expect(p.calls('POST','/leads')).toBe(0);
  });
  it('holds a reused handoffRef whose content differs',async()=>{
    const p=panel(),adapter=new CatalisaHandoffTransport(config);await adapter.send(packet(),signal());
    await expect(adapter.send(packet({briefVersion:2}),signal())).rejects.toMatchObject({code:'handoff_unconfirmed',diagnostic:{stage:'ledger-mismatch'}});expect(p.calls('POST','/leads')).toBe(1);
  });
  it('derives no event from the acknowledgement, only from real product evidence',async()=>{
    const p=panel(),adapter=new CatalisaHandoffTransport(config);await adapter.send(packet(),signal());
    expect(await adapter.observe(ref,signal())).toEqual([]);
    const lead=[...p.leads.values()][0],later=new Date(Date.now()+1000).toISOString();p.chats.push({id:'chat_1',leadId:lead.id});
    p.messages.set('chat_1',[{fromMe:true,deliveredAt:'2026-01-01T00:00:00.000Z'},{fromMe:false,deliveredAt:later},{fromMe:true,deliveredAt:null,readAt:null}]);
    expect(await adapter.observe(ref,signal())).toEqual([]);
    p.messages.get('chat_1')!.push({fromMe:true,deliveredAt:later});lead.assignedToId='user_team';
    const events=await adapter.observe(ref,signal());
    expect(events.map(event=>[event.status,event.sequence])).toEqual([['delivered',2],['assigned',3]]);expect(events[0].occurredAt).toBe(later);
    expect(await adapter.observe(ref,signal())).toEqual(events);
  });
  it('never reports delivery for e-mail, which has no delivery evidence in the product',async()=>{
    const p=panel(),adapter=new CatalisaHandoffTransport(config);
    await adapter.send(packet({channel:'email',address:'visitante@example.invalid',contact:{...packet().contact,phone}}),signal());
    const lead=[...p.leads.values()][0];p.chats.push({id:'chat_1',leadId:lead.id});p.messages.set('chat_1',[{fromMe:true,deliveredAt:new Date(Date.now()+1000).toISOString()}]);lead.assignedToId='user_team';
    expect((await adapter.observe(ref,signal())).map(event=>event.status)).toEqual(['assigned']);
  });
  it('signs events exactly as the site webhook verifies them',()=>{
    const event={eventId:ref+'-assigned',handoffRef:ref,sequence:3,status:'assigned' as const,occurredAt:'2026-10-24T11:00:00.000Z'};
    const signed=signHandoffEvent(event,'test-only-webhook-secret',1793000000000);
    expect(signed.headers['X-Catalisa-Timestamp']).toBe('1793000000');
    expect(signed.headers['X-Catalisa-Signature']).toBe(createHmac('sha256','test-only-webhook-secret').update('1793000000.'+signed.body).digest('hex'));expect(JSON.parse(signed.body)).toEqual(event);
  });
  it('keeps the newest history within the notes budget and points to the full record',()=>{
    const messages=Array.from({length:60},(_,index)=>({messageRef:'m'+index,role:'visitor' as const,step:'refinement',text:'x'.repeat(1990)+index,occurredAt:'2026-10-24T10:00:00.000Z',briefVersion:1}));
    const notes=leadNotes(packet({messages}),collection);
    expect(notes.length).toBeLessThanOrEqual(40000);expect(notes).toContain('x'.repeat(10)+'59');expect(notes).not.toContain('x'.repeat(1990)+'0\n');expect(notes).toContain('mensagens mais antigas omitidas');
  });
});
