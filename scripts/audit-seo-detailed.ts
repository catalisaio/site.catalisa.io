import {installBuildSiteLocales, assertBuildSiteLocaleCoverage} from './site-locales';
/** Whole-artifact crawl, no browser/third-party requests or synthetic scoring. */
import {getBuildPages} from '../src/seo/build-pages';
import fs from'node:fs';import path from'node:path';import{JSDOM}from'jsdom';
const arg=(name:string,fallback:string)=>process.argv.find(x=>x.startsWith('--'+name+'='))?.slice(name.length+3)||fallback;
const dist=path.resolve(arg('dist','dist')),output=path.resolve(arg('output','docs/redesign-2026-10-22/qa/seo-detailed/audit.json'));
const inventory=JSON.parse(fs.readFileSync(path.join(dist,'release-routes.json'),'utf8'));
const sitemap=new JSDOM(fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8'),{contentType:'text/xml'});const publicPaths=new Set([...sitemap.window.document.querySelectorAll('loc')].map(x=>new URL(x.textContent!).pathname));sitemap.window.close();
if(inventory.mode?.redesign)installBuildSiteLocales();
const definitions=new Map(getBuildPages(inventory.mode).map(page=>[page.path,page]));
const paths=[...new Set<string>([...inventory.native,...inventory.compatibility])];const redirects=inventory.redirects as Record<string,string>;
const issues:{severity:'error'|'review';path:string;check:string;value?:string}[]=[],pages:Record<string,unknown>[]=[],links=new Map<string,Set<string>>(),incoming=new Map<string,Set<string>>(),descriptions=new Map<string,string>();
function fileFor(route:string){return path.join(dist,route==='/'?'index.html':route.slice(1)+'/index.html');}
for(const route of paths){
 const doc=new JSDOM(fs.readFileSync(fileFor(route),'utf8'),{url:'https://catalisa.io'+route});const d=doc.window.document;
 const issue=(severity:'error'|'review',check:string,value?:string)=>issues.push({severity,path:route,check,value});
 const description=d.querySelector<HTMLMetaElement>('meta[name="description"]')?.content??'';
 if(descriptions.has(description)&&publicPaths.has(route))issue('review','duplicate_description',descriptions.get(description));descriptions.set(description,route);
 const targets=new Set<string>();links.set(route,targets);let anchors=0,redirectLinks=0,missingAlt=0;
 for(const anchor of d.querySelectorAll<HTMLAnchorElement>('a[href]')){
  const raw=anchor.getAttribute('href')!;if(!raw||/^(?:mailto:|tel:|blob:|javascript:)/.test(raw))continue;
  let url:URL;try{url=new URL(raw,'https://catalisa.io'+route);}catch{issue('error','invalid_link',raw);continue;}
  if(url.origin!=='https://catalisa.io')continue;anchors++;
  const target=url.pathname.replace(/\/+$/,'')||'/';
  if(url.pathname!==target&&target!=='/')redirectLinks++;
  if(redirects[target]){redirectLinks++;targets.add(redirects[target]);continue;}
  if(paths.includes(target)){targets.add(target);if(!incoming.has(target))incoming.set(target,new Set());incoming.get(target)!.add(route);}
  else if(!inventory.authenticatedPrefixes.some((prefix:string)=>target===prefix||target.startsWith(prefix+'/'))&&!fs.existsSync(path.join(dist,decodeURIComponent(url.pathname))))issue('error','missing_internal_link',raw);
  if(url.hash&&target===route){try{if(!d.getElementById(decodeURIComponent(url.hash.slice(1))))issue('error','missing_fragment',raw);}catch{issue('error','invalid_fragment',raw);}}
 }
 for(const image of d.querySelectorAll<HTMLImageElement>('img')){
  if(!image.hasAttribute('alt')){missingAlt++;issue('error','missing_image_alt',image.getAttribute('src')??'');}
  const src=image.getAttribute('src');if(src?.startsWith('/')&&!fs.existsSync(path.join(dist,decodeURIComponent(src.split('?')[0]))))issue('error','missing_image',src);
 }
 for(const element of d.querySelectorAll('[src],video[poster],link[rel="stylesheet"]'))for(const attribute of ['src','poster','href']){
  const source=element.getAttribute(attribute);if(source?.startsWith('/')&&!source.startsWith('//')&&!fs.existsSync(path.join(dist,decodeURIComponent(source.split('?')[0]))))issue('error','missing_local_resource',source);
 }
 const image=d.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content;
 if(image?.startsWith('https://catalisa.io/')&&!fs.existsSync(path.join(dist,new URL(image).pathname)))issue('error','missing_social_image',image);
 const definition=definitions.get(route);
 if(definition&&d.documentElement.lang!==definition.lang)issue('error','incorrect_document_language',d.documentElement.lang);
 const alternates=[...d.querySelectorAll<HTMLLinkElement>('link[hreflang]')];
 if(definition&&publicPaths.has(route)){
  const expected:Record<string,string>=definition.alternates??{[definition.lang]:definition.path,...(definition.alternate?{[definition.lang==='pt-BR'?'en-US':'pt-BR']:definition.alternate}:{}),'x-default':definition.lang==='pt-BR'?definition.path:definition.alternate??definition.path};
  if(alternates.length!==Object.keys(expected).length)issue('error','incorrect_alternate_count',String(alternates.length));
  for(const[language,target]of Object.entries(expected))if(alternates.filter(link=>link.hreflang===language&&link.href==='https://catalisa.io'+target).length!==1)issue('error','incorrect_language_alternate',language+':'+target);
 }
 for(const alternate of alternates){const target=new URL(alternate.href).pathname;if(!publicPaths.has(target)&&publicPaths.has(route))issue('error','alternate_not_public',alternate.href);}
 const headings=[...d.querySelectorAll('main h1,main h2,main h3,main h4,main h5,main h6')].map(node=>({level:Number(node.tagName.slice(1)),text:node.textContent?.trim()}));
 let lastLevel=0;for(const heading of headings){if(lastLevel&&heading.level>lastLevel+1)issue('review','heading_level_skip',heading.text?.slice(0,120));lastLevel=heading.level;}
 const schemas=[...d.querySelectorAll('script[type="application/ld+json"]')].flatMap(node=>{const json=JSON.parse(node.textContent||'{}');return json['@graph']??(Array.isArray(json)?json:[json]);});
 const normalizedText=(value:string)=>value.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().toLocaleLowerCase();const text=normalizedText(d.querySelector('main')?.textContent??'');
 for(const schema of schemas){
  if(['Article','BlogPosting'].includes(schema['@type'])&&!schema.headline)issue('error','article_without_headline');
  if(schema['@type']==='FAQPage')for(const question of schema.mainEntity??[])if(question.name&&!text.includes(normalizedText(question.name)))issue('error','faq_question_not_in_content',question.name);
  if(schema.datePublished&&schema.dateModified&&Date.parse(schema.dateModified)<Date.parse(schema.datePublished))issue('error','modified_before_published');
  if(schema.aggregateRating)issue('review','rating_requires_visible_verified_source');if(schema.offers)issue('review','offer_requires_visible_current_price');
 }
 pages.push({path:route,public:publicPaths.has(route),native:inventory.native.includes(route),title:d.title,titleLength:d.title.length,descriptionLength:description.length,wordCount:(d.querySelector('main')?.textContent?.trim().split(/\s+/)||[]).length,internalLinks:anchors,linksThroughRedirect:redirectLinks,missingAlt,headings:headings.length,schemaTypes:schemas.map(s=>s['@type'])});
 doc.window.close();
}
const reachable=new Set<string>(),queue=['/'];while(queue.length){const next=queue.shift()!;if(reachable.has(next))continue;reachable.add(next);for(const target of links.get(next)??[])if(!reachable.has(target))queue.push(target);}
for(const route of publicPaths)if(!reachable.has(route))issues.push({severity:'review',path:route,check:'not_reachable_from_home'});
const verificationFile='googlebf700a2a05f1612d.html';if(!fs.existsSync(path.join(dist,verificationFile)))issues.push({severity:'error',path:'/'+verificationFile,check:'legacy_search_console_verification_missing'});
const report={checkedAt:new Date().toISOString(),artifact:dist,scope:'Static production candidate, all HTML, internal links/assets/fragments, graph reachability, metadata, schema, hreflang and original Search Console verification. No rankings, Search Console access, field performance or owner editorial approval inferred.',passed:!issues.some(x=>x.severity==='error'),pages:pages.length,publicUrls:publicPaths.size,reachablePublicUrls:[...publicPaths].filter(x=>reachable.has(x)).length,originalSearchConsoleVerificationPreserved:fs.existsSync(path.join(dist,verificationFile)),errors:issues.filter(x=>x.severity==='error'),review:issues.filter(x=>x.severity==='review'),routes:pages};
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:report.passed,pages:report.pages,errors:report.errors.length,review:report.review.length,reachablePublicUrls:report.reachablePublicUrls,output}));if(!report.passed)process.exitCode=1;

if(inventory.mode?.redesign)assertBuildSiteLocaleCoverage();
