/** Staging discovery for the user-selected site account; auth + GET only. */
import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import {parse}from'dotenv';
const origin='https://panel-api.wpp.bb.stg.catalisa.app';
const credentials=parse(await fs.readFile(path.join(os.homedir(),'.config/catalisa/admin.staging.env')));
if(credentials.EMAIL!=='admin@catalisa.app'||!credentials.PASSWORD)throw Error('Unexpected staging account');
const login=await fetch(origin+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:credentials.EMAIL,password:credentials.PASSWORD}),signal:AbortSignal.timeout(15000)});if(!login.ok)throw Error('Login HTTP '+login.status);
const auth=await login.json(),token=auth.accessToken??auth.access_token??auth.token;if(!token)throw Error('No authentication token');
async function get(route){const response=await fetch(origin+route,{headers:{Authorization:'Bearer '+token},redirect:'error',signal:AbortSignal.timeout(20000)});if(!response.ok)return{status:response.status};return{status:response.status,value:await response.json()};}
function list(value){if(Array.isArray(value))return value;for(const key of['items','data','agents','workflows','credentials'])if(Array.isArray(value?.[key]))return value[key];if(value?.data&&typeof value.data==='object')return list(value.data);return[];}
const me=await get('/auth/me');if((me.value?.email??me.value?.user?.email)!==credentials.EMAIL)throw Error('Account mismatch');
const agentResult=await get('/agents?limit=100&offset=0&includeInactive=true');const workflowResult=await get('/workflows?limit=100&offset=0');const credentialResult=await get('/credentials');const ai=await get('/ai/status');
const agents=list(agentResult.value).map(a=>({id:a.id,name:a.name,slug:a.slug,active:a.active,provider:a.provider,model:a.model,credentialId:a.credentialId,tools:Array.isArray(a.tools)?a.tools.map(t=>({name:t.name,active:t.active})):null}));
const workflows=list(workflowResult.value).map(w=>({id:w.id,name:w.name,active:w.active,description:w.description}));
const credentialMetadata=list(credentialResult.value).map(c=>({id:c.id,name:c.name,type:c.type,active:c.active,provider:c.provider??c.config?.provider}));
await fs.mkdir('.local/site',{recursive:true,mode:0o700});await fs.writeFile('.local/site/staging-discovery.json',JSON.stringify({origin,token,ownerId:me.value.id??me.value.user?.id,agents,workflows,credentials:credentialMetadata},null,2),{mode:0o600});
console.log(JSON.stringify({accountMatches:true,statuses:{agents:agentResult.status,workflows:workflowResult.status,credentials:credentialResult.status,ai:ai.status},agents:agents.map(({id,credentialId,...a})=>a),workflows:workflows.map(({id,...w})=>w),credentials:credentialMetadata.map(({id,...c})=>c)},null,2));
