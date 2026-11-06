import type { Plugin } from 'vite';
import { getSiteBuildMode } from '../src/seo/release';
import { getRedesignPage } from '../src/seo/redesign';
import{autoLocaleDecision,siteAutoLocalePolicy,siteLocaleStorageKey}from'../src/redesign/i18n/auto-locale';

/** New-site forms work without optional analytics. Enable only with a native preferences flow. */
export function withoutOptionalAnalytics(html: string): string {
  const clean = html
    .replace(/<!-- Google Tag Manager \(deferred[\s\S]*?<!-- End Google Tag Manager -->/g, '')
    .replace(/<!-- Microsoft Clarity[\s\S]*?<!-- End Microsoft Clarity -->/g, '')
    .replace(/<!-- Google Tag Manager \(noscript\)[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/g, '');
  if (/googletagmanager\.com|clarity\.ms\/tag\//i.test(clean)) throw new Error('Optional analytics remain in the new-site HTML shell');
  return clean;
}

export function withoutExternalFontLinks(html: string): string {
  return html.replace(/<link\b[^>]*href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com[^>]*>/g, '');
}

/** Same pure policy as main; executes before any Portuguese body can paint.
 * No-JS/search bots retain the complete canonical/static SEO document. */
export function autoLocaleBootstrapGate():string{
  return `<style>html[data-site-locale-redirect] body{visibility:hidden}</style><script>
(function(){
 try{
  var preference,intlLocale;
  try{preference=localStorage.getItem(${JSON.stringify(siteLocaleStorageKey)});}catch(error){}
  try{intlLocale=Intl.DateTimeFormat().resolvedOptions().locale;}catch(error){}
  var decision=(${autoLocaleDecision.toString()})({pathname:location.pathname,search:location.search,hash:location.hash,preference:preference,languages:navigator.languages,language:navigator.language,intlLocale:intlLocale,userAgent:navigator.userAgent},${JSON.stringify(siteAutoLocalePolicy)});
  if(!decision||!decision.destination)return;
  document.documentElement.setAttribute('data-site-locale-redirect',decision.destination);
  location.replace(decision.destination);
 }catch(error){document.documentElement.removeAttribute('data-site-locale-redirect');}
})();
</script>`;
}

/** Before React is ready, preserve anonymous snapshot geometry without flashing it to a returning visitor. */
export function contactBootstrapGate(): string {
  const copy={
    '/contato':['Retomando sua conversa…','O carregamento está demorando. Suas respostas continuam salvas. ','Recarregar'],
    '/en/contact':['Resuming your conversation…','Loading is taking longer. Your answers are still saved. ','Reload'],
    '/de/kontakt':['Ihr Gespräch wird fortgesetzt…','Das Laden dauert länger. Ihre Antworten bleiben gespeichert. ','Neu laden'],
    '/es/contacto':['Retomando tu conversación…','La carga está tardando. Tus respuestas siguen guardadas. ','Volver a cargar'],
    '/da/kontakt':['Genoptager din samtale…','Indlæsningen tager længere tid. Dine svar er stadig gemt. ','Genindlæs'],
    '/nl/contact':['Je gesprek wordt hervat…','Het laden duurt langer. Je antwoorden blijven bewaard. ','Opnieuw laden'],
    '/fr/contact':['Reprise de votre conversation…','Le chargement prend plus de temps. Vos réponses sont toujours enregistrées. ','Recharger'],
  };
  return `<style>
html[data-contact-bootstrap] .c-contact .z-dialogue>*:not([data-contact-bootstrap-status]){visibility:hidden}
[data-contact-bootstrap-status]{position:absolute;inset:0 auto auto 0;max-width:100%;margin:0;color:#62596a;font:14px/1.6 Arial,sans-serif}
[data-contact-bootstrap-fallback]{padding:80px 6%;font:16px/1.6 Arial,sans-serif;color:#62596a}
</style><script>
(function(){
 var copy=${JSON.stringify(copy)}[location.pathname.replace(/\\/+$/,'')];if(!copy)return;
 var doc=document,html=doc.documentElement;html.setAttribute('data-contact-bootstrap','');
 var observer;
 function status(){
  if(!html.hasAttribute('data-contact-bootstrap')){if(observer)observer.disconnect();return;}
  var target=doc.querySelector('.c-contact .z-dialogue');if(!target)return;target.setAttribute('aria-busy','true');
  if(!target.querySelector('[data-contact-bootstrap-status]')){var message=doc.createElement('p');message.setAttribute('data-contact-bootstrap-status','');message.setAttribute('role','status');message.textContent=copy[0];target.append(message);}
 }
 observer=new MutationObserver(status);observer.observe(html,{childList:true,subtree:true});
 doc.addEventListener('DOMContentLoaded',function(){var root=doc.getElementById('root');if(root&&!root.hasChildNodes()){var message=doc.createElement('p');message.setAttribute('data-contact-bootstrap-fallback','');message.setAttribute('role','status');message.textContent=copy[0];root.append(message);}status();},{once:true});
 setTimeout(function(){if(!html.hasAttribute('data-contact-bootstrap'))return;var message=doc.querySelector('[data-contact-bootstrap-status],[data-contact-bootstrap-fallback]');if(message){message.textContent=copy[1];var button=doc.createElement('button');button.type='button';button.textContent=copy[2];button.onclick=function(){location.reload();};message.append(button);}},20000);
})();
</script>`;
}

export function siteReleasePlugin(environment: Record<string, string | undefined>): Plugin {
  const mode = getSiteBuildMode(environment);
  return {
    name: 'site-release-manifest',
    transformIndexHtml(html) {
      if (mode.redesign || environment.VITE_REDESIGN_PREVIEW === '1') html = withoutExternalFontLinks(withoutOptionalAnalytics(html)).replace('</head>',autoLocaleBootstrapGate()+contactBootstrapGate()+'</head>');
      if (!mode.redesign) return html;
      const home = getRedesignPage('/')!;
      const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
      return html
        .replace(/<title>[^<]*<\/title>/, `<title>${escape(home.title)}</title>`)
        .replace(/(<meta\s+(?:name|property)="(?:description|og:description|twitter:description)"\s+content=")[^"]*/g, `$1${escape(home.description)}`)
        .replace(/(<meta\s+(?:name|property)="(?:og:title|twitter:title|og:image:alt|twitter:image:alt)"\s+content=")[^"]*/g, `$1${escape(home.title)}`)
        .replace(/(<meta\s+(?:name|property)="(?:og:image|og:image:secure_url|twitter:image)"\s+content=")[^"]*/g, '$1https://catalisa.io/og/redesign/design-system-home.png')
        .replace(/<link\s+rel="(?:icon|apple-touch-icon|manifest)"[^>]*>/g, '')
        .replace(/<meta name="theme-color"[^>]*>/, '<meta name="theme-color" content="#56319a" />')
        .replace('</head>', `<link rel="icon" type="image/svg+xml" href="/redesign/brand/catalisa-simbolo-principal.svg" /><link rel="apple-touch-icon" href="/redesign/brand/catalisa-simbolo-principal-256.png" /><link rel="manifest" href="/redesign.webmanifest" /><meta name="robots" content="${mode.indexing ? 'index, follow' : 'noindex, nofollow'}" /></head>`);
    },
    generateBundle() {
      this.emitFile({type: 'asset', fileName: 'site-build.json', source: JSON.stringify(mode, null, 2) + '\n'});
      if (mode.redesign) this.emitFile({type: 'asset', fileName: 'redesign.webmanifest', source: JSON.stringify({
        name: 'Catalisa — Plataforma de capacidades', short_name: 'Catalisa', start_url: '/', display: 'standalone',
        theme_color: '#56319a', background_color: '#f7f4ee',
        icons: [128, 256, 512].map(size => ({src: `/redesign/brand/catalisa-simbolo-principal-${size}.png`, sizes: `${size}x${size}`, type: 'image/png'})),
      }, null, 2) + '\n'});
    },
  };
}
