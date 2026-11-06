import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {compileHtml} from './compile-redesign-html.mjs';
import {scopeStyles} from './scope-redesign-styles.mjs';

const map=JSON.parse(await fs.readFile('docs/redesign-2026-10-22/mapa-migracao.json','utf8'));
const routes=map.routes.filter(route=>route.referenceRoute.startsWith('/perspectivas/'));
const pages=[],documents=[],demoCases=[];
for(const route of routes){
  const doc=new JSDOM(await fs.readFile(route.referenceHtml,'utf8')).window.document,main=doc.querySelector('main');documents.push(main);
  const path=route.referenceRoute.replace(/\/$/,'');
  const templates=[...main.querySelectorAll('[data-e-template]')];
  for(const template of templates)demoCases.push(`case ${JSON.stringify(path+':'+template.dataset.eTemplate)}:return <>${compileHtml(template.innerHTML)}</>;`);
  const topics=[...main.querySelectorAll('[data-e-topic]')].map(node=>node.dataset.eTopic);
  const jsx=compileHtml(main.innerHTML,node=>{
    if(node.localName==='template')return '';
    if(node.classList.contains('e-page'))return{attributes:{className:`{${JSON.stringify(node.className)}+(paused?' e-paused':'')}`}};
    if(node.hasAttribute('data-e-motion'))return{attributes:{'aria-pressed':'{paused}',onClick:'{()=>setPaused(value=>!value)}'},children:"{paused?'Retomar movimento ▶':'Pausar movimento Ⅱ'}"};
    if(node.hasAttribute('data-e-filter')){const value=node.dataset.eFilter;return{attributes:{'aria-pressed':`{filter===${JSON.stringify(value)}}`,onClick:`{()=>setFilter(${JSON.stringify(value)})}`}};}
    if(node.hasAttribute('data-e-topic'))return{attributes:{hidden:`{filter!=='all'&&filter!==${JSON.stringify(node.dataset.eTopic)}}`}};
    if(node.classList.contains('e-stories'))return{attributes:{className:"{'e-stories'+(filter!=='all'?' e-filtered':'')}"}};
    if(node.id==='e-count')return{children:"{count+' leitura'+(count===1?' disponível':'s disponíveis')}"};
    if(node.hasAttribute('data-e-state')){const index=Number(node.dataset.eState);return{attributes:{'aria-selected':`{selected===${index}}`,tabIndex:`{selected===${index}?0:-1}`,onClick:`{()=>setSelected(${index})}`,onKeyDown:`{event=>tabKey(event,${index},${templates.length},setSelected,'e-lab-tab-')}`}};}
    if(node.id==='e-lab-panel')return{attributes:{'aria-labelledby':"{'e-lab-tab-'+selected}",tabIndex:'{0}'},children:'<Demo path={path} index={selected}/>'};
    if(['button','select','input','textarea'].includes(node.localName))throw Error('Unbound editorial control: '+node.outerHTML);
    return null;
  });
  const description=(main.querySelector('.e-article-title>p')??main.querySelector('p'))?.textContent.trim();
  pages.push({path,title:route.title,description,stateCount:templates.length,topics,html:jsx});
}
await fs.writeFile('src/redesign/data/editorial.json',JSON.stringify(pages.map(({html,...page})=>page),null,2)+'\n');
const content=pages.map(page=>`case ${JSON.stringify(page.path)}:return <>${page.html}</>;`).join('\n');
const module=`// Generated offline from final N01 editorial HTML and its template states.
import {useState} from 'react';import {Link,useLocation} from 'react-router-dom';import type{CSSProperties}from'react';
import {RedesignFrame} from './foundation-components';import {tabKey} from './operation-components';import pages from './data/editorial.json';
import './base.css';import './editorial-reference.css';import './editorial.css';
function Demo({path,index}:{path:string;index:number}){switch(path+':'+index){${demoCases.join('\n')}}return null;}
function Content({path,paused,setPaused,filter,setFilter,selected,setSelected,count}:{path:string;paused:boolean;setPaused:(value:((before:boolean)=>boolean))=>void;filter:string;setFilter:(value:string)=>void;selected:number;setSelected:(value:number)=>void;count:number}){switch(path){${content}}return null;}
function EditorialPage({path}:{path:string}){const [paused,setPaused]=useState(false),[filter,setFilter]=useState('all'),[selected,setSelected]=useState(0);const page=pages.find(item=>item.path===path);const count=page?.topics.filter(topic=>filter==='all'||topic===filter).length??0;return <RedesignFrame title={page?.title||'Perspectivas'}><div className="c-editorial"><Content {...{path,paused,setPaused,filter,setFilter,selected,setSelected,count}}/></div></RedesignFrame>;}
export default function Editorial(){const path=useLocation().pathname.replace(/\\/$/,'');return <EditorialPage key={path} path={path}/>;}
`;
await fs.writeFile('src/redesign/Editorial.tsx',module);
await scopeStyles({files:[{file:'site'},{file:'editorial',all:true},{file:'mobile'}],documents,root:'.c-editorial',output:'src/redesign/editorial-reference.css'});
console.log(JSON.stringify({pages:pages.length,articleStates:demoCases.length}));
