import { createSiteApi } from './api';
import type { SessionStore } from './types';
import { siteIntegrations } from './integrations';
import {siteInbox} from './site-inbox';
import {createSiteTeamApi} from './site-team-api';
import {SessionMarketSource,SiteMarketWorker} from './site-market-outbox';
import type {SiteMarketInsights,MarketPolicyApproval} from './site-market-insights';

export async function siteStore(env:Record<string,string|undefined>,local:boolean):Promise<SessionStore>{
  const backend=env.SITE_STORE||(local?'sqlite':'supabase');
  if(backend==='catalisa'){
    if(!env.SITE_CATALISA_ORIGIN||!env.SITE_CATALISA_TOKEN||!env.SITE_CATALISA_OWNER_EMAIL||!env.SITE_STORE_COLLECTION)throw Error('Catalisa site store configuration missing');
    const {CatalisaSessionStore}=await import('./catalisa-store');
    return new CatalisaSessionStore({origin:env.SITE_CATALISA_ORIGIN,token:env.SITE_CATALISA_TOKEN,ownerEmail:env.SITE_CATALISA_OWNER_EMAIL,collection:env.SITE_STORE_COLLECTION,local});
  }
  if(backend==='sqlite'&&local){
    const { SqliteSessionStore } = await import('./sqlite-store');
    return new SqliteSessionStore(env.SITE_LOCAL_DATABASE || '.local/site/sessions.sqlite');
  }
  if(backend==='supabase'){
    if(!env.SITE_SUPABASE_URL||!env.SITE_SUPABASE_SERVICE_ROLE_KEY)throw Error('Site Supabase configuration missing');
    const {SupabaseSessionStore}=await import('./supabase-store');
    return new SupabaseSessionStore(env.SITE_SUPABASE_URL,env.SITE_SUPABASE_SERVICE_ROLE_KEY);
  }
  throw Error('Invalid site store backend; SQLite is local only');
}

export async function siteRuntime(env: Record<string, string | undefined>, local: boolean) {
  if(!local&&(!env.SITE_SESSION_SECRET||!env.SITE_ALLOWED_ORIGINS))throw Error('Site security configuration missing');
  const store=await siteStore(env,local);
  const integrations = siteIntegrations({agentOrigin:env.SITE_CATALISA_ORIGIN,agentToken:env.SITE_CATALISA_TOKEN,agentId:env.SITE_CATALISA_AGENT_ID,ownerEmail:env.SITE_CATALISA_OWNER_EMAIL,handoffUrl:env.SITE_HANDOFF_URL,handoffToken:env.SITE_HANDOFF_TOKEN,handoffSigningSecret:env.SITE_HANDOFF_SIGNING_SECRET,channels:env.SITE_HANDOFF_CHANNELS},local);
  const secret=env.SITE_SESSION_SECRET || 'local-development-only-secret-no-production',origins=local ? ['http://localhost:5175', 'http://127.0.0.1:5175'] : (env.SITE_ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean);
  let insights:SiteMarketInsights|undefined;
  if(env.SITE_MARKET_INSIGHTS_ENABLED==='1'){
    if(!store.pendingMarketSessions||!env.SITE_CATALISA_ORIGIN||!env.SITE_CATALISA_TOKEN||!env.SITE_CATALISA_OWNER_EMAIL||!env.SITE_MARKET_POLICY_APPROVAL_JSON||env.SITE_MARKET_POLICY_APPROVAL_JSON.length>8192)throw Error('Approved site market configuration and durable outbox store required');
    const {CatalisaMarketStorage}=await import('./site-market-store'),{configuredMarketInsights}=await import('./site-market-insights');
    let approval:MarketPolicyApproval;try{approval=JSON.parse(env.SITE_MARKET_POLICY_APPROVAL_JSON);}catch{throw Error('Invalid site market policy approval');}
    insights=configuredMarketInsights({...env,SITE_SESSION_SECRET:secret},new CatalisaMarketStorage({origin:env.SITE_CATALISA_ORIGIN,token:env.SITE_CATALISA_TOKEN,ownerEmail:env.SITE_CATALISA_OWNER_EMAIL}),approval);
  }
  const inbox=siteInbox(env,local,insights);
  if(insights&&!inbox)throw Error('Site market insights require the authenticated site operator inbox');
  const marketWorker=insights&&inbox?new SiteMarketWorker(insights,[new SessionMarketSource(store),inbox.marketSource()]):undefined;
  const nodeRuntime=local||env.SITE_RUNTIME_MODE==='node';
  const visitor=createSiteApi({ store,...integrations,insights,...(nodeRuntime?{requestBudgetMs:90000,generationTimeoutMs:60000}:{}),handoff:inbox??(env.SITE_WEBHOOK_SECRET?integrations.handoff:undefined),webhookSecret:env.SITE_WEBHOOK_SECRET,secret,secure:!local,origins });
  const team=inbox?createSiteTeamApi({inbox,insights,marketWorker,origin:env.SITE_CATALISA_ORIGIN!,ownerEmail:env.SITE_CATALISA_OWNER_EMAIL!,secret,secure:!local,origins}):undefined;
  return Object.assign(async(request:Request,ip:string)=>await team?.(request,ip)??visitor(request,ip),{marketWorker});
}
