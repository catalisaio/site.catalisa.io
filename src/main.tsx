import { StrictMode,lazy,Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import {liveRedesignPreview, redesignRelease} from './redesign/preview';
import {getMigrationTarget, isLegacyCompatibilityPath} from './seo/migration';
import{getSiteLocale,parseSitePath}from'./redesign/i18n/routes';
import{loadSiteLocale}from'./redesign/i18n/runtime';
import{browserAutoLocaleDecision}from'./redesign/i18n/auto-locale';

const root = document.getElementById('root')!;
// These are browser snapshots, not react-dom/server output. Their generated IDs,
// Emotion styles and animation state do not form a valid hydration contract.
// Keep static HTML for no-JS discovery; mount the interactive app with createRoot.
function releaseSnapshotHead(){if(root.hasChildNodes())document.head.querySelectorAll('[data-seo], [data-jsonld], [data-redesign-head]').forEach(node=>node.remove());}
const usesNewSite = (path: string) => (liveRedesignPreview||redesignRelease)&&(!!parseSitePath(path)||!isLegacyCompatibilityPath(path));
// The HTML head gate normally decides before paint. This also covers dev or
// older empty shells without that gate, without importing either app/font set.
let localeRedirectPending=(redesignRelease||liveRedesignPreview)&&document.documentElement.hasAttribute('data-site-locale-redirect');
if((redesignRelease||liveRedesignPreview)&&!localeRedirectPending){const destination=browserAutoLocaleDecision()?.destination;if(destination){try{document.documentElement.setAttribute('data-site-locale-redirect',destination);location.replace(destination);localeRedirectPending=true;}catch{document.documentElement.removeAttribute('data-site-locale-redirect');}}}
// Crossing the compatibility boundary starts a fresh application, including its styles.
// This also handles Links created by either router and browser back/forward navigation.
if ((redesignRelease || liveRedesignPreview)&&!localeRedirectPending) {
  const initialApp = usesNewSite(location.pathname);
  const initialLocale=getSiteLocale(location.pathname);
  const crossesLanguage=(path:string)=>initialApp&&usesNewSite(path)&&getSiteLocale(path)!==initialLocale;
  const target = getMigrationTarget(location.pathname, true);
  if (target) location.replace(target + location.search + location.hash);
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
    if (!anchor || anchor.download || (anchor.target && anchor.target !== '_self')) return;
    const url = new URL(anchor.href, location.href);
    if (url.origin !== location.origin) return;
    const redirect = getMigrationTarget(url.pathname, true);
    if (redirect || usesNewSite(url.pathname) !== initialApp||crossesLanguage(url.pathname)) { event.preventDefault(); location.assign((redirect ?? url.pathname) + url.search + url.hash); }
  }, true);
  // Language switching and imperative router navigation use History rather than anchors.
  for (const method of ['pushState', 'replaceState'] as const) {
    const original = history[method].bind(history);
    history[method] = (data: unknown, unused: string, targetUrl?: string | URL | null) => {
      if (targetUrl != null) {
        const url = new URL(targetUrl, location.href);
        const redirect = url.origin === location.origin ? getMigrationTarget(url.pathname, true) : undefined;
        if (url.origin === location.origin && (redirect || usesNewSite(url.pathname) !== initialApp||crossesLanguage(url.pathname))) {
          const destination = (redirect ?? url.pathname) + url.search + url.hash;
          if (method === 'replaceState') location.replace(destination); else location.assign(destination);
          return;
        }
      }
      original(data, unused, targetUrl);
    };
  }
  addEventListener('popstate', () => { if (usesNewSite(location.pathname) !== initialApp||crossesLanguage(location.pathname)) location.reload(); });
}
async function start(){
  const Measurement=(redesignRelease||liveRedesignPreview)?lazy(async()=>({default:(await import('./analytics/AnalyticsConsent')).AnalyticsConsent})):null;
  if(usesNewSite(location.pathname)){
    await loadSiteLocale(getSiteLocale(location.pathname));
    const {default:App,prepareInitialRoute}=await import('./redesign/App');
    await prepareInitialRoute(location.pathname);
    releaseSnapshotHead();
    createRoot(root).render(<StrictMode><App/><Suspense fallback={null}>{Measurement&&<Measurement/>}</Suspense></StrictMode>);
  }else{
    // The new-site shell uses its local font assets. Preserved pages load their
    // original Inter family only when entering the isolated legacy application.
    if((redesignRelease||liveRedesignPreview)&&!document.querySelector('link[data-legacy-font]')){
      const font=document.createElement('link');font.rel='stylesheet';font.dataset.legacyFont='';
      font.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
      document.head.append(font);
    }
    await Promise.all([import('./i18n'),import('./index.css')]);
    const {default:App}=await import('./App');
    releaseSnapshotHead();
    createRoot(root).render(<StrictMode><App/><Suspense fallback={null}>{Measurement&&<Measurement/>}</Suspense></StrictMode>);
  }
}
if(!localeRedirectPending)void start();
