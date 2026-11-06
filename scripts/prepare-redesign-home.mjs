import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import sharp from 'sharp';
import {compileHtml} from './compile-redesign-html.mjs';
import {referenceAssets} from './redesign-source.mjs';
import {scopeStyles} from './scope-redesign-styles.mjs';

const main=new JSDOM(await fs.readFile(referenceAssets+'/../index.html','utf8')).window.document.querySelector('main');
const sizes=new Map();for(const image of main.querySelectorAll('img')){const src=image.getAttribute('src');if(src?.startsWith('/assets/connection/'))sizes.set(src,await sharp(await fs.readFile(referenceAssets+'/'+src.slice('/assets/'.length))).metadata());}
const jsx=compileHtml(main.innerHTML,node=>{
  if(node.localName==='img'&&node.classList.contains('hero-sculpture'))return{attributes:{src:'{"/redesign/media-v2/hero-composition.webp"}',alt:'{"Capacidades independentes em roxo conectadas por caminhos laranja numa composição modular"}',width:'{1536}',height:'{1024}',fetchPriority:'"high"'}};
  if(node.localName==='img'&&sizes.has(node.getAttribute('src'))){const{width,height}=sizes.get(node.getAttribute('src'));return{attributes:{src:`{${JSON.stringify(node.getAttribute('src').replace('/assets/connection/','/redesign/'))}}`,width:`{${width}}`,height:`{${height}}`}};}
  if(node.hasAttribute('data-open-film'))return{attributes:{ref:'{opener}',onClick:'{()=>{setPaused(false);dialog.current?.showModal();}}'}};
  if(node.id==='concept-film')return{attributes:{ref:'{dialog}',className:"{'film-dialog'+(paused?' paused':'')}",'aria-label':'"Estudo de composição"',onClose:'{()=>opener.current?.focus()}',onClick:'{event=>{if(event.target===event.currentTarget)dialog.current?.close();}}'}};
  if(node.hasAttribute('data-close-film'))return{attributes:{onClick:'{()=>dialog.current?.close()}'}};
  if(node.hasAttribute('data-toggle-film'))return{attributes:{'aria-pressed':'{paused}',onClick:'{()=>setPaused(value=>!value)}'},children:"{paused?'Reproduzir':'Pausar'}"};
  if(['button','select','input','textarea'].includes(node.localName))throw Error('Unbound Home control: '+node.outerHTML);
  return null;
});
const module=`// Native Home derived directly from the final N01 HTML. Official header/footer signatures follow D04.
import{useEffect,useRef,useState}from'react';import{Link}from'react-router-dom';${jsx.includes('as CSSProperties')?"import type{CSSProperties}from'react';":''}
import{SiteHeader,SiteFooter}from'./components';import{PreviewMeta}from'./PreviewMeta';import'./base.css';import'./home-reference.css';
export default function Home(){const[paused,setPaused]=useState(false);const dialog=useRef<HTMLDialogElement>(null),opener=useRef<HTMLButtonElement>(null),main=useRef<HTMLElement>(null);
useEffect(()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12});main.current?.querySelectorAll('.signal-art').forEach(node=>observer.observe(node));return()=>observer.disconnect();},[]);
return <div className="c-site"><PreviewMeta title="Catalisa"/><SiteHeader/><main id="c-main" ref={main} tabIndex={-1}><div className="c-home">${jsx}</div></main><SiteFooter/></div>;}
`;
await fs.writeFile('src/redesign/Home.tsx',module);
await scopeStyles({files:[{file:'site',all:true},{file:'mobile'}],documents:[main],root:'.c-home',output:'src/redesign/home-reference.css'});
console.log(JSON.stringify({source:'Final N01 Home',sections:main.querySelectorAll(':scope>section').length,images:sizes.size}));
