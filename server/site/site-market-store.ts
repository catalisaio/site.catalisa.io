import {ApiError} from './input';
import type {MarketFrame,MarketReview,MarketStorage} from './site-market-insights';
import {upstreamPressure} from './upstream-pressure';
export const MARKET_COLLECTION='site_catalisa_metrics_v1',MARKET_PURPOSE='catalisa-site-market-v1';
interface Document {id:string;docKey:string;version:number;attributes:{purpose:string;kind:'event'|'review'|'exclusion'|'erased';expiresAt:string;eventDay?:string;payload:MarketFrame|MarketReview|Record<string,never>}}
const record=(value:unknown):Record<string,unknown>=>value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
const canonical=(value:unknown):string=>Array.isArray(value)?'['+value.map(canonical).join(',')+']':value&&typeof value==='object'?'{'+Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,value])=>JSON.stringify(key)+':'+canonical(value)).join(',')+'}':JSON.stringify(value);
const unavailable=()=>new ApiError(503,'market_storage_unavailable','Os indicadores estão temporariamente indisponíveis.');
/** Dedicated encrypted storage; constructing the adapter performs no request or collection creation. */
export class CatalisaMarketStorage implements MarketStorage {
 private ready?:Promise<void>;
 private readonly fetcher:typeof fetch;
 constructor(private config:{origin:string;token:string;ownerEmail:string;fetch?:typeof fetch}){
  const origin=new URL(config.origin);if(origin.protocol!=='https:'||origin.origin!==config.origin||!config.token||config.ownerEmail!=='admin@catalisa.app')throw Error('Invalid market storage configuration');this.fetcher=config.fetch??fetch;
 }
 private async call(path:string,method='GET',body?:unknown):Promise<{status:number;body:Record<string,unknown>}>{
  let response:Response;try{response=await this.fetcher(this.config.origin+path,{method,headers:{Authorization:'Bearer '+this.config.token,Accept:'application/json',...(body===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)}),redirect:'error',signal:AbortSignal.timeout(8000)});}catch{throw unavailable();}
  const pressure=upstreamPressure(response);if(pressure)throw pressure;
  if(response.status===204)return{status:204,body:{}};
  const chunks:Uint8Array[]=[];let size=0;const reader=response.body?.getReader();if(reader)while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>1000000){await reader.cancel();throw unavailable();}chunks.push(part.value);}
  try{return{status:response.status,body:record(JSON.parse(Buffer.concat(chunks).toString('utf8')))}}catch{throw unavailable();}
 }
 private async verify(){
  const me=await this.call('/auth/me'),user=record(me.body.user??me.body);if(me.status!==200||user.email!==this.config.ownerEmail)throw unavailable();
  const response=await this.call('/data-store/collections/'+MARKET_COLLECTION),meta=record(response.body.data??response.body),properties=record(record(meta.jsonSchema).properties);
  const purposes=record(properties.purpose).enum;
  if(response.status!==200||meta.pii!==true||record(properties.payload).encrypted!==true||!Array.isArray(purposes)||!purposes.includes(MARKET_PURPOSE))throw unavailable();
 }
 private ensure(){return this.ready??=this.verify().catch(reason=>{this.ready=undefined;throw reason;});}
 private async query(where:Record<string,unknown>,page=1){
  await this.ensure();const result=await this.call('/data-store/collections/'+MARKET_COLLECTION+'/query','POST',{where,page,pageSize:100});
  if(![200,201].includes(result.status)||!Array.isArray(result.body.data))throw unavailable();
  return result.body.data.map((value:unknown)=>{const doc=value as Document;if(!doc.id||!doc.docKey||!Number.isSafeInteger(doc.version)||doc.attributes?.purpose!==MARKET_PURPOSE||!Number.isFinite(Date.parse(doc.attributes.expiresAt)))throw unavailable();return doc;});
 }
 private async find(key:string){const docs=await this.query({$docKey:{op:'eq',value:key}});if(docs.length>1||docs[0]&&docs[0].docKey!==key)throw unavailable();return docs[0]??null;}
 private async excluded(subjectKey:string){const marker=await this.find('exclusion:'+subjectKey);return !!marker&&marker.attributes.kind==='exclusion'&&marker.attributes.expiresAt>new Date().toISOString();}
 private data(kind:'event'|'review',payload:MarketFrame|MarketReview,expiresAt:string){return{purpose:MARKET_PURPOSE,kind,payload,expiresAt,...(kind==='event'?{eventDay:(payload as MarketFrame).eventDay}:{})};}
 async append(eventKey:string,frame:MarketFrame,expiresAt:string):Promise<void|'suppressed'>{
  if(!/^[a-f0-9]{64}$/.test(eventKey))throw Error('Invalid market key');await this.ensure();
  if(await this.excluded(frame.subjectKey))return 'suppressed';
  const key='event:'+eventKey,result=await this.call('/data-store/collections/'+MARKET_COLLECTION+'/documents','POST',{docKey:key,data:this.data('event',frame,expiresAt)});
  if(result.status===201){if(await this.excluded(frame.subjectKey)){const created=await this.find(key);if(created)await this.erase(created);return 'suppressed';}return;}if(result.status!==409)throw unavailable();
  const previous=await this.find(key);if(!previous||previous.attributes.kind!=='event'||canonical(previous.attributes.payload)!==canonical(frame))throw new ApiError(409,'market_event_mismatch','O evento já foi registrado com outras categorias.');
 }
 async readReview(subjectKey:string){
  if(!/^[a-f0-9]{64}$/.test(subjectKey))throw Error('Invalid market subject');if(await this.excluded(subjectKey))return null;const doc=await this.find('review:'+subjectKey);
  if(!doc||doc.attributes.expiresAt<=new Date().toISOString()||doc.attributes.kind!=='review')return null;return doc.attributes.payload as MarketReview;
 }
 async writeReview(review:MarketReview,expectedRevision:number,expiresAt:string){
  const key='review:'+review.subjectKey,doc=await this.find(key),current=doc&&doc.attributes.kind==='review'&&doc.attributes.expiresAt>new Date().toISOString()?doc.attributes.payload as MarketReview:null;
  if(await this.excluded(review.subjectKey))throw new ApiError(410,'market_subject_erased','Esta referência foi excluída dos indicadores.');
  if((current?.revision??0)!==expectedRevision)throw new ApiError(409,'market_review_conflict','A categorização foi atualizada. Reabra antes de corrigir.');
  const data=this.data('review',review,expiresAt),result=doc?await this.call('/data-store/collections/'+MARKET_COLLECTION+'/documents/'+encodeURIComponent(doc.id),'PUT',{expectedVersion:doc.version,data}):await this.call('/data-store/collections/'+MARKET_COLLECTION+'/documents','POST',{docKey:key,data});
  if(result.status===409)throw new ApiError(409,'market_review_conflict','A categorização foi atualizada. Reabra antes de corrigir.');if(![200,201].includes(result.status))throw unavailable();
  if(await this.excluded(review.subjectKey)){const created=await this.find(key);if(created)await this.erase(created);throw new ApiError(410,'market_subject_erased','Esta referência foi excluída dos indicadores.');}
 }
 private async all(kind:'event'|'review'|'exclusion',fromDay?:string,includeExpired=false){
  const result:Document[]=[],deadline=Date.now()+25000;
  for(let page=1;page<=100;page++){
   if(Date.now()>deadline)throw new ApiError(503,'market_aggregation_limit','A consulta de indicadores excedeu o limite. Tente um período menor.');
   const docs=await this.query({kind:{op:'eq',value:kind},...(!includeExpired?{expiresAt:{op:'gt',value:new Date().toISOString()}}:{}),...(fromDay?{eventDay:{op:'gt',value:new Date(Date.parse(fromDay)-86400000).toISOString().slice(0,10)}}:{})},page);result.push(...docs);if(docs.length<100)return result;
  }
  throw new ApiError(503,'market_aggregation_limit','A consulta excedeu o limite de registros; nenhum relatório parcial foi apresentado.');
 }
 async events(fromDay:string,toDay:string){const exclusions=new Set((await this.all('exclusion')).map(doc=>doc.docKey.slice('exclusion:'.length)));return(await this.all('event',fromDay)).filter(doc=>String(doc.attributes.eventDay)>=fromDay&&String(doc.attributes.eventDay)<=toDay&&!exclusions.has((doc.attributes.payload as MarketFrame).subjectKey)).map(doc=>doc.attributes.payload as MarketFrame);}
 async reviews(subjectKeys:string[]){const wanted=new Set(subjectKeys),result=new Map<string,MarketReview|null>();for(const doc of await this.all('review')){const review=doc.attributes.payload as MarketReview;if(wanted.has(review.subjectKey))result.set(review.subjectKey,review);}return result;}
 async cleanup(){
  const docs=(await this.query({expiresAt:{op:'lte',value:new Date().toISOString()}})).slice(0,20);
  for(const doc of docs){const cleared=await this.call('/data-store/collections/'+MARKET_COLLECTION+'/documents/'+encodeURIComponent(doc.id),'PUT',{expectedVersion:doc.version,data:{purpose:MARKET_PURPOSE,kind:'erased',payload:{},expiresAt:new Date().toISOString()}});if(cleared.status===409)continue;if(cleared.status!==200)throw unavailable();const erased=await this.call('/data-store/collections/'+MARKET_COLLECTION+'/documents/'+encodeURIComponent(doc.id),'DELETE');if(![200,204,404].includes(erased.status))throw unavailable();}
 }
 private async erase(doc:Document){
  const cleared=await this.call('/data-store/collections/'+MARKET_COLLECTION+'/documents/'+encodeURIComponent(doc.id),'PUT',{expectedVersion:doc.version,data:{purpose:MARKET_PURPOSE,kind:'erased',payload:{},expiresAt:new Date().toISOString()}});
  if(cleared.status===409)return false;if(cleared.status===404)return true;if(cleared.status!==200)throw unavailable();
  const erased=await this.call('/data-store/collections/'+MARKET_COLLECTION+'/documents/'+encodeURIComponent(doc.id),'DELETE');if(![200,204,404].includes(erased.status))throw unavailable();return true;
 }
 async eraseSubject(subjectKey:string,expiresAt:string){
  if(!/^[a-f0-9]{64}$/.test(subjectKey))throw Error('Invalid market subject');await this.ensure();
  const marked=await this.call('/data-store/collections/'+MARKET_COLLECTION+'/documents','POST',{docKey:'exclusion:'+subjectKey,data:{purpose:MARKET_PURPOSE,kind:'exclusion',payload:{},expiresAt}});if(![201,409].includes(marked.status))throw unavailable();
  const docs=(await this.all('event',undefined,true)).filter(doc=>(doc.attributes.payload as MarketFrame).subjectKey===subjectKey),review=await this.find('review:'+subjectKey);if(review)docs.push(review);
  let removed=0;for(const doc of docs.slice(0,20))if(await this.erase(doc))removed++;
  return {removed,remaining:docs.length-removed};
 }
}
