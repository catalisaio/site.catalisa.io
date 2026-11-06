// @vitest-environment node
import {describe,expect,it,vi} from 'vitest';
import {SiteInboxTransport,SITE_INBOX_COLLECTION,SITE_INBOX_PURPOSE} from './site-inbox';
import {createSiteTeamApi} from './site-team-api';
import {siteTeamView} from './site-team-view';
import {Script} from 'node:vm';
import type {HandoffPacket} from './types';
const ref='handoff_00000000-0000-4000-8000-000000000001';
const actor={id:'operator-site',email:'admin@catalisa.app',displayName:'Equipe de teste'};
const config={origin:'https://panel-test.invalid',token:'test-only-token',ownerEmail:actor.email};
const packet=():HandoffPacket=>({schemaVersion:'1.0',handoffRef:ref,channel:'here',contact:{contactRef:'contact_test',leadRef:'lead_test',name:'Pessoa fictícia',email:'pessoa@example.invalid'},briefing:{idea:'Produto fictício de crédito'},briefVersion:1,messages:[],confirmation:{confirmed:true,occurredAt:'2026-10-24T10:00:00.000Z'}});
type Doc={id:string;docKey:string;version:number;attributes:Record<string,any>};
function panel(owner=actor.email){
 const docs=new Map<string,Doc>();let counter=0;
 const fetch=vi.fn(async(input:string|URL|Request,init:RequestInit={})=>{
  const url=new URL(String(input)),path=url.pathname,method=init.method??'GET',body=init.body?JSON.parse(String(init.body)):undefined;
  if(path==='/auth/me')return Response.json({id:actor.id,email:owner,name:actor.displayName});
  if(path==='/auth/login')return Response.json({accessToken:'verified-by-auth-me'});
  if(path==='/data-store/collections/'+SITE_INBOX_COLLECTION)return Response.json({pii:true,jsonSchema:{properties:{purpose:{enum:[SITE_INBOX_PURPOSE]},packet:{encrypted:true},staffSession:{encrypted:true}}}});
  if(path.endsWith('/query')){
   let data=[...docs.values()].filter(doc=>Object.entries(body.where).every(([key,query])=>{const {op,value}=query as {op:string;value:any};const actual=key==='$docKey'?doc.docKey:doc.attributes[key];return op==='eq'?actual===value:op==='gt'?actual>value:op==='lte'?actual<=value:false;}));
   data=data.slice((body.page-1)*body.pageSize,body.page*body.pageSize);return Response.json({data:structuredClone(data)},{status:201});
  }
  if(path.endsWith('/documents')&&method==='POST'){
   if([...docs.values()].some(doc=>doc.docKey===body.docKey))return Response.json({},{status:409});
   const doc={id:'doc_'+(++counter),docKey:body.docKey,version:1,attributes:structuredClone(body.data)};docs.set(doc.id,doc);return Response.json({data:doc},{status:201});
  }
  const document=path.match(/\/documents\/([^/]+)$/);
  if(document){const doc=docs.get(document[1]);if(!doc)return Response.json({},{status:404});
   if(method==='PUT'){if(doc.version!==body.expectedVersion)return Response.json({},{status:409});doc.version++;doc.attributes=structuredClone(body.data);return Response.json({data:doc});}
   if(method==='DELETE'){docs.delete(doc.id);return new Response(null,{status:204});}
  }
  return Response.json({},{status:501});
 });
 return {fetch,docs,inbox:new SiteInboxTransport({...config,fetch})};
}
const signal=()=>AbortSignal.timeout(2000);
const access={handoffRef:ref,contactRef:'contact_test',leadRef:'lead_test'};
describe('exclusive human site inbox',()=>{
 it('serves a syntactically valid browser console with no dynamic HTML injection',()=>{
  const html=siteTeamView('test-only-nonce'),script=html.match(/<script nonce="test-only-nonce">([\s\S]*?)<\/script>/)?.[1];
  expect(script).toBeTruthy();expect(()=>new Script(script!)).not.toThrow();expect(script).not.toContain('innerHTML');expect(script).not.toContain('eval(');
 });
 it('accepts e-mail alone durably and idempotently without emitting delivery or product messages',async()=>{
  const {inbox,docs,fetch}=panel();await inbox.send(packet(),signal());await inbox.send(packet(),signal());
  expect(inbox.channels).toEqual(['here']);expect(docs.size).toBe(1);expect(await inbox.observe(ref,signal())).toEqual([]);
  expect(fetch.mock.calls.every(([path])=>!new URL(String(path)).pathname.match(/^\/(leads|chats|workflows)/))).toBe(true);
 });
 it('accepts phone alone and rejects external channels or missing contact',async()=>{
  const {inbox}=panel();await inbox.send({...packet(),contact:{contactRef:'contact_test',leadRef:'lead_test',name:'Pessoa fictícia',phone:'+12025550123'}},signal());
  await expect(inbox.send({...packet(),channel:'email',address:'pessoa@example.invalid'},signal())).rejects.toMatchObject({code:'handoff_rejected'});
  await expect(inbox.send({...packet(),contact:{contactRef:'contact_test',leadRef:'lead_test',name:'Pessoa fictícia'}},signal())).rejects.toMatchObject({code:'handoff_rejected'});
 });
 it('requires opening and claiming for replies and exposes observed events only',async()=>{
  const {inbox}=panel();await inbox.send(packet(),signal());
  await expect(inbox.claim(ref,actor,signal())).rejects.toMatchObject({code:'context_required'});
  await inbox.openRequest(ref,actor,signal());expect((await inbox.observe(ref,signal())).map(event=>event.status)).toEqual(['delivered']);
  const message={clientMessageId:'00000000-0000-4000-8000-000000000001',text:'Resposta humana fictícia'};
  await expect(inbox.reply(ref,actor,message,signal())).rejects.toMatchObject({code:'claim_required'});
  await inbox.claim(ref,actor,signal());await inbox.reply(ref,actor,message,signal());await inbox.reply(ref,actor,message,signal());
  const thread=await inbox.readThread(access,signal());expect(thread.messages).toHaveLength(1);expect(thread.messages[0]).not.toHaveProperty('actorId');expect(thread.owner?.displayName).toBe(actor.displayName);
  expect((await inbox.observe(ref,signal())).map(event=>event.status)).toEqual(['delivered','assigned']);
 });
 it('isolates visitors and rejects changed immutable packets or reused message identifiers',async()=>{
  const {inbox}=panel();await inbox.send(packet(),signal());
  await expect(inbox.readThread({...access,contactRef:'other-cookie-contact'},signal())).rejects.toMatchObject({code:'thread_not_found'});
  await expect(inbox.send({...packet(),briefVersion:2},signal())).rejects.toMatchObject({code:'handoff_mismatch'});
  const message={clientMessageId:'00000000-0000-4000-8000-000000000002',text:'Tenho pressa'};
  await inbox.appendVisitorMessage(access,message,signal());await inbox.appendVisitorMessage(access,message,signal());
  await expect(inbox.appendVisitorMessage(access,{...message,text:'Outro conteúdo'},signal())).rejects.toMatchObject({code:'message_mismatch'});
  expect((await inbox.readThread(access,signal())).messages).toHaveLength(1);
 });
 it('fails closed for another tenant and persists operator sessions across instances',async()=>{
  const wrong=panel('other@example.invalid');await expect(wrong.inbox.send(packet(),signal())).rejects.toMatchObject({code:'inbox_unavailable'});expect(wrong.docs.size).toBe(0);
  const p=panel(),hash='a'.repeat(64),session={token:'test-jwt',actor,createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+600000).toISOString()};
  await p.inbox.saveStaffSession(hash,session,signal());const second=new SiteInboxTransport({...config,fetch:p.fetch});expect(await second.readStaffSession(hash,signal())).toEqual(session);
  await second.revokeStaffSession(hash,signal());expect(await p.inbox.readStaffSession(hash,signal())).toBeNull();
 });
 it('staff API authenticates independently, blocks cross-origin login and never returns upstream tokens',async()=>{
  const p=panel(),handle=createSiteTeamApi({inbox:p.inbox,origin:config.origin,ownerEmail:actor.email,secret:'test-only-secret-32-characters-long',secure:true,origins:['https://site-test.invalid'],fetch:p.fetch});
  const send=(path:string,method='GET',body?:unknown,extra:Record<string,string>={})=>handle(new Request('https://site-test.invalid/api/site/team'+path,{method,headers:{Origin:'https://site-test.invalid',...(body?{'Content-Type':'application/json'}:{}),...extra},...(body?{body:JSON.stringify(body)}:{})}),'127.0.0.1');
  expect((await send('/requests','GET',undefined,{Cookie:'catalisa_site=visitor-cookie'}))?.status).toBe(401);
  expect((await send('/login','POST',{email:actor.email,password:'fake-only'},{Origin:'https://evil.invalid'}))?.status).toBe(403);
  const login=await send('/login','POST',{email:actor.email,password:'fake-only'});expect(login?.status).toBe(200);expect(await login!.text()).not.toContain('verified-by-auth-me');
  const cookie=login!.headers.get('set-cookie')!;expect(cookie).toContain('HttpOnly');expect(cookie).toContain('SameSite=Strict');expect(cookie).toContain('Secure');
  expect((await send('/session','GET',undefined,{Cookie:cookie.split(';')[0]}))?.status).toBe(200);
  expect((await send('/logout','POST',{}, {Cookie:cookie.split(';')[0]}))?.status).toBe(200);
  expect((await send('/session','GET',undefined,{Cookie:cookie.split(';')[0]}))?.status).toBe(401);
 });
});
