import {StrictMode} from 'react';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {afterEach,describe,expect,it,vi} from 'vitest';
import Contact,{prepareInitialSession} from './Contact';
import type {ContactSnapshot} from './site-client';

afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.restoreAllMocks();});
describe('direct contact client transitions',()=>{
 it('captures one contact, restores unchecked confirmation and dispatches no concept request',async()=>{
  vi.spyOn(window,'scrollTo').mockImplementation(()=>{});let created=false;
  let saved:ContactSnapshot={session:{sessionRef:'fixture-direct',briefVersion:0,identityStatus:'anonymous',leadStatus:'none'},briefing:{},messages:[],availableChannels:['here'],generationAvailable:true};
  const handoffRef='handoff_fixture_direct',sent=vi.fn();
  const fetch=vi.fn(async(input:string|URL|Request,init:RequestInit={})=>{
   const route=String(input).replace('/api/site/',''),method=init.method??'GET',body=init.body?JSON.parse(String(init.body)):{};
   if(route==='session')return Response.json(saved,{status:created?200:401});
   if(route==='sessions'&&method==='POST'){created=true;return Response.json(saved.session,{status:201});}
   if(route==='direct/briefing'&&method==='POST'){
    saved={...saved,session:{...saved.session,briefVersion:1,entryMode:'direct'},briefing:{idea:'Ideia não informada; confirmar com o visitante.',context:'Contexto não informado; confirmar com o visitante.',goal:'Continuar com a equipe sem gerar conceito.'},messages:[{messageRef:'direct-choice',role:'visitor',step:'contact-direct',text:'Prefiro falar direto com a equipe.',occurredAt:new Date().toISOString(),briefVersion:1},{messageRef:'direct-context',role:'system',step:'direct-context',text:'{"context":"Contexto não informado"}',occurredAt:new Date().toISOString(),briefVersion:1}]};
    return Response.json({briefVersion:1,entryMode:'direct'});
   }
   if(route==='identity'&&method==='POST'){saved={...saved,displayName:body.name,identity:{contactRef:'site_contact_fixture',leadRef:'site_lead_fixture',identityStatus:'provisional',briefVersion:1},session:{...saved.session,identityStatus:'provisional',leadStatus:'pending'}};return Response.json(saved.identity,{status:201});}
   if(route==='contact'&&method==='POST'){saved={...saved,contactDetails:{email:body.email}};return Response.json({contactDetails:saved.contactDetails});}
   if(route==='handoffs'&&method==='POST'){sent(body);saved={...saved,latestHandoff:{handoffRef,status:'accepted',requestId:'fixture-request',updatedAt:new Date().toISOString()},handoffSelection:{channel:'here',concept:null}};return Response.json(saved.latestHandoff,{status:202});}
   if(route==='handoffs/'+handoffRef)return Response.json(saved.latestHandoff);
   if(route==='handoffs/'+handoffRef+'/messages')return Response.json({handoffRef,channel:'here',status:'accepted',updatedAt:new Date().toISOString(),messages:[],lastSequence:0});
   throw Error('Unexpected client request: '+method+' '+route);
  });vi.stubGlobal('fetch',fetch);
  const mount=()=>render(<StrictMode><MemoryRouter initialEntries={['/contato']}><Contact/></MemoryRouter></StrictMode>);
  await prepareInitialSession();mount();fireEvent.click(screen.getByRole('button',{name:/Prefiro falar direto com a equipe/}));
  await waitFor(()=>expect(document.querySelector('.z-view-name')).toBeVisible());expect(document.querySelector('dialog[open]')).toBeNull();expect(document.querySelector('.z-view-context')).toBeNull();
  fireEvent.change(document.querySelector('#z-input')!,{target:{value:'Pessoa fictícia direta'}});fireEvent.submit(document.querySelector('#z-entry')!);
  await waitFor(()=>expect(document.querySelector('.z-view-contact')).toBeVisible());fireEvent.submit(document.querySelector('.z-view-contact form')!);expect(document.querySelector('.z-view-contact')).toBeVisible();expect(sent).not.toHaveBeenCalled();
  fireEvent.change(document.querySelector('#z-contact-email')!,{target:{value:'direct-ui@example.invalid'}});fireEvent.submit(document.querySelector('.z-view-contact form')!);
  await waitFor(()=>expect(document.querySelector('.z-view-confirm')).toBeVisible());expect(document.querySelector('.zd-consent input')).not.toBeChecked();expect(screen.getByRole('button',{name:/Confirmar encaminhamento/})).toBeDisabled();
  cleanup();await prepareInitialSession();mount();expect(document.querySelector('.z-view-confirm')).toBeVisible();expect(document.querySelector('.zd-consent input')).not.toBeChecked();expect(document.querySelector('.z-view-summary')).toBeNull();
  fireEvent.click(document.querySelector('.zd-consent input')!);fireEvent.click(screen.getByRole('button',{name:/Confirmar encaminhamento/}));
  await waitFor(()=>expect(document.querySelector('[data-handoff-status="accepted"]')).toBeVisible());expect(sent).toHaveBeenCalledTimes(1);expect(sent.mock.calls[0][0]).toEqual({channel:'here',confirmed:true,contextVersion:1});
  expect(fetch.mock.calls.filter(([url,init])=>String(url).includes('/api/site/concepts')&&init?.method==='POST')).toHaveLength(0);expect(screen.getByRole('button',{name:'Voltar à conversa ↗'})).toBeVisible();
 });
});
