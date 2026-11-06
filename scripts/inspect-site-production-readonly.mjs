import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {parseEnv} from 'node:util';
import {homedir} from 'node:os';
import {join} from 'node:path';

// GET only. Does not create agents/collections, infer, message, provision or deploy.
const origin='https://panel-api.wpp.bb.catalisa.app';
const credentials=parseEnv(await readFile(join(homedir(),'.config/catalisa/admin.prod.env'),'utf8'));
const token=credentials.TOKEN;
if(!token)throw Error('Production admin token is unavailable');
const result={observedAt:new Date().toISOString(),origin,scope:'Production readiness GET-only inventory; no provision, inference, message or deploy',operations:[],ownerConfirmed:false,resources:{}};
async function get(path){
  const response=await fetch(origin+path,{headers:{Authorization:'Bearer '+token,Accept:'application/json'},redirect:'error',signal:AbortSignal.timeout(15000)});
  result.operations.push({method:'GET',path,status:response.status});
  if(!response.ok)throw Error('Production read returned HTTP'+response.status);
  return response.json();
}
function rows(value){if(Array.isArray(value))return value;for(const key of ['items','data','agents','credentials']){if(Array.isArray(value?.[key]))return value[key];}if(value?.data&&typeof value.data==='object')return rows(value.data);throw Error('Unrecognized list envelope');}
try{
  const me=await get('/auth/me');
  if((me.email??me.user?.email)!=='admin@catalisa.app')throw Error('Production token does not match the user-selected owner');
  result.ownerConfirmed=true;
  const agents=rows(await get('/agents?limit=100&offset=0&includeInactive=true&search=site-catalisa'));
  const collections=rows(await get('/data-store/collections'));
  const aiCredentials=rows(await get('/credentials'));
  await get('/ai/status');
  result.resources={
    dedicatedSiteAgents:agents.filter(item=>/site.catalisa|site-catalisa|catalisa.site/i.test(String(item.slug)+' '+String(item.name))).map(item=>({name:item.name,slug:item.slug,active:item.isActive??item.active??null,declaredToolCount:Array.isArray(item.tools)?item.tools.length:null,credentialConfigured:!!(item.credentialId??item.aiCredentialId)})),
    dedicatedSiteCollections:collections.filter(item=>/^site_catalisa_(sessions|inbox)_v1$/.test(item.name)).map(item=>({name:item.name,pii:item.pii===true})),
    activeOwnerAiCredentialCount:aiCredentials.filter(item=>item.active&&item.type==='AI_PROVIDER').length,
    activeOwnerAnthropicCredentialAvailable:aiCredentials.some(item=>item.active&&item.type==='AI_PROVIDER'&&/anthropic/i.test(String(item.name)+' '+String(item.provider??item.config?.provider))),
    note:'Missing dedicated resources require separate scoped provisioning before production candidate. Inventory is not a generation or persistence proof.'
  };
}catch(error){result.error=error?.cause?.code??error?.code??error.message;process.exitCode=1;}
await mkdir('docs/redesign-2026-10-22/qa/integrations',{recursive:true});
await writeFile('docs/redesign-2026-10-22/qa/integrations/production-readonly.json',JSON.stringify(result,null,2)+'\n');
console.info(JSON.stringify(result,null,2));
