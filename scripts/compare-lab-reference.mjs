import{chromium}from'@playwright/test';import fs from'node:fs/promises';import path from'node:path';
const output=path.resolve(process.env.REDESIGN_LAB_COMPARISON_OUTPUT||'docs/redesign-2026-10-22/qa/lab');await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});const results=[];
const selectors=['.l-hero h1','.l-composer-copy h2','#l-prompt','.l-workbench','.l-conversation h2','.l-result-title h3','.l-journey-track','.l-closing h2','#l-result','.l-prototype-note'];
try{for(const width of[320,390,768,1440]){
 const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage();await context.route(/https?:\/\/(?!127\.0\.0\.1|localhost)/,route=>route.abort());const samples={};
 for(const[kind,origin]of[['reference',process.env.REDESIGN_REFERENCE_ORIGIN||'http://127.0.0.1:8176'],['native',process.env.REDESIGN_LAB_ORIGIN||'http://127.0.0.1:5175']]){
  await page.goto(origin+'/lab/');await page.locator('.l-journey-track').waitFor();if(kind==='native')await page.locator('#l-form button:not(:disabled)').waitFor();await page.evaluate(()=>document.fonts.ready);
  samples[kind]=await page.evaluate(selectors=>Object.fromEntries(selectors.map(selector=>{const el=document.querySelector(selector),rect=el.getBoundingClientRect(),style=getComputedStyle(el);return[selector,{width:rect.width,height:rect.height,fontSize:style.fontSize,lineHeight:style.lineHeight,fontWeight:style.fontWeight,text:el.textContent}]})),selectors);
  await page.screenshot({path:path.join(output,`${kind}-reference-comparison-${width}.png`),fullPage:true});
 }
 const deltas=Object.fromEntries(selectors.map(selector=>[selector,{width:Math.round((samples.native[selector].width-samples.reference[selector].width)*100)/100,height:Math.round((samples.native[selector].height-samples.reference[selector].height)*100)/100,fontSizeMatches:samples.native[selector].fontSize===samples.reference[selector].fontSize,lineHeightMatches:samples.native[selector].lineHeight===samples.reference[selector].lineHeight}]));
 results.push({width,samples,deltas});console.log(JSON.stringify({width,deltas}));await context.close();
}}finally{await fs.writeFile(path.join(output,'reference-comparison.json'),JSON.stringify({date:new Date().toISOString(),scope:'Rendered final frozen Lab reference versus native initial state. New identity and truthful integration copy are intentional differences; no visual approval is implied.',results},null,2));await browser.close();}
