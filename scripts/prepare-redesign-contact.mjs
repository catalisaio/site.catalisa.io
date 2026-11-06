import fs from 'node:fs/promises';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
import {referenceAssets,referenceContext} from './redesign-source.mjs';
import {compileHtml} from './compile-redesign-html.mjs';
import {scopeStyles} from './scope-redesign-styles.mjs';

const ctx=await referenceContext(['connection/contact.js','connection/contact-demo.js']);
const read=expression=>vm.runInContext(expression,ctx);
const paths=JSON.parse(read('JSON.stringify(Z_PATHS)'));
const samples=JSON.parse(read('JSON.stringify(Object.values(ZD_CASES).map(({name,placeholder})=>({name,idea:placeholder})))'));
await fs.writeFile('src/redesign/data/contact.json',JSON.stringify({paths,samples},null,2)+'\n');
const main=new JSDOM(await fs.readFile(`${referenceAssets}/../contato/index.html`,'utf8')).window.document.querySelector('main');
const documents=[main];
for(const expression of ['zdView({...zInitial(),name:"Pessoa de exemplo"})','zdHandoff({...zInitial(),name:"Pessoa de exemplo"})'])documents.push(new JSDOM(read(expression)).window.document.body);
const markers={'__IDEA__':'briefing.idea','__CONTEXT__':'briefing.context','__GOAL__':'briefing.goal','__NAME__':"name.toLocaleUpperCase('pt-BR')"};
function dynamicText(value){return value.split(/(__IDEA__|__CONTEXT__|__GOAL__|__NAME__)/).filter(Boolean).map(part=>markers[part]?`{${markers[part]}}`:`{${JSON.stringify(part)}}`).join('');}
function bindings(node){
  if(node.id==='z-entry')return{attributes:{onSubmit:'{event=>{event.preventDefault();submit(draft);}}','aria-busy':'{busy}'}};
  if(node.id==='z-input')return{attributes:{value:'{draft}',disabled:'{busy}',onChange:'{event=>setDraft(event.currentTarget.value)}'},children:node.localName==='textarea'?'':undefined};
  if(node.hasAttribute('data-contact-summary'))return{children:'{contactLabel}'};
  if(node.id==='z-input-error')return{children:'{error}'};
  if(node.id==='z-input-help')return{children:`{busy?'Salvando sua resposta…':${JSON.stringify(node.textContent)}}`};
  if(node.classList.contains('z-send'))return{attributes:{disabled:'{busy}','aria-label':"{busy?'Salvando resposta':'Continuar'}"},children:'{busy?<span className="z-spinner" aria-hidden="true"/>:<span aria-hidden="true">↗</span>}' };
  if(!node.children.length&&Object.keys(markers).some(marker=>node.textContent.includes(marker)))return{children:dynamicText(node.textContent)};
  if(node.hasAttribute('data-z-path'))return{attributes:{disabled:'{busy}',onClick:`{()=>choosePath(${JSON.stringify(node.dataset.zPath)})}`}};
  if(node.hasAttribute('data-z-answer'))return{attributes:{disabled:'{busy}',onClick:`{()=>submit(${JSON.stringify(node.dataset.zAnswer)})}`}};
  if(node.hasAttribute('data-z-edit'))return{attributes:{disabled:'{busy}',onClick:`{()=>edit(${JSON.stringify(node.dataset.zEdit)})}`}};
  if(node.hasAttribute('data-z'))return{attributes:{disabled:'{busy}',onClick:`{()=>action(${JSON.stringify(node.dataset.z)})}`}};
  if(node.localName==='button'){
    if(node.type==='submit')return{attributes:{disabled:'{busy}'}};
    throw Error('Unbound contact button: '+node.outerHTML);
  }
  return null;
}
const states=[];
for(const step of ['intro','context','focus','name','summary'])for(const path of (['context','focus'].includes(step)?Object.keys(paths):['custom'])){
  const html=read(`zView({...zInitial(),step:${JSON.stringify(step)},path:${JSON.stringify(path)},idea:'__IDEA__',context:'__CONTEXT__',focus:'__GOAL__',name:'__NAME__'})`);
  const node=new JSDOM(html).window.document.body.firstElementChild;
  if(step==='name')node.querySelector('.z-quiet').textContent='Seu nome e suas respostas ficam vinculados a esta conversa.';
  if(step==='intro')node.querySelector('.z-quiet')?.insertAdjacentHTML('beforeend',' <a href="/politica-privacidade">Política de Privacidade</a>. Suas respostas são salvas para continuar a conversa.');
  if(step==='summary')node.querySelector('.z-brief').insertAdjacentHTML('beforeend','<div><span>CONTATO</span><button data-z="contact" aria-label="Editar e-mail ou telefone">Editar ↗</button><p data-contact-summary></p></div>');
  documents.push(node);states.push({key:step+':'+path,jsx:compileHtml(node,bindings)});
}
const shell=compileHtml(main.innerHTML,node=>{
  if(node.id==='z-dialogue')return{children:'{children}'};
  if(node.classList.contains('z-stage'))return{attributes:{hidden:'{!!workspace}'}};
  if(node.id==='z-demo')return{attributes:{hidden:'{!workspace}'},children:'{workspace}'};
  if(node.id==='z-dialog')return'{dialog}';
  if(node.id==='z-page')return{attributes:{className:"{`z-page${paused?' z-paused':''}`}",'data-scene':'{scene}','data-mode':"{workspace?'demo':'conversation'}"}};
  if(node.classList.contains('z-prototype'))return{attributes:{onClick:"{()=>action('about')}"},children:'{"Como funciona"}<span>↗</span>'};
  if(node.id==='z-history-button')return{attributes:{hidden:'{!hasHistory}',onClick:"{()=>action('history')}"}};
  if(node.dataset.z==='motion')return{attributes:{onClick:"{()=>action('motion')}",'aria-pressed':'{paused}','aria-label':"{paused?'Retomar movimento':'Pausar movimento'}"}};
  if(node.id==='z-art-index')return{children:"{phase===0?'01 — PEÇAS EM ABERTO':phase===1?'02 — ENCONTRANDO CONTEXTO':'03 — UM CAMINHO EM COMUM'}"};
  if(node.id==='z-art-caption')return{children:"{phase===0?<>O próximo ainda<br/>pode ter muitas formas.</>:phase===1?<>Sua ideia começa<br/>a encontrar uma forma.</>:<>Uma conversa.<br/>Vários próximos passos.</>}"};
  if(node.id==='z-art-tags')return{children:"{(phase===0?['Uma intenção.','Infinitas conexões.']:tags).map(tag=><span key={tag}>{tag}</span>)}"};
  if(node.hasAttribute('data-z-phase'))return{attributes:{'aria-current':`{phase===${node.dataset.zPhase}?'step':undefined}`,className:`{phase>${node.dataset.zPhase}?'z-phase-done':undefined}`}};
  return bindings(node);
});
await fs.writeFile('src/redesign/ContactViews.tsx',`// Generated from final N01 Contact HTML and finite views. No legacy browser runtime.
import type{ReactNode}from'react';import{Link}from'react-router-dom';import type{Briefing}from'../../server/site/types';
export type ContactStep='intro'|'context'|'focus'|'name'|'summary';
type Actions={action:(name:string)=>void;submit:(text:string)=>void;choosePath:(path:string)=>void;edit:(step:string)=>void;busy:boolean};
export function ContactDialogue({step,path,draft,setDraft,error,briefing,name,contactLabel,submit,choosePath,edit,action,busy}:Actions&{step:ContactStep;path:string;draft:string;setDraft:(text:string)=>void;error:string;briefing:Briefing;name:string;contactLabel:string}){switch(step+':'+(['context','focus'].includes(step)?path:'custom')){${states.map(state=>`case ${JSON.stringify(state.key)}:return <>${state.jsx}</>;`).join('\n')}}return null;}
export function ContactShell({children,dialog,action,paused,phase,scene,tags,hasHistory,busy,workspace}:{children:ReactNode;dialog:ReactNode;action:(name:string)=>void;paused:boolean;phase:number;scene:string;tags:string[];hasHistory:boolean;busy:boolean;workspace?:ReactNode}){return <>${shell}</>;}
`);
await scopeStyles({files:[{file:'site'},{file:'contact',all:true},{file:'contact-demo',all:true},{file:'mobile'}],documents,root:'.c-contact',output:'src/redesign/contact-reference.css',insideMain:true});
console.log(JSON.stringify({nativeViews:states.length,paths:Object.keys(paths).length}));
