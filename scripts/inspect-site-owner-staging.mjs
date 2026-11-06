/** Account discovery only: login plus authenticated GETs. No chat, lead creation, message or deployment. */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {parse} from 'dotenv';

const origin='https://panel-api.wpp.bb.stg.catalisa.app';
const credentials=parse(await fs.readFile(path.join(os.homedir(),'.config/catalisa/admin.staging.env')));
if(credentials.EMAIL!=='admin@catalisa.app'||!credentials.PASSWORD)throw Error('The configured staging account does not match the user-selected site owner.');
const result={date:new Date().toISOString(),origin,scope:'User-selected admin account discovery; authentication and GET only. No agent selection, generation, lead, channel or deployment operation.',operations:[],candidates:[]};
let bearer;
async function request(resource,login=false){
  const response=await fetch(origin+resource,{method:login?'POST':'GET',redirect:'error',headers:{Accept:'application/json',...(login?{'Content-Type':'application/json'}:{Authorization:'Bearer '+bearer})},...(login?{body:JSON.stringify({email:credentials.EMAIL,password:credentials.PASSWORD})}:{}),signal:AbortSignal.timeout(15000)});
  result.operations.push({resource:resource.split('?')[0].replace(/\/agents\/[^/]+/,'/agents/:id'),method:login?'POST':'GET',status:response.status});
  if(!response.ok)throw Error('Staging discovery returned HTTP '+response.status);
  return response.json();
}
try{
  const auth=await request('/auth/login',true);bearer=auth.accessToken??auth.access_token??auth.token;
  if(typeof bearer!=='string'||!bearer)throw Error('Authentication response did not contain an access token.');
  const me=await request('/auth/me');
  if(me.email!==credentials.EMAIL&&me.user?.email!==credentials.EMAIL)throw Error('Authenticated account did not match the requested owner.');
  result.accountMatchesUserSelection=true;
  const found=new Map();
  for(const search of ['catalisa','site','lab']){
    const response=await request('/agents?limit=100&offset=0&includeInactive=true&search='+encodeURIComponent(search));
    const agents=Array.isArray(response)?response:response.items??response.data??response.agents;
    if(!Array.isArray(agents))throw Error('Unknown agent list shape.');
    for(const agent of agents)if(/catalisa|site|\blab\b/i.test(String(agent.name)+' '+String(agent.slug)))found.set(agent.id,agent);
  }
  result.candidates=[...found.values()].map(agent=>({name:agent.name,slug:agent.slug,active:agent.active??agent.isActive??null,isPublic:agent.isPublic??null,declaredToolCount:Array.isArray(agent.tools)?agent.tools.length:null}));
  result.candidateCount=result.candidates.length;
  for(const candidate of result.candidates){
    const agent=[...found.values()].find(item=>item.slug===candidate.slug);
    if(candidate.slug!=='atendimento-catalisa'||!/^[\w-]{1,120}$/.test(agent?.id))continue;
    const detail=await request('/agents/'+agent.id);
    candidate.declaredToolNames=Array.isArray(detail.tools)?detail.tools.map(tool=>typeof tool==='string'?tool:String(tool.name??tool.toolName??'unspecified')):[];
    candidate.knowledgeAssessment='Not assessed by this account/tool inventory; a dedicated site knowledge contract still needs validation.';
  }
}catch(error){
  result.error=error.cause?.code??error.code??error.message;
  process.exitCode=1;
}finally{
  bearer=undefined;
  await fs.mkdir('docs/redesign-2026-10-22/qa/integrations',{recursive:true});
  await fs.writeFile('docs/redesign-2026-10-22/qa/integrations/admin-staging-readonly.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
}
