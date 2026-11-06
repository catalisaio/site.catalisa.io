import{afterEach,beforeEach,describe,expect,it,vi}from'vitest';
beforeEach(()=>{localStorage.clear();document.querySelectorAll('#catalisa-google-tag,#catalisa-clarity').forEach(x=>x.remove());});
afterEach(()=>{vi.unstubAllGlobals();vi.restoreAllMocks();});
describe('measurement privacy boundaries',()=>{
 it.each(['/apresentacao/i/private-invite','/en/presentation/i/secret','/treinamento/perfil','/api/site/team','/contato?email=person%40example.invalid','/lab?idea=secret','/lab#email=private'])('does not measure private URL %s',async route=>{
  const{safeMeasurementUrl}=await import('./site-analytics');expect(safeMeasurementUrl('https://catalisa.io'+route)).toBeNull();
 });
 it('keeps public paths while excluding query attribution values from page URLs',async()=>{
  const{safeMeasurementUrl}=await import('./site-analytics');expect(safeMeasurementUrl('https://catalisa.io/agentes/?utm_source=linkedin&utm_campaign=products')).toBe('https://catalisa.io/agentes');
  expect(safeMeasurementUrl('https://catalisa.io/?utm_campaign=5511999999999')).toBeNull();
 });
 it('respects the existing opt-out and never loads production vendors locally',async()=>{
  vi.resetModules();localStorage.setItem('catalisa_cookie_consent','denied');const module=await import('./site-analytics');expect(module.readConsent()).toBe('denied');
  module.bootstrapMeasurement();module.setConsent('granted');module.trackSiteEvent('concept_ready',{source:'lab',email:'private@example.invalid'});
  expect(document.querySelector('#catalisa-google-tag,#catalisa-clarity')).toBeNull();
 });
});

/** Isolated URL/history fixtures; script tags are observed without loading SDKs. */
function browserAt(host:string,path='/'){
 let current=new URL(path,'https://'+host);
 const assign=vi.fn(),reload=vi.fn(),listeners=new Map<string,EventListener>();
 const fakeLocation={get href(){return current.href;},get origin(){return current.origin;},get hostname(){return current.hostname;},get pathname(){return current.pathname;},assign,reload};
 const navigate=(_data:unknown,_unused:string,target?:string|URL|null)=>{if(target!=null)current=new URL(String(target),current);};
 const push=vi.fn(navigate),replace=vi.fn(navigate);
 vi.stubGlobal('location',fakeLocation);vi.stubGlobal('history',{pushState:push,replaceState:replace});
 vi.stubGlobal('addEventListener',(name:string,listener:EventListener)=>listeners.set(name,listener));
 delete window.clarity;delete window.dataLayer;delete window.gtag;
 return {assign,reload,push,replace,go:(path:string)=>{current=new URL(path,current);},pop:()=>listeners.get('popstate')?.(new Event('popstate'))};
}
async function boot(host:string,path='/',consent:'granted'|'denied'|null='granted'){
 vi.resetModules();const browser=browserAt(host,path);if(consent)localStorage.setItem('catalisa_cookie_consent',consent);else localStorage.removeItem('catalisa_cookie_consent');const api=await import('./site-analytics');api.bootstrapMeasurement();return {api,browser};
}
describe('isolated staging heatmaps',()=>{
 it('loads only the staging Clarity project after consent, without enabling Google or its funnel events',async()=>{
  const{api}=await boot('site-staging.catalisa.io');
  expect(document.querySelector('#catalisa-clarity')?.getAttribute('src')).toBe('https://www.clarity.ms/tag/z40bi9hrk8');
  expect(document.querySelector('#catalisa-google-tag')).toBeNull();expect(api.measurementAllowed()).toBe(false);
  api.trackSiteEvent('cta_click',{source:'products'});expect(window.dataLayer).toBeUndefined();
 });
 it.each([null,'denied']as const)('does not load staging heatmaps before granted consent (%s)',async consent=>{
  const{api}=await boot('site-staging.catalisa.io','/',consent);expect(document.querySelector('#catalisa-clarity,#catalisa-google-tag')).toBeNull();
  api.setConsent('granted');expect(document.querySelector('#catalisa-clarity')?.getAttribute('src')).toContain('z40bi9hrk8');expect(document.querySelector('#catalisa-google-tag')).toBeNull();
 });
 it.each(['catalisa.io','www.catalisa.io'])('keeps the existing production Google property and new production Clarity on %s',async host=>{
  const{api}=await boot(host);expect(api.measurementAllowed()).toBe(true);
  expect(document.querySelector('#catalisa-google-tag')?.getAttribute('src')).toContain('G-JYJWH17ZVX');
  expect(document.querySelector('#catalisa-clarity')?.getAttribute('src')).toBe('https://www.clarity.ms/tag/z4073yqv5z');
 });
 it.each(['localhost','127.0.0.1','evil.catalisa.io','site-staging.catalisa.io.example.invalid'])('does not load either vendor on an unapproved host %s',async host=>{
  const{api}=await boot(host);expect(api.measurementAllowed()).toBe(false);expect(document.querySelector('#catalisa-clarity,#catalisa-google-tag')).toBeNull();
 });
 it.each(['/contato','/en/contact','/de/kontakt','/es/contacto','/da/kontakt','/nl/contact','/fr/contact','/lab','/en/lab','/de/lab','/es/lab','/da/lab','/nl/lab','/fr/lab','/api/site/team','/apresentacao/i/private','/en/presentation/i/private','/treinamento/perfil','/unknown-private-screen','/contato?email=private%40example.invalid','/?private_token=secret'])('does not load staging replay or Google on %s',async route=>{
  await boot('site-staging.catalisa.io',route);expect(document.querySelector('#catalisa-clarity,#catalisa-google-tag')).toBeNull();
 });
 it.each(['/contato','/en/contact','/de/kontakt','/es/contacto','/da/kontakt','/nl/contact','/fr/contact','/lab','/en/lab','/de/lab','/es/lab','/da/lab','/nl/lab','/fr/lab'])('keeps production replay out of conversations at %s',async route=>{
  await boot('catalisa.io',route);expect(document.querySelector('#catalisa-clarity')).toBeNull();
 });
 it('navigates by document before a live staging replay can observe a conversation or private query',async()=>{
  const{browser}=await boot('site-staging.catalisa.io');history.pushState(null,'','/fr/contact');
  expect(browser.assign).toHaveBeenCalledWith('https://site-staging.catalisa.io/fr/contact');expect(browser.push).not.toHaveBeenCalled();
  history.replaceState(null,'','/produtos?private_token=secret');expect(browser.assign).toHaveBeenCalledWith('https://site-staging.catalisa.io/produtos?private_token=secret');expect(browser.replace).not.toHaveBeenCalled();
 });
 it('also isolates the first private-to-public staging navigation before replay starts',async()=>{
  const{browser}=await boot('site-staging.catalisa.io','/fr/contact');expect(document.querySelector('#catalisa-clarity')).toBeNull();
  history.pushState(null,'','/fr/produits');expect(browser.assign).toHaveBeenCalledWith('https://site-staging.catalisa.io/fr/produits');expect(browser.push).not.toHaveBeenCalled();expect(document.querySelector('#catalisa-clarity')).toBeNull();
 });
 it('reloads a back/forward boundary before replay initializes over an old conversation DOM',async()=>{
  const{browser}=await boot('site-staging.catalisa.io','/contato');browser.go('/produtos');browser.pop();
  expect(browser.reload).toHaveBeenCalledOnce();expect(document.querySelector('#catalisa-clarity')).toBeNull();
 });
 it('revokes staging replay and clears only its host cookies, preserving production Google cookies',async()=>{
  const{api,browser}=await boot('site-staging.catalisa.io');const clarity=vi.fn();window.clarity=clarity;
  vi.spyOn(document,'cookie','get').mockReturnValue('_clck=stage; _clsk=stage; _ga=production; _ga_STREAM=production');
  const writes=vi.spyOn(document,'cookie','set').mockImplementation(()=>{});api.setConsent('denied');
  expect(clarity).toHaveBeenCalledWith('stop');expect(clarity).toHaveBeenCalledWith('consentv2',{analytics_Storage:'denied',ad_Storage:'denied'});expect(browser.reload).toHaveBeenCalledOnce();expect(api.readConsent()).toBe('denied');
  expect(writes.mock.calls.length).toBe(4);for(const[value]of writes.mock.calls){expect(value).not.toContain('Domain=.catalisa.io');expect(value).not.toMatch(/^_ga/);}
  expect(document.querySelector('#catalisa-google-tag')).toBeNull();
 });
});

describe('private referrer protection',()=>{
 it.each([
  ['site-staging.catalisa.io','/fr/contact'],
  ['site-staging.catalisa.io','/contato?email=private%40example.invalid'],
  ['catalisa.io','/contato?email=private%40example.invalid'],
 ])('does not initialize replay after an own private referrer on %s %s',async(host,referrer)=>{
  vi.spyOn(document,'referrer','get').mockReturnValue('https://'+host+referrer);
  await boot(host,'/produtos');expect(document.querySelector('#catalisa-clarity')).toBeNull();
  if(host==='catalisa.io')expect(document.querySelector('#catalisa-google-tag')).not.toBeNull();
 });
 it('retains replay for a normal external referral',async()=>{
  vi.spyOn(document,'referrer','get').mockReturnValue('https://example.com/');
  await boot('site-staging.catalisa.io','/produtos');expect(document.querySelector('#catalisa-clarity')?.getAttribute('src')).toContain('z40bi9hrk8');
 });
});

describe('safe funnel navigation retains Google measurement',()=>{
 it.each(['/contato','/en/contact','/de/kontakt','/es/contacto','/da/kontakt','/nl/contact','/fr/contact','/lab','/en/lab'])('stops replay but keeps Google enabled for a CTA to %s',async target=>{
  const{api,browser}=await boot('catalisa.io','/produtos');const clarity=vi.fn();window.clarity=clarity;
  const disabled=()=> (window as unknown as Record<string,unknown>)['ga-disable-'+api.measurement.ga4];
  expect(disabled()).toBe(false);history.pushState(null,'',target);
  expect(browser.assign).toHaveBeenCalledWith('https://catalisa.io'+target);expect(browser.push).not.toHaveBeenCalled();expect(clarity).toHaveBeenCalledWith('stop');expect(disabled()).toBe(false);
  // The document click handler runs after Router requests this navigation.
  api.trackSiteEvent('cta_click',{source:'products',cta_type:'product_credit_contact'});
  expect(window.dataLayer?.some(entry=>entry[0]==='event'&&entry[1]==='cta_click'&&(entry[2] as Record<string,unknown>).cta_type==='product_credit_contact')).toBe(true);
 });
 it.each(['/contato?email=private%40example.invalid','/produtos?private_token=secret','/apresentacao/i/private','/unknown-private-screen'])('disables Google before an unsafe navigation to %s',async target=>{
  const{api,browser}=await boot('catalisa.io','/produtos');history.pushState(null,'',target);
  expect(browser.assign).toHaveBeenCalledWith('https://catalisa.io'+target);expect(browser.push).not.toHaveBeenCalled();expect((window as unknown as Record<string,unknown>)['ga-disable-'+api.measurement.ga4]).toBe(true);
 });
});
