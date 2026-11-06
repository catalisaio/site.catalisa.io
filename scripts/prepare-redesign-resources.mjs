import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {compileHtml} from './compile-redesign-html.mjs';
import {prepareBrandKit} from './prepare-redesign-brand.mjs';
import {scopeStyles} from './scope-redesign-styles.mjs';

const kit=await prepareBrandKit();
const map=JSON.parse(await fs.readFile('docs/redesign-2026-10-22/mapa-migracao.json','utf8'));
const routes=map.routes.filter(route=>['/interfaces/','/fontes/','/mapa/','/press-kit/'].includes(route.referenceRoute));
const allCaptures=JSON.parse(await fs.readFile('src/redesign/data/financial-captures.json','utf8'));
const captures=[],pages=[],documents=[];
function imageSize(node){if(node.localName!=='img')return null;const image=allCaptures.find(item=>node.getAttribute('src')?.endsWith('/'+item.file));return image?{attributes:{width:`{${image.width}}`,height:`{${image.height}}`}}:null;}
for(const route of routes){
  const main=new JSDOM(await fs.readFile(route.referenceHtml,'utf8')).window.document.querySelector('main');
  if(route.referenceRoute==='/mapa/')for(const[href,label]of [['/en','Site in English'],['/en/ai-agents-whatsapp','WhatsApp AI agents (English)'],['/determinismo','Determinismo'],['/en/determinism','Determinism (English)'],['/insights/all','Todos os insights'],['/en/insights/all','All insights (English)'],['/vtex-day-2026','VTEX Day 2026']]){const link=main.ownerDocument.createElement('a');link.href=href;link.className='c-text-link';link.textContent=label;main.querySelector('.site-map>div')?.append(link);}
  for(const node of main.querySelectorAll('[src],[href]'))for(const attribute of ['src','href']){
    const value=node.getAttribute(attribute);
    if(value?.startsWith('/assets/brand/'))node.setAttribute(attribute,value.replace('/assets/brand/','/redesign/brand/'));
  }
  documents.push(main);
  const jsx=compileHtml(main.innerHTML,node=>{
    if(node.hasAttribute('data-image')){
      const file=node.dataset.image.split('/').pop();const capture=allCaptures.find(item=>item.file===file);if(!capture)throw Error('Missing interface provenance: '+file);if(!captures.some(item=>item.file===file))captures.push(capture);
      return `<CaptureButton file=${JSON.stringify(file)} label=${JSON.stringify('Ampliar '+node.dataset.caption)} className="screenshot-button">${[...node.childNodes].map(child=>compileHtml(child,imageSize)).join('')}</CaptureButton>`;
    }
    if(node.hasAttribute('data-k-color'))return{attributes:{onClick:`{()=>copyColor(${JSON.stringify(node.dataset.kColor)})}`}};
    if(node.id==='k-copy-status')return{children:'{copyStatus}'};
    if(['button','select','input','textarea'].includes(node.localName))throw Error('Unbound resource control: '+node.outerHTML);
    return imageSize(node);
  });pages.push({path:route.referenceRoute.replace(/\/$/,''),title:route.title,html:jsx});
}
await fs.writeFile('src/redesign/data/resource-captures.json',JSON.stringify(captures,null,2)+'\n');
await fs.writeFile('src/redesign/data/resources.json',JSON.stringify(pages.map(({html,...page})=>page),null,2)+'\n');
const module=`// Native resource pages preserving the supplied identity under decision D15.
import{useState}from'react';import{Link,useLocation}from'react-router-dom';import type{CSSProperties}from'react';
import{OperationFrame,CaptureButton}from'./operation-components';import captures from'./data/resource-captures.json';import pages from'./data/resources.json';
import'./base.css';import'./resources-reference.css';import'./resources.css';
function Content({path,copyColor,copyStatus}:{path:string;copyColor:(color:string)=>void;copyStatus:string}){switch(path){${pages.map(page=>`case ${JSON.stringify(page.path)}:return <>${page.html}</>;`).join('\n')}}return null;}
function ResourcePage({path}:{path:string}){const[copyStatus,setCopyStatus]=useState('Clique em uma cor para copiar o HEX.');async function copyColor(color:string){try{await navigator.clipboard.writeText(color);setCopyStatus(color+' copiado.');}catch{setCopyStatus('Copie este código: '+color);}}const page=pages.find(item=>item.path===path);return <OperationFrame title={page?.title||'Recursos'} items={captures}><div className="c-resources"><Content {...{path,copyColor,copyStatus}}/></div></OperationFrame>;}
export default function Resources(){const path=useLocation().pathname.replace(/\\/$/,'');return <ResourcePage key={path} path={path}/>;}
`;
await fs.writeFile('src/redesign/Resources.tsx',module.includes('as CSSProperties')?module:module.replace("import type{CSSProperties}from'react';",''));
await scopeStyles({files:[{file:'site'},{file:'presskit',all:true},{file:'mobile'}],documents,root:'.c-resources',output:'src/redesign/resources-reference.css'});
console.log(JSON.stringify({pages:pages.length,captures:captures.length,brand:{svg:kit.svgCount,png:kit.pngCount,source:kit.source}}));
