/** Test-only loopback contracts. No real AI, CRM, email or WhatsApp is invoked. */
import {createServer} from 'node:http';
import {createHmac,timingSafeEqual} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {createSiteApi} from '../server/site/api';
import {SqliteSessionStore} from '../server/site/sqlite-store';
import {CatalisaConceptGenerator,HttpHandoffTransport} from '../server/site/integrations';
import type {HandoffPacket} from '../server/site/types';
import type {ConceptContent,HandoffEvent} from '../server/site/concept-types';

export async function contactHarness(options:{initialHumanReview?:boolean}={}){
  const fixture=JSON.parse(readFileSync('docs/redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/contracts/concept.example.json','utf8')) as ConceptContent;
  fixture.title='Agenda — teste local';
  if(options.initialHumanReview===false)fixture.journey.forEach(step=>{step.humanReview=false;});
  const store=new SqliteSessionStore(':memory:'),secret='test-harness-signature-secret-at-least-32-characters';
  const packets=new Map<string,HandoffPacket>();let generationCalls=0,handoffCalls=0,failGeneration=false;
  let handle:ReturnType<typeof createSiteApi>;
  const server=createServer(async(incoming,outgoing)=>{
    try{
      const parts:Buffer[]=[];let size=0;for await(const part of incoming){size+=part.length;if(size>500000){outgoing.writeHead(413);outgoing.end();return;}parts.push(part);}
      const raw=Buffer.concat(parts).toString('utf8'),body=raw?JSON.parse(raw):{};
      const json=(data:unknown,status=200)=>{outgoing.writeHead(status,{'Content-Type':'application/json'});outgoing.end(JSON.stringify(data));};
      if(incoming.url==='/auth/me'){json({email:'admin@catalisa.app'});return;}
      if(incoming.url==='/agents/site-test-agent'){json({active:true,tools:[]});return;}
      if(incoming.url==='/agents/site-test-agent/chat'){
        generationCalls++;if(failGeneration){failGeneration=false;json({code:'fixture_provider_failure'},503);return;}const input=body.context?.customData?.siteConcept?.request;
        const content:ConceptContent=structuredClone(input?.previous??fixture);
        if(input?.refinement){content.journey[0].humanReview=true;content.summary='Conceito de teste local atualizado com revisão humana.';}
        json({response:JSON.stringify(content),toolCalls:[]});return;
      }
      if(incoming.url==='/receiver'){
        const timestamp=String(incoming.headers['x-catalisa-timestamp']||''),signature=String(incoming.headers['x-catalisa-signature']||'');
        const expected=createHmac('sha256',secret).update(timestamp+'.'+raw).digest('hex');
        if(signature.length!==64||!timingSafeEqual(Buffer.from(signature),Buffer.from(expected))||incoming.headers.authorization!=='Bearer test-only-token'){json({accepted:false},401);return;}
        const packet=body as HandoffPacket;if(!packets.has(packet.handoffRef)){packets.set(packet.handoffRef,packet);handoffCalls++;}
        json({accepted:true,handoffRef:packet.handoffRef});return;
      }
      const headers=new Headers();for(const[key,value]of Object.entries(incoming.headers))if(value)headers.set(key,Array.isArray(value)?value.join(','):value);
      const response=await handle(new Request(origin+(incoming.url||'/'),{method:incoming.method,headers,...(!['GET','HEAD'].includes(incoming.method||'GET')&&raw?{body:raw}:{})}),'local-contract-test');
      outgoing.writeHead(response.status,Object.fromEntries(response.headers));outgoing.end(Buffer.from(await response.arrayBuffer()));
    }catch{outgoing.writeHead(500,{'Content-Type':'application/json'});outgoing.end(JSON.stringify({code:'test_harness_error'}));}
  });
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  const address=server.address();if(!address||typeof address==='string')throw Error('Missing test listener');const origin='http://127.0.0.1:'+address.port;
  const generator=new CatalisaConceptGenerator({agentOrigin:origin,agentToken:'test-only-token',agentId:'site-test-agent',ownerEmail:'admin@catalisa.app'},true);
  const handoff=new HttpHandoffTransport({handoffUrl:origin+'/receiver',handoffToken:'test-only-token',handoffSigningSecret:secret,channels:'here,email,whatsapp'},true);
  handle=createSiteApi({store,generator,handoff,webhookSecret:secret,secret:'test-harness-session-secret-at-least-32-characters',secure:false,origins:['http://127.0.0.1:5175','http://localhost:5175']});
  async function event(event:HandoffEvent){const raw=JSON.stringify(event),timestamp=String(Math.floor(Date.now()/1000));const signature=createHmac('sha256',secret).update(timestamp+'.'+raw).digest('hex');const response=await fetch(origin+'/api/internal/handoff-events',{method:'POST',headers:{'Content-Type':'application/json','X-Catalisa-Timestamp':timestamp,'X-Catalisa-Signature':signature},body:raw});if(!response.ok)throw Error('Callback contract failed: '+response.status);return response.json();}
  return{origin,packets,event,failNextGeneration:()=>{failGeneration=true;},counts:()=>({generationCalls,handoffCalls}),close:async()=>{server.closeAllConnections();await new Promise<void>((resolve,reject)=>server.close(error=>error?reject(error):resolve()));store.close();}};
}
