import type {CommitResult,Receipt,SessionState,SessionStore,StoredSession} from './types';
import {ApiError} from './input';
import {marketOutboxMetadata} from './site-market-outbox';
import {upstreamPressure} from './upstream-pressure';

export interface CatalisaStoreConfig {origin:string;token:string;ownerEmail:string;collection:string;local?:boolean}
interface StoredReceipt {expiresAt:string;receipt:Receipt}
interface Attributes {purpose:'catalisa-site-v1';kind:'session'|'quota'|'erased';expiresAt:string;state?:SessionState;receipts?:Record<string,StoredReceipt>;handoffRefs?:string[];marketPending?:boolean;marketNextAt?:string;count?:number;migration?:{id:string;sourceRevision:number}}
interface Document {id:string;docKey:string;version:number;attributes:Attributes}
const purpose='catalisa-site-v1' as const;
const unavailable=(operation='store',httpStatus?:number)=>Object.assign(new ApiError(503,'persistence_unavailable','Não foi possível acessar sua conversa agora. Tente novamente; suas respostas já salvas serão retomadas.'),{diagnostic:{operation,httpStatus}});

/** Tenant-scoped Data Store. State + idempotency receipt share one versioned, encrypted document. */
export class CatalisaSessionStore implements SessionStore {
  private origin:string;
  private base:string;
  private ready?:Promise<void>;
  constructor(private config:CatalisaStoreConfig){
    const url=new URL(config.origin);
    if(url.username||url.password||url.search||url.hash||url.pathname!=='/'||(url.protocol!=='https:'&&!(config.local&&url.protocol==='http:'&&['127.0.0.1','localhost'].includes(url.hostname))))throw Error('Invalid store origin');
    if(!/^[a-z][a-z0-9_-]{0,62}$/.test(config.collection)||!config.token||!config.ownerEmail)throw Error('Invalid store configuration');
    this.origin=url.origin;this.base='/data-store/collections/'+config.collection;
  }
  private async request(route:string,method='GET',body?:unknown):Promise<{status:number;body:Record<string,unknown>}>{
    const encoded=body===undefined?undefined:JSON.stringify(body);
    if(encoded&&Buffer.byteLength(JSON.stringify((body as {data?:unknown}).data??body))>500000)throw new ApiError(429,'history_limit','Esta conversa chegou ao limite de armazenamento. Baixe o conceito e continue com a equipe.');
    let response:Response;
    try{response=await fetch(this.origin+route,{method,headers:{Authorization:'Bearer '+this.config.token,Accept:'application/json',...(encoded?{'Content-Type':'application/json'}:{})},...(encoded?{body:encoded}:{}),signal:AbortSignal.timeout(5000),redirect:'error'});}catch{throw unavailable(method+' '+route.replace(/[a-f0-9-]{30,}/g,':id'));}
    const pressure=upstreamPressure(response);if(pressure)throw pressure;
    if(response.status===204)return{status:204,body:{}};
    const reader=response.body?.getReader();if(!reader)throw unavailable();const parts:Uint8Array[]=[];let bytes=0;
    while(true){const part=await reader.read();if(part.done)break;bytes+=part.value.byteLength;if(bytes>2000000){await reader.cancel();throw unavailable();}parts.push(part.value);}
    let decoded:unknown;try{decoded=JSON.parse(Buffer.concat(parts).toString('utf8'));}catch{throw unavailable();}
    if(!decoded||typeof decoded!=='object'||Array.isArray(decoded))throw unavailable();
    if(!response.ok&&![404,409].includes(response.status))throw unavailable(method+' '+route.replace(/[a-f0-9-]{30,}/g,':id'),response.status);
    return{status:response.status,body:decoded as Record<string,unknown>};
  }
  private async verify(){
    const me=await this.request('/auth/me');
    const user=(me.body.user??me.body) as Record<string,unknown>;
    if(me.status!==200||(me.body.email??user.email)!==this.config.ownerEmail)throw unavailable('owner-check',me.status);
    const response=await this.request(this.base),collection=response.body.data as {pii?:boolean;jsonSchema?:{properties?:Record<string,{encrypted?:boolean;enum?:string[]}>}};
    const properties=collection?.jsonSchema?.properties;
    if(response.status!==200||collection?.pii!==true||properties?.state?.encrypted!==true||properties?.receipts?.encrypted!==true||!properties?.purpose?.enum?.includes(purpose))throw unavailable('collection-schema',response.status);
  }
  private ensureReady(){return this.ready??=this.verify().catch(reason=>{this.ready=undefined;throw reason;});}
  private document(value:unknown):Document{
    const doc=value as Document;
    if(!doc?.id||!Number.isSafeInteger(doc.version)||doc.attributes?.purpose!==purpose)throw unavailable();
    return doc;
  }
  private async query(where:Record<string,{op:string;value:unknown}>,pageSize=2):Promise<Document[]>{
    await this.ensureReady();const response=await this.request(this.base+'/query','POST',{where,page:1,pageSize});
    if(![200,201].includes(response.status)||!Array.isArray(response.body.data))throw unavailable('document-query',response.status);
    return response.body.data.map(value=>this.document(value));
  }
  private async find(key:string){const docs=await this.query({$docKey:{op:'eq',value:key}});if(docs.length>1)throw unavailable();return docs[0]??null;}
  private validSession(doc:Document|null):doc is Document&{attributes:Attributes&{state:SessionState}}{
    if(!doc||doc.attributes.kind!=='session'||doc.attributes.expiresAt<=new Date().toISOString())return false;
    const state=doc.attributes.state;
    if(!state?.session?.sessionRef||!Number.isSafeInteger(state.session.briefVersion)||!state.briefing||!Array.isArray(state.messages))throw unavailable();
    return true;
  }
  private receiptIn(doc:Document,key:string):Receipt|null{
    const entries=doc.attributes.receipts;
    const saved=entries&&Object.hasOwn(entries,key)?entries[key]:undefined;
    return saved&&saved.expiresAt>new Date().toISOString()?saved.receipt:null;
  }
  async create(hash:string,state:SessionState,expiresAt:string){
    await this.ensureReady();const response=await this.request(this.base+'/documents','POST',{docKey:'session:'+hash,data:{purpose,kind:'session',state,receipts:{},handoffRefs:Object.keys(state.handoffs??{}),...marketOutboxMetadata(state),expiresAt}});
    if(response.status!==201)throw unavailable();
  }
  async read(hash:string):Promise<StoredSession|null>{
    const doc=await this.find('session:'+hash);
    return this.validSession(doc)?{revision:doc.version,state:doc.attributes.state,expiresAt:doc.attributes.expiresAt}:null;
  }
  async receipt(hash:string,key:string):Promise<Receipt|null>{const doc=await this.find('session:'+hash);return this.validSession(doc)?this.receiptIn(doc,key):null;}
  async commit(hash:string,revision:number,state:SessionState,key:string,receipt:Receipt):Promise<CommitResult>{
    const doc=await this.find('session:'+hash);if(!this.validSession(doc))return{kind:'missing'};
    const previous=this.receiptIn(doc,key);if(previous)return previous.digest===receipt.digest?{kind:'replay',receipt:previous}:{kind:'mismatch'};
    if(doc.version!==revision)return{kind:'conflict'};
    const now=new Date().toISOString(),receipts:Record<string,StoredReceipt>=Object.fromEntries(Object.entries(doc.attributes.receipts??{}).filter(([,value])=>value.expiresAt>now));
    receipts[key]={expiresAt:new Date(Date.now()+86400000).toISOString(),receipt};
    const response=await this.request(this.base+'/documents/'+encodeURIComponent(doc.id),'PUT',{expectedVersion:revision,data:{...doc.attributes,state,receipts,handoffRefs:Object.keys(state.handoffs??{}),...marketOutboxMetadata(state)}});
    if(response.status===200)return{kind:'committed',receipt};
    if(response.status===404)return{kind:'missing'};
    if(response.status===409){const current=await this.find('session:'+hash);if(!this.validSession(current))return{kind:'missing'};const replay=this.receiptIn(current,key);return replay?replay.digest===receipt.digest?{kind:'replay',receipt:replay}:{kind:'mismatch'}:{kind:'conflict'};}
    throw unavailable();
  }
  async quota(key:string,limit:number,expiresAt:string):Promise<boolean>{
    for(let attempt=0;attempt<8;attempt++){
      const doc=await this.find('quota:'+key),now=new Date().toISOString();
      if(!doc){const created=await this.request(this.base+'/documents','POST',{docKey:'quota:'+key,data:{purpose,kind:'quota',count:1,expiresAt}});if(created.status===201)return true;if(created.status===409)continue;throw unavailable();}
      if(doc.attributes.kind!=='quota')throw unavailable();
      const count=doc.attributes.expiresAt>now?doc.attributes.count??0:0;if(count>=limit)return false;
      const response=await this.request(this.base+'/documents/'+encodeURIComponent(doc.id),'PUT',{expectedVersion:doc.version,data:{purpose,kind:'quota',count:count+1,expiresAt}});
      if(response.status===200)return true;if([404,409].includes(response.status))continue;throw unavailable();
    }
    throw unavailable();
  }
  async findHandoff(ref:string):Promise<string|null>{
    const docs=await this.query({kind:{op:'eq',value:'session'},expiresAt:{op:'gt',value:new Date().toISOString()},handoffRefs:{op:'contains',value:[ref]}});
    if(docs.length>1)throw unavailable();const doc=docs[0];return doc&&this.validSession(doc)&&doc.docKey.startsWith('session:')?doc.docKey.slice(8):null;
  }
  async pendingMarketSessions(limit:number){
    const docs=await this.query({kind:{op:'eq',value:'session'},marketPending:{op:'eq',value:true},marketNextAt:{op:'lte',value:new Date().toISOString()},expiresAt:{op:'gt',value:new Date().toISOString()}},Math.min(2,Math.max(1,limit)));
    return docs.filter(doc=>this.validSession(doc)&&/^session:[a-f0-9]{64}$/.test(doc.docKey)).map(doc=>doc.docKey.slice(8));
  }
  /** Explicit, operator-only import. Existing remote sessions are never overwritten. */
  async importLocalSession(hash:string,source:StoredSession,receipts:Record<string,StoredReceipt>,migrationId:string){
    const key='session:'+hash,current=await this.find(key),now=new Date().toISOString();
    if(current){
      if(current.attributes.migration?.id===migrationId&&current.attributes.migration.sourceRevision===source.revision)return'already-imported' as const;
      throw new ApiError(409,'migration_conflict','Uma sessão já existe no destino. A migração não a substituiu.');
    }
    const data:Attributes={purpose,kind:'session',expiresAt:source.expiresAt,state:source.state,receipts:Object.fromEntries(Object.entries(receipts).filter(([,entry])=>entry.expiresAt>now)),handoffRefs:Object.keys(source.state.handoffs??{}),...marketOutboxMetadata(source.state),migration:{id:migrationId,sourceRevision:source.revision}};
    const response=await this.request(this.base+'/documents','POST',{docKey:key,data});
    if(response.status!==201)throw new ApiError(409,'migration_conflict','A sessão mudou durante a migração. Nenhum registro existente foi substituído.');
    return'imported' as const;
  }
  /** Overwrite sensitive fields before soft deletion; retries leave only an empty tombstone. */
  private async erase(doc:Document){
    if(doc.attributes.kind!=='erased'){
      const result=await this.request(this.base+'/documents/'+encodeURIComponent(doc.id),'PUT',{expectedVersion:doc.version,data:{purpose,kind:'erased',state:{},receipts:{},handoffRefs:[],expiresAt:new Date().toISOString()}});
      if(result.status===409)return false;if(result.status===404)return true;if(result.status!==200)throw unavailable();
    }
    const result=await this.request(this.base+'/documents/'+encodeURIComponent(doc.id),'DELETE');if(![200,204,404].includes(result.status))throw unavailable();return true;
  }
  async cleanup(maxRecords=5,deadline=Date.now()+24000){
    const docs=await this.query({expiresAt:{op:'lte',value:new Date().toISOString()},kind:{op:'in',value:['session','quota','erased']}},Math.min(maxRecords,100));let removed=0;
    for(const doc of docs){if(Date.now()+10000>deadline)break;if(await this.erase(doc))removed++;}
    return{removed,remaining:docs.length-removed};
  }
  /** Test/migration tooling can remove only an explicitly addressed session in this collection. */
  async eraseSession(hash:string){const doc=await this.find('session:'+hash);if(doc)return this.erase(doc);return true;}
}
