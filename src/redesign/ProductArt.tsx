import {useId} from 'react';

/** Brand illustrations, not product interfaces or evidence of a deployed flow. */
export function ProductArt({product}:{product:string}){
  const id=useId().replace(/:/g,'');
  if(product==='banking'||product==='credit')return <img className="p-product-image" src={product==='banking'?'/redesign/financial-city.webp':'/redesign/media-v2/architecture-composition.webp'} alt="" width={product==='banking'?1536:1254} height={product==='banking'?1024:1254} loading="lazy" decoding="async"/>;
  if(product==='recrutamento')return <div className="p-people-art"><img src="/redesign/media-v3/editorial-executive.jpg" alt="" width={1280} height={720} loading="lazy" decoding="async"/><span className="p-people-disc"/><span className="p-people-frame"/></div>;
  return <svg viewBox="0 0 600 400" aria-hidden="true" className={`p-product-art p-product-art--${product}`}>
    <defs>
      <linearGradient id={`${id}-purple`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b19acb"/><stop offset="1" stopColor="#66408d"/></linearGradient>
      <linearGradient id={`${id}-orange`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffbb73"/><stop offset="1" stopColor="#ed7836"/></linearGradient>
      <filter id={`${id}-shadow`} x="-50%" y="-50%" width="200%" height="220%"><feDropShadow dx="12" dy="22" stdDeviation="12" floodColor="#38203e" floodOpacity=".18"/></filter>
      <pattern id={`${id}-grid`} width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="currentColor" opacity=".17"/></pattern>
    </defs>
    <rect width="600" height="400" fill={`url(#${id}-grid)`}/>
    <g className="p-art-orbit" fill="none" stroke="currentColor" opacity=".25"><ellipse cx="300" cy="213" rx="215" ry="123" transform="rotate(-18 300 213)"/><path d="M80 310L502 110M125 76L490 330" strokeDasharray="3 9"/></g>
    {product==='med'&&<g filter={`url(#${id}-shadow)`} className="p-art-object"><path d="M225 75h104v87h87v104h-87v87H225v-87h-87V162h87z" fill="#835ba2"/><path d="M225 75l24-14h104l-24 14zm191 87l24-14v104l-24 14zm-87 191l24-14v-87l-24 14z" fill="#5b3678"/><circle cx="400" cy="104" r="45" fill={`url(#${id}-orange)`}/><circle cx="147" cy="314" r="15" fill="#fdc234"/></g>}
    {product==='juridico'&&<g filter={`url(#${id}-shadow)`} className="p-art-object"><path d="M181 325V166a119 119 0 0 1 238 0v159h-68V166a51 51 0 0 0-102 0v159z" fill={`url(#${id}-purple)`}/><path d="M181 325h68l24-14h-68zm170 0h68l24-14h-68zm68 0V166a119 119 0 0 0-62-104c55 23 86 57 86 104v145z" fill="#53346e"/><rect x="279" y="157" width="43" height="169" rx="21" fill={`url(#${id}-orange)`}/><circle cx="300" cy="111" r="19" fill="#fdc234"/><path d="M147 330h310" stroke="#e9dff1" strokeWidth="2"/></g>}
    {product==='biometrics'&&<g className="p-art-object"><rect x="168" y="61" width="264" height="284" rx="128" fill={`url(#${id}-purple)`} filter={`url(#${id}-shadow)`}/><g fill="none" stroke="#f4edfa" strokeWidth="3"><path d="M228 155q21-17 42 0m61 0q21-17 42 0M300 158l-15 64h31m-48 35q32 22 64 0"/><path d="M151 136V74h62m174 0h62v62m0 139v62h-62m-174 0h-62v-62" stroke="#e88843" strokeWidth="7"/><path d="M188 212h225" stroke="#fdc234"/></g><circle cx="446" cy="212" r="11" fill="#fdc234"/></g>}
    {product==='decision'&&<g className="p-art-object"><g fill="none" stroke="#9d7cb6" strokeWidth="3"><path d="M140 200h139m0 0V100h148M279 200h148M279 200v100h148"/><path className="p-art-path" d="M140 200h139V100h148" stroke="#fb994b" strokeWidth="7"/></g><g filter={`url(#${id}-shadow)`}><rect x="86" y="146" width="108" height="108" rx="8" fill={`url(#${id}-purple)`} transform="rotate(-12 140 200)"/><circle cx="436" cy="100" r="44" fill={`url(#${id}-orange)`}/><circle cx="436" cy="200" r="31" fill="#b99dce"/><circle cx="436" cy="300" r="31" fill="#b99dce"/></g><path d="M417 100l13 13 23-26" fill="none" stroke="#36213f" strokeWidth="5"/><circle cx="279" cy="200" r="10" fill="#fdc234"/></g>}
  </svg>;
}
