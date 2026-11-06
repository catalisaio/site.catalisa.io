/** Guarded editorial merge for the five reviewed launch dictionaries. No source-copy mutation. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const base='docs/redesign-2026-10-22/qa/localization';
const argument=(name,fallback)=>process.argv.find(arg=>arg.startsWith('--'+name+'='))?.slice(name.length+3)??fallback;
const locales=argument('locales','en-US,de-DE,es-ES,da-DK,nl-NL').split(',');
const digest=value=>createHash('sha256').update(value).digest('hex');
const entries=[];
for(const file of ['source-catalog.json',...(await fs.readdir(base)).filter(file=>/^source(?:-[a-z]+)*-additions\.json$/.test(file)).sort()])entries.push(...JSON.parse(await fs.readFile(path.join(base,file),'utf8')).messages);
const sources=[...new Set(entries.map(entry=>entry.source))];
const protectedNames=JSON.parse(await fs.readFile('src/redesign/i18n/technical-terms.json','utf8')).filter(term=>/[A-Z]/.test(term)&&!['Banking','Credit','Platform','Inter'].includes(term));
const capture=(text,pattern)=>[...text.matchAll(pattern)].map(match=>match[0]).sort();
const placeholders=text=>capture(text,/\{[a-zA-Z_]\w*\}/g);
const urls=text=>capture(text,/https?:\/\/[^\s"'<>]+/g).map(value=>value.replace(/[.,;:)]*$/,'')).sort();
const emails=text=>capture(text,/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g);
const inlineCode=text=>capture(text,/`[^`]+`/g);
const digits=text=>capture(text,/\d+/g);
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const styles={'en-US':'you','de-DE':'Sie','es-ES':'tú','da-DK':'du','nl-NL':'je','fr-FR':'vous'};
const glossary={'en-US':['capability','capabilities'],'de-DE':['Fähigkeit','Fähigkeiten'],'es-ES':['capacidad','capacidades'],'da-DK':['kapabilitet','kapabiliteter'],'nl-NL':['functionaliteit','functionaliteiten'],'fr-FR':['capacité','capacités']};
const substitutions={
 'en-US':[],
 'fr-FR':[],
 'es-ES':[],
 'de-DE':[['Capabilities','Fähigkeiten'],['Capability','Fähigkeit'],['Funktionen','Fähigkeiten'],['Funktion','Fähigkeit']],
 'da-DK':[['funktionerne','kapabiliteterne'],['funktioner','kapabiliteter'],['funktionen','kapabiliteten'],['funktion','kapabilitet'],['capabilities','kapabiliteter'],['capability','kapabilitet']],
 'nl-NL':[['capaciteiten','functionaliteiten'],['capaciteit','functionaliteit'],['capabilities','functionaliteiten'],['capability','functionaliteit'],['mogelijkheden','functionaliteiten'],['mogelijkheid','functionaliteit']],
};
function keepCase(original,replacement){return original===original.toLocaleUpperCase()?replacement.toLocaleUpperCase():original[0]===original[0].toLocaleUpperCase()?replacement[0].toLocaleUpperCase()+replacement.slice(1):replacement;}
function normalizeCapability(source,text,locale){
 // Preserve actual capacity/throughput measures and separate function concepts.
 if(!/capacidad[eo]s?/i.test(source)||/fun[cç][aãõo]|funcionalidad|vaz[aã]o|mem[oó]ria|armazenamento|simult[aâ]n|\bGB\b|\bMB\b/i.test(source)||/```|`|https?:\/\//.test(source))return text;
 for(const[from,to]of substitutions[locale])text=text.replace(new RegExp('(?<![\\p{L}\\p{N}_])'+from+'(?![\\p{L}\\p{N}_])','giu'),match=>keepCase(match,to));
 return text;
}
const material=/erro|incorret|gram[aá]tic|concord[aâ]ncia|omiti|falta(?:va|m|r|ou)?|falso|cognato|sentido|significa|nega[cç][aã]o|ambig|portugu[eê]s|n[aã]o traduz|nome gen[eé]rico|produto|bloqueio|reserva|saldo|captura|fato|refer[eê]ncia|pontua[cç][aã]o|ortograf|espa[cç]o|acento|fragmento|literal|decalque|coloca[cç][aã]o|idiom[aá]tic|infinitivo|verbo|artigo|preposi[cç][aã]o|interpreta|traduzid[oa] (?:errad|como)|tradu[cç][aã]o (?:errada|incorreta)|mudava|alterava/i;
const register=/tratamento|tuteo|t[uú]teo|\btú\b|\busted\b|\bustedes\b|\bje\/|\bje'|\bje"|\bu\/|\bu'|\bu"|informal|formal|pronom|tom (?:do|de)|registro|registo/i;
const styleOnly=/consist[eê]ncia|terminolog|padroniza|uniform|padr[aã]o|mais natural|soa|prefer[ií]|estil|pontua[cç][aã]o uniforme/i;
const reports=[];
const supplement=JSON.parse(await fs.readFile(argument('supplement',path.join(base,'editorial-manual-seo-supplement.json')),'utf8'));
for(const locale of locales){
 const file='src/redesign/i18n/locales/'+locale+'.json',raw=await fs.readFile(file,'utf8'),dictionary=JSON.parse(raw),messages=dictionary.messages;
 const review=JSON.parse(await fs.readFile(path.join(base,'editorial-review-'+locale+'.json'),'utf8'));
 const patch=JSON.parse(await fs.readFile(path.join(base,'editorial-patch-'+locale+'.json'),'utf8'));
 const manual=Object.entries(supplement.locales[locale]);
 if(!review.complete||review.reviewed+manual.length!==sources.length||review.available!==review.reviewed)throw Error('Full current editorial coverage required: '+locale);
 for(const[source,text]of manual){if(!sources.includes(source)||!equal(placeholders(source),placeholders(text))||!equal(urls(source),urls(text)))throw Error('Invalid manual supplement');if(messages[source]!==undefined&&messages[source]!==text)throw Error('Manual supplement conflicts with current value: '+locale);messages[source]=text;}
 const decisions=[],normalized=[];
 for(const correction of patch.corrections){
  const {source,previous,reason}=correction;let text=normalizeCapability(source,correction.text,locale),outcome='applied-material',why='Grammar/meaning/product-label correction';
  if(source==='Pode movimentar'){outcome='skipped-manual';why='Preserve owner-reviewed available-balance label';}
  else if(messages[source]===text){outcome='already-current';why='Current value already equals the proposal';}
  else if(messages[source]!==previous){outcome='skipped-conflict';why='Current dictionary changed since the reviewed snapshot';}
  else if(!equal(placeholders(source),placeholders(text))||!equal(urls(source),urls(text))||!equal(emails(source),emails(text))||!equal(inlineCode(source),inlineCode(text))||!equal(digits(source),digits(text))){outcome='skipped-structure';why='Protected placeholder, URL, email, numeric fact or inline-code mismatch';}
  else if(protectedNames.some(name=>source.includes(name)&&previous.includes(name)&&!text.includes(name))){outcome='skipped-identifier';why='Proposal removed an existing protected technical or company name';}
  else if(register.test(reason)){outcome='skipped-register';why='Batch-level register normalization is not a material correction; fixed style is '+styles[locale];}
  else if(styleOnly.test(reason)&&!material.test(reason)){outcome='skipped-style';why='Subjective synonym/terminology preference; no demonstrated grammar or meaning defect';}
  else if(!material.test(reason)){outcome='skipped-unsubstantiated';why='No clear material grammar/meaning correction in the reason';}
  if(outcome==='applied-material')messages[source]=text;
  decisions.push({source,previous,proposed:correction.text,result:text,outcome,why,reviewReason:reason});
 }
 // Apply one explicit, narrow architecture glossary rather than contradictory
 // model preferences from independently reviewed batches. Never touch keys.
 for(const source of sources){
  const previous=messages[source],text=normalizeCapability(source,previous,locale);
  if(text!==previous){messages[source]=text;normalized.push({source,previous,text});}
 }
 const missing=sources.filter(source=>typeof messages[source]!=='string'||!messages[source].trim());
 if(missing.length)throw Error('Missing translations after merge: '+locale);
 await fs.writeFile(file,JSON.stringify(dictionary,null,2)+'\n');
 const after=await fs.readFile(file,'utf8'),counts={};for(const decision of decisions)counts[decision.outcome]=(counts[decision.outcome]??0)+1;
 const report={locale,date:new Date().toISOString(),sourceCount:sources.length,translated:sources.length,reviewed:review.reviewed+manual.length,independentCliReviewed:review.reviewed,manualSeoSupplementReviewed:manual.length,manualSupplement:'editorial-manual-seo-supplement.json',deltaReviewedBeyondOriginal4031:review.reviewed+manual.length-4031,coverageComplete:true,reviewMethod:review.method,style:styles[locale],capabilityGlossary:glossary[locale],manualBalanceLabelPreserved:true,beforeSha256:digest(raw),afterSha256:digest(after),counts,glossaryNormalizations:normalized.length,decisions,normalized,limitations:['Automatic independent pair review, not native human or legal approval.','Pure style/register and unsupported synonym changes are retained as skipped proposals.','Rendering, translated composition fragments and generated AI output require their separate browser/integration checks.']};
 await fs.writeFile(path.join(base,'editorial-merge-'+locale+'.json'),JSON.stringify(report,null,2)+'\n');
 reports.push({locale,sourceCount:sources.length,translated:sources.length,reviewed:report.reviewed,independentCliReviewed:review.reviewed,manualSeoSupplementReviewed:manual.length,deltaReviewed:report.deltaReviewedBeyondOriginal4031,counts,glossaryNormalizations:normalized.length,dictionarySha256:report.afterSha256});
 console.log(JSON.stringify(reports.at(-1)));
}
await fs.writeFile(path.join(base,locales.length===1?'editorial-merge-'+locales[0]+'-consolidated.json':'editorial-merge-consolidated.json'),JSON.stringify({date:new Date().toISOString(),scope:'Five non-French dictionaries only; guarded editorial patches and architecture capability glossary. No original Portuguese source or application code changed.',complete:true,sourceCount:sources.length,locales:reports},null,2)+'\n');
