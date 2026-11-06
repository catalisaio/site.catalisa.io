/** Local visual/state smoke. Every site API response is controlled; no inference or server writes. */
import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const origin='http://127.0.0.1:5175';
const output=path.resolve('docs/redesign-2026-10-22/qa/concept-progress-local');
const fixturePath='docs/redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/contracts/concept.example.json';
const content=JSON.parse(await fs.readFile(fixturePath,'utf8'));
await fs.mkdir(output,{recursive:true});
const checks=[],errors=[],blocked=[],requests=[],captures=[];
let browser,currentPage,stage='launch',passed=false;
const deferred=()=>{let resolve;const promise=new Promise(done=>{resolve=done;});return {promise,resolve};};
async function seen(gate){let timer;try{await Promise.race([gate.promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Controlled request did not reach its expected gate: '+stage)),25000);})]);}finally{clearTimeout(timer);}}
const concept=version=>({conceptRef:'concept_visual_fixture',version,briefVersion:3,content:{...structuredClone(content),title:content.title+' · versão '+version}});
function snapshot(){return {session:{sessionRef:'visual-fixture',briefVersion:3,identityStatus:'provisional',leadStatus:'pending'},briefing:{idea:'Uma clínica que organiza pedidos de consulta.',context:'Pacientes e recepção precisam conferir os horários.',goal:'Explorar uma primeira composição.'},messages:[],identity:{contactRef:'visual-contact',leadRef:'visual-lead',identityStatus:'provisional',briefVersion:3},displayName:'Pessoa fictícia',contactDetails:{email:'visual@example.invalid'},availableChannels:['here'],generationAvailable:true};}

async function controlledPage(width,label,{existingConcept=false,motion='reduce'}={}){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:motion});
  const page=await context.newPage();currentPage=page;
  let saved=snapshot(),flow,serial=0;
  if(existingConcept)saved.latestConcept=concept(1);
  const unexpected=[];
  page.on('pageerror',error=>errors.push({label,width,message:error.message}));
  page.on('console',message=>{if(message.type()==='error')errors.push({label,width,message:message.text()});});
  // A real local asset request may pass. Every API request is fulfilled here.
  await context.route('**/*',async route=>{
    const request=route.request(),url=new URL(request.url());
    if(url.origin!==origin){blocked.push({label,width,origin:url.origin,path:url.pathname});await route.abort();return;}
    if(!url.pathname.startsWith('/api/site/')){await route.continue();return;}
    const endpoint=url.pathname.slice('/api/site/'.length),method=request.method();
    requests.push({label,width,endpoint,method});
    const json=(body,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});
    if(endpoint==='session'&&method==='GET'){
      if(flow?.status==='opening'){
        const pending=flow;pending.openingSeen.resolve();await pending.session.promise;
        saved={...saved,latestConcept:pending.next};delete saved.pendingJob;pending.status='complete';
      }
      await json(saved);return;
    }
    if(endpoint==='sessions'&&method==='POST'){await json(saved.session,201);return;}
    if(endpoint==='lab/briefing'&&method==='POST'){
      const body=request.postDataJSON();saved={...saved,session:{...saved.session,briefVersion:saved.session.briefVersion+1},briefing:{...saved.briefing,idea:body.idea}};
      delete saved.latestConcept;
      saved.messages.push({messageRef:'lab-'+saved.session.briefVersion,role:'system',step:'lab-context',text:'Contexto fictício controlado',briefVersion:saved.session.briefVersion,occurredAt:new Date().toISOString()});
      await json({briefVersion:saved.session.briefVersion});return;
    }
    if(/^concepts(?:\/[^/]+\/revisions)?$/.test(endpoint)&&method==='POST'){
      if(!flow||flow.status!=='armed'){unexpected.push(method+' '+endpoint);await json({error:{message:'Unarmed controlled request'}},500);return;}
      const pending=flow;pending.status='post';pending.postSeen.resolve();await pending.post.promise;
      pending.status='job';await json({jobRef:pending.ref,status:'running',requestId:'visual-request'},202);return;
    }
    if(endpoint.startsWith('jobs/')&&method==='GET'&&flow&&endpoint==='jobs/'+flow.ref){
      const pending=flow;pending.jobSeen.resolve();await pending.job.promise;
      if(pending.failure){pending.status='failed';await json({jobRef:pending.ref,status:'failed',requestId:'visual-request',error:{code:'CONTROLLED_FAILURE',message:'Falha simulada: tente novamente.',retryable:true,requestId:'visual-request'}});return;}
      pending.status='opening';await json({jobRef:pending.ref,status:'succeeded',requestId:'visual-request'});return;
    }
    unexpected.push(method+' '+endpoint);await json({error:{message:'Unexpected controlled request'}},500);
  });
  await page.clock.install();
  return {context,page,unexpected,
    arm(next,failure=false){flow={ref:'visual-job-'+(++serial),next,failure,status:'armed',post:deferred(),job:deferred(),session:deferred(),postSeen:deferred(),jobSeen:deferred(),openingSeen:deferred()};return flow;},
    async close(){try{expect(unexpected,'Unexpected API requests').toEqual([]);}finally{await context.close();if(currentPage===page)currentPage=undefined;}}};
}

async function capture(page,width,name){
  const overflow=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
  expect(overflow.document,name+' document overflow').toBeLessThanOrEqual(overflow.viewport+1);
  expect(overflow.body,name+' body overflow').toBeLessThanOrEqual(overflow.viewport+1);
  const filename=width+'-'+name+'.png';await page.screenshot({path:path.join(output,filename),fullPage:true,animations:'disabled'});
  captures.push({name,width,file:filename,overflow});
}
async function progress(page,phase,{reduced=true,refinement=false}={}){
  const panel=page.locator('.c-concept-progress');
  await expect(panel).toBeVisible();await expect(panel).toHaveAttribute('data-generation-phase',phase);
  await expect(panel).toBeInViewport({ratio:.5});
  await expect(panel.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow',/.+/);
  expect(await panel.textContent()).not.toMatch(/\d+\s*%/);
  await expect(panel.locator('li[aria-current="step"]')).toHaveCount(1);
  await expect(panel.locator('strong')).toHaveText(phase==='opening'?'Abrindo sua prévia':refinement?'Criando a próxima versão':'Criando seu conceito com IA');
  if(reduced){const animations=await panel.evaluate(node=>[node,...node.querySelectorAll('*')].map(item=>getComputedStyle(item).animationName));expect(animations.every(value=>value==='none')).toBe(true);}
  if(await page.locator('.c-lab').count()){
    const typography=await panel.evaluate(node=>({body:parseFloat(getComputedStyle(node.querySelector('.c-concept-progress-head p')).fontSize),title:parseFloat(getComputedStyle(node.querySelector('strong')).fontSize)}));
    expect(typography.body).toBe(12);expect(typography.body).toBeLessThanOrEqual(typography.title);
  }
}
async function postToOpening(page,flow,width,prefix,{refinement=false,longWait=false}={}){
  await seen(flow.postSeen);await progress(page,'generating',{refinement});
  await capture(page,width,prefix+'-post-pending');
  if(longWait){
    await page.clock.fastForward(31000);
    await expect.poll(async()=>{const value=await page.locator('.c-concept-progress-time').textContent();const [minutes,seconds]=value.split(':').map(Number);return minutes*60+seconds;}).toBeGreaterThanOrEqual(31);
    await expect(page.locator('.c-concept-progress')).toContainText('A resposta está levando mais tempo');
    // Time alone does not claim completion or advance the actual request milestone.
    await progress(page,'generating',{refinement});await capture(page,width,prefix+'-elapsed');
  }
  flow.post.resolve();await seen(flow.jobSeen);await progress(page,'generating',{refinement});
  if(flow.failure){flow.job.resolve();return;}
  flow.job.resolve();await seen(flow.openingSeen);
  await progress(page,'opening',{refinement});await capture(page,width,prefix+'-opening');
}
async function contact(width){
  const runner=await controlledPage(width,'contact'),{page}=runner;
  try{
    stage=width+' contact initial';await page.goto(origin+'/contato/',{waitUntil:'networkidle'});
    await expect(page.locator('.z-view-summary')).toBeVisible();
    const first=runner.arm(concept(1));await page.locator('[data-z="continue"]').click();
    await postToOpening(page,first,width,'contact-initial',{longWait:true});
    await expect(page.locator('.zd-exhibit')).toHaveCount(0);
    first.session.resolve();await expect(page.locator('.zd-concept-stamp')).toContainText('Versão 1');
    await expect(page.locator('.c-concept-progress')).toHaveCount(0);await capture(page,width,'contact-initial-success');
    stage=width+' contact refinement';const second=runner.arm(concept(2));
    await page.locator('#zd-refine-form textarea').fill('Mostrar a revisão antes da confirmação.');
    await page.getByRole('button',{name:'Pedir ajuste no conceito'}).click();
    await postToOpening(page,second,width,'contact-refinement',{refinement:true});
    await expect(page.locator('.zd-concept-stamp')).toContainText('Versão 1');
    await expect(page.locator('.zd-exhibit')).toBeVisible();
    second.session.resolve();await expect(page.locator('.zd-concept-stamp')).toContainText('Versão 2');
    await expect(page.locator('.c-concept-progress')).toHaveCount(0);await capture(page,width,'contact-refinement-success');
    checks.push({width,flow:'contact',initialPostPending:true,elapsedControlledClockAdvanced31s:true,noInventedPercentage:true,openingHeldBySessionRead:true,success:true,refinementPreservesOldPreviewUntilCommit:true,reducedMotion:true});
  }catch(error){await page.screenshot({path:path.join(output,width+'-contact-failure.png'),fullPage:true}).catch(()=>{});throw error;}finally{await runner.close();}
}
async function lab(width){
  const runner=await controlledPage(width,'lab'),{page}=runner;
  const generate=async(text,next,failure=false)=>{const flow=runner.arm(next,failure);await page.locator('#l-prompt').fill(text);await page.locator('#l-form button[type="submit"]').click();return flow;};
  try{
    stage=width+' lab demo';await page.goto(origin+'/lab/',{waitUntil:'networkidle'});
    await expect(page.locator('.l-result-title')).toContainText('Composição demonstrativa');
    const first=await generate('Primeira ideia fictícia para consultas.',concept(1));
    await seen(first.postSeen);await expect(page.locator('.c-concept-pending-preview')).toBeVisible();
    await expect(page.locator('.l-result-title')).toHaveCount(0);await expect(page.locator('#l-result')).toHaveAttribute('aria-busy','true');
    await postToOpening(page,first,width,'lab-from-demo');first.session.resolve();
    await expect(page.locator('.l-result-seal')).toContainText('Versão 1');await expect(page.locator('.c-concept-pending-preview')).toHaveCount(0);
    await capture(page,width,'lab-first-success');
    stage=width+' lab previous failure';const failed=await generate('Outra ideia fictícia para agenda.',concept(2),true);
    await seen(failed.postSeen);await expect(page.locator('.c-concept-pending-preview')).toBeVisible();await expect(page.locator('.l-result-title')).toHaveCount(0);
    await postToOpening(page,failed,width,'lab-previous-failure');
    await expect(page.locator('.l-global-error')).toContainText('A prévia anterior foi mantida');
    await expect(page.locator('.l-result-seal')).toContainText('Versão 1');await expect(page.locator('.l-result-title')).toContainText('Prévia anterior');
    await expect(page.locator('.c-concept-progress')).toHaveCount(0);await capture(page,width,'lab-error-preserves-previous');
    stage=width+' lab previous success';const next=await generate('Terceira ideia fictícia para agenda.',concept(2));
    await seen(next.postSeen);await expect(page.locator('.c-concept-pending-preview')).toBeVisible();await expect(page.locator('.l-result-title')).toHaveCount(0);
    await postToOpening(page,next,width,'lab-previous-success');next.session.resolve();
    await expect(page.locator('.l-result-seal')).toContainText('Versão 2');await expect(page.locator('.l-global-error')).toHaveCount(0);
    await capture(page,width,'lab-next-success');
    checks.push({width,flow:'lab',demoReplacedWhilePending:true,previousReplacedWhilePending:true,openingHeldBySessionRead:true,success:true,errorPreservesPreviousConcept:true,reducedMotion:true});
  }catch(error){await page.screenshot({path:path.join(output,width+'-lab-failure.png'),fullPage:true}).catch(()=>{});throw error;}finally{await runner.close();}
}

try{
  browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  for(const width of [320,390,768,1440]){await contact(width);await lab(width);}
  stage='normal motion';const runner=await controlledPage(1440,'motion',{motion:'no-preference'});
  try{
    await runner.page.goto(origin+'/contato/',{waitUntil:'networkidle'});const flow=runner.arm(concept(1));await runner.page.locator('[data-z="continue"]').click();await seen(flow.postSeen);
    await progress(runner.page,'generating',{reduced:false});
    const animation=await runner.page.locator('.c-concept-progress-track>span').evaluate(node=>getComputedStyle(node).animationName);expect(animation).not.toBe('none');
    await capture(runner.page,1440,'contact-motion-enabled');
    await runner.page.locator('[data-z="motion"]').click();await expect(runner.page.locator('.c-concept-progress')).toBeVisible();
    const paused=await runner.page.locator('.c-concept-progress').evaluate(node=>({opacity:Number(getComputedStyle(node).opacity),trackState:getComputedStyle(node.querySelector('.c-concept-progress-track>span')).animationPlayState}));
    expect(paused.opacity).toBe(1);expect(paused.trackState).toBe('paused');
    await capture(runner.page,1440,'contact-motion-manually-paused');
    checks.push({flow:'normal-motion',indeterminateAnimationPresent:true,manualPausePreservesVisibleCard:true,manualPauseStopsTrack:true,noPercentage:true});
    flow.post.resolve();await seen(flow.jobSeen);flow.job.resolve();await seen(flow.openingSeen);flow.session.resolve();await expect(runner.page.locator('.zd-concept-stamp')).toContainText('Versão 1');
  }finally{await runner.close();}
  expect(errors,'Browser errors').toEqual([]);passed=true;
}catch(error){if(currentPage)await currentPage.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});errors.push({stage,message:String(error)});process.exitCode=1;}
finally{
  await browser?.close();
  const report={date:new Date().toISOString(),passed,origin,scope:'Local browser rendering/state verification with controlled API routes and existing contract JSON fixture. No real inference, server persistence, provider call, handoff, external message or production deployment.',fixture:fixturePath,widths:[320,390,768,1440],stage,checks,captures,requests,blockedExternalRequests:blocked,errors};
  await fs.writeFile(path.join(output,'verification.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({passed,checks:checks.length,captures:captures.length,errors:errors.length,report:path.relative(process.cwd(),path.join(output,'verification.json'))}));
}
