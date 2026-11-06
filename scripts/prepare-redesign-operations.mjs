import fs from 'node:fs/promises';
import vm from 'node:vm';
import sharp from 'sharp';
import { JSDOM } from 'jsdom';
import { referenceAssets, referenceContext, writeScopedCss } from './redesign-source.mjs';
import { compileHtml } from './compile-redesign-html.mjs';

const ctx = await referenceContext(['connection/experience.js', 'connection/studio.js', 'connection/workflows.js', 'connection/agents.js', 'connection/governance.js']);
const read = expr => vm.runInContext(expr, ctx);
const data = JSON.parse(read('JSON.stringify({stages:S_STAGES,cases:S_CASES,shots:S_SHOTS,roles:N_ROLES,scenarios:W_SCENARIOS,captures:X_CAPTURE_META})'));
const mainHtml = {};
for (const route of ['studio', 'workflows', 'agentes', 'governanca']) {
  const doc = new JSDOM(await fs.readFile(`${referenceAssets}/../${route}/index.html`, 'utf8')).window.document;
  mainHtml[route] = doc.querySelector('main').innerHTML;
}
const files = new Set([...Object.values(mainHtml), ...data.shots.map((_, i) => read(`sCapture(${i})`))].flatMap(html => [...html.matchAll(/data-gallery-file="([^"]+)"/g)].map(m => m[1])));
const captures = [];
await fs.mkdir('public/redesign/screens', { recursive: true });
for (const file of files) {
  const meta = data.captures[file]; if (!meta) throw new Error(`Missing capture provenance: ${file}`);
  const image = await fs.readFile(`${referenceAssets}/screens/${file}`); const { width, height } = await sharp(image).metadata();
  await fs.writeFile(`public/redesign/screens/${file}`, image);
  captures.push({ file, ...meta, width, height });
}
await fs.writeFile('src/redesign/data/operation-captures.json', JSON.stringify(captures, null, 2) + '\n');
await fs.writeFile('src/redesign/data/operations.json', JSON.stringify({ stages: data.stages, cases: data.cases, shots: data.shots, roles: data.roles, scenarios: data.scenarios }, null, 2) + '\n');
function capture(node) {
  if (!node.hasAttribute('data-gallery-file')) return null;
  return `<CaptureButton file=${JSON.stringify(node.getAttribute('data-gallery-file'))} label=${JSON.stringify(node.getAttribute('aria-label') || 'Ampliar imagem')} className=${JSON.stringify(node.className || '')}>${[...node.childNodes].map(n => compileHtml(n, common)).join('')}</CaptureButton>`;
}
function common(node) {
  const c = capture(node); if (c) return c;
  if (node.localName === 'img' && node.getAttribute('src')?.startsWith('/assets/screens/')) {
    const meta = captures.find(item => node.getAttribute('src').endsWith('/' + item.file));
    if (!meta) throw new Error('Missing capture dimensions');
    return { attributes: { width: `{${meta.width}}`, height: `{${meta.height}}` } };
  }
  return null;
}
function compile(html, extra = () => null) { return compileHtml(html, node => extra(node) ?? common(node)); }
const viewFunctions = [];
function view(name, cases, signature, extra) {
  const body = `export function ${name}(${signature}) { switch (index) {${cases.map(([key, html]) => `case ${JSON.stringify(key)}: return (<>${compile(html, extra)}</>);`).join('\n')}default: return null;} }`;
  viewFunctions.push(body);
}
view('StudioStageView', data.stages.map((_, i) => [i, read(`sStagePanel(${i})`)]), '{index}: {index:number}');
view('StudioCaptureView', data.shots.map((_, i) => [i, read(`sCapture(${i})`)]), '{index}: {index:number}');
view('StudioExampleView', data.cases.map((_, i) => [i, read(`sExample(${i})`)]), '{index}: {index:number}');
const flowCases = data.scenarios.flatMap((scenario, i) => scenario.groups.flatMap((_, step) => ['regular', 'missing', 'failure'].map(mode => [`${i}:${step}:${mode}`, read(`wSimulation(${i},${step},'${mode}')`)])));
view('WorkflowView', flowCases, '{index,mode,onMode,onNext,onPrevious}: {index:string;mode:FlowMode;onMode:(mode:FlowMode)=>void;onNext:()=>void;onPrevious:()=>void}', node => {
  if (node.id === 'w-sim-mode') return { attributes: { value: '{mode}', onChange: '{event=>onMode(event.currentTarget.value as FlowMode)}' } };
  if (node.hasAttribute('data-w-next')) return { attributes: { onClick: '{onNext}' } };
  if (node.hasAttribute('data-w-prev')) return { attributes: { onClick: '{onPrevious}' } };
  return null;
});
view('AgentView', data.roles.flatMap((_, i) => [['read', false], ['prepare', false], ['prepare', true]].map(([access, prepared]) => [`${i}:${access}:${prepared}`, read(`nDemo(${i},'${access}',${prepared})`)])), '{index,onAccess,onPrepare}: {index:string;onAccess:(value:AgentAccess)=>void;onPrepare:()=>void}', node => {
  if (node.hasAttribute('data-n-access')) return { attributes: { onClick: `{()=>onAccess('${node.getAttribute('data-n-access')}')}` } };
  if (node.hasAttribute('data-n-prepare')) return { attributes: { onClick: '{onPrepare}' } };
  return null;
});
const approvalCases = ['new','pending','approved','refused'].flatMap(state => ['requester','reviewer'].flatMap(actor => [false, ...(state === 'pending' && actor === 'requester' ? [true] : [])].map(denied => [`${state}:${actor}:${denied}`, read(`qApproval('${state}','${actor}',${denied})`)])));
view('ApprovalView', approvalCases, '{index,actor,onActor,onRequest,onApprove,onRefuse,onReset}: {index:string;actor:ApprovalActor;onActor:(value:ApprovalActor)=>void;onRequest:()=>void;onApprove:()=>void;onRefuse:()=>void;onReset:()=>void}', node => {
  if (node.id === 'q-actor') return { attributes: { value: '{actor}', onChange: '{event=>onActor(event.currentTarget.value as ApprovalActor)}' } };
  for (const [attr, handler] of [['request','onRequest'],['approve','onApprove'],['refuse','onRefuse'],['reset','onReset']]) if (node.hasAttribute('data-q-' + attr)) return { attributes: { onClick: `{${handler}}` } };
  return null;
});
const views = viewFunctions.join('\n\n');
await fs.writeFile('src/redesign/OperationViews.tsx', `// Generated offline from finite N01 demonstration states; never executes services.\nimport { Link } from 'react-router-dom';\n${views.includes('as CSSProperties') ? "import type { CSSProperties } from 'react';\n" : ''}import { CaptureButton } from './operation-components';\nexport type FlowMode='regular'|'missing'|'failure';\nexport type AgentAccess='read'|'prepare';\nexport type ApprovalActor='requester'|'reviewer';\n${views}\n`);

const families = [
  { route:'studio', file:'Studio', prefix:'s', css:'studio', title:'Studio', hooks:'const [paused,setPaused]=useState(false); const [stage,setStage]=useState(0); const [capture,setCapture]=useState(0); const [example,setExample]=useState(0);', tabs:[['s-stage','stage','setStage',4,'s-stage-tab-'],['s-capture','capture','setCapture',3,'s-capture-tab-'],['s-case','example','setExample',5,'s-example-tab-']], panels:{'s-stage-panel':['stage','s-stage-tab-','<StudioStageView index={stage}/>'],'s-capture-panel':['capture','s-capture-tab-','<StudioCaptureView index={capture}/>'],'s-example-panel':['example','s-example-tab-','<StudioExampleView index={example}/>']}, views:'StudioStageView,StudioCaptureView,StudioExampleView' },
  { route:'workflows', file:'Workflows', prefix:'w', css:'workflows', title:'Workflows', hooks:`const [paused,setPaused]=useState(false); const [scenario,setScenario]=useState(0); const [step,setStep]=useState(0); const [mode,setMode]=useState<FlowMode>('regular'); const selectScenario=(value:number)=>{setScenario(value);setStep(0);setMode('regular');};`, tabs:[['w-scenario','scenario','selectScenario',3,'w-scenario-']], panels:{'w-simulation':['scenario','w-scenario-',`<WorkflowView index={scenario+':'+step+':'+mode} mode={mode} onMode={setMode} onPrevious={()=>setStep(value=>Math.max(0,value-1))} onNext={()=>setStep(value=>(value+1)%operations.scenarios[scenario].groups.length)}/>`]}, views:'WorkflowView', types:'FlowMode', imports:"import operations from './data/operations.json';" },
  { route:'agentes', file:'Agents', prefix:'n', css:'agents', title:'Agentes IA', hooks:`const [paused,setPaused]=useState(false); const [role,setRole]=useState(0); const [access,setAccess]=useState<AgentAccess>('read'); const [prepared,setPrepared]=useState(false); const selectRole=(value:number)=>{setRole(value);setAccess('read');setPrepared(false);};`, tabs:[['n-role','role','selectRole',4,'n-role-']], panels:{'n-demo':['role','n-role-',`<AgentView index={role+':'+access+':'+prepared} onAccess={value=>{setAccess(value);setPrepared(false);}} onPrepare={()=>{if(access==='prepare')setPrepared(true);}}/>`]}, views:'AgentView', types:'AgentAccess' },
  { route:'governanca', file:'Governance', prefix:'q', css:'governance', title:'Governança', hooks:`const [paused,setPaused]=useState(false); const [state,setState]=useState<'new'|'pending'|'approved'|'refused'>('new'); const [actor,setActor]=useState<ApprovalActor>('requester'); const [denied,setDenied]=useState(false); const focus=useRef<string|null>(null); useEffect(()=>{if(focus.current){document.querySelector<HTMLElement>(focus.current)?.focus({preventScroll:true});focus.current=null;}},[state,actor,denied]); const decide=(next:'approved'|'refused')=>{if(state!=='pending')return;if(actor==='requester'){setDenied(true);focus.current='#q-actor';}else{setState(next);setDenied(false);focus.current='[data-q-reset]';}};`, tabs:[], panels:{'q-approval':[null,null,`<ApprovalView index={state+':'+actor+':'+denied} actor={actor} onActor={value=>{setActor(value);setDenied(false);}} onRequest={()=>{if(state==='new'&&actor==='requester'){setState('pending');setDenied(false);focus.current='#q-actor';}}} onApprove={()=>decide('approved')} onRefuse={()=>decide('refused')} onReset={()=>{setState('new');setActor('requester');setDenied(false);focus.current='[data-q-request]';}}/>`]}, views:'ApprovalView', types:'ApprovalActor' },
];
for (const family of families) {
  const jsx = compile(mainHtml[family.route], node => {
    if (node.classList.contains(family.prefix+'-page')) return { attributes: { className: `{'${family.prefix}-page'+(paused?' ${family.prefix}-motion-paused':'')}` } };
    if (node.hasAttribute(`data-${family.prefix}-motion`)) return `<OperationPause paused={paused} toggle={()=>setPaused(value=>!value)} className=${JSON.stringify(node.className || '')}/>`;
    const panel = family.panels[node.id];
    if (panel) return { attributes: { ...(panel[0] ? { 'aria-labelledby': `{'${panel[1]}'+${panel[0]}}`, tabIndex:'{0}' } : {}) }, children: panel[2] };
    for (const [attr,state,select,count,prefix] of family.tabs) if (node.hasAttribute('data-' + attr)) {
      const index = Number(node.getAttribute('data-'+attr));
      return { attributes: { 'aria-selected': `{${state}===${index}}`, tabIndex: `{${state}===${index}?0:-1}`, onClick:`{()=>${select}(${index})}`, onKeyDown:`{event=>tabKey(event,${index},${count},${select},'${prefix}')}` } };
    }
    if (['button','select','input','textarea'].includes(node.localName) && !node.hasAttribute('data-gallery-file')) throw new Error(`Unbound control in ${family.route}: ${node.outerHTML.slice(0,150)}`);
    return null;
  });
  const imports = `import {useState${family.prefix==='q'?',useEffect,useRef':''}} from 'react';\nimport {Link} from 'react-router-dom';\n${jsx.includes('as CSSProperties')?"import type {CSSProperties} from 'react';\n":''}import {OperationFrame,OperationPause${family.tabs.length?',tabKey':''},CaptureButton} from './operation-components';\nimport {${family.views}} from './OperationViews';\n${family.types ? `import type {${family.types}} from './OperationViews';` : ''}\n${family.imports||''}\nimport './base.css';\nimport './${family.css}-reference.css';\n`;
  const module = `// Native React migration of the final N01 HTML; interactive state is owned here.\n${imports}\nexport default function ${family.file}(){${family.hooks}\nreturn <OperationFrame title="${family.title}">${jsx}</OperationFrame>;}\n`;
  await fs.writeFile(`src/redesign/${family.file}.tsx`, module);
  await writeScopedCss({ file:family.css, output:`src/redesign/${family.css}-reference.css`, prefix:'c-'+family.css, owner:new RegExp(`\\.${family.prefix}-page\\b`), ownerRoot:`.${family.prefix}-page` });
}
console.log(JSON.stringify({ pages:families.length,captures:captures.length,workflowStates:flowCases.length,agentStates:12,approvalStates:approvalCases.length }));
