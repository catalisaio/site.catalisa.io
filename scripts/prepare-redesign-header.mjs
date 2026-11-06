import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {compileHtml} from './compile-redesign-html.mjs';
import {scopeStyles} from './scope-redesign-styles.mjs';
import {referenceAssets} from './redesign-source.mjs';

const header=new JSDOM(await fs.readFile(referenceAssets+'/../index.html','utf8')).window.document.querySelector('header');
const original=header.cloneNode(true);
const aliases={'site-header':'c-header','header-row':'c-header-row','top-nav':'c-top-nav','header-right':'c-header-right','menu-trigger':'c-menu-trigger','mobile-menu-label':'c-mobile-menu-label','sr-only':'c-sr-only','mega-menu':'c-mega-menu','mega-inner':'c-platform-menu','menu-art':'c-menu-art','all-menu':'c-all-menu','nav-toggle':'c-nav-toggle','l-nav-cta':'c-lab-link','l-nav-desktop':'c-desktop-label','l-nav-mobile':'c-mobile-label'};
for(const node of[header,...header.querySelectorAll('[class]')])node.className=node.className.split(/\s+/).map(name=>aliases[name]??name).join(' ');
const jsx=compileHtml(header,node=>{
  if(node.classList.contains('wordmark'))return '{brand}';
  if(node.localName==='header')return{attributes:{ref:'{root}'}};
  if(node.hasAttribute('data-menu')){
    const name=node.dataset.menu;
    if(!['platform','all'].includes(name))throw Error('Unknown header menu');
    return{attributes:{type:'"button"','aria-expanded':`{menu==='${name}'}`,'aria-controls':`{id+'-${name}'}`,onClick:`{event=>toggle('${name}',event.currentTarget)}`,...(name==='all'?{'aria-label':"{menu==='all'?'Fechar navegação':'Abrir navegação'}"}:{})}};
  }
  if(['menu-platform','menu-all'].includes(node.id)){const name=node.id.replace('menu-','');return{attributes:{id:`{id+'-${name}'}`,hidden:`{menu!=='${name}'}`}};}
  if(node.localName==='img')return{attributes:{src:'"/redesign/hero.webp"',width:'{1536}',height:'{1024}'}};
  if(node.localName==='button')throw Error('Unbound header control');
  return null;
}).replace('<button className={"c-menu-trigger"}', '<LanguagePicker onOpen={closeMenu}/><button className={"c-menu-trigger"}');
await fs.writeFile('src/redesign/HeaderView.tsx',`// Generated from the final N01 header; the logo is supplied as the official BrandMark.
import{Link}from'react-router-dom';import{LanguagePicker}from'./i18n/LanguagePicker';import type{ReactNode,RefObject}from'react';import'./header-reference.css';
export function HeaderView({menu,id,root,toggle,brand,closeMenu}:{menu:'platform'|'all'|null;id:string;root:RefObject<HTMLElement|null>;toggle:(name:'platform'|'all',button:HTMLButtonElement)=>void;brand:ReactNode;closeMenu:()=>void}){return <div className="c-header-host c-header-with-languages">${jsx}</div>;}
`);
const output='src/redesign/header-reference.css';
await scopeStyles({files:[{file:'site'},{file:'experience'},{file:'mobile'}],documents:[original],root:'.c-header-host',output});
let css=await fs.readFile(output,'utf8');for(const[before,after]of Object.entries(aliases))css=css.replace(new RegExp('\\.'+before+'\\b','g'),'.'+after);
css+='\n/* Preserve source spacing and accessible controls without legacy theme defaults. */\n.c-site .c-header-host .c-header-row{gap:0}\n.c-site .c-header-host .c-menu-trigger{padding:0}\n.c-site .c-header-host .c-sr-only{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}\n';
await fs.writeFile(output,css);
console.log(JSON.stringify({source:'Final N01 header',menus:2,brand:'Official SVG provided by BrandMark'}));
