/** Staging-only recovery candidate. Does not change the currently connected site agent. */
import fs from 'node:fs/promises';
import {parse} from 'dotenv';
import {CatalisaConceptGenerator} from '../server/site/integrations';
import {validateConcept} from '../server/site/concept';
const env=parse(await fs.readFile('.local/site/staging-runtime.env'));
const origin='https://panel-api.wpp.bb.stg.catalisa.app',owner='admin@catalisa.app';
if(env.SITE_CATALISA_ORIGIN!==origin||env.SITE_CATALISA_OWNER_EMAIL!==owner)throw Error('Dedicated staging owner required');
async function api(route:string,method='GET',body?:unknown){
 const r=await fetch(origin+route,{method,headers:{Authorization:'Bearer '+env.SITE_CATALISA_TOKEN,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(15000),redirect:'error'});
 if(!r.ok)throw Error('Recovery candidate API '+method+' HTTP '+r.status);
 return r.json();
}
function list(value:any):any[]{if(Array.isArray(value))return value;for(const k of ['data','items','agents','credentials'])if(Array.isArray(value?.[k]))return value[k];throw Error('Unknown list envelope');}
const me=await api('/auth/me');if((me.email??me.user?.email)!==owner)throw Error('Owner mismatch');
const original=await api('/agents/'+env.SITE_CATALISA_AGENT_ID);
if(!original.description?.startsWith('Site Catalisa — gerador exclusivo de conceitos.')||original.tools?.length)throw Error('Current site agent scope mismatch');
const credentials=list(await api('/credentials'));
const credential=credentials.find(c=>{let config;try{config=typeof c.config==='string'?JSON.parse(c.config):c.config;}catch{return false;}return c.active&&c.type==='AI_PROVIDER'&&c.name==='OpenAI API Key'&&config?.provider==='openai';});
if(!credential)throw Error('Existing readable owner OpenAI credential unavailable');
const slug='site-catalisa-conceitos-recuperacao';
const description='Site Catalisa — candidato isolado de recuperação de geração, sem ferramentas. Gerenciado por site.catalisa.io; não altera outros agentes ou produtos.';
const systemPrompt=original.systemPrompt+'\n\nConsistência obrigatória da composição: o pedido de ajuste é a tarefa atual; o conceito anterior é dado de referência e precisa ser alterado onde solicitado. Quando uma etapa envia ou recebe e-mail, inclua obrigatoriamente a capacidade de slug email tanto em blocks quanto no blockSlugs dessa etapa; wpp e wpp-business não enviam e-mail. Se o ajuste troca apenas notificações, mantenha o WhatsApp como canal de vendas e mude somente a comunicação de aviso. Atualize também os papéis das peças e a jornada, nunca apenas os títulos. Descreva quem revisa e o que autoriza em cada etapa humanReview=true. Nas telas use exemplos concretos do negócio: peças, valores, horários ou estados ilustrativos; não escreva valores vazios como Detalhes do pedido 1, Item 1 ou Clique aqui. Esses dados são exemplos, não resultados reais.\nFormato JSON obrigatório: blocks é uma lista de OBJETOS com slug e role; nunca uma lista de strings. Exemplo de formato: "blocks":[{"slug":"wpp","role":"Canal principal de vendas"},{"slug":"email","role":"Notificações após conferência humana"}]. Em journey, blockSlugs é que é uma lista de strings com os slugs desses objetos. Use exatamente o schema fornecido em context.customData.siteConcept.schema, sem propriedades extras.';
let agent=list(await api('/agents?limit=100&offset=0&search='+slug)).find(a=>a.slug===slug);
if(agent&&agent.description!==description)throw Error('Recovery slug belongs to another resource');
const config={name:'Site Catalisa — Recuperação de conceitos',slug,description,systemPrompt,provider:'openai',credentialId:credential.id,model:'fast',maxIterations:1,temperature:.3,memoryStrategy:'none',sessionContinuity:false,executionBudgetMs:20000,actionPolicy:{default:'deny',byRole:{site_concept:{allow:[]}}},active:true,isPublic:false};
agent=agent?await api('/agents/'+agent.id,'PUT',config):await api('/agents','POST',config);
const checked=await api('/agents/'+agent.id);
if(checked.provider!=='openai'||checked.credentialId!==credential.id||!checked.active||checked.tools?.length||checked.systemPrompt!==systemPrompt)throw Error('Candidate configuration not confirmed');
await fs.writeFile('.local/site/recovery-agent-staging.json',JSON.stringify({origin,agentId:agent.id,credentialId:credential.id,provider:'openai',originalAgentId:env.SITE_CATALISA_AGENT_ID}),{mode:0o600});
const generator=new CatalisaConceptGenerator({agentOrigin:origin,agentToken:env.SITE_CATALISA_TOKEN,agentId:agent.id,ownerEmail:owner},false);
const report:any={checkedAt:new Date().toISOString(),passed:false,scope:'Real owned staging zero-tool candidate; initial and notification-only refinement. Existing connected site agent and all other products unchanged. No outbound messaging. Agent chat still controls the actual model tier.',results:[]};
try{
 let start=Date.now();const briefing={idea:'vender pelo whats',context:'loja de roupas',goal:'vender mais'};
 const first=validateConcept(await generator.generate({briefing},AbortSignal.timeout(60000)));
 report.results.push({operation:'initial',elapsedMs:Date.now()-start,content:first});
 if(!first.blocks.some(b=>['wpp','wpp-business'].includes(b.slug)))throw Error('Initial concept did not preserve WhatsApp channel');
 start=Date.now();const revised=validateConcept(await generator.generate({briefing,previous:first,refinement:'Troque as notificações pelo WhatsApp por e-mail, com revisão humana antes de enviar.'},AbortSignal.timeout(60000)));
 report.results.push({operation:'refinement',elapsedMs:Date.now()-start,content:revised});
 if(!revised.blocks.some(b=>b.slug==='email'))throw Error('Refinement did not include email');
 if(!revised.blocks.some(b=>['wpp','wpp-business'].includes(b.slug)))throw Error('Notification-only refinement removed the primary WhatsApp channel');
 if(!revised.journey.some(j=>j.humanReview))throw Error('Requested human review missing');
 report.passed=true;
}catch(error){report.error=error instanceof Error?error.message:'Recovery candidate failed';process.exitCode=1;}
await fs.writeFile('docs/redesign-2026-10-22/qa/integrations/readable-provider-recovery.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:report.passed,results:report.results.map((x:any)=>({operation:x.operation,elapsedMs:x.elapsedMs,title:x.content.title})),error:report.error}));
