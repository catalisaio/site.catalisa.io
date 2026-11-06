import{lazy,Suspense}from'react';
import type{ComponentType}from'react';
import{BrowserRouter,Route,Routes}from'react-router-dom';
import{LocalizedLink as Link}from'./i18n/navigation';
import{t}from'./i18n/runtime';
import{localizeSitePath,parseSitePath,siteBasePaths,supportedSiteLocales}from'./i18n/routes';
import editorial from'./data/editorial.json';
import resources from'./data/resources.json';
import ecosystem from'./data/ecosystem.json';
import{RedesignFrame}from'./foundation-components';
import'./reset.css';import'./base.css';import'./hero-clarity.css';

type PageModule={default:ComponentType;prepareInitialSession?:()=>Promise<void>};
type PageLoader=()=>Promise<PageModule>;
const loaders={operationalAssistant:()=>import('./OperationalAssistant'),products:()=>import('./Products'),home:()=>import('./Home'),styleguide:()=>import('./Styleguide'),capabilities:()=>import('./Capabilities'),vision:()=>import('./Vision'),architecture:()=>import('./Architecture'),developers:()=>import('./Developers'),studio:()=>import('./Studio'),workflows:()=>import('./Workflows'),agents:()=>import('./Agents'),governance:()=>import('./Governance'),banking:()=>import('./Banking'),credit:()=>import('./Credit'),editorial:()=>import('./Editorial'),resources:()=>import('./Resources'),contact:()=>import('./Contact'),lab:()=>import('./Lab'),ecosystem:()=>import('./Ecosystem'),legal:()=>import('./Legal')}satisfies Record<string,PageLoader>;
const fixed:Record<string,PageLoader>={'/assistente-operacional':loaders.operationalAssistant,'/produtos':loaders.products,'/':loaders.home,'/design-system':loaders.styleguide,'/visao':loaders.vision,'/arquitetura':loaders.architecture,'/desenvolvedores':loaders.developers,'/studio':loaders.studio,'/workflows':loaders.workflows,'/agentes':loaders.agents,'/governanca':loaders.governance,'/ecossistema/banking':loaders.banking,'/ecossistema/credit':loaders.credit,'/contato':loaders.contact,'/lab':loaders.lab,'/politica-privacidade':loaders.legal,'/termos':loaders.legal};
export function getPageLoader(basePath:string):PageLoader|undefined{return fixed[basePath]??(/^\/capacidades(?:\/|$)/.test(basePath)?loaders.capabilities:ecosystem.some(page=>page.path===basePath)?loaders.ecosystem:editorial.some(page=>page.path===basePath)?loaders.editorial:resources.some(page=>page.path===basePath)?loaders.resources:undefined);}
const prepared=new Map<PageLoader,PageModule>(),components=new Map<PageLoader,ComponentType>();
function routeComponent(loader:PageLoader){let Component=components.get(loader);if(!Component){const Lazy=lazy(loader);Component=function PreparedRoute(){const Page=prepared.get(loader)?.default??Lazy;return <Page/>;};components.set(loader,Component);}return Component;}
/** Keep the translated public snapshot until its locale, actual route and CSS are ready. */
export async function prepareInitialRoute(pathname:string){const parsed=parseSitePath(pathname);if(!parsed)return;const loader=getPageLoader(parsed.basePath);if(!loader)return;const module=await loader();await module.prepareInitialSession?.();prepared.set(loader,module);}
function Missing(){return <RedesignFrame title={t('Página não encontrada')}><section className="c-wrap" style={{paddingBlock:100}}><h1>{t('Vamos encontrar')}<br/>{t('outra conexão.')}</h1><Link className="c-text-link" to="/">{t('Voltar ao início ↗')}</Link></section></RedesignFrame>;}
/** Public locales share the independent new-site composition, with actual translations loaded before mount. */
export default function RedesignApp(){return <BrowserRouter><Suspense fallback={<div className="c-site" aria-busy="true" style={{minHeight:'100vh'}}/>}><Routes>{supportedSiteLocales.flatMap(locale=>siteBasePaths.map(basePath=>{const loader=getPageLoader(basePath);if(!loader)return null;const Page=routeComponent(loader),path=localizeSitePath(basePath,locale);return <Route key={path} path={path} element={<Page/>}/>;}))}<Route path="*" element={<Missing/>}/></Routes></Suspense></BrowserRouter>;}
