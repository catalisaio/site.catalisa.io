/** Retry the exact fictional browser session that reproduced the incident, then refine and reload. */
import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import {siteSmokeEnvironment} from './site-smoke-environment';
const smoke=await siteSmokeEnvironment();
if(!smoke.staging)throw Error('Recovery proof must use the real staging site');
const output='docs/redesign-2026-10-22/qa/contact-recovery-real-staging';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:smoke.launchArgs});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',storageState:'.local/site/recovery-failed-contact-cookie.json',...smoke.browserOptions});
await context.route('**/*',smoke.restrictOrigin);
const page=await context.newPage(),errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
let passed=false,stage='restore',failure:string|undefined;
const report:Record<string,unknown>={date:new Date().toISOString(),origin:smoke.origin,scope:'Actual staged UI/BFF/owner AI; retries the same fictional cookie that failed with upstream HTTP500, preserves briefing/contact, performs human review and free refinement, then reloads. No outbound message or handoff.'};
async function snapshot(){return page.evaluate(async()=>await(await fetch('/api/site/session')).json());}
async function ready(version?:number){
 await expect.poll(async()=>page.evaluate(version=>{
  const error=document.querySelector('.z-error')?.textContent?.trim();if(error)return 'failed';
  const stamp=document.querySelector('.zd-concept-stamp')?.textContent||'';
  return document.querySelector('.zd-workspace')&&(!version||stamp.includes('Versão '+version))?'succeeded':'pending';
 },version),{timeout:100000,intervals:[250,500,1000]}).not.toBe('pending');
 const error=await page.locator('.z-error').textContent().catch(()=>null);if(error?.trim())throw Error(error.trim());
 await expect(page.locator('.zd-workspace')).toBeVisible();
}
try{
 const response=await page.goto(smoke.origin+'/contato/');report.releaseId=response?.headers()['x-catalisa-site-release'];
 await expect(page.locator('.z-view-summary')).toBeVisible({timeout:25000});
 const before=await snapshot();expect(before.briefing).toEqual({idea:'vender pelo whats',context:'loja de roupas',goal:'vender mais'});expect(before.contactDetails.email).toBe('joana.teste@example.invalid');
 report.sameFailedSessionRecovered=true;report.originalSessionRef=before.session.sessionRef;report.briefingPreserved=true;report.contactPreserved=true;
 stage='retry-real-generation';const generationStart=Date.now();await page.locator('[data-z="continue"]').click();await expect(page.locator('.c-concept-progress')).toBeVisible();await ready();report.initialElapsedMs=Date.now()-generationStart;
 const generated=await snapshot();expect(generated.session.sessionRef).toBe(before.session.sessionRef);expect(generated.latestConcept.content.blocks.some((b:{slug:string})=>['wpp','wpp-business'].includes(b.slug))).toBe(true);report.initialConcept=generated.latestConcept;
 stage='human-review';const hadReview=generated.latestConcept.content.journey.some((j:{humanReview:boolean})=>j.humanReview),reviewStart=Date.now();
 await page.getByRole('button',{name:hadReview?'Ver revisão humana':'Incluir revisão humana',exact:true}).click();await expect(page.locator('.zd-flow-nodes')).toBeVisible({timeout:3000});report.humanReviewElapsedMs=Date.now()-reviewStart;report.humanReviewAlreadyExisted=hadReview;
 const reviewed=await snapshot();
 stage='refinement';const start=Date.now();await page.locator('#zd-refine-form textarea').fill('Troque as notificações pelo WhatsApp por e-mail, com revisão humana antes de enviar.');await page.getByRole('button',{name:'Pedir ajuste no conceito',exact:true}).click();await ready(reviewed.latestConcept.version+1);report.refinementElapsedMs=Date.now()-start;
 const refined=await snapshot();expect(refined.latestConcept.content.blocks.some((b:{slug:string})=>b.slug==='email')).toBe(true);expect(refined.latestConcept.content.blocks.some((b:{slug:string})=>['wpp','wpp-business'].includes(b.slug))).toBe(true);expect(refined.latestConcept.content.journey.some((j:{humanReview:boolean})=>j.humanReview)).toBe(true);report.refinedConcept=refined.latestConcept;report.notificationChangePreservesPrimaryChannel=true;
 stage='reload';await page.reload();await expect(page.locator('.zd-workspace')).toBeVisible({timeout:25000});const restored=await snapshot();expect(restored.latestConcept.conceptRef).toBe(refined.latestConcept.conceptRef);expect(restored.latestConcept.version).toBe(refined.latestConcept.version);expect(restored.briefing).toEqual(before.briefing);expect(restored.contactDetails).toEqual(before.contactDetails);report.reloadRestoresVersionAndContext=true;
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await page.screenshot({path:path.join(output,'recovered-'+width+'.png'),fullPage:true});}
 expect(errors).toEqual([]);passed=true;
}catch(error){failure=String(error);process.exitCode=1;await page.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});}
finally{
 await context.storageState({path:'.local/site/recovered-contact-cookie.json'}).catch(()=>{});await fs.chmod('.local/site/recovered-contact-cookie.json',0o600).catch(()=>{});
 await browser.close();Object.assign(report,{passed,stage,failure,errors});await fs.writeFile(path.join(output,'verification.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({passed,stage,failure,initialElapsedMs:report.initialElapsedMs,humanReviewElapsedMs:report.humanReviewElapsedMs,refinementElapsedMs:report.refinementElapsedMs,sameFailedSessionRecovered:report.sameFailedSessionRecovered,notificationChangePreservesPrimaryChannel:report.notificationChangePreservesPrimaryChannel}));
}
