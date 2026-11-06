import fs from'node:fs/promises';import path from'node:path';import{createHash}from'node:crypto';
import{parse}from'@babel/parser';import{analyzeSource,applySourceEdits,preserveTechnicalNames}from'./localize-source.mjs';
import traverseModule from'@babel/traverse';
const traverse=traverseModule.default??traverseModule;
function stableNode(value){if(Array.isArray(value))return value.map(stableNode);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([key])=>!['start','end','loc','extra','leadingComments','trailingComments','innerComments'].includes(key)).map(([key,entry])=>[key,stableNode(entry)]));return value;}
function preservedSyntax(source){
 const ast=parse(source,{sourceType:'module',plugins:['typescript','jsx']}),values=[];
 traverse(ast,{
  JSXAttribute(nodePath){const name=nodePath.node.name.name;if(['className','id','href','to','src','type','role','key','d','viewBox','aria-controls','aria-labelledby','aria-describedby'].includes(name)||name?.startsWith('data-'))values.push(['attribute',stableNode(nodePath.node)]);},
  JSXSpreadAttribute(nodePath){values.push(['spread',stableNode(nodePath.node)]);},
  BinaryExpression(nodePath){if(['===','!==','==','!=','in'].includes(nodePath.node.operator))values.push(['comparison',stableNode(nodePath.node)]);},
  ImportDeclaration(nodePath){if(!nodePath.node.source.value.endsWith('/i18n/runtime'))values.push(['import',stableNode(nodePath.node)]);},
  JSXElement(nodePath){const name=nodePath.node.openingElement.name;if(name.type==='JSXIdentifier'&&['pre','code'].includes(name.name))values.push(['code-example',stableNode(nodePath.node)]);},
 });return JSON.stringify(values);
}

const apply=process.argv.includes('--apply');const preview=process.argv.find(x=>x.startsWith('--preview-dir='))?.slice(14);
const root=path.resolve('src/redesign'),files=(await fs.readdir(root)).filter(file=>/\.(tsx?|jsx?)$/.test(file)&&!file.includes('.test.')&&file!=='preview.ts').map(file=>path.join(root,file));
if(process.argv.includes('--include-consent'))files.push(path.resolve('src/analytics/AnalyticsConsent.tsx'));
const catalog=JSON.parse(await fs.readFile(path.join(root,'data/catalog.json'),'utf8'));preserveTechnicalNames([...catalog.blocks.flatMap(block=>[block.name,block.slug]),...catalog.products.flatMap(product=>[product.name,product.slug])]);
const report={generatedAt:new Date().toISOString(),applied:apply,scope:'Literal JSX, UI attributes, templates and user-facing status/error messages only. Existing files remain untouched without --apply. No JSON import rewriting, dynamic user content, classes, IDs, route/API values, enums, code/pre examples or product-name translation.',files:[],review:[]},prepared=[];
for(const file of files){
 const source=await fs.readFile(file,'utf8'),relative=path.relative(process.cwd(),file),analysis=analyzeSource(source,relative);
 const runtime=path.relative(path.dirname(file),path.resolve('src/redesign/i18n/runtime')).split(path.sep).join('/'),importPath=runtime.startsWith('.')?runtime:'./'+runtime;
 const output=applySourceEdits(source,analysis.edits,importPath);
 parse(output,{sourceType:'module',plugins:['typescript','jsx']});
 if(preservedSyntax(source)!==preservedSyntax(output))throw Error('Preserved attributes, comparisons, imports or code examples changed: '+relative);
 prepared.push({file,relative,source,output});
 report.files.push({file:relative,changed:output!==source,edits:analysis.edits.length,syntaxVerified:true,preservationVerified:true,beforeSha256:createHash('sha256').update(source).digest('hex'),afterSha256:createHash('sha256').update(output).digest('hex')});report.review.push(...analysis.review);
}
for(const item of prepared){if(preview&&item.output!==item.source){const destination=path.resolve(preview,item.relative);await fs.mkdir(path.dirname(destination),{recursive:true});await fs.writeFile(destination,item.output);}if(apply&&item.output!==item.source){if(await fs.readFile(item.file,'utf8')!==item.source)throw Error('Source changed during codemod; stopped: '+item.relative);await fs.writeFile(item.file,item.output);}}
const destination='docs/redesign-2026-10-22/qa/localization/codemod-report.json';await fs.mkdir(path.dirname(destination),{recursive:true});await fs.writeFile(destination,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({applied:apply,files:report.files.length,changed:report.files.filter(file=>file.changed).length,edits:report.files.reduce((sum,file)=>sum+file.edits,0),manualReview:report.review.length,report:destination}));
