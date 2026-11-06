/** Integrates static display data and known public links; never touches private conversation data. */
import fs from'node:fs/promises';import path from'node:path';import{createHash}from'node:crypto';import{parse}from'@babel/parser';import traverseModule from'@babel/traverse';import generateModule from'@babel/generator';import{tsImport}from'tsx/esm/api';
const traverse=traverseModule.default??traverseModule,generate=generateModule.default??generateModule;
const apply=process.argv.includes('--apply'),root=path.resolve('src/redesign'),excluded=new Set(['App.tsx','PreviewMeta.tsx']);
const{parseSitePath}=await tsImport('../src/redesign/i18n/routes.ts',import.meta.url);
const report={generatedAt:new Date().toISOString(),applied:apply,scope:'Native static JSON display imports, Link/useLocation adapters and known internal a[href] only. App, PreviewMeta, consent, private generated concepts/briefing/messages and all external/download/asset links are outside this mutation.',files:[]},prepared=[];
for(const filename of(await fs.readdir(root)).filter(file=>/\.[jt]sx?$/.test(file)&&!file.includes('.test.')&&!excluded.has(file))){
 const file=path.join(root,filename),source=await fs.readFile(file,'utf8'),ast=parse(source,{sourceType:'module',plugins:['typescript','jsx']}),edits=[],initializers=[],navigation=[];
 let dataImports=0,hrefs=0;const lastImport=Math.max(0,...ast.program.body.filter(node=>node.type==='ImportDeclaration').map(node=>node.end));
 for(const node of ast.program.body.filter(node=>node.type==='ImportDeclaration')){
  if(node.source.value.startsWith('./data/')&&node.source.value.endsWith('.json')){
   const binding=node.specifiers.find(specifier=>specifier.type==='ImportDefaultSpecifier');if(!binding||binding.local.name.startsWith('__siteBase_'))continue;
   const alias='__siteBase_'+binding.local.name;edits.push({start:binding.local.start,end:binding.local.end,text:alias});initializers.push('const '+binding.local.name+'=__siteData('+alias+');');dataImports++;
  }
  if(node.source.value==='react-router-dom'&&node.importKind!=='type'){
   const moving=node.specifiers.filter(specifier=>specifier.type==='ImportSpecifier'&&specifier.importKind!=='type'&&['Link','useLocation'].includes(specifier.imported.name));if(!moving.length)continue;
   navigation.push(...moving.map(specifier=>(specifier.imported.name==='Link'?'LocalizedLink':'useSiteLocation')+' as '+specifier.local.name));
   const keep=node.specifiers.filter(specifier=>!moving.includes(specifier));edits.push({start:node.start,end:node.end,text:keep.length?generate({...node,specifiers:keep}).code:''});
  }
 }
 traverse(ast,{JSXOpeningElement(nodePath){
  if(nodePath.node.name.type!=='JSXIdentifier'||nodePath.node.name.name!=='a'||nodePath.node.attributes.some(attribute=>attribute.type==='JSXAttribute'&&attribute.name.name==='download'))return;
  const href=nodePath.node.attributes.find(attribute=>attribute.type==='JSXAttribute'&&attribute.name.name==='href');if(!href?.value)return;
  const literal=href.value.type==='StringLiteral'?href.value:href.value.type==='JSXExpressionContainer'&&href.value.expression.type==='StringLiteral'?href.value.expression:null;
  if(!literal||!literal.value.startsWith('/')||!parseSitePath(literal.value))return;
  edits.push({start:href.value.start,end:href.value.end,text:'{__siteHref('+JSON.stringify(literal.value)+')}'});hrefs++;
 }});
 if(!edits.length)continue;
 const imports=[];if(dataImports)imports.push('import{localizeData as __siteData}from"./i18n/runtime";');if(navigation.length||hrefs)imports.push('import{'+[...navigation,...(hrefs?['localizedHref as __siteHref']:[])].join(',')+'}from"./i18n/navigation";');
 if(initializers.length)edits.push({start:lastImport,end:lastImport,text:'\n'+initializers.join('\n')+'\n'});
 let output=source;for(const edit of edits.sort((a,b)=>b.start-a.start))output=output.slice(0,edit.start)+edit.text+output.slice(edit.end);output=imports.join('\n')+'\n'+output;
 parse(output,{sourceType:'module',plugins:['typescript','jsx']});prepared.push({file,source,output});report.files.push({file:path.relative(process.cwd(),file),dataImports,navigationAliases:navigation,internalAnchors:hrefs,syntaxVerified:true,beforeSha256:createHash('sha256').update(source).digest('hex'),afterSha256:createHash('sha256').update(output).digest('hex')});
}
for(const item of prepared)if(apply){if(await fs.readFile(item.file,'utf8')!==item.source)throw Error('Source changed during integration: '+item.file);await fs.writeFile(item.file,item.output);}
await fs.writeFile('docs/redesign-2026-10-22/qa/localization/data-imports-report.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({applied:apply,files:report.files.length,dataImports:report.files.reduce((sum,file)=>sum+file.dataImports,0),internalAnchors:report.files.reduce((sum,file)=>sum+file.internalAnchors,0)}));
