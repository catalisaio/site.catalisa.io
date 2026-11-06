// @vitest-environment node
import {afterEach,describe,expect,it,vi} from 'vitest';
import type {SiteApiOptions} from './api';
const captured=vi.hoisted(()=>({options:[] as SiteApiOptions[]}));
vi.mock('./api',()=>({createSiteApi:(options:SiteApiOptions)=>{captured.options.push(options);return async()=>Response.json({fixture:true});}}));
import {siteRuntime} from './runtime';
import {SqliteSessionStore} from './sqlite-store';
const env={SITE_STORE:'catalisa',SITE_CATALISA_ORIGIN:'https://fixture.invalid',SITE_CATALISA_TOKEN:'fixture-only',SITE_CATALISA_OWNER_EMAIL:'admin@catalisa.app',SITE_STORE_COLLECTION:'site_catalisa_sessions_v1',SITE_SESSION_SECRET:'fixture-runtime-secret-more-than-32-characters',SITE_ALLOWED_ORIGINS:'https://site-test.invalid'};
afterEach(()=>{for(const options of captured.options.splice(0))if(options.store instanceof SqliteSessionStore)options.store.close();});
describe('hosting-specific generation budgets',()=>{
 it('keeps the serverless defaults without an explicit Node marker',async()=>{await siteRuntime(env,false);expect(captured.options.at(-1)?.requestBudgetMs).toBeUndefined();expect(captured.options.at(-1)?.generationTimeoutMs).toBeUndefined();});
 it('uses the 90/60-second profile only for the explicit Node adapter',async()=>{await siteRuntime({...env,SITE_RUNTIME_MODE:'node'},false);expect(captured.options.at(-1)?.requestBudgetMs).toBe(90000);expect(captured.options.at(-1)?.generationTimeoutMs).toBe(60000);});
 it('uses the Node profile for the local Node preview and ignores arbitrary mode strings',async()=>{await siteRuntime({SITE_LOCAL_DATABASE:':memory:'},true);expect(captured.options.at(-1)?.requestBudgetMs).toBe(90000);await siteRuntime({...env,SITE_RUNTIME_MODE:'unrecognized'},false);expect(captured.options.at(-1)?.requestBudgetMs).toBeUndefined();});
});
