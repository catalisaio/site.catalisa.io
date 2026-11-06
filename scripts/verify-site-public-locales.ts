/** Read-only actual HTTPS acceptance: no cookies, POSTs, sessions or AI jobs. */
import fs from 'node:fs/promises';
import https from 'node:https';
import dns from 'node:dns/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {JSDOM} from 'jsdom';
import type {LookupFunction} from 'node:net';
import type {TLSSocket} from 'node:tls';
import {enabledSiteLocales} from '../shared/site-locale';
import {localizeSitePath} from '../src/redesign/i18n/routes';
import {getBuildPages} from '../src/seo/build-pages';
import type {BuildPage} from '../src/seo/build-pages';
import {getRedesignPage,getRedesignGraph} from '../src/seo/redesign';
import {BASE_URL} from '../src/seo/routes';
import {installBuildSiteLocales,assertBuildSiteLocaleCoverage,expectedPublicSnapshotHeading} from './site-locales';
import {publicSnapshotIssue} from './public-snapshot-contract.mjs';

const argument = (name:string) => process.argv.find(value=>value.startsWith('--'+name+'='))?.slice(name.length+3);
const target = argument('target');
if(target!=='staging'&&target!=='production')throw Error('Use --target=staging|production');
const expectedRelease = argument('release');
if(!expectedRelease||!/^[a-zA-Z0-9._-]+$/.test(expectedRelease))throw Error('Use --release=the-exact-release-ID');
const dist = argument('dist') ? resolve(argument('dist')!) : undefined;
const origin = target==='staging'?'https://site-staging.catalisa.io':BASE_URL;
const stagingHost='site-staging.catalisa.io',stagingEdge='177.104.184.38';
const output=resolve(argument('output')??`docs/redesign-2026-10-22/qa/release/public-locales-${target}.json`);
const accessHeaders:Record<string,string>={};
if(target==='staging'){
  const access=JSON.parse(await fs.readFile(argument('credentials-file')??'.local/site/staging-https/access.json','utf8'));
  assert.equal(access.url,origin);
  if(access.basicAuth!==false){assert.ok(access.username&&access.password,'Staging access is incomplete');accessHeaders.Authorization='Basic '+Buffer.from(access.username+':'+access.password).toString('base64');}
}
installBuildSiteLocales();
assert.deepEqual([...enabledSiteLocales].sort(),['pt-BR','en-US','de-DE','es-ES','da-DK','nl-NL','fr-FR'].sort(),'Exactly the seven authorized site languages must be enabled');
const inventory=getBuildPages({redesign:true,indexing:true});
const bases=['/','/produtos','/contato','/lab','/ecossistema/banking','/ecossistema/credit','/politica-privacidade'];
type Response={status:number;headers:Record<string,string|string[]|undefined>;body:Buffer;tls:{authorized:boolean;protocol:string|null;validTo?:string};durationMs:number};
const sha=(value:Buffer|string)=>createHash('sha256').update(value).digest('hex');
const stagingLookup:LookupFunction=(_name,options,callback)=>callback(null,options.all?[{address:stagingEdge,family:4}]:stagingEdge,4);
function request(url:URL):Promise<Response>{return new Promise((done,reject)=>{
  assert.equal(url.protocol,'https:');
  assert.ok([stagingHost,'catalisa.io','www.catalisa.io'].includes(url.hostname),'Only the dedicated public/staging hosts may be read');
  const started=Date.now();
  const req=https.request(url,{method:'GET',rejectUnauthorized:true,servername:url.hostname,timeout:20000,
    ...(target==='staging'&&url.hostname===stagingHost?{lookup:stagingLookup}:{}),
    headers:{Accept:'text/html,application/json,application/xml,text/plain','Accept-Encoding':'identity','User-Agent':'Catalisa-Public-Locales-ReadOnly/1',...(url.hostname===stagingHost?accessHeaders:{})},
  },response=>{
    const chunks:Buffer[]=[];let size=0;
    const socket=response.socket as TLSSocket;
    const tls={authorized:socket.authorized,protocol:socket.getProtocol(),validTo:socket.getPeerCertificate().valid_to};
    response.on('data',(chunk:Buffer)=>{size+=chunk.length;if(size>8_000_000){req.destroy(Error('Response exceeds the audit limit'));return;}chunks.push(chunk);});
    response.on('end',()=>done({status:response.statusCode??0,headers:response.headers,body:Buffer.concat(chunks),tls,durationMs:Date.now()-started}));
    response.on('error',reject);
  });req.on('timeout',()=>req.destroy(Error('Trusted HTTPS request timed out')));req.on('error',reject);req.end();
});}
function checkRelease(response:Response){assert.equal(response.tls.authorized,true,'TLS must validate normally');assert.equal(response.headers['x-catalisa-site-release'],expectedRelease,'Unexpected deployed release');}
function expectedAlternates(page:BuildPage):Record<string,string>{return page.alternates??{[page.lang]:page.path,...(page.alternate?{[page.lang==='pt-BR'?'en-US':'pt-BR']:page.alternate}:{}),'x-default':page.lang==='pt-BR'?page.path:page.alternate??page.path};}
const report:{[key:string]:unknown;passed:boolean;errors:{check:string;error:string}[];languages:unknown[];routes:unknown[]}={
  checkedAt:new Date().toISOString(),target,origin,expectedRelease,candidate:dist??null,passed:false,
  scope:'Actual trusted HTTPS GET-only checks. Production uses normal DNS; staging alone uses the documented dedicated edge lookup. Checks public HTML, exact optional candidate bytes, metadata/JSON-LD/alternates, all sitemap URLs, robots, WWW redirect and anonymous session401. No AI, browser, session creation, authentication, outbound messages or deployment.',
  requestPolicy:{methods:['GET'],cookiesSent:false,aiCalls:0,mutatingRequests:0,stagingEdgeMapping:target==='staging'?{hostname:stagingHost,address:stagingEdge}:null},
  languages:[],routes:[],errors:[],
};
async function checked(name:string,run:()=>Promise<void>){try{await run();}catch(error){report.errors.push({check:name,error:String(error)});}}
try{
  const dnsResults=[];
  for(const hostname of ['catalisa.io','www.catalisa.io',...(target==='staging'?[stagingHost]:[])]){
    try{dnsResults.push({hostname,addresses:await dns.lookup(hostname,{all:true})});}catch(error){dnsResults.push({hostname,error:String(error)});if(target==='production')report.errors.push({check:'dns:'+hostname,error:String(error)});}
  }
  report.dns=dnsResults;
  if(target==='production')await checked('www-canonical-redirect',async()=>{
    const www=await request(new URL('https://www.catalisa.io/?public_locales_check=1'));
    assert.equal(www.tls.authorized,true);assert.ok([301,308].includes(www.status),'WWW must permanently redirect');
    const location=new URL(String(www.headers.location),'https://www.catalisa.io');assert.equal(location.origin,BASE_URL);assert.equal(location.pathname,'/');assert.equal(location.search,'?public_locales_check=1');
    report.www={status:www.status,location:location.href,tls:www.tls};
  });
  // All seven Home statuses are collected first, before secondary page checks.
  for(const basePath of bases)for(const locale of enabledSiteLocales){
    const route=localizeSitePath(basePath,locale);
    const summary:{[key:string]:unknown}={locale,path:route,status:null,passed:false};
    report.routes.push(summary);if(basePath==='/')report.languages.push(summary);
    await checked(route,async()=>{
      const response=await request(new URL(origin+route));
      Object.assign(summary,{status:response.status,release:response.headers['x-catalisa-site-release'],durationMs:response.durationMs});
      assert.equal(response.status,200);checkRelease(response);assert.match(String(response.headers['content-type']),/text\/html/i);
      const headerNoindex=/noindex/i.test(String(response.headers['x-robots-tag']??''));assert.equal(headerNoindex,target==='staging','Edge indexing header mismatch');
      if(target==='staging')assert.equal(response.headers['cache-control'],'no-store');
      const html=response.body.toString('utf8'),dom=new JSDOM(html,{url:BASE_URL+route}),doc=dom.window.document;
      try{
        const definition=inventory.find(page=>page.path===route),page=getRedesignPage(route);assert.ok(definition&&page);
        assert.equal(doc.documentElement.lang,locale);assert.equal(doc.title,page.title);assert.equal(doc.querySelectorAll('main h1').length,1);
        assert.ok(doc.querySelector('main h1')?.textContent?.trim());assert.equal(doc.querySelectorAll('link[rel="canonical"]').length,1);assert.equal(doc.querySelector('link[rel="canonical"]')?.getAttribute('href'),BASE_URL+route);
        const robots=doc.querySelector('meta[name="robots"]')?.getAttribute('content')??'';assert.ok(robots);assert.equal(/noindex/i.test(robots),false,'The reviewed production artifact must remain indexable in HTML');
        const alternates=[...doc.querySelectorAll('link[rel="alternate"][hreflang]')],expected=expectedAlternates(definition);assert.equal(alternates.length,Object.keys(expected).length);assert.equal(alternates.length,8);
        for(const[language,path]of Object.entries(expected))assert.equal(alternates.filter(node=>node.getAttribute('hreflang')===language&&node.getAttribute('href')===BASE_URL+path).length,1,'Wrong alternate '+language);
        const nodes=[...doc.querySelectorAll('script[type="application/ld+json"]')].flatMap(script=>{const value=JSON.parse(script.textContent??'{}');return value['@graph']??(Array.isArray(value)?value:[value]);});
        for(const expectedNode of getRedesignGraph(page)['@graph']){
          const actual=nodes.find(node=>node['@id']===expectedNode['@id']);assert.ok(actual,'Missing JSON-LD entity');
          for(const key of ['url','inLanguage','primaryImageOfPage','mainEntityOfPage'])if(expectedNode[key]!==undefined)assert.deepEqual(actual[key],expectedNode[key],'Wrong JSON-LD '+key);
          if(expectedNode['@type']==='BreadcrumbList')assert.deepEqual(actual.itemListElement.map((item:{item:string})=>item.item),(expectedNode.itemListElement as {item:string}[]).map(item=>item.item));
        }
        if(basePath==='/contato'||basePath==='/lab'){
          const form=doc.querySelector(basePath==='/contato'?'.c-contact':'.c-lab'),control=doc.querySelector(basePath==='/contato'?'#z-input':'#l-prompt');
          assert.equal(publicSnapshotIssue({path:basePath,expectedHeading:expectedPublicSnapshotHeading(basePath,locale),h1:doc.querySelector('main h1')?.textContent??'',busy:!!form?.querySelector('[aria-busy="true"]'),controlReady:!!control&&!control.hasAttribute('disabled'),errors:[...(form?.querySelectorAll('.z-error,.l-error,.l-global-error')??[])].map(node=>node.textContent?.trim()).filter(Boolean)}),undefined);
        }
        summary.lang=doc.documentElement.lang;summary.title=doc.title;summary.alternates=alternates.length;summary.headerNoindex=headerNoindex;summary.htmlSha256=sha(response.body);summary.tls=response.tls;
        if(dist){const expectedFile=resolve(dist,route==='/'?'index.html':route.slice(1)+'/index.html');assert.equal(sha(response.body),sha(await fs.readFile(expectedFile)),'Public HTML differs from candidate');summary.candidateBytesIdentical=true;}
        summary.passed=true;
      }finally{dom.window.close();}
    });
  }
  await checked('robots',async()=>{
    const response=await request(new URL(origin+'/robots.txt'));assert.equal(response.status,200);checkRelease(response);const text=response.body.toString('utf8');
    const blocksAll=/^Disallow:\s*\/\s*$/mi.test(text);assert.equal(blocksAll,target==='staging');if(target==='production'){assert.match(text,/^Allow:\s*\/\s*$/mi);assert.match(text,/Sitemap:\s*https:\/\/catalisa\.io\/sitemap\.xml/);}
    report.robots={status:response.status,blocksAll,sha256:sha(response.body)};
  });
  await checked('sitemap',async()=>{
    const response=await request(new URL(origin+'/sitemap.xml'));assert.equal(response.status,200);checkRelease(response);
    const dom=new JSDOM(response.body.toString('utf8'),{contentType:'text/xml'});try{
      const urls=[...dom.window.document.querySelectorAll('url')],expected=inventory.filter(page=>!page.noIndex);assert.equal(urls.length,expected.length);
      const locations=urls.map(node=>node.querySelector('loc')?.textContent);assert.equal(new Set(locations).size,locations.length);assert.deepEqual([...locations].sort(),expected.map(page=>BASE_URL+page.path).sort());
      for(const page of expected){const node=urls.find(node=>node.querySelector('loc')?.textContent===BASE_URL+page.path)!;const alternates=[...node.querySelectorAll('[hreflang]')],links=expectedAlternates(page);assert.equal(alternates.length,Object.keys(links).length);for(const[language,path]of Object.entries(links))assert.equal(alternates.filter(link=>link.getAttribute('hreflang')===language&&link.getAttribute('href')===BASE_URL+path).length,1);}
      report.sitemap={status:response.status,publicUrls:urls.length,exactInventory:true,reciprocalExpectedAlternates:true,sha256:sha(response.body)};
    }finally{dom.window.close();}
  });
  await checked('anonymous-session',async()=>{
    const response=await request(new URL(origin+'/api/site/session'));assert.equal(response.status,401);checkRelease(response);assert.match(String(response.headers['content-type']),/application\/json/i);assert.equal(JSON.parse(response.body.toString('utf8')).code,'session_required');assert.equal(response.headers['set-cookie'],undefined);report.anonymousSession={status:401,json:true,noCookieIssued:true};
  });
  await checked('design-system-noindex',async()=>{
    const checks=[];
    for(const locale of enabledSiteLocales){
      const route=localizeSitePath('/design-system',locale),response=await request(new URL(origin+route));assert.equal(response.status,200);checkRelease(response);assert.match(String(response.headers['x-robots-tag']),/noindex/i);
      const dom=new JSDOM(response.body.toString('utf8'));try{assert.match(dom.window.document.querySelector('meta[name="robots"]')?.getAttribute('content')??'',/noindex/i);assert.equal(dom.window.document.documentElement.lang,locale);}finally{dom.window.close();}
      checks.push({locale,path:route,status:200,noindex:true});
    }
    report.designSystem=checks;
  });
  assertBuildSiteLocaleCoverage();report.passed=report.errors.length===0;
}catch(error){report.errors.push({check:'audit-fatal',error:String(error)});report.passed=false;
}finally{
  await fs.mkdir(resolve(output,'..'),{recursive:true});await fs.writeFile(output,JSON.stringify(report,null,2)+'\n');
  console.info(JSON.stringify({passed:report.passed,target,release:expectedRelease,languages:report.languages.length,routes:report.routes.length,errors:report.errors,output}));
}
if(!report.passed)process.exitCode=1;
