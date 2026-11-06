import{parseSitePath}from'../redesign/i18n/routes';
import{ptToEn}from'../i18n/route-paths';
/** Existing public identifiers, verified against catalisa.io and its Google tag. */
export const measurement={googleTag:'G-JYJWH17ZVX',ga4:'G-JYJWH17ZVX',claritySite:'z4073yqv5z',clarityStaging:'z40bi9hrk8',clarityPresentations:'vp5b7apoc2'} as const;
export const consentKey='catalisa_cookie_consent';
export type Consent='granted'|'denied'|null;
let choice:Consent=null,started=false,clarityStarted=false,bootstrapped=false,lastPath='',pageStart=0,lastReplayable=false;
const denied={analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
const privatePath=/^\/(?:api|apresentacao|treinamento|en\/(?:presentation|training))(?:\/|$)/;
const conversationPath=(path:string)=>['/contato','/lab'].includes(parseSitePath(path)?.basePath??path.replace(/\/+$/,''));
export function safeMeasurementUrl(input:string):string|null{
 try{
  const url=new URL(input,window.location.origin),path=url.pathname.replace(/\/+$/,'')||'/';
  if(privatePath.test(path)||/[\s@%]|\d{9,}/.test(path)||path.length>180)return null;
  // Unknown query parameters may carry private identifiers or free text. Do
  // not load auto-measurement on these URLs, even when consent was given.
  for(const[key,value]of url.searchParams){if(!/^utm_(source|medium|campaign|content|term)$/.test(key)||!/^[a-zA-Z0-9_. -]{1,100}$/.test(value)||/\d{9,}/.test(value))return null;}
  if(url.hash&&!/^#[a-zA-Z][\w-]{0,80}$/.test(url.hash))return null;
  return url.origin+path;
 }catch{return null;}
}
export function readConsent():Consent{try{const value=localStorage.getItem(consentKey);return value==='granted'||value==='denied'?value:null;}catch{return choice;}}
export function measurementAllowed(){return ['catalisa.io','www.catalisa.io'].includes(location.hostname)&&choice==='granted'&&!!safeMeasurementUrl(location.href);}
/** Heatmaps use distinct projects; the production Google property never starts on staging. */
function clarityProject(){return ['catalisa.io','www.catalisa.io'].includes(location.hostname)?measurement.claritySite:location.hostname==='site-staging.catalisa.io'?measurement.clarityStaging:undefined;}
const legacyPublicPaths=new Set([...Object.keys(ptToEn),...Object.values(ptToEn),'/vtex-day-2026']);
function replayUrlAllowed(input:string){
 if(!safeMeasurementUrl(input))return false;
 const path=new URL(input,location.href).pathname.replace(/\/+$/,'')||'/';
 if(conversationPath(path))return false;
 // Unknown/private screens must not become replayable just because their URL has no query.
 return !!parseSitePath(path)||legacyPublicPaths.has(path)||/^\/(?:en\/)?(?:insights|playbooks)\/[a-zA-Z0-9_-]{1,120}$/.test(path);
}
function privateReplayReferrer(){try{const referrer=new URL(document.referrer);return referrer.origin===location.origin&&!replayUrlAllowed(referrer.href);}catch{return false;}}
function clarityAllowed(){return !!clarityProject()&&choice==='granted'&&replayUrlAllowed(location.href)&&!privateReplayReferrer();}
function initializeClarity(){
 if(clarityStarted||!clarityAllowed())return;
 clarityStarted=true;
 const clarity=window.clarity??Object.assign((...args:unknown[])=>{(clarity as typeof clarity&{q:unknown[][]}).q.push(args);},{q:[] as unknown[][]});
 window.clarity=clarity;clarity('consentv2',{analytics_Storage:'granted',ad_Storage:'denied'});
 load('catalisa-clarity','https://www.clarity.ms/tag/'+clarityProject());
}
function documentBoundary(url:URL){
 // Also isolate a protected initial page before replay has ever started: a public
 // transition must never initialize the SDK while React still displays private DOM.
 return !!clarityProject()&&(conversationPath(url.pathname)!==conversationPath(location.pathname)||replayUrlAllowed(url.href)!==replayUrlAllowed(location.href));
}
/** Safe conversation pages still receive sanitized GA funnel clicks; stop only replay. */
function prepareDocumentBoundary(url:string){
 const path=new URL(url,location.href).pathname;
 if(safeMeasurementUrl(url)&&(conversationPath(path)||replayUrlAllowed(url)))window.clarity?.('stop');
 else disable();
}
function command(..._args:unknown[]){window.dataLayer??=[];window.dataLayer.push(arguments as unknown as Record<string,unknown>);}
function load(id:string,src:string){if(document.getElementById(id))return;const script=document.createElement('script');script.id=id;script.async=true;script.src=src;document.head.append(script);}
function disable(){(window as unknown as Record<string,unknown>)['ga-disable-'+measurement.ga4]=true;window.clarity?.('stop');}
function initialize(){
 if(!measurementAllowed()||started){initializeClarity();return;}
 started=true;(window as unknown as Record<string,unknown>)['ga-disable-'+measurement.ga4]=false;
 window.gtag=command;
 command('consent','default',denied);
 command('consent','update',{...denied,analytics_storage:'granted'});
 command('set','ads_data_redaction',true);
 command('js',new Date());
 const attribution:Record<string,string>={};for(const[key,value]of new URL(location.href).searchParams)attribution['campaign_'+(key==='utm_campaign'?'name':key.slice(4))]=value;
 // The existing property enables automatic history page views. Keep that ONE
 // owner; never send a second manual page_view on React route changes.
 command('config',measurement.ga4,{...attribution,send_page_view:true,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:safeMeasurementUrl(location.href),page_referrer:referrerOrigin()});
 load('catalisa-google-tag','https://www.googletagmanager.com/gtag/js?id='+measurement.googleTag);
 initializeClarity();
}
function referrerOrigin(){try{return document.referrer?new URL(document.referrer).origin:'';}catch{return '';}}
export function setConsent(value:Exclude<Consent,null>){
 choice=value;try{localStorage.setItem(consentKey,value);}catch{/* Keep the choice for this document when storage is unavailable. */}
 if(value==='granted')initialize();
 else if(started||clarityStarted){
  disable();if(started)command('consent','update',denied);window.clarity?.('consentv2',{analytics_Storage:'denied',ad_Storage:'denied'});
  const production=['catalisa.io','www.catalisa.io'].includes(location.hostname);
  const cookieDomains=production?['',`; Domain=${location.hostname}`,'; Domain=.catalisa.io']:['',`; Domain=${location.hostname}`];
  for(const item of document.cookie.split(';')){const name=item.split('=')[0].trim();if(!(production?/^(_ga(?:_|$)|_clck$|_clsk$)/:/^(_clck|_clsk)$/).test(name))continue;for(const domain of cookieDomains)document.cookie=name+'=; Max-Age=0; Path=/'+domain+'; SameSite=Lax';}
  // Unload vendor listeners as well; next document has no optional scripts.
  location.reload();
 }
 window.dispatchEvent(new Event('catalisa-consent-changed'));
}
const eventNames=new Set(['cta_click','outbound_click','file_download','scroll_depth','section_view','section_engagement','time_on_page','tab_return','engaged_session','deep_engagement','video_play','video_pause','video_complete','video_progress','hero_view','hero_engagement','funnel_stage','funnel_conversion','concept_requested','concept_ready','concept_failed','concept_refined','human_review_added','handoff_accepted']);
const enumKeys=new Set(['source','channel','outcome','cta_type','section_id','hero_id','funnel_id','stage','error_code','link_path']);
const numericKeys=new Set(['percent','seconds','away_seconds','pages_viewed','stage_index','total_stages','elapsed_ms','milestone','percent_watched','duration']);
const outcomes=new Set<string>();
/** Deduplication key stays in memory; it is never an analytics parameter. */
export function trackSiteOutcome(event:string,localKey:string,params:Record<string,unknown>={}){if(!bootstrapped)bootstrapMeasurement();if(!measurementAllowed()||outcomes.has(event+':'+localKey))return;outcomes.add(event+':'+localKey);trackSiteEvent(event,params);}
export function trackSiteEvent(event:string,params:Record<string,unknown>={},pathOverride?:string){
 if(!bootstrapped)bootstrapMeasurement();
 if(!started||!measurementAllowed()||!eventNames.has(event))return;
 const page=safeMeasurementUrl(pathOverride?new URL(pathOverride,location.origin).href:location.href);if(!page)return;
 const safe:Record<string,string|number>={send_to:measurement.ga4,page_path:new URL(page).pathname,page_location:page};
 for(const[key,value]of Object.entries(params)){
  if(numericKeys.has(key)&&typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=86400000)safe[key]=Math.round(value);
  if(enumKeys.has(key)&&typeof value==='string'&&/^[a-zA-Z_][a-zA-Z0-9_/-]{0,79}$/.test(value)&&!/@|\d{9,}/.test(value))safe[key]=value;
 }
 command('event',event,safe);
}
function routeChanged(){
 if(!safeMeasurementUrl(location.href)){lastReplayable=false;disable();return;}
 lastReplayable=replayUrlAllowed(location.href);initialize();const path=location.pathname.replace(/\/+$/,'')||'/';if(path===lastPath)return;
 if(lastPath&&pageStart){trackSiteEvent('time_on_page',{seconds:(Date.now()-pageStart)/1000},lastPath);if(started&&measurementAllowed())command('config',measurement.ga4,{send_page_view:false,page_location:safeMeasurementUrl(location.href),page_referrer:location.origin+lastPath});}lastPath=path;pageStart=Date.now();
 if(clarityStarted&&clarityAllowed()){window.clarity?.('set','page_path',path);window.clarity?.('set','language',document.documentElement.lang);}
}
/** Installed once: production GA/Clarity, isolated staging Clarity, local vendors disabled. */
export function bootstrapMeasurement(){
 if(bootstrapped)return;bootstrapped=true;choice=readConsent();
 for(const method of ['pushState','replaceState']as const){const original=history[method].bind(history);history[method]=(data:unknown,unused:string,target?:string|URL|null)=>{
  const url=target==null?null:new URL(target,location.href);
  if(url&&documentBoundary(url)){prepareDocumentBoundary(url.href);location.assign(url.href);return;}
  // Prevent an already-loaded vendor from observing protected invite URLs or
  // arbitrary private queries through its own history listener.
  if((started||clarityStarted)&&url&&!safeMeasurementUrl(url.href)){disable();location.assign(url.href);return;}
  original(data,unused,target);queueMicrotask(routeChanged);
 };}
 addEventListener('popstate',()=>{if((clarityProject()&&replayUrlAllowed(location.href)!==lastReplayable)||((started||clarityStarted)&&(!safeMeasurementUrl(location.href)||conversationPath(location.pathname)))){prepareDocumentBoundary(location.href);location.reload();return;}routeChanged();});
 routeChanged();
 let scrollMarks=new Set<number>();let current=location.pathname;
 addEventListener('scroll',()=>{if(current!==location.pathname){current=location.pathname;scrollMarks=new Set();}const height=document.documentElement.scrollHeight-innerHeight;if(height<=0)return;const depth=Math.round(scrollY/height*100);for(const percent of [25,50,75,100])if(depth>=percent&&!scrollMarks.has(percent)){scrollMarks.add(percent);trackSiteEvent('scroll_depth',{percent});}},{passive:true});
 document.addEventListener('click',event=>{
  const anchor=(event.target as Element|null)?.closest<HTMLAnchorElement>('a[href]');if(!anchor)return;
  const url=new URL(anchor.href,location.href);if(!['http:','https:'].includes(url.protocol))return;
  const product=anchor.closest('[data-product]')?.getAttribute('data-product');
  if(product&&['banking','credit','med','juridico','recrutamento','biometrics','decision'].includes(product)){
   const kind=url.origin!==location.origin?'showcase':parseSitePath(url.pathname)?.basePath==='/contato'?'contact':'details';
   trackSiteEvent('cta_click',{source:'products',cta_type:'product_'+product+'_'+kind});
   if(kind==='showcase')trackSiteEvent('outbound_click',{source:'site'});
   return;
  }
  // The existing Google tag already owns automatic file_download events.
  if(anchor.download||/\.(zip|pdf|svg|png)$/.test(url.pathname))return;
  else if(url.hostname==='wa.me')trackSiteEvent('cta_click',{cta_type:'whatsapp'});
  else if(url.origin!==location.origin)trackSiteEvent('outbound_click',{source:'site'});
  else if(['/contato','/lab'].includes(parseSitePath(url.pathname)?.basePath??url.pathname.replace(/\/+$/,'')))trackSiteEvent('cta_click',{cta_type:(parseSitePath(url.pathname)?.basePath??url.pathname).includes('lab')?'lab':'contact'});
 },{passive:true});
 const videos=new WeakSet<HTMLVideoElement>();
 const observed=new WeakSet<Element>(),visible=new Map<Element,number>();
 const observer=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(entries=>{for(const entry of entries){const id=entry.target.getAttribute('data-hero-id')||entry.target.id;if(entry.isIntersecting){visible.set(entry.target,Date.now());trackSiteEvent(entry.target.hasAttribute('data-hero-id')?'hero_view':'section_view',{section_id:id,hero_id:entry.target.getAttribute('data-hero-id')||undefined});}else{const since=visible.get(entry.target);if(since&&Date.now()-since>2000)trackSiteEvent('section_engagement',{section_id:id,seconds:(Date.now()-since)/1000});visible.delete(entry.target);}}},{threshold:.3});
 function bindContent(){
  if(!measurementAllowed())return;
  for(const element of document.querySelectorAll('main section[id],main [data-hero-id]'))if(!observed.has(element)){observed.add(element);observer?.observe(element);}
  for(const video of document.querySelectorAll<HTMLVideoElement>('main video'))if(!videos.has(video)){
   videos.add(video);const milestones=new Set<number>();
   for(const[type,event]of [['play','video_play'],['pause','video_pause'],['ended','video_complete']])video.addEventListener(type,()=>trackSiteEvent(event,{duration:Number.isFinite(video.duration)?video.duration:0,percent_watched:video.duration?video.currentTime/video.duration*100:0}));
   video.addEventListener('timeupdate',()=>{if(!video.duration)return;for(const milestone of [25,50,75])if(video.currentTime/video.duration*100>=milestone&&!milestones.has(milestone)){milestones.add(milestone);trackSiteEvent('video_progress',{milestone});}});
  }
 }
 let scheduled=false;const contentChanges=new MutationObserver(()=>{if(scheduled||!measurementAllowed())return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;bindContent();});});contentChanges.observe(document.getElementById('root')??document.body,{childList:true,subtree:true});
 addEventListener('catalisa-consent-changed',bindContent);bindContent();
}
