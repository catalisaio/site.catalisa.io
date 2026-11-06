import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { verifyTimeline } from './verificar-timeline.mjs';
import { infrastructureCases } from './infrastructure.mjs';
import { verifyDashboard } from './verificar-dashboard.mjs';
import { verifyValueChain } from './verificar-value-chain.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(dir, 'dados.json'), 'utf8'));
const narrative = JSON.parse(fs.readFileSync(path.join(dir, 'narrativa.json'), 'utf8'));
const report = { checkedAt: new Date().toISOString(), checks: [], browser: [], pdfs: [] };
function check(name, assertion) { assertion(); report.checks.push({ name, passed: true }); }
const prIds = new Set(data.prs.map(p => p.id));
const commitIds = new Set(data.commits.map(c => c.id));
const cats = new Set(data.categories.map(c => c.id));
check('PRs únicos e contagem completa', () => { assert.equal(prIds.size, 2978); assert.equal(data.prs.length, 2978); });
check('Estados particionam o inventário', () => { assert.equal(data.prs.filter(p=>p.state==='MERGED').length,2856); assert.equal(data.prs.filter(p=>p.state==='OPEN').length,75); assert.equal(data.prs.filter(p=>p.state==='CLOSED').length,47); });
check('Integração principal não confunde ramo de trabalho',()=>{assert.equal(data.prs.filter(p=>p.integrated).length,2840);assert.equal(data.prs.filter(p=>p.state==='MERGED'&&!p.integrated).length,16);});
check('Commits únicos e integração',()=>{assert.equal(commitIds.size,data.commits.length);assert.equal(data.commits.length,9909);assert.equal(data.commits.filter(c=>c.integrated).length,7502);});
check('110 frentes com fontes existentes',()=>{assert.equal(narrative.stories.length,110);for(const s of narrative.stories){assert(s.refs.length);for(const id of s.refs)assert(prIds.has(id),id);assert(narrative.groups.some(g=>g.id===s.group));}});
check('Nenhum registro sem categoria válida',()=>{for(const r of [...data.prs,...data.commits,...data.docs,...data.modules]){assert(r.categories?.length,r.id);for(const id of r.categories)assert(cats.has(id));}});
check('Documentação atual e histórica',()=>{assert.equal(data.docs.filter(d=>!d.historical).length,1328);assert.equal(data.docs.filter(d=>d.historical).length,285);});
check('Acervo de testes e estrutura',()=>{assert.equal(data.repositories.reduce((n,r)=>n+r.testFiles,0),2710);assert.equal(data.files.length,12859);assert.equal(data.modules.length,159);assert.equal(data.modules.filter(m=>m.repo==='bb').length,42);});
check('Referências de código e docs dos capítulos existem',()=>{const paths=new Set(data.files.map(f=>f.repo+':'+f.path));for(const g of narrative.groups)for(const p of [...g.code,...g.docs])assert(paths.has(p)||[...paths].some(f=>f.startsWith(p+'/')),p);});
check('CRM de hoje representado',()=>{for(const id of ['wpp#2005','wpp#2006','wpp#2007'])assert(data.prs.find(p=>p.id===id)?.integrated);assert.equal(data.prs.find(p=>p.id==='wpp#2008').state,'OPEN');});
const privateNames=/med[\s_-]*fund|\bpine\b|p[aá]ssaro[\s_-]*marr[oó][mn]|yarok|\bfiduc\b|chria|alper|facila|medpay|pega[\s_-]*plant[aã]o|marcelo/iu;
check('Narrativa sem nomes de clientes',()=>{for(const s of narrative.stories)for(const v of [s.title,s.summary,s.value,s.limit,...s.details])assert(!privateNames.test(v),s.id+' '+v);});
check('CSV existe para cada inventário',()=>{for(const n of ['prs','commits','documentos','modulos'])assert(fs.statSync(path.join(dir,n+'.csv')).size>100);});
check('Casos Developy ancorados no mesmo corpus',()=>{assert.equal(infrastructureCases.length,9);for(const item of infrastructureCases)for(const id of item.refs)assert(prIds.has(id),id);assert.equal(data.prs.filter(item=>item.repo==='developy').length,335);assert.equal(data.prs.filter(item=>item.repo==='developy'&&item.integrated).length,328);});
check('Conferência de código Developy usa caminhos e snapshot do corpus',()=>{const evidence=JSON.parse(fs.readFileSync(path.join(dir,'infra-evidencias.json'),'utf8'));assert.equal(evidence.length,11);const paths=new Set(data.files.filter(item=>item.repo==='developy').map(item=>item.path));for(const source of evidence){assert(paths.has(source.path),source.path);assert.equal(source.sha,data.repositories.find(item=>item.key==='developy').sha);assert(source.matches.length);assert.equal(source.sha256.length,64);}for(const item of infrastructureCases)assert(evidence.some(source=>source.case===item.id));});
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors=[]; const requests=[];
  page.on('pageerror',error=>errors.push(String(error)));
  page.on('request',request=>{if(/^https?:/.test(request.url()))requests.push(request.url());});
  for(const name of (process.argv.includes('--dashboard-only') || process.argv.includes('--value-only') ? [] : ['index','relatorio-completo','developy','investidores','entrevistas'])){
    await page.setViewportSize({width:1440,height:1100});
    await page.goto(pathToFileURL(path.join(dir,(name === 'index' ? 'dossie' : name)+'.html')).href,{waitUntil:'load'});
    const text=await page.locator('body').innerText();
    assert(!privateNames.test(text),name+' contém nome de cliente');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false,name+' overflow');
    const broken=await page.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(id=>!document.getElementById(id)));
    assert.deepEqual(broken,[],name+' âncora quebrada');
    assert.equal(await page.locator('body').getAttribute('data-design'),'bauhaus-transitoria-v1');
    assert.equal(await page.locator('.topbar [aria-current="page"]').count(),1);
    const palette=await page.evaluate(()=>({paper:getComputedStyle(document.documentElement).getPropertyValue('--paper').trim(),title:getComputedStyle(document.querySelector('h1')).fontFamily}));
    assert.equal(palette.paper,'#f4f0e8');assert(palette.title.includes('Inter'));
    assert.equal(await page.locator('body').getAttribute('data-identity'),'catalisa-transitoria-2026-10');
    assert(Number(await page.locator('h1').evaluate(node=>getComputedStyle(node).fontWeight))>=700);
    assert.equal(await page.locator('.construction-row').count(),3);
    assert.deepEqual(await page.locator('.construction-bar time').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('datetime'))),data.repositories.map(repo=>repo.firstCommit.slice(0,10)));
    if(name==='relatorio-completo'){assert.equal(await page.locator('.story').count(),110);assert(text.includes('O trabalho de hoje'));}
    if(name==='developy'){
      assert.equal(await page.locator('.infrastructure-case').count(),9);
      assert.equal(await page.locator('.story:not(.infrastructure-case)').count(),14);
      for(const id of infrastructureCases.map(item=>item.id))assert.equal(await page.locator('#'+id).count(),1);
      assert(text.includes('328'));assert(text.includes('335'));assert(text.includes('Proxmox real'));
    }
    if(name==='entrevistas')assert.equal(await page.locator('.story').count(),10);
    if(name!=='index'){
      await page.locator('.reading-index summary').click();
      const first=page.locator('.reading-index a').first();
      const target=await first.getAttribute('href');await first.click();
      assert.equal(new URL(page.url()).hash,target);
      await page.evaluate(()=>{document.querySelector('.reading-index').open=false;window.scrollTo({top:0,behavior:'instant'});});
    }
    await page.screenshot({path:path.join(dir,'preview-'+name+'.png'),fullPage:false});
    const desktop={page:name==='index'?'dossie':name,version:'bauhaus-transitoria-v1',visibleClientNames:false,overflow:false,brokenAnchors:broken,palette,tableOfContents:name!=='index'};
    if(name!=='index'){
      const pdfLabel = { 'relatorio-completo': 'Relatório completo', developy: 'Developy Cloud', investidores: 'Investidores', entrevistas: 'Entrevistas' }[name];
      await page.pdf({
        path:path.join(dir,name+'.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true,
        displayHeaderFooter:true,headerTemplate:'<span></span>',
        footerTemplate:`<div style="width:100%;margin:0 16mm;padding-top:5px;border-top:1px solid #dedae5;font:8px 'Segoe UI',sans-serif;color:#5a5468;display:flex;justify-content:space-between"><span>Catalisa · ${pdfLabel}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
      });
      const pdf=path.join(dir,name+'.pdf');
      const pdfText=execFileSync('pdftotext',[pdf,'-'],{encoding:'utf8'});
      assert(!privateNames.test(pdfText),name+' PDF contém nome de cliente');
      const pages=Number(execFileSync('pdfinfo',[pdf],{encoding:'utf8'}).match(/Pages:\s+(\d+)/)[1]);
      assert.equal(pdfText.split('\f').filter(value=>value.trim()).length,pages);
      const pdfPages=pdfText.split('\f').filter(value=>value.trim());
      for(let i=1;i<pdfPages.length;i++)assert(new RegExp(`\\b${i+1}\\s*/\\s*${pages}\\b`).test(pdfPages[i]),name+' sem número na página '+(i+1));
      if(name==='developy')for(const item of infrastructureCases)assert(pdfText.replace(/\s/g,'').includes(item.id),item.id+' ausente no PDF');
      report.pdfs.push({file:name+'.pdf',bytes:fs.statSync(pdf).size,pages,visibleClientNames:false,pageNumbers:true});
    }
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,name+' mobile overflow');
    if(name!=='index'){
      await page.locator('.reading-index summary').click();
      assert.equal(await page.locator('.reading-index nav').isVisible(),true);
      await page.locator('.reading-index a').last().click();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,name+' mobile deep content overflow');
      await page.evaluate(()=>{document.querySelector('.reading-index').open=false;window.scrollTo({top:0,behavior:'instant'});});
    }
    await page.screenshot({path:path.join(dir,'preview-'+name+'-mobile.png'),fullPage:false});
    if(name==='index')fs.copyFileSync(path.join(dir,'preview-index-mobile.png'),path.join(dir,'preview-mobile.png'));
    report.browser.push({...desktop,mobileOverflow:false,mobileTableOfContents:name!=='index'});
  }
  await page.setViewportSize({width:1440,height:1100});
  if(!process.argv.includes('--value-only')) {
  const dashboard = await verifyDashboard(page, dir, data, narrative, privateNames).catch(error => { if(errors.length)throw new Error(errors.join('\n')); throw error; });
  report.pdfs.push(dashboard.pdf);
  report.browser.push(dashboard);
  }
  if(!process.argv.includes('--dashboard-only')) {
    const valueChain = await verifyValueChain(page, dir, privateNames).catch(error => { if(errors.length)throw new Error(errors.join('\n')); throw error; });
    report.pdfs.push(valueChain.pdf);
    report.browser.push(valueChain);
  }
  if(!process.argv.includes('--dashboard-only') && !process.argv.includes('--value-only')) report.browser.push(await verifyTimeline(page, dir));
  assert.deepEqual(errors,[],'Erros JavaScript');assert.deepEqual(requests,[],'Dependências de rede');
  report.pageErrors=errors;report.externalRequests=requests;report.passed=true;
}finally{await browser.close();fs.writeFileSync(path.join(dir,process.argv.includes('--dashboard-only')?'verificacao-dashboard.json':process.argv.includes('--value-only')?'verificacao-cadeia.json':'verificacao.json'),JSON.stringify(report,null,2));}
process.stdout.write(JSON.stringify(report) + String.fromCharCode(10));
