import fs from 'node:fs/promises';
import vm from 'node:vm';
import sharp from 'sharp';
import {JSDOM} from 'jsdom';
import {referenceContext,referenceAssets,writeScopedCss} from './redesign-source.mjs';
import {compileHtml} from './compile-redesign-html.mjs';
import {applyFinancialMessaging} from './redesign-editorial-overrides.mjs';

const context=await referenceContext(['connection/experience.js','connection/banking.js','connection/credit.js']);
const read=expression=>vm.runInContext(expression,context);
const data=JSON.parse(read('JSON.stringify({layers:BK_LAYER_COPY,tour:BK_TOUR,balances:BK_BALANCES,evidence:CR_EVIDENCE,collaterals:CR_COLLATERALS,stages:CR_STAGES})'));
await fs.writeFile('src/redesign/data/financial.json',JSON.stringify(data,null,2)+'\n');
const pages={};
for(const name of ['banking','credit'])pages[name]=applyFinancialMessaging(`/ecossistema/${name}/`,new JSDOM(await fs.readFile(`${referenceAssets}/../ecossistema/${name}/index.html`,'utf8')).window.document.querySelector('main').innerHTML);
const captures=[];
await fs.mkdir('public/redesign/media',{recursive:true});
for(const file of new Set(Object.values(pages).flatMap(html=>[...html.matchAll(/data-gallery-file="([^"]+)"/g)].map(match=>match[1])))){
  const product=file.startsWith('bank')?'banking':'credit';
  const meta=JSON.parse(read(`JSON.stringify(xShots('${product}').find(shot=>shot.file===${JSON.stringify(file)}))`));
  if(!meta?.origin)throw Error('Missing capture provenance: '+file);
  const bytes=await fs.readFile(`${referenceAssets}/screens/${file}`),{width,height}=await sharp(bytes).metadata();
  await fs.writeFile(`public/redesign/screens/${file}`,bytes);captures.push({...meta,width,height});
}
await fs.writeFile('src/redesign/data/financial-captures.json',JSON.stringify(captures,null,2)+'\n');
for(const name of ['banking','credit'])await fs.copyFile(`${referenceAssets}/media/${name}-reel.mp4`,`public/redesign/media/${name}-reel.mp4`);
function common(node){
  if(node.hasAttribute('data-gallery-file'))return `<CaptureButton file=${JSON.stringify(node.getAttribute('data-gallery-file'))} label=${JSON.stringify(node.getAttribute('aria-label'))} className=${JSON.stringify(node.className)}>${[...node.childNodes].map(child=>compileHtml(child,common)).join('')}</CaptureButton>`;
  if(node.localName==='img'){
    const capture=captures.find(item=>node.getAttribute('src')?.endsWith('/'+item.file));
    if(capture)return {attributes:{width:`{${capture.width}}`,height:`{${capture.height}}`}};
  }
  return null;
}
const text=expression=>({children:`{${expression}}`});
for(const family of [{name:'banking',file:'Banking',prefix:'bk',title:'Banking Platform'},{name:'credit',file:'Credit',prefix:'cr',title:'Credit Platform'}]){
  const {prefix,name}=family;
  const jsx=compileHtml(pages[name],node=>{
    const id=node.id;
    if(id===prefix+'-page')return{attributes:{className:`{'${prefix}-page'+(paused?' ${prefix}-paused':'')}`}};
    if(node.hasAttribute('data-'+prefix+'-motion'))return `<OperationPause paused={paused} toggle={()=>setPaused(value=>!value)}/>`;
    const tabs=name==='banking'?['app','desktop','console']:data.stages.map(stage=>stage.id);
    const attribute=name==='banking'?'data-bk-channel':'data-cr-stage';
    if(node.hasAttribute(attribute)){
      const index=tabs.indexOf(node.getAttribute(attribute));if(index<0)throw Error('Unknown financial tab');
      return{attributes:{id:`"c-${prefix}-tab-${index}"`,'aria-selected':`{selected===${index}}`,tabIndex:`{selected===${index}?0:-1}`,onClick:`{()=>setSelected(${index})}`,onKeyDown:`{event=>tabKey(event,${index},${tabs.length},setSelected,'c-${prefix}-tab-')}`}};
    }
    if(id.startsWith(prefix+'-panel-')){
      const index=tabs.indexOf(id.replace(prefix+'-panel-',''));
      return{attributes:{hidden:`{selected!==${index}}`,'aria-labelledby':`"c-${prefix}-tab-${index}"`,tabIndex:'{0}'}};
    }
    if(name==='banking'){
      if(id==='bk-base')return{attributes:{'data-layer':'{layer}'}};
      if(id==='bk-layer-title')return text('data.layers[layer][0]');
      if(id==='bk-layer-copy')return text('data.layers[layer][1]');
      if(node.hasAttribute('data-bk-layer')){const value=node.getAttribute('data-bk-layer');return{attributes:{'aria-pressed':`{layer==='${value}'}`,onClick:`{()=>setLayer('${value}')}`}};}
      const tourFields=['title','copy','client-state','operation-state','operation-copy'];
      if(tourFields.some(key=>id==='bk-tour-'+key))return text(`data.tour[tour][${tourFields.indexOf(id.slice(8))}]`);
      if(id==='bk-tour-scene')return{attributes:{'data-step':'{tour}'}};
      if(node.hasAttribute('data-bk-tour')){const index=Number(node.getAttribute('data-bk-tour'));return{attributes:{'aria-pressed':`{tour===${index}}`,onClick:`{()=>setTour(${index})}`}};}
      if(node.hasAttribute('data-bk-tour-next'))return{attributes:{onClick:'{()=>setTour(value=>(value+1)%4)}'},children:"{tour===3?'Recomeçar percurso ↺':'Próximo momento →'}"};
      if(node.hasAttribute('data-bk-balance')){const value=node.getAttribute('data-bk-balance');return{attributes:{'aria-pressed':`{balance==='${value}'}`,onClick:`{()=>setBalance('${value}')}`}};}
      if(id==='bk-balance-example')return{attributes:{'data-state':'{balance}'}};
      const balanceFields={'bk-bank-value':'money(position.bank)','bk-reserved-value':'money(position.reserved)','bk-usable-value':"position.usable===null?'Em conferência':money(position.usable)",'bk-balance-state':'position.status','bk-balance-title':'position.title','bk-balance-copy':'position.copy'};
      if(balanceFields[id])return text(balanceFields[id]);
      if(id==='bk-reserved-part'||id==='bk-usable-part')return{attributes:{style:`{{width:(${id==='bk-reserved-part'?'position.reserved':'position.bank-position.reserved'}/position.bank*100)+'%'}}`}};
      if(node.classList.contains('bk-balance-rail'))return{attributes:{'aria-label':`{position.usable===null?'O valor movimentável está em conferência.':money(position.bank)+' informados pelo banco, '+money(position.reserved)+' de reserva estruturada e '+money(position.usable)+' movimentáveis.'}`}};
    }else{
      if(node.hasAttribute('data-cr-next')){const next=(Number(node.getAttribute('data-cr-next'))+1)%4;return{attributes:{onClick:`{()=>{setSelected(${next});document.getElementById('c-cr-tab-${next}')?.focus({preventScroll:true});}}`}};}
      if(node.hasAttribute('data-cr-evidence')){const value=node.getAttribute('data-cr-evidence');return{attributes:{'aria-pressed':`{evidence==='${value}'}`,onClick:`{()=>setEvidence('${value}')}`}};}
      if(node.hasAttribute('data-cr-collateral')){const value=node.getAttribute('data-cr-collateral');return{attributes:{'aria-pressed':`{collateral==='${value}'}`,onClick:`{()=>setCollateral('${value}')}`}};}
      if(id==='cr-evidence-dossier')return{attributes:{'data-state':'{evidence}'}};
      for(const key of ['state','title','copy','result'])if(id==='cr-evidence-'+key)return text('reading.'+key);
      if(id==='cr-evidence-items')return{children:"{reading.items.map((item,index)=><li key={index}><span>{'0'+(index+1)}</span>{item}<i>{evidence==='missing'&&index===1?'—':evidence==='human'&&index===1?'◉':'✓'}</i></li>)}"};
      if(id==='cr-collateral-label')return text('modality.label.toLocaleUpperCase(\'pt-BR\')');
      for(const key of ['glyph','title','copy','detail'])if(id==='cr-collateral-'+key)return text('modality.'+key);
    }
    const shared=common(node);if(shared)return shared;
    if(['button','input','select','textarea'].includes(node.localName))throw Error('Unbound financial control: '+node.outerHTML.slice(0,200));
    return null;
  });
  const hooks=name==='banking'?`const [layer,setLayer]=useState<keyof typeof data.layers>('channels');const [tour,setTour]=useState(0);const [balance,setBalance]=useState<keyof typeof data.balances>('reserved');const position=data.balances[balance];`:`const [evidence,setEvidence]=useState<keyof typeof data.evidence>('complete');const [collateral,setCollateral]=useState<keyof typeof data.collaterals>('receivables');const reading=data.evidence[evidence],modality=data.collaterals[collateral];`;
  const module=`// Native React migration of final N01 ${family.title} HTML. Demonstrations never execute services.
import {useState} from 'react';
import {Link} from 'react-router-dom';
${jsx.includes('as CSSProperties')?"import type {CSSProperties} from 'react';":''}
import {OperationFrame,OperationPause,CaptureButton,tabKey} from './operation-components';
import data from './data/financial.json';
import captures from './data/financial-captures.json';
import './base.css';import './${name}-reference.css';import './financial.css';
${name==='banking'?"const money=(value:number)=>value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});":''}
export default function ${family.file}(){const [paused,setPaused]=useState(false);const [selected,setSelected]=useState(0);${hooks}return <OperationFrame title="${family.title}" items={captures}>${jsx}</OperationFrame>;}
`;
  await fs.writeFile(`src/redesign/${family.file}.tsx`,module);
  await writeScopedCss({file:name,output:`src/redesign/${name}-reference.css`,prefix:'c-'+name,owner:new RegExp(`\\.${prefix}-page\\b`),ownerRoot:'.'+prefix+'-page'});
}
console.log(JSON.stringify({pages:2,captures:captures.length,media:2}));
