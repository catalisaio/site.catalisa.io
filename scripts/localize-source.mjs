import {parse} from '@babel/parser';
import traverseModule from '@babel/traverse';

const traverse=traverseModule.default??traverseModule;
export const runtimeAlias='__siteT';
const uiAttributes=new Set(['alt','title','aria-label','aria-description','placeholder','label','help','caption','description','emptyMessage','busyLabel','submitLabel']);
const messageCalls=new Set(['setError','setStatus','setCopyStatus','setSelection','alert']);
const displayVariables=new Set(['prompts','statusCopy','channelName','labels','demoOptions','title','detail','description','message','statusMessage','copyStatus','label','subtitle','footnote','emptyMessage','busyLabel','placeholder']);
const displayProperties=new Set(['title','description','heading','headline','label','caption','alt','hint','reply','question','focus','intro','text','message','footnote','busyLabel','placeholder']);
const errorConstructors=new Map([['Error',0],['SiteApiError',2],['ApiError',2],['IntegrationError',1]]);
const preserveNames=new Set(['Catalisa','catalisa','catalisa.','Catalisa.','Studio','Banking','banking','Banking Platform','Credit','Credit Platform','Platform','Med','Biometrics','Decision','Decision Platform','WhatsApp','WhatsApp Business','AI Engine','WPP','WPP Business','JSON','HTTP','API','SVG','PNG','CSS','HTML','Inter','ai','identity','events','decision','agents','workflows','governance','build','preview','inspect','intention','plan','execute','operate','diagram','platform','all','none','custom','image','product','status','documents','bi','v2','connect()']);
export function preserveTechnicalNames(names){for(const name of names)preserveNames.add(name);}
export function getPreservedTechnicalNames(){return [...preserveNames].sort();}

export function humanText(value){
 const text=value.trim();
 return !!text&&/[\p{L}]/u.test(text)&&!preserveNames.has(text)&&
  !/^(?:https?:|mailto:|tel:|\/|#|--[a-z]|\.\/|\.\.\/|data:|blob:|```|curl\b|(?:GET|POST|PUT|PATCH|DELETE)\s+\/)/.test(text)&&
  !/^[\w./-]+\.(?:svg|png|jpe?g|webp|mp4|woff2?|json|css|m?js|tsx?)$/i.test(text)&&
  !/^[a-f0-9]{24,}$/i.test(text)&&! /^[a-z]{2}-[A-Z]{2}$/.test(text)&&
  !/^[a-z][a-z0-9]*(?:-[a-z0-9]+){2,}$/.test(text)&&
  !/^(?:Bearer\s|[A-Z_]{3,}=|(?:const|let|var|import|export|function)\s)/.test(text);
}

/** React's JSX whitespace semantics, without changing the element structure. */
export function jsxText(value){
 const lines=value.split(/\r\n|\n|\r/);let last=0;
 for(let index=0;index<lines.length;index++)if(/\S/.test(lines[index]))last=index;
 let result='';for(let index=0;index<lines.length;index++){
  let line=lines[index].replace(/\t/g,' ');if(index!==0)line=line.replace(/^ +/,'');if(index!==lines.length-1)line=line.replace(/ +$/,'');
  if(line){result+=line;if(index!==last)result+=' ';}
 }return result;
}

function attributeContext(nodePath){
 const attribute=nodePath.findParent(parent=>parent.isJSXAttribute());
 return attribute?.node.name?.name;
}
function alreadyTranslated(nodePath){return !!nodePath.findParent(parent=>parent.isCallExpression()&&parent.node.callee.type==='Identifier'&&['t','siteT',runtimeAlias,'translateText'].includes(parent.node.callee.name));}
function isComparison(nodePath){return !!nodePath.findParent(parent=>parent.isBinaryExpression()&&['===','==','!==','!=','in'].includes(parent.node.operator));}
function contextFor(nodePath){
 if(nodePath.findParent(parent=>parent.isVariableDeclarator()&&parent.node.id.type==='Identifier'&&parent.node.id.name==='stepKey'))return null;
 if(isComparison(nodePath)||nodePath.findParent(parent=>parent.node.type.startsWith('TS')))return null;
 if(nodePath.parentPath.isObjectProperty()&&nodePath.parentPath.node.key===nodePath.node)return null;
 if(nodePath.findParent(parent=>parent.isJSXSpreadAttribute()))return null;
 if(nodePath.findParent(parent=>parent.isJSXElement()&&parent.node.openingElement.name.type==='JSXIdentifier'&&['pre','code'].includes(parent.node.openingElement.name.name)))return null;
 if(alreadyTranslated(nodePath))return 'already-translated';
 const attribute=attributeContext(nodePath);if(attribute)return uiAttributes.has(attribute)?'ui-attribute':null;
 const jsx=nodePath.findParent(parent=>parent.isJSXExpressionContainer());
 if(jsx&&!nodePath.findParent(parent=>parent.isMemberExpression()&&parent.node.property===nodePath.node)){
  const callArgument=nodePath.findParent(parent=>parent.isCallExpression()&&parent.node.start>=jsx.node.start&&parent.node.end<=jsx.node.end&&parent.node.arguments.some(argument=>argument&&nodePath.node.start>=argument.start&&nodePath.node.end<=argument.end));
  if(!callArgument)return 'jsx-expression';
 }
 const call=nodePath.findParent(parent=>parent.isCallExpression()&&parent.node.callee.type==='Identifier'&&messageCalls.has(parent.node.callee.name));
 if(call)return 'ui-message';
 const error=nodePath.findParent(parent=>parent.isNewExpression()||parent.isCallExpression()&&parent.node.callee.type==='Identifier'&&errorConstructors.has(parent.node.callee.name));
 if(error&&error.node.callee.type==='Identifier'&&errorConstructors.has(error.node.callee.name)){
  const index=errorConstructors.get(error.node.callee.name),argument=error.node.arguments[index];
  if(argument&&nodePath.node.start>=argument.start&&nodePath.node.end<=argument.end)return 'error-message';
 }
 const property=nodePath.parentPath;
 if(property.isObjectProperty()&&property.node.value===nodePath.node){const key=property.node.key.type==='Identifier'?property.node.key.name:property.node.key.value;if(displayProperties.has(key))return 'display-property';}
 const declaration=nodePath.findParent(parent=>parent.isVariableDeclarator()&&parent.node.id.type==='Identifier'&&displayVariables.has(parent.node.id.name));
 if(declaration&&!nodePath.findParent(parent=>parent.isCallExpression()||parent.isNewExpression()))return 'display-declaration';
 return null;
}

export function analyzeSource(source,file,{allowTransform=true}={}){
 const ast=parse(source,{sourceType:'module',plugins:['typescript','jsx'],errorRecovery:false});
 const entries=[],edits=[],review=[];
 const add=(nodePath,text,kind,replacement)=>{
  if(!humanText(text))return;
  entries.push({text:text.trim(),kind,file,line:nodePath.node.loc?.start.line??0});
  if(replacement&&allowTransform)edits.push({start:nodePath.node.start,end:nodePath.node.end,text:replacement});
 };
 traverse(ast,{
  JSXText(nodePath){if(nodePath.findParent(parent=>parent.isJSXElement()&&parent.node.openingElement.name.type==='JSXIdentifier'&&['pre','code'].includes(parent.node.openingElement.name.name)))return;const text=jsxText(nodePath.node.value);add(nodePath,text,'jsx-text','{'+runtimeAlias+'('+JSON.stringify(text)+')}');},
  StringLiteral(nodePath){
   const kind=contextFor(nodePath);if(!kind)return;
   const text=nodePath.node.value;if(!humanText(text))return;
   if(kind==='already-translated'){add(nodePath,text,kind);return;}
   const directAttribute=nodePath.parentPath.isJSXAttribute();
   add(nodePath,text,kind,(directAttribute?'{':'')+runtimeAlias+'('+JSON.stringify(text)+')'+(directAttribute?'}':''));
  },
  TemplateLiteral(nodePath){
   const kind=contextFor(nodePath);if(!kind||kind==='already-translated')return;
   const text=nodePath.node.quasis.map((quasi,index)=>quasi.value.cooked+(index<nodePath.node.expressions.length?'{value'+index+'}':'')).join('');
   if(!humanText(text))return;
   // Templates in visible strings preserve interpolated values; technical
   // templates under className, href, path and JSX event handlers are excluded.
   const values=nodePath.node.expressions.map((expression,index)=>JSON.stringify('value'+index)+':'+source.slice(expression.start,expression.end)).join(',');
   add(nodePath,text,'ui-template',runtimeAlias+'('+JSON.stringify(text)+(values?',{'+values+'}':'')+')');nodePath.skip();
  },
  VariableDeclarator(nodePath){
   if(nodePath.node.id.type!=='Identifier'||!['prompts','statusCopy','channelName','labels','categories','domains','demoOptions'].includes(nodePath.node.id.name))return;
   review.push({file,line:nodePath.node.loc?.start.line??0,kind:'display-data-with-possible-logic',name:nodePath.node.id.name});
  },
 });
 // A nested expression can overlap a parent template: keep the outer edit.
 const unique=edits.sort((a,b)=>a.start-b.start||b.end-a.end).filter((edit,index,all)=>!all.slice(0,index).some(previous=>edit.start>=previous.start&&edit.end<=previous.end));
 return{entries,edits:unique,review};
}

export function applySourceEdits(source,edits,importPath){
 if(!edits.length)return source;
 let output=source;for(const edit of [...edits].sort((a,b)=>b.start-a.start))output=output.slice(0,edit.start)+edit.text+output.slice(edit.end);
 if(!new RegExp('\\bt\\s+as\\s+'+runtimeAlias+'\\b').test(source))output='import {t as '+runtimeAlias+'} from '+JSON.stringify(importPath)+';\n'+output;
 return output;
}
