/** Real staging agent through the local UI/BFF. Fictional inputs; no external messages. */
import{chromium,expect as baseExpect}from'@playwright/test';
// Persistence crosses the real staging services. Keep explicit3s human-review
// and100s generation budgets; allow normal saving transitions to finish.
const expect=baseExpect.configure({timeout:20000});
import type{Page}from'@playwright/test';
import fs from'node:fs/promises';import path from'node:path';
import{siteSmokeEnvironment}from'./site-smoke-environment';
const smoke=await siteSmokeEnvironment();
const output=path.resolve('docs/redesign-2026-10-22/qa/contact-real'+smoke.outputSuffix);await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:smoke.launchArgs});
const results:{key:string;passed:boolean;[key:string]:unknown}[]=[];
const cases=[{key:'loja-whatsapp',idea:'vender pelo whats',context:'loja de roupas',goal:'vender mais',name:'Joana — teste',email:'joana.teste@example.invalid'},{key:'clinica-agenda',idea:'agenda clinica',context:'dentista',goal:'menos faltas',name:'Paulo — teste',phone:'+12025550123'},{key:'escola-cobranca',idea:'cobrar atrasados',context:'escola de ingles',goal:'parar cobranca manual',name:'Ana — teste',email:'ana.teste@example.invalid'}];
const selected=process.argv[2];
async function settle(page:Page,version?:number){
 await expect.poll(async()=>page.evaluate(version=>{const error=document.querySelector('.z-error')?.textContent?.trim();if(error)return'failed';const stamp=document.querySelector('.zd-concept-stamp')?.textContent||'';return document.querySelector('.zd-workspace')&&(!version||stamp.includes('Versão '+version))?'succeeded':'pending';},version),{timeout:100000,intervals:[250,500,1000]}).not.toBe('pending');
 const error=await page.locator('.z-error').first().textContent().catch(()=>null);if(error?.trim())throw Error(error.trim());
 await expect(page.locator('.zd-workspace')).toBeVisible();
}
try{
 for(const item of cases.filter(item=>!selected||item.key===selected)){
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',...smoke.browserOptions}),page=await context.newPage(),errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));let stage='briefing';
  try{
   await context.route('**/*',smoke.restrictOrigin);await page.goto(smoke.origin+'/contato/');await expect(page.locator('#z-input')).toBeVisible();
   const send=async(value:string)=>{await page.locator('#z-input').fill(value);await page.locator('#z-entry button[type="submit"]').click();};
   await send(item.idea);await expect(page.locator('.z-view-context')).toBeVisible();await send(item.context);await expect(page.locator('.z-view-focus')).toBeVisible();await send(item.goal);await expect(page.locator('.z-view-name')).toBeVisible();await send(item.name);await expect(page.locator('.z-view-contact')).toBeVisible();
   if(item.email)await page.locator('#z-contact-email').fill(item.email);if(item.phone)await page.locator('#z-contact-phone').fill(item.phone);
   await page.locator('.z-view-contact button[type="submit"]').click();await expect(page.locator('.z-view-summary')).toBeVisible();
   const before=await page.evaluate(async()=>await(await fetch('/api/site/session')).json());expect(before.generationAvailable).toBe(true);expect(before.contactDetails.email||before.contactDetails.phone).toBeTruthy();
   const conceptRequests:string[]=[];page.on('request',request=>{if(request.method()==='POST'&&new URL(request.url()).pathname.startsWith('/api/site/concepts'))conceptRequests.push(request.url());});
   stage='initial-generation';const start=Date.now();await page.locator('[data-z="continue"]').click();await expect(page.locator('.c-concept-progress')).toBeVisible();await page.screenshot({path:path.join(output,item.key+'-generation-pending.png'),fullPage:true});await settle(page);const elapsedMs=Date.now()-start;
   const saved=await page.evaluate(async()=>await(await fetch('/api/site/session')).json()),concept=saved.latestConcept;expect(concept?.content?.title).toBeTruthy();
   await page.screenshot({path:path.join(output,item.key+'-produto.png'),fullPage:true});stage='human-review';
   const hadReview=concept.content.journey.some((step:{humanReview:boolean})=>step.humanReview),requestsBefore=conceptRequests.length,reviewStart=Date.now();await page.getByRole('button',{name:hadReview?'Ver revisão humana':'Incluir revisão humana',exact:true}).click();await expect(page.locator('.zd-flow-nodes')).toBeVisible({timeout:3000});const reviewElapsedMs=Date.now()-reviewStart;
   await expect(page.locator('.zd-human-review-note')).toContainText('Revisão humana prevista nesta etapa');expect(conceptRequests.length-requestsBefore).toBe(hadReview?0:1);
   const afterReview=await page.evaluate(async()=>await(await fetch('/api/site/session')).json());expect(afterReview.latestConcept.version).toBe(concept.version+(hadReview?0:1));
   await page.reload();await expect(page.locator('.zd-workspace')).toBeVisible({timeout:15000});await page.getByRole('button',{name:'Ver revisão humana',exact:true}).click();await expect(page.locator('.zd-flow-nodes')).toBeVisible();await page.screenshot({path:path.join(output,item.key+'-jornada.png'),fullPage:true});
   let refinement;
   if(item.key==='loja-whatsapp'){
    stage='free-refinement';const version=afterReview.latestConcept.version+1,refinementStart=Date.now();await page.locator('#zd-refine-form textarea').fill('Troque as notificações pelo WhatsApp por e-mail, com revisão humana antes de enviar.');await page.getByRole('button',{name:'Pedir ajuste no conceito',exact:true}).click();await settle(page,version);
    const updated=await page.evaluate(async()=>await(await fetch('/api/site/session')).json());expect(updated.latestConcept.content.blocks.some((block:{slug:string})=>block.slug==='email')).toBe(true);refinement={elapsedMs:Date.now()-refinementStart,concept:updated.latestConcept};await page.screenshot({path:path.join(output,item.key+'-ajuste-livre.png'),fullPage:true});
   }
   expect(errors).toEqual([]);results.push({key:item.key,passed:true,briefing:{idea:item.idea,context:item.context,goal:item.goal},elapsedMs,reviewElapsedMs,hadReview,concept,refinement,errors});console.log(JSON.stringify({case:item.key,passed:true,elapsedMs,reviewElapsedMs,title:concept.content.title,refinement:!!refinement}));
  }catch(reason){const message=String(reason);results.push({key:item.key,passed:false,stage,error:message,errors});await page.screenshot({path:path.join(output,item.key+'-failure.png'),fullPage:true}).catch(()=>{});console.log(JSON.stringify({case:item.key,passed:false,stage,error:message.slice(0,500)}));}
  finally{const file=path.resolve('.local/site/'+smoke.privatePrefix+item.key+'.json');await context.storageState({path:file}).catch(()=>{});await fs.chmod(file,0o600).catch(()=>{});await context.close();}
 }
}finally{const passed=results.length>0&&results.every(result=>result.passed);await fs.writeFile(path.join(output,'verification'+(selected?'-'+selected:'')+'.json'),JSON.stringify({date:new Date().toISOString(),passed,origin:smoke.origin,release:smoke.production?process.env.SITE_SMOKE_RELEASE:undefined,tlsValidation:smoke.staging||smoke.production,scope:smoke.production?'Actual public production browser/BFF and configured production AI; synthetic contact, human review and reload. No handoff or external messages.':'Real staging AI through the target browser/BFF, fictional short contact flows, human review, reload, one free refinement. No handoff or external messages.',results},null,2));await browser.close();if(!passed)process.exitCode=1;}
