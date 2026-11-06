import {describe,expect,it} from 'vitest';
import {JSDOM} from 'jsdom';
import {withRouteResourceHints} from './route-resource-hints.mjs';
const html='<!doctype html><html><head><title>Home</title><script type="module" src="/assets/index.js"></script></head><body><main><h1>A forma segue a conexão.</h1><img class="hero-sculpture" src="/redesign/financial-city.webp" width="1536" height="1024" fetchpriority="high"></main></body></html>';
describe('Native Home LCP resource hint',()=>{
  it('discovers the existing hero source early without changing its pixels or DOM composition',()=>{
    const result=withRouteResourceHints(html,'/'),before=new JSDOM(html).window.document,after=new JSDOM(result).window.document;
    const hint=after.querySelector('head link[rel="preload"][as="image"]');
    expect(hint.getAttribute('href')).toBe('/redesign/financial-city.webp');expect(hint.getAttribute('fetchpriority')).toBe('high');
    expect(after.head.firstElementChild).toBe(hint);expect(after.querySelector('main').outerHTML).toBe(before.querySelector('main').outerHTML);
    before.defaultView.close();after.defaultView.close();
  });
  it('is idempotent and does not add hints on other pages',()=>{
    const once=withRouteResourceHints(html,'/');expect(withRouteResourceHints(once,'/')).toBe(once);
    expect(withRouteResourceHints(html,'/contato')).toBe(html);expect(withRouteResourceHints(html,'/ecossistema/banking')).toBe(html);
  });
  it('carries responsive source selection if the approved hero ever gains srcset',()=>{
    const result=withRouteResourceHints(html.replace('width="1536"','srcset="/redesign/hero-small.webp 768w, /redesign/financial-city.webp 1536w" sizes="100vw" width="1536"'),'/');
    const doc=new JSDOM(result).window.document,hint=doc.querySelector('link[as="image"]');
    expect(hint.getAttribute('imagesrcset')).toContain('hero-small.webp 768w');expect(hint.getAttribute('imagesizes')).toBe('100vw');doc.defaultView.close();
  });
});
