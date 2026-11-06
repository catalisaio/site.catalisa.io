/** Update only the already connected, dedicated staging site agent. Plan unless --apply. */
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {parse} from 'dotenv';
const apply=process.argv.includes('--apply');
if(process.argv.slice(2).some(arg=>arg!=='--apply'))throw Error('Only --apply is accepted');
const env=parse(await fs.readFile('.local/site/staging-runtime.env'));
const origin='https://panel-api.wpp.bb.stg.catalisa.app',owner='admin@catalisa.app';
if(env.SITE_CATALISA_ORIGIN!==origin||env.SITE_CATALISA_OWNER_EMAIL!==owner)throw Error('Staging site owner required');
async function api(route,method='GET',body){
 const response=await fetch(origin+route,{method,headers:{Authorization:'Bearer '+env.SITE_CATALISA_TOKEN,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(15000),redirect:'error'});
 if(!response.ok)throw Error('Site recovery API '+method+' HTTP '+response.status);
 return response.json();
}
const me=await api('/auth/me');if((me.email??me.user?.email)!==owner)throw Error('Owner mismatch');
const config=JSON.parse(await fs.readFile('.local/site/recovery-agent-staging.json','utf8'));
if(config.origin!==origin||config.originalAgentId!==env.SITE_CATALISA_AGENT_ID)throw Error('Recovery target mismatch');
const report=JSON.parse(await fs.readFile('docs/redesign-2026-10-22/qa/integrations/readable-provider-recovery.json','utf8'));
if(report.passed!==true||report.results?.length!==2||report.results[0].operation!=='initial'||report.results[1].operation!=='refinement')throw Error('Actual candidate generation/refinement must pass before application');
const current=await api('/agents/'+env.SITE_CATALISA_AGENT_ID),candidate=await api('/agents/'+config.agentId);
if(!current.description?.startsWith('Site Catalisa — gerador exclusivo de conceitos.')||!current.active||current.tools?.length!==0)throw Error('Connected agent is not the dedicated site resource');
if(candidate.slug!=='site-catalisa-conceitos-recuperacao'||candidate.provider!=='openai'||candidate.credentialId!==config.credentialId||!candidate.active||candidate.tools?.length!==0)throw Error('Candidate changed or has tools');
const response=await api('/credentials');const rows=Array.isArray(response)?response:response.data??response.items??response.credentials;
if(!Array.isArray(rows))throw Error('Unknown credential envelope');
const credential=rows.find(c=>c.id===candidate.credentialId);const settings=typeof credential?.config==='string'?JSON.parse(credential.config):credential?.config;
if(!credential?.active||credential.type!=='AI_PROVIDER'||settings?.provider!=='openai')throw Error('Candidate credential is not the readable active owner credential');
const plan={target:'staging',dedicatedSiteAgentOnly:true,agentIdUnchanged:true,providerBefore:current.provider,providerAfter:'openai',toolCount:0,usesExistingOwnerCredential:true,productionUnchanged:true,panelDeployment:false,buildingBlockChanges:false,apply};
console.log(JSON.stringify(plan));
if(!apply)process.exit(0);
const backup='.local/site/staging-agent-before-provider-recovery.json';
try{await fs.writeFile(backup,JSON.stringify({origin,agentId:env.SITE_CATALISA_AGENT_ID,provider:current.provider,credentialId:current.credentialId,systemPrompt:current.systemPrompt},null,2)+'\n',{flag:'wx',mode:0o600});}catch(error){if(error.code!=='EEXIST')throw error;const existing=JSON.parse(await fs.readFile(backup));if(existing.agentId!==env.SITE_CATALISA_AGENT_ID||existing.origin!==origin)throw Error('Backup belongs to another target');}
await api('/agents/'+env.SITE_CATALISA_AGENT_ID,'PUT',{provider:'openai',credentialId:candidate.credentialId,systemPrompt:candidate.systemPrompt});
const checked=await api('/agents/'+env.SITE_CATALISA_AGENT_ID);
if(checked.provider!=='openai'||checked.credentialId!==candidate.credentialId||checked.systemPrompt!==candidate.systemPrompt||checked.tools?.length!==0||!checked.active)throw Error('Applied agent state did not verify; inspect the private backup before further work');
await fs.writeFile('docs/redesign-2026-10-22/qa/integrations/site-agent-recovery-applied.json',JSON.stringify({...plan,appliedAt:new Date().toISOString(),verified:true,systemPromptSha256:createHash('sha256').update(checked.systemPrompt).digest('hex'),realBrowserAcceptancePending:true},null,2)+'\n');
console.log(JSON.stringify({applied:true,verified:true,dedicatedStagingSiteAgentOnly:true,realBrowserAcceptancePending:true}));
