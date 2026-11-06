import {readFileSync} from 'node:fs';
import {describe,expect,it,vi} from 'vitest';
import {withoutOptionalAnalytics,withoutExternalFontLinks,contactBootstrapGate,autoLocaleBootstrapGate} from './vite-release';
import {JSDOM} from 'jsdom';
import{runInNewContext}from'node:vm';

describe('New-site HTML analytics gate',()=>{
  it('removes the actual external scripts and no-JS tracking iframe while preserving the app',()=>{
    const html=readFileSync('index.html','utf8');
    expect(html).toContain('googletagmanager.com');
    expect(html).toContain('clarity.ms/tag/');
    const clean=withoutOptionalAnalytics(html);
    expect(clean).not.toMatch(/googletagmanager\.com|clarity\.ms\/tag\//i);
    expect(clean).toContain('<div id="root"></div>');
    expect(clean).toContain('src="/src/main.tsx"');
    expect(clean).toContain("'analytics_storage': 'denied'");
  });
  it('fails closed if another tracker survives outside the known bootstrap sections',()=>{
    expect(()=>withoutOptionalAnalytics('<script src="https://www.googletagmanager.com/gtm.js"></script>')).toThrow(/remain/);
    expect(()=>withoutOptionalAnalytics('<iframe src="https://www.clarity.ms/tag/a"></iframe>')).toThrow(/remain/);
  });
  it('removes native-shell remote font dependencies while preserving all local assets',()=>{
    const clean=withoutExternalFontLinks(readFileSync('index.html','utf8'));
    expect(clean).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
    expect(clean).toContain('src="/src/main.tsx"');
    expect(clean).toContain('href="/favicon.svg"');
  });
  it('reserves the contact snapshot and shows only loading until its session is known; no-JS retains the introduction',async()=>{
    const source='<html><head>'+contactBootstrapGate()+'</head><body><div id="root"><main class="c-contact"><div class="z-dialogue"><div class="z-view-intro"><h1>Vamos dar forma</h1><input/></div></div></main></div></body></html>';
    const noJs=new JSDOM(source,{url:'https://catalisa.io/contato'});
    expect(noJs.window.document.documentElement.hasAttribute('data-contact-bootstrap')).toBe(false);
    expect(noJs.window.document.querySelector('h1')?.textContent).toBe('Vamos dar forma');noJs.window.close();
    const live=new JSDOM(source,{url:'https://catalisa.io/contato',runScripts:'dangerously'});
    await new Promise(resolve=>live.window.setTimeout(resolve,0));
    expect(live.window.document.documentElement.hasAttribute('data-contact-bootstrap')).toBe(true);
    expect(live.window.getComputedStyle(live.window.document.querySelector('.z-view-intro')! as Element).visibility).toBe('hidden');
    expect(live.window.document.querySelector('[data-contact-bootstrap-status]')?.textContent).toBe('Retomando sua conversa…');
    expect(live.window.document.querySelector('h1')?.textContent).toBe('Vamos dar forma');live.window.close();
  });
});

describe('Pre-paint Home language gate',()=>{
  function execute({pathname='/',preference=null,userAgent='Mozilla/5.0',languages=['de-CH']}:{pathname?:string;preference?:string|null;userAgent?:string;languages?:string[]}={}){
    const attributes=new Map<string,string>(),replace=vi.fn();
    const source=autoLocaleBootstrapGate().match(/<script>([\s\S]*?)<\/script>/)![1];
    runInNewContext(source,{URLSearchParams,location:{pathname,search:'?utm_source=search&token=private',hash:'#arquitetura',replace},navigator:{languages,language:languages[0],userAgent},localStorage:{getItem:()=>preference},Intl:{DateTimeFormat:()=>({resolvedOptions:()=>({locale:'en-US'})})},document:{documentElement:{setAttribute:(name:string,value:string)=>attributes.set(name,value),removeAttribute:(name:string)=>attributes.delete(name)}}});
    return{attributes,replace};
  }
  it('executes the exact serialized policy without a module dependency and hides only when redirecting',()=>{
    const result=execute();expect(result.replace).toHaveBeenCalledExactlyOnceWith('/de?utm_source=search#arquitetura');expect(result.attributes.get('data-site-locale-redirect')).toBe('/de?utm_source=search#arquitetura');
    const portuguese=execute({preference:'pt-BR'});expect(portuguese.replace).not.toHaveBeenCalled();expect(portuguese.attributes.size).toBe(0);
  });
  it('never redirects bots or explicit/deep/compatibility paths before the application loads',()=>{
    for(const pathname of['/fr','/contato','/api/site/session','/insights'])expect(execute({pathname}).replace).not.toHaveBeenCalled();
    const bot=execute({userAgent:'Googlebot',preference:'fr-FR'});expect(bot.replace).not.toHaveBeenCalled();expect(bot.attributes.size).toBe(0);
  });
  it('leaves static Portuguese content and canonical/hreflang discovery intact when JavaScript is disabled',()=>{
    const source='<html><head><link rel="canonical" href="https://catalisa.io/"><link rel="alternate" hreflang="pt-BR" href="https://catalisa.io/"><link rel="alternate" hreflang="en" href="https://catalisa.io/en">'+autoLocaleBootstrapGate()+'</head><body><h1>Crie seu próximo produto.</h1></body></html>';
    const page=new JSDOM(source,{url:'https://catalisa.io/'});expect(page.window.document.querySelector('h1')?.textContent).toBe('Crie seu próximo produto.');expect(page.window.document.querySelectorAll('link[hreflang]')).toHaveLength(2);expect(page.window.document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://catalisa.io/');expect(page.window.document.documentElement.hasAttribute('data-site-locale-redirect')).toBe(false);expect(page.window.getComputedStyle(page.window.document.body).visibility).toBe('visible');page.window.close();
  });
});
