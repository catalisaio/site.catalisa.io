import fs from 'node:fs/promises';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import postcss from 'postcss';
import { compileHtml } from './compile-redesign-html.mjs';
import { referenceContext, referenceAssets } from './redesign-source.mjs';

// Final checked-in HTML is authoritative; reference JS is used offline only for tab states.
const root = referenceAssets.replace(/\/assets$/, '');
const routes = ['ecossistema', 'ecossistema/med', 'ecossistema/juridico', 'ecossistema/recrutamento', 'ecossistema/biometrics', 'ecossistema/decision', 'composicoes'];
const context = await referenceContext();
const documents = [], pages = [];
function compile(html, interactive = false) {
  return compileHtml(html, node => {
    if(node.localName==='h3'&&node.closest('.feature-copy'))return '<h2>'+compileHtml(node.innerHTML)+'</h2>';
    if (node.localName === 'img' && node.getAttribute('src')?.startsWith('/assets/connection/')) return { attributes: { src: `{${JSON.stringify(node.getAttribute('src').replace('/assets/connection/', '/redesign/'))}}` } };
    if (interactive && node.hasAttribute('data-composition')) {
      const index = Number(node.getAttribute('data-composition'));
      return { attributes: { id: `"c-composition-tab-${index}"`, 'aria-controls': '"composition-example"', 'aria-selected': `{selected===${index}}`, tabIndex: `{selected===${index}?0:-1}`, onClick: `{()=>setSelected(${index})}`, onKeyDown: `{event=>tabKey(event,${index},3,setSelected,'c-composition-tab-')}` } };
    }
    if (interactive && node.id === 'composition-example') return { attributes: { 'aria-labelledby': "{'c-composition-tab-'+selected}", tabIndex: '{0}' }, children: '<CompositionView index={selected}/>' };
    if (['button','input','select','textarea'].includes(node.localName)) throw new Error(`Unbound ecosystem control: ${node.outerHTML}`);
    return null;
  });
}
for (const route of routes) {
  const html = await fs.readFile(`${root}/${route}/index.html`, 'utf8');
  const document = new JSDOM(html).window.document, main = document.querySelector('main');
  documents.push(main);
  const name = document.querySelector('h1').textContent.replace(/\s+/g, ' ').trim();
  pages.push({ path: '/' + route, name, html: compile(main.innerHTML, route === 'composicoes') });
}
const cases = pages.map(page => `case ${JSON.stringify(page.path)}: return <>${page.html}</>;`).join('\n');
const views = [0,1,2].map(index => `case ${index}: return <>${compile(vm.runInContext(`cComposition(${index})`, context))}</>;`).join('\n');
const jsx = `// Generated offline from final N01 HTML. No legacy JS or HTML injection at runtime.
import {useState} from 'react';
import {useLocation,Link} from 'react-router-dom';
import type {CSSProperties} from 'react';
import {RedesignFrame} from './foundation-components';
import {tabKey} from './operation-components';
import pages from './data/ecosystem.json';
import './base.css';
import './ecosystem-reference.css';
import './ecosystem.css';
function CompositionView({index}:{index:number}){switch(index){${views}}return null;}
function Content({path,selected,setSelected}:{path:string;selected:number;setSelected:(value:number)=>void}){switch(path){${cases}}return null;}
export default function Ecosystem(){const path=useLocation().pathname.replace(/\\/$/,'');const [selected,setSelected]=useState(0);const page=pages.find(item=>item.path===path);return <RedesignFrame title={page?.name||'Ecossistema'}><div className="c-ecosystem"><Content path={path} selected={selected} setSelected={setSelected}/></div></RedesignFrame>;}
`;
// Avoid unused type imports when no generated node needs style attributes.
await fs.writeFile('src/redesign/Ecosystem.tsx', jsx.includes('as CSSProperties') ? jsx : jsx.replace("import type {CSSProperties} from 'react';\n", ''));
await fs.writeFile('src/redesign/data/ecosystem.json', JSON.stringify(pages.map(({html,...page})=>page), null, 2)+'\n');

// Keep the original media-query order. Include only selectors that target these final pages.
const css = postcss.parse(await fs.readFile(`${referenceAssets}/connection/site.css`, 'utf8'));
css.walkAtRules('font-face', rule => rule.remove());
css.walkAtRules('keyframes', rule => rule.remove());
css.walkRules(rule => {
  const selectors = rule.selectors.filter(selector => {
    if (/^(?:\*|html|body|:root)\b/.test(selector) || selector === '*') return false;
    const query = selector.replace(/::[\w-]+(?:\([^)]*\))?/g, '').replace(/:(?:hover|focus-visible|focus|active)/g, '');
    try { return documents.some(main => main.querySelector(query)); } catch { throw new Error('Unsupported ecosystem CSS selector: '+selector); }
  });
  if (!selectors.length) {rule.remove();return;}
  rule.selectors = selectors.map(selector => '.c-site .c-ecosystem '+selector.replace(/\.wrap\b/g,'.c-wrap').replace(/\.label\b/g,'.c-eyebrow').replace(/\.text-link\b/g,'.c-text-link'));
});
css.walkDecls(declaration => {
  declaration.value = declaration.value.replace(/var\(--(line|paper|ink|purple|muted|lavender)\)/g, (_,key)=>`var(--c-${({line:'rule',paper:'paper',ink:'ink',purple:'brand',muted:'body',lavender:'lavender'})[key]})`);
});
css.walkAtRules(rule => {if(rule.nodes?.length===0)rule.remove();});
await fs.writeFile('src/redesign/ecosystem-reference.css', '/* Scoped from the immutable final N01 site.css, retaining matching selectors and media order. */\n'+css.toString()+'\n');
console.log(JSON.stringify({routes:pages.length,compositionStates:3}));
