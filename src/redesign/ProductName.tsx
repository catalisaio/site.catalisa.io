import{productLabel}from'./i18n/product-label';
/** Translate the entire product name before choosing an editorial line break;
 * translating the old Banking/Platform fragments reverses words in some locales. */
export function ProductName({name}:{name:string}){
 const label=productLabel(name),middle=label.length/2;
 const breaks=[...label.matchAll(/\s+/g)].map(match=>({at:match.index!,width:match[0].length}));
 const split=breaks.sort((a,b)=>Math.abs(a.at-middle)-Math.abs(b.at-middle))[0];
 return split?<>{label.slice(0,split.at)}<br/>{label.slice(split.at+split.width)}</>:<>{label}</>;
}
