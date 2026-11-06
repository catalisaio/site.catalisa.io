/** Read only. Output contains no conversation, credentials or visitor inputs. */
import fs from 'node:fs/promises';
const config=JSON.parse(await fs.readFile('.local/site/staging-connection.json','utf8'));
const origin=config.origin;
if(origin!=='https://panel-api.wpp.bb.stg.catalisa.app')throw Error('Unexpected environment');
const headers={Authorization:'Bearer '+config.token};
const response=await fetch(origin+'/agents/'+config.agentId+'/executions?limit=8',{headers,signal:AbortSignal.timeout(15000),redirect:'error'});
if(!response.ok)throw Error('Execution metadata HTTP '+response.status);
const payload=await response.json();await fs.writeFile('.local/site/agent-diagnostics.json',JSON.stringify(payload),{mode:0o600});
const entries=Array.isArray(payload)?payload:payload.executions??payload.items??payload.data??[];
console.log(JSON.stringify({readOnly:true,status:response.status,envelopeKeys:Object.keys(payload),executions:entries.map(entry=>({createdAt:entry.createdAt,status:entry.status,durationMs:entry.durationMs,errorCode:entry.errorCode,timedOutStage:entry.timedOutStage,inputTokens:entry.inputTokens,outputTokens:entry.outputTokens,keys:Object.keys(entry)}))},null,2));
