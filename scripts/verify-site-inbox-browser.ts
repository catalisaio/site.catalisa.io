/** Real local browser, real staging IAM/Data Store. Synthetic site-only chat; no external messages. */
import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {parse} from 'dotenv';
import {CatalisaSessionStore} from '../server/site/catalisa-store';
import {siteSmokeEnvironment} from './site-smoke-environment';
const smoke=await siteSmokeEnvironment(),origin=smoke.origin;
const env=parse(await fs.readFile('.env.local'));
if(env.SITE_HANDOFF_BACKEND!=='site-inbox'||!env.SITE_CATALISA_ORIGIN.includes('.stg.'))throw Error('Dedicated staging inbox configuration required');
const credentials=parse(await fs.readFile(path.join(os.homedir(),'.config/catalisa/admin.staging.env')));
if(credentials.EMAIL!=='admin@catalisa.app'||!credentials.PASSWORD)throw Error('Staging staff account required');
const output='docs/redesign-2026-10-22/qa/inbox-browser'+smoke.outputSuffix;await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:smoke.launchArgs});
const visitor=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',...smoke.browserOptions}),team=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',...smoke.browserOptions});
const visitorPage=await visitor.newPage(),teamPage=await team.newPage();
const errors:string[]=[],requests:{path:string;status:number}[]=[];
for(const context of [visitor,team])await context.route('**/*',smoke.restrictOrigin);
for(const page of [visitorPage,teamPage]){page.on('pageerror',reason=>errors.push(reason.message));page.on('response',response=>{if(response.url().includes('/api/site/'))requests.push({path:new URL(response.url()).pathname,status:response.status()});});}
const name='Verificação navegador '+randomUUID().slice(0,8),email='inbox-browser@example.invalid';let ref='',stage='prepare',passed=false,failure:string|undefined;
const report:Record<string,unknown>={date:new Date().toISOString(),origin,tlsValidation:smoke.staging,scope:'Actual browser UI, dedicated staging inbox and IAM, email-only fictional visitor, here-only human chat. No CRM creation or external messages.'};
// Use browser fetch so the optional Chromium hostname map covers API setup as well as navigation.
async function post(route:string,data?:unknown){const result=await visitorPage.evaluate(async({route,data,key})=>{const response=await fetch('/api/site/'+route,{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':key},body:JSON.stringify(data)});return{status:response.status,body:await response.json()};},{route,data:data??{},key:randomUUID()});if(result.status<200||result.status>=300)throw Error('Visitor setup '+route+' HTTP '+result.status);return result.body;}
async function cleanupPacket(){
 if(!ref)return;
 const base=env.SITE_CATALISA_ORIGIN+'/data-store/collections/site_catalisa_inbox_v1',headers={Authorization:'Bearer '+env.SITE_CATALISA_TOKEN,'Content-Type':'application/json'};
 const query=await fetch(base+'/query',{method:'POST',headers,body:JSON.stringify({where:{$docKey:{op:'eq',value:'handoff:'+ref}},page:1,pageSize:2}),signal:AbortSignal.timeout(15000)});
 if(!query.ok)throw Error('Synthetic inbox lookup failed');const result=await query.json();if(!result.data?.length)return;
 if(result.data.length!==1||result.data[0].attributes?.packet?.original?.contact?.email!==email)throw Error('Refuse cleanup of unrelated inbox packet');
 const doc=result.data[0],cleared=await fetch(base+'/documents/'+doc.id,{method:'PUT',headers,body:JSON.stringify({expectedVersion:doc.version,data:{purpose:'catalisa-site-inbox-v1',kind:'erased',expiresAt:new Date().toISOString(),packet:{},staffSession:{},count:0}}),signal:AbortSignal.timeout(15000)});
 if(!cleared.ok)throw Error('Synthetic packet clearing failed');const erased=await fetch(base+'/documents/'+doc.id,{method:'DELETE',headers,signal:AbortSignal.timeout(15000)});if(![200,204].includes(erased.status))throw Error('Synthetic packet deletion failed');report.syntheticPacketRemoved=true;
}
try{
 await visitorPage.goto(origin+'/contato/');
 await post('sessions');await post('lab/briefing',{idea:'Teste fictício: criar um produto original de crédito para lojistas, com análise e revisão humana.',expectedVersion:0});await post('identity',{name,briefVersion:1});await post('contact',{email,briefVersion:1});ref=(await post('handoffs',{channel:'here',confirmed:true,contextVersion:1})).handoffRef;
 stage='visitor-restoration';await visitorPage.goto(origin+'/contato/');await expect(visitorPage.locator('#z-team-message')).toBeVisible({timeout:25000});await expect(visitorPage.locator('[data-handoff-status]')).toHaveAttribute('data-handoff-status','accepted');
 stage='operator-login';await teamPage.goto(origin+'/api/site/team/');await expect(teamPage.locator('#login-form')).toBeVisible({timeout:15000});await teamPage.locator('#email').fill(credentials.EMAIL);await teamPage.locator('#password').fill(credentials.PASSWORD);await teamPage.getByRole('button',{name:'Entrar',exact:true}).click();await expect(teamPage.locator('#workspace')).toBeVisible({timeout:25000});report.actualOperatorLogin=true;
 stage='operator-opens-context';let request=teamPage.getByRole('button',{name:new RegExp(name)});
 for(let pageNumber=0;pageNumber<200&&!await request.count();pageNumber++){
  if(!await teamPage.locator('#next').isVisible())break;await teamPage.locator('#next').click();await expect(teamPage.locator('#status')).toHaveText('',{timeout:15000});
 }
 await expect(request).toBeVisible({timeout:20000});await request.click();await expect(teamPage.locator('#detail')).toContainText(email,{timeout:20000});await expect(teamPage.locator('#detail')).toContainText('produto original de crédito');
 await visitorPage.getByRole('button',{name:'Atualizar estado'}).click();await expect(visitorPage.locator('[data-handoff-status]')).toHaveAttribute('data-handoff-status','delivered',{timeout:15000});report.deliveryAfterActualOpen=true;
 stage='operator-claims';await teamPage.getByRole('button',{name:'Assumir atendimento',exact:true}).click();await expect(teamPage.locator('#reply-text')).toBeVisible({timeout:20000});await visitorPage.getByRole('button',{name:'Atualizar estado'}).click();await expect(visitorPage.locator('[data-handoff-status]')).toHaveAttribute('data-handoff-status','assigned',{timeout:15000});report.assignmentAfterActualClaim=true;
 stage='visitor-message';const visitorText='Tenho pressa. Quero começar pelo crédito para lojistas. <b>texto puro</b>';
 await visitorPage.locator('#z-team-message').fill(visitorText);await visitorPage.getByRole('button',{name:'Enviar mensagem',exact:true}).click();await expect(visitorPage.locator('.z-thread-visitor')).toContainText(visitorText,{timeout:15000});expect(await visitorPage.locator('.z-thread-visitor b').count()).toBe(0);report.visitorMessageRenderedAsText=true;
 await teamPage.locator('#refresh').click();await expect(teamPage.locator('#detail .message.visitor')).toContainText(visitorText,{timeout:20000});
 stage='operator-reply';const reply='Podemos começar pela jornada de crédito para lojistas e pelas regras de análise. Vou revisar seu contexto antes de avançarmos.';
 await teamPage.locator('#reply-text').fill(reply);await teamPage.getByRole('button',{name:'Enviar resposta',exact:true}).click();await expect(teamPage.locator('#detail .message.team')).toContainText(reply,{timeout:20000});
 await visitorPage.getByRole('button',{name:'Atualizar conversa'}).click();await expect(visitorPage.locator('.z-thread-team')).toContainText(reply,{timeout:15000});report.actualHumanReplyVisible=true;
 stage='reload';await visitorPage.reload();await expect(visitorPage.locator('.z-thread-team')).toContainText(reply,{timeout:25000});await expect(visitorPage.locator('.z-thread-visitor')).toContainText(visitorText);report.visitorReloadRestoresThread=true;
 for(const width of [320,390,768,1440]){await visitorPage.setViewportSize({width,height:1000});await teamPage.setViewportSize({width,height:1000});for(const [label,page]of [['visitor',visitorPage],['team',teamPage]]as const){await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await page.screenshot({path:path.join(output,label+'-'+width+'.png'),fullPage:true});}}
 stage='logout';await teamPage.locator('#logout').click();await expect(teamPage.locator('#login')).toBeVisible({timeout:15000});expect(await teamPage.evaluate(async()=>(await fetch('/api/site/team/requests')).status)).toBe(401);report.logoutBlocksQueue=true;
 expect(errors).toEqual([]);passed=true;
}catch(reason){failure=String(reason);process.exitCode=1;for(const [label,page]of [['visitor',visitorPage],['team',teamPage]]as const)await page.screenshot({path:path.join(output,label+'-failure.png'),fullPage:true}).catch(()=>{});}
finally{
 const stateFile='.local/site/'+smoke.privatePrefix+'inbox-browser.json';await visitor.storageState({path:stateFile}).catch(()=>{});await fs.chmod(stateFile,0o600).catch(()=>{});
 try{if(teamPage.url().startsWith(origin+'/'))await teamPage.evaluate(async()=>{await fetch('/api/site/team/logout',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});}).catch(()=>{});await cleanupPacket();const cookies=await visitor.cookies(origin+'/api/site/session'),cookie=cookies.find(item=>item.name==='catalisa_site');if(cookie){const store=new CatalisaSessionStore({origin:env.SITE_CATALISA_ORIGIN,token:env.SITE_CATALISA_TOKEN,ownerEmail:env.SITE_CATALISA_OWNER_EMAIL,collection:env.SITE_STORE_COLLECTION});await store.eraseSession(createHash('sha256').update(cookie.value).digest('hex'));report.syntheticSessionRemoved=true;}}
 catch(reason){report.cleanupError=String(reason);passed=false;process.exitCode=1;}
 await browser.close();Object.assign(report,{passed,stage,failure,errors,requests});await fs.writeFile(path.join(output,'verification.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed,stage,failure,errors,cleanupError:report.cleanupError}));
}
