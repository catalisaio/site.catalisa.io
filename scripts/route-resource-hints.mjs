/** Hints for the approved native composition; no pixels, JavaScript or legacy pages are changed. */
export function withRouteResourceHints(html, pathname) {
  if(!['/','/design-system/home'].includes(pathname.replace(/\/+$/,'')||'/'))return html;
  const hero=html.match(/<img\b[^>]*class="[^"]*\bhero-sculpture\b[^"]*"[^>]*>/i)?.[0];
  const attribute=(tag,name)=>tag.match(new RegExp('\\b'+name+'="([^"]*)"','i'))?.[1];
  const src=hero&&attribute(hero,'src');
  if(!src||!src.startsWith('/redesign/'))throw Error('Native Home LCP image must have a local source before generating its preload');
  const clean=html.replace(/<link\b[^>]*>/gi,tag=>attribute(tag,'rel')==='preload'&&attribute(tag,'as')==='image'&&attribute(tag,'href')===src?'':tag);
  const srcset=attribute(hero,'srcset'),sizes=attribute(hero,'sizes');
  const hint=`<link rel="preload" as="image" href="${src}" fetchpriority="high" data-site-route-hint="home-hero"${srcset?` imagesrcset="${srcset}"`:''}${sizes?` imagesizes="${sizes}"`:''}>`;
  return clean.replace(/<head(?:\s[^>]*)?>/i,head=>head+hint);
}
