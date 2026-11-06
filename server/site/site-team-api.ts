import {createHmac,randomBytes} from 'node:crypto';
import {ApiError,fields,text} from './input';
import {siteTeamView} from './site-team-view';
import type {SiteInboxTransport,SiteStaffActor} from './site-inbox';
import type {SiteMarketInsights} from './site-market-insights';
import type {SiteMarketWorker} from './site-market-outbox';
import {marketTeamRequest} from './site-market-api';

export interface SiteTeamConfig {
  inbox:SiteInboxTransport; origin:string; ownerEmail:string; secret:string;
  secure:boolean; origins:string[]; fetch?:typeof fetch;
  insights?:SiteMarketInsights;marketWorker?:SiteMarketWorker;
}
const COOKIE='catalisa_site_team';
const PREFIX='/api/site/team';
const object=(value:unknown):Record<string,unknown>=>value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
const denied=()=>new ApiError(401,'team_unauthenticated','Entre com a conta da equipe Catalisa.');

/** Site-only operator API. It neither shares the visitor cookie nor exposes Catalisa JWTs. */
export function createSiteTeamApi(config:SiteTeamConfig){
  const upstream=new URL(config.origin);
  if(upstream.origin!==config.origin||upstream.protocol!=='https:'||config.ownerEmail!=='admin@catalisa.app'||config.secret.length<24||!config.origins.length)throw Error('Invalid site team configuration');
  const fetcher=config.fetch??fetch;
  const digest=(purpose:string,value:string)=>createHmac('sha256',config.secret).update(purpose+'\0'+value).digest('hex');
  const cookie=(value:string,age:number)=>COOKIE+'='+value+'; Path='+PREFIX+'; HttpOnly; SameSite=Strict; Max-Age='+age+(config.secure?'; Secure':'');
  function json(value:unknown,status=200,extra:Record<string,string>={}){return new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff',...extra}});}
  async function authCall(path:string,signal:AbortSignal,token?:string,body?:unknown){
    let response:Response;
    try{response=await fetcher(config.origin+path,{method:body===undefined?'GET':'POST',headers:{Accept:'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(body===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.any([signal,AbortSignal.timeout(10000)]),redirect:'error'});}catch{throw new ApiError(503,'team_auth_unavailable','Não foi possível validar o acesso agora. Tente novamente.');}
    if([401,403].includes(response.status))throw denied();
    if(!response.ok)throw new ApiError(503,'team_auth_unavailable','Não foi possível validar o acesso agora. Tente novamente.');
    const reader=response.body?.getReader();let length=0;const chunks:Uint8Array[]=[];
    if(reader)while(true){const value=await reader.read();if(value.done)break;length+=value.value.length;if(length>65536){await reader.cancel();throw new ApiError(503,'team_auth_unavailable','Resposta de acesso inválida.');}chunks.push(value.value);}
    try{return object(JSON.parse(Buffer.concat(chunks).toString('utf8')));}catch{throw new ApiError(503,'team_auth_unavailable','Resposta de acesso inválida.');}
  }
  async function actor(token:string,signal:AbortSignal):Promise<SiteStaffActor>{
    const data=await authCall('/auth/me',signal,token),user=object(data.user??data);
    if(user.email!==config.ownerEmail||typeof user.id!=='string'||!user.id||user.id.length>160)throw denied();
    const displayName=typeof user.name==='string'&&user.name.trim()?user.name.trim().slice(0,160):'Equipe Catalisa';
    return {id:user.id,email:config.ownerEmail,displayName};
  }
  async function body(request:Request,allowed:string[]){
    if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))throw new ApiError(415,'json_required','Envie os dados em JSON.');
    const reader=request.body?.getReader();let size=0;const chunks:Uint8Array[]=[];
    if(reader)while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>16384){await reader.cancel();throw new ApiError(413,'body_too_large','A mensagem ultrapassou o limite.');}chunks.push(part.value);}
    try{return fields(JSON.parse(Buffer.concat(chunks).toString('utf8')),allowed);}catch(reason){if(reason instanceof ApiError)throw reason;throw new ApiError(400,'invalid_json','Revise os dados enviados.');}
  }
  async function quota(kind:string,key:string,limit:number,windowMs:number,signal:AbortSignal){
    const bucket=Math.floor(Date.now()/windowMs),expiresAt=new Date((bucket+1)*windowMs).toISOString();
    if(!await config.inbox.quota(digest('quota',kind+':'+bucket+':'+key),limit,expiresAt,signal))throw new ApiError(429,'team_rate_limit','Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.');
  }
  function staffCookie(request:Request){
    const values=(request.headers.get('cookie')??'').split(';').map(v=>v.trim()).filter(v=>v.startsWith(COOKIE+'='));
    if(values.length!==1)return undefined;const value=values[0].slice(COOKIE.length+1);return /^[A-Za-z0-9_-]{43}$/.test(value)?value:undefined;
  }
  return async(request:Request,ip:string):Promise<Response|null>=>{
    const url=new URL(request.url),path=url.pathname;
    if(path!==PREFIX&&!path.startsWith(PREFIX+'/'))return null;
    try{
      const method=request.method.toUpperCase(),signal=AbortSignal.any([request.signal,AbortSignal.timeout(25000)]);
      if(method==='GET'&&(path===PREFIX||path===PREFIX+'/')){
        const nonce=randomBytes(18).toString('base64');
        return new Response(siteTeamView(nonce,!!config.insights),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; script-src 'nonce-"+nonce+"'; style-src 'nonce-"+nonce+"'; connect-src 'self'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"}});
      }
      if(!['GET','POST'].includes(method))return json({code:'method_not_allowed'},405,{Allow:'GET, POST'});
      if(method==='POST'&&(!config.origins.includes(request.headers.get('origin')??'')||request.headers.get('sec-fetch-site')==='cross-site'))throw new ApiError(403,'origin_forbidden','Abra o atendimento pelo endereço autorizado do site.');
      if(path===PREFIX+'/login'&&method==='POST'){
        await quota('login-ip',ip,10,15*60000,signal);
        const data=await body(request,['email','password']);
        const email=text(data.email,254).toLowerCase(),password=data.password;
        if(typeof password!=='string'||!password||password.length>1024)throw denied();
        // Do not send arbitrary account credentials to the upstream IAM.
        if(email!==config.ownerEmail)throw denied();
        await quota('login-account',email,10,15*60000,signal);
        const result=await authCall('/auth/login',signal,undefined,{email,password});
        if(typeof result.accessToken!=='string'||!result.accessToken||result.accessToken.length>16000)throw denied();
        const staff=await actor(result.accessToken,signal);
        let ttl=3600;
        try{const payload=JSON.parse(Buffer.from(result.accessToken.split('.')[1],'base64url').toString('utf8'));if(typeof payload.exp==='number')ttl=Math.min(ttl,Math.floor(payload.exp-Date.now()/1000));}catch{/* /auth/me, rather than an unsigned claim, authenticates the actor. */}
        if(ttl<30)throw denied();
        const value=randomBytes(32).toString('base64url'),createdAt=new Date().toISOString();
        await config.inbox.saveStaffSession(digest('session',value),{token:result.accessToken,actor:staff,createdAt,expiresAt:new Date(Date.now()+ttl*1000).toISOString()},signal);
        const previous=staffCookie(request);if(previous)await config.inbox.revokeStaffSession(digest('session',previous),signal);
        return json({actor:staff,expiresAt:new Date(Date.now()+ttl*1000).toISOString()},200,{'Set-Cookie':cookie(value,ttl)});
      }
      const value=staffCookie(request);if(!value)throw denied();
      const hash=digest('session',value),session=await config.inbox.readStaffSession(hash,signal);
      if(!session)throw denied();
      if(path===PREFIX+'/logout'&&method==='POST'){
        await config.inbox.revokeStaffSession(hash,signal);return json({signedOut:true},200,{'Set-Cookie':cookie('',0)});
      }
      const staff=await actor(session.token,signal);
      if(staff.id!==session.actor.id||staff.email!==session.actor.email){await config.inbox.revokeStaffSession(hash,signal);throw denied();}
      await quota('staff',staff.id,180,60000,signal);
      const market=await marketTeamRequest(request,staff,{mode:'STAFF',insights:config.insights,worker:config.marketWorker,origins:config.origins});if(market)return market;
      if(path===PREFIX+'/session'&&method==='GET')return json({actor:staff,expiresAt:session.expiresAt});
      if(path===PREFIX+'/requests'&&method==='GET'){
        const rawPage=url.searchParams.get('page')??'1';if(!/^[1-9]\d{0,2}$/.test(rawPage))throw new ApiError(422,'invalid_page','Página inválida.');
        return json(await config.inbox.listRequests(staff,signal,Number(rawPage)));
      }
      const route=path.match(/^\/api\/site\/team\/requests\/(handoff_[A-Za-z0-9_-]{1,90})(?:\/(claim|replies))?$/);
      if(route){
        if(!route[2]&&method==='GET')return json(await config.inbox.openRequest(route[1],staff,signal));
        if(route[2]==='claim'&&method==='POST'){await body(request,[]);return json(await config.inbox.claim(route[1],staff,signal));}
        if(route[2]==='replies'&&method==='POST'){
          const data=await body(request,['clientMessageId','text']);
          return json(await config.inbox.reply(route[1],staff,{clientMessageId:text(data.clientMessageId,36),text:text(data.text,2000)},signal));
        }
      }
      return json({code:'not_found'},404);
    }catch(reason){
      if(reason instanceof ApiError)return json({code:reason.code,message:reason.message},reason.status,reason.status===401?{'Set-Cookie':cookie('',0)}:{});
      return json({code:'team_unavailable',message:'O atendimento está temporariamente indisponível. Tente novamente.'},503);
    }
  };
}
