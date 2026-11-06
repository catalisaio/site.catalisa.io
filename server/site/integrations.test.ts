// @vitest-environment node
import {afterEach,describe,expect,it,vi} from 'vitest';
import {CatalisaConceptGenerator,HttpHandoffTransport,parseConceptJson} from './integrations';
import {completeReferencedBlocks,validateConcept} from './concept';
import observedSchool from './__fixtures__/school-missing-block-index.json';
import type {HandoffPacket} from './types';
import {conceptLocaleCopy} from '../../shared/site-concept-locale';
import type {ConceptLocale} from '../../shared/site-concept-locale';

afterEach(()=>vi.unstubAllGlobals());
const config={agentOrigin:'https://site-test.invalid',agentToken:'test-only-token',agentId:'site-test-agent',ownerEmail:'admin@catalisa.app'};
describe('Server integration boundaries',()=>{
  it('isolates per-call language instructions and strict disclaimer schemas across simultaneous calls on one adapter',async()=>{
    const bodies:Record<string,unknown>[]=[],locales=Object.keys(conceptLocaleCopy) as ConceptLocale[];
    const fetch=vi.fn(async(url:string,init?:RequestInit)=>{
      if(url.endsWith('/auth/me'))return Response.json({email:'admin@catalisa.app'});
      if(url.endsWith('/agents/site-test-agent'))return Response.json({active:true,tools:[]});
      const body=JSON.parse(String(init?.body)),siteConcept=body.context.customData.siteConcept; bodies.push(body);
      const locale=siteConcept.outputLocale as ConceptLocale,output={...structuredClone(observedSchool),disclaimer:conceptLocaleCopy[locale].disclaimer};
      return Response.json({response:JSON.stringify(output),toolCalls:[]});
    });vi.stubGlobal('fetch',fetch);const adapter=new CatalisaConceptGenerator(config,false);
    const output=await Promise.all(locales.map(locale=>adapter.generate({locale,briefing:{idea:'Visitor text must remain unchanged'}},AbortSignal.timeout(2000))));
    for(const[index,locale]of locales.entries()){
      expect(validateConcept(output[index],locale).disclaimer).toBe(conceptLocaleCopy[locale].disclaimer);
      const body=bodies.find(body=>(body.context as {customData:{siteConcept:{outputLocale:string}}}).customData.siteConcept.outputLocale===locale) as {message:string;context:{customData:{siteConcept:{schema:{properties:{disclaimer:{const:string}}};request:{locale:string;briefing:{idea:string}}}}}};
      expect(body.message).toContain('('+locale+')');expect(body.message).toContain('Keep schema keys, schemaVersion, IDs, references and capability slugs unchanged');expect(body.context.customData.siteConcept.schema.properties.disclaimer.const).toBe(conceptLocaleCopy[locale].disclaimer);expect(body.context.customData.siteConcept.request.briefing.idea).toBe('Visitor text must remain unchanged');
    }
    expect(bodies).toHaveLength(locales.length);expect(fetch.mock.calls.filter(([url])=>url.endsWith('/chat'))).toHaveLength(locales.length);
  });
  it('normalizes only a terminal string null, preserving real IDs and rejecting unknown destinations',()=>{
    const output=structuredClone(observedSchool);output.screens[0].action.nextScreenId='null';
    expect(validateConcept(completeReferencedBlocks(output)).screens[0].action.nextScreenId).toBeNull();
    output.screens[1].id='null';expect(validateConcept(completeReferencedBlocks(output)).screens[0].action.nextScreenId).toBe('null');
    output.screens[0].action.nextScreenId='unmatched';expect(()=>validateConcept(completeReferencedBlocks(output))).toThrow();
  });
  it('accepts only a complete JSON response or its single provider JSON fence',()=>{
    const concept=completeReferencedBlocks(observedSchool),json=JSON.stringify(concept);
    expect(validateConcept(parseConceptJson('```json\n'+json+'\n```'))).toEqual(concept);
    expect(validateConcept(parseConceptJson('\n '+json+' \n'))).toEqual(concept);
    for(const invalid of ['Here is the concept: '+json,'```javascript\n'+json+'\n```','```json\n'+json+'\n```\n<script>alert(1)</script>','```json\n'+json.slice(0,-1)+'\n```'])expect(()=>parseConceptJson(invalid)).toThrow();
    const unknown=structuredClone(concept);unknown.journey[0].blockSlugs=['unknown-capability'];expect(()=>validateConcept(completeReferencedBlocks(parseConceptJson('```json\n'+JSON.stringify(unknown)+'\n```')))).toThrow();
  });
  it('treats an HTTP 4xx as a definitive receiving-service rejection',async()=>{vi.stubGlobal('fetch',vi.fn(async()=>Response.json({error:'test rejection'},{status:422})));const adapter=new HttpHandoffTransport({handoffUrl:'https://site-test.invalid/receiver',handoffToken:'test-only-token',handoffSigningSecret:'test-only-secret',channels:'here'},false);await expect(adapter.send({handoffRef:'handoff_test'} as HandoffPacket,AbortSignal.timeout(1000))).rejects.toMatchObject({code:'handoff_rejected'});});
  it('does not invoke chat when the authenticated owner differs',async()=>{const fetch=vi.fn(async()=>Response.json({email:'different@example.invalid'}));vi.stubGlobal('fetch',fetch);const adapter=new CatalisaConceptGenerator(config,false);await expect(adapter.generate({briefing:{idea:'Teste'}},AbortSignal.timeout(1000))).rejects.toMatchObject({code:'agent_owner_mismatch'});expect(fetch).toHaveBeenCalledTimes(1);});
  it('does not invoke chat on an agent with operational tools',async()=>{const fetch=vi.fn().mockResolvedValueOnce(Response.json({email:'admin@catalisa.app'})).mockResolvedValueOnce(Response.json({active:true,tools:[{name:'send_whatsapp_message'}]}));vi.stubGlobal('fetch',fetch);await expect(new CatalisaConceptGenerator(config,false).generate({briefing:{idea:'Teste'}},AbortSignal.timeout(1000))).rejects.toMatchObject({code:'agent_scope_mismatch'});expect(fetch).toHaveBeenCalledTimes(2);});
  it('rejects a receiving service that does not acknowledge the same handoff',async()=>{const fetch=vi.fn(async()=>Response.json({accepted:true,handoffRef:'different'}));vi.stubGlobal('fetch',fetch);const adapter=new HttpHandoffTransport({handoffUrl:'https://site-test.invalid/receiver',handoffToken:'test-only-token',handoffSigningSecret:'test-only-signing-secret',channels:'here'},false);await expect(adapter.send({handoffRef:'handoff_test'} as HandoffPacket,AbortSignal.timeout(1000))).rejects.toMatchObject({code:'handoff_unconfirmed'});const options=fetch.mock.calls[0] as unknown as [string,RequestInit];expect(options[1].redirect).toBe('error');expect((options[1].headers as Record<string,string>)['Idempotency-Key']).toBe('handoff_test');expect((options[1].headers as Record<string,string>)['X-Catalisa-Signature']).toMatch(/^[a-f0-9]{64}$/);});
  it('retries a transient read-only owner check but calls chat only once',async()=>{
    const fetch=vi.fn().mockResolvedValueOnce(Response.json({}, {status:503})).mockResolvedValueOnce(Response.json({email:'admin@catalisa.app'})).mockResolvedValueOnce(Response.json({active:true,tools:[]})).mockResolvedValueOnce(Response.json({response:'{}',toolCalls:[]}));vi.stubGlobal('fetch',fetch);
    await expect(new CatalisaConceptGenerator(config,false).generate({briefing:{idea:'Teste'}},AbortSignal.timeout(2000))).resolves.toEqual({});
    expect(fetch).toHaveBeenCalledTimes(4);expect(fetch.mock.calls.filter(([url])=>String(url).endsWith('/chat'))).toHaveLength(1);
  });
  it('does not retry a failed chat, and diagnoses the upstream stage without exposing content',async()=>{
    const fetch=vi.fn().mockResolvedValueOnce(Response.json({email:'admin@catalisa.app'})).mockResolvedValueOnce(Response.json({active:true,tools:[]})).mockResolvedValueOnce(Response.json({}, {status:503}));vi.stubGlobal('fetch',fetch);
    await expect(new CatalisaConceptGenerator(config,false).generate({briefing:{idea:'Teste'}},AbortSignal.timeout(2000))).rejects.toMatchObject({code:'provider_unavailable',diagnostic:{stage:'concept-chat',httpStatus:503}});expect(fetch).toHaveBeenCalledTimes(3);
  });
  it('completes the block index from explicit journey references in an observed real school response',()=>{
    expect(()=>validateConcept(observedSchool)).toThrow();
    const complete=validateConcept(completeReferencedBlocks(observedSchool));
    expect(complete.blocks.map(block=>block.slug)).toEqual(['payments','wpp','customers','billing','decision-engine','email']);
    expect(complete.screens).toEqual(observedSchool.screens);expect(complete.journey).toEqual(observedSchool.journey);expect(observedSchool.blocks).toHaveLength(4);
    const unknown=structuredClone(observedSchool);unknown.journey[0].blockSlugs=['unknown-capability'];expect(()=>validateConcept(completeReferencedBlocks(unknown))).toThrow();
    const broken=structuredClone(observedSchool);broken.screens[0].action.nextScreenId='missing-screen';expect(()=>validateConcept(completeReferencedBlocks(broken))).toThrow();
  });
  it('allows HTTP only for explicit loopback development connectors',()=>{expect(()=>new CatalisaConceptGenerator({...config,agentOrigin:'http://remote.invalid'},true)).toThrow();expect(()=>new CatalisaConceptGenerator({...config,agentOrigin:'http://127.0.0.1:5186'},false)).toThrow();expect(()=>new CatalisaConceptGenerator({...config,agentOrigin:'http://127.0.0.1:5186'},true)).not.toThrow();});
});
