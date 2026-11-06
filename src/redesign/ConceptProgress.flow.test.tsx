import {act,cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import Contact,{prepareInitialSession} from './Contact';
import Lab from './Lab';
import type {ContactSnapshot} from './site-client';
import type {Concept} from '../../server/site/concept-types';
import fixture from '../../docs/redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/contracts/concept.example.json';

const concept={conceptRef:'fixture-concept',version:1,briefVersion:3,content:fixture} as Concept;
const initial=():ContactSnapshot=>({session:{sessionRef:'fixture-progress',briefVersion:3,identityStatus:'provisional',leadStatus:'pending'},briefing:{idea:'Agendamento da clínica',context:'Recepção',goal:'Reduzir faltas'},displayName:'Pessoa fictícia',identity:{contactRef:'fixture-contact',leadRef:'fixture-lead',identityStatus:'provisional',briefVersion:3},contactDetails:{email:'progress@example.invalid'},messages:[],availableChannels:['here'],generationAvailable:true});
function deferred(){let resolve!:(response:Response)=>void;const promise=new Promise<Response>(done=>{resolve=done;});return{promise,resolve};}
const dialogMethods={showModal:Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype,'showModal'),close:Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype,'close')};
beforeEach(()=>{
 vi.spyOn(window,'scrollTo').mockImplementation(()=>{});
 vi.stubGlobal('matchMedia',()=>({matches:true}));
 Object.defineProperty(HTMLDialogElement.prototype,'showModal',{configurable:true,value:function(this:HTMLDialogElement){this.setAttribute('open','');}});
 Object.defineProperty(HTMLDialogElement.prototype,'close',{configurable:true,value:function(this:HTMLDialogElement){this.removeAttribute('open');this.dispatchEvent(new Event('close'));}});
});
afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.restoreAllMocks();for(const name of ['showModal','close'] as const){const descriptor=dialogMethods[name];if(descriptor)Object.defineProperty(HTMLDialogElement.prototype,name,descriptor);else Reflect.deleteProperty(HTMLDialogElement.prototype,name);}});

describe('real request milestones in generation UI',()=>{
 it('keeps Contact pending until the actual response and saved snapshot are available',async()=>{
  const post=deferred(),readback=deferred();let finished=false;
  const fetch=vi.fn(async(input:string|URL|Request,init:RequestInit={})=>{
   const route=String(input).replace('/api/site/','');
   if(route==='session')return finished?readback.promise:Response.json(initial());
   if(route==='concepts'&&init.method==='POST')return post.promise;
   if(route==='jobs/job-fixture')return Response.json({jobRef:'job-fixture',status:'succeeded',concept});
   throw Error('Unexpected controlled request '+route);
  });vi.stubGlobal('fetch',fetch);await prepareInitialSession();
  render(<MemoryRouter><Contact/></MemoryRouter>);fireEvent.click(screen.getByRole('button',{name:/Visualizar meu produto/}));
  await waitFor(()=>expect(document.querySelector('[data-generation-phase="generating"]')).toBeVisible());
  expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');expect(document.querySelector('.zd-workspace')).toBeNull();
  finished=true;await act(async()=>post.resolve(Response.json({jobRef:'job-fixture',status:'running'},{status:202})));
  await waitFor(()=>expect(document.querySelector('[data-generation-phase="opening"]')).toBeVisible());expect(document.querySelector('.zd-workspace')).toBeNull();
  await act(async()=>readback.resolve(Response.json({...initial(),latestConcept:concept})));
  await waitFor(()=>expect(document.querySelector('.zd-workspace')).toBeVisible());expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  expect(fetch.mock.calls.filter(([url,init])=>String(url).endsWith('/concepts')&&init?.method==='POST')).toHaveLength(1);
 });

 it('saves Lab identity once, then generates without a duplicate session setup',async()=>{
  let created=false,saved:ContactSnapshot={session:{sessionRef:'fixture-lab-progress',briefVersion:0,identityStatus:'anonymous',leadStatus:'none'},briefing:{},messages:[],availableChannels:['here'],generationAvailable:true};const post=deferred();
  const fetch=vi.fn(async(input:string|URL|Request,init:RequestInit={})=>{
   const route=String(input).replace('/api/site/',''),body=init.body?JSON.parse(String(init.body)):{};
   if(route==='session')return Response.json(saved,{status:created?200:401});
   if(route==='sessions'){created=true;return Response.json(saved.session,{status:201});}
   if(route==='lab/briefing'){saved={...saved,session:{...saved.session,briefVersion:1},briefing:{idea:body.idea},messages:[{messageRef:'lab-message',role:'system',step:'lab-context',text:'Contexto do Lab',occurredAt:new Date().toISOString(),briefVersion:1}]};return Response.json({briefVersion:1});}
   if(route==='identity'){saved={...saved,displayName:body.name,identity:{contactRef:'fixture-contact',leadRef:'fixture-lead',identityStatus:'provisional',briefVersion:1}};return Response.json(saved.identity);}
   if(route==='contact'){saved={...saved,contactDetails:{email:body.email}};return Response.json({contactDetails:saved.contactDetails});}
   if(route==='concepts')return post.promise;
   throw Error('Unexpected controlled request '+route);
  });vi.stubGlobal('fetch',fetch);render(<MemoryRouter><Lab/></MemoryRouter>);
  await waitFor(()=>expect(document.querySelector('#l-prompt')).toBeEnabled());fireEvent.change(document.querySelector('#l-prompt')!,{target:{value:'Matrícula pelo WhatsApp'}});fireEvent.submit(document.querySelector('#l-form')!);
  await waitFor(()=>expect(document.querySelector('.l-identity-dialog')).toHaveAttribute('open'));
  fireEvent.change(document.querySelector('#l-name')!,{target:{value:'Pessoa fictícia'}});fireEvent.change(document.querySelector('#l-email')!,{target:{value:'lab-progress@example.invalid'}});fireEvent.submit(document.querySelector('.l-identity-dialog form')!);
  await waitFor(()=>expect(document.querySelector('[data-generation-phase="generating"]')).toBeVisible());
  expect(document.querySelector('.c-concept-pending-preview')).toBeVisible();expect(document.querySelector('.l-result-title')).toBeNull();
  expect(fetch.mock.calls.filter(([url])=>String(url).endsWith('/sessions'))).toHaveLength(1);
  await act(async()=>post.resolve(Response.json({code:'provider_unavailable',message:'Falha temporária de teste',retryable:true},{status:503})));
  await waitFor(()=>expect(document.querySelector('.l-global-error')).toHaveTextContent('Falha temporária de teste'));
  expect(document.querySelector('.c-concept-pending-preview')).toBeNull();expect(document.querySelector('#l-prompt')).toHaveValue('Matrícula pelo WhatsApp');
 });

 it('restores the previous Lab concept after a failed new generation',async()=>{
  let saved={...initial(),latestConcept:concept};const post=deferred();
  vi.stubGlobal('fetch',vi.fn(async(input:string|URL|Request,init:RequestInit={})=>{
   const route=String(input).replace('/api/site/',''),body=init.body?JSON.parse(String(init.body)):{};
   if(route==='session')return Response.json(saved);
   if(route==='sessions')return Response.json(saved.session,{status:201});
   if(route==='lab/briefing'){saved={...saved,briefing:{...saved.briefing,idea:body.idea},session:{...saved.session,briefVersion:4},latestConcept:undefined as unknown as Concept};return Response.json({briefVersion:4});}
   if(route==='concepts')return post.promise;
   throw Error('Unexpected controlled request '+route);
  }));render(<MemoryRouter><Lab/></MemoryRouter>);
  await waitFor(()=>expect(document.querySelector('.l-result-title')).toHaveTextContent(fixture.title));fireEvent.change(document.querySelector('#l-prompt')!,{target:{value:'Uma nova ideia'}});fireEvent.submit(document.querySelector('#l-form')!);
  await waitFor(()=>expect(document.querySelector('.c-concept-pending-preview')).toBeVisible());expect(document.querySelector('.l-result-title')).toBeNull();
  await act(async()=>post.resolve(Response.json({code:'provider_unavailable',message:'Falha temporária de teste',retryable:true},{status:503})));
  await waitFor(()=>expect(document.querySelector('.l-global-error')).toHaveTextContent('A prévia anterior foi mantida'));
  expect(document.querySelector('.l-result-title')).toHaveTextContent(fixture.title);expect(document.querySelector('.l-result-title')).toHaveTextContent('Prévia anterior');expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
 });
});
