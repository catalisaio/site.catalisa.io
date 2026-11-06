/** Synthetic Data Store/IAM contracts. No network, environment or credentials are read. */
export function fixtureSitePanel(){
 type Doc={id:string;docKey:string;version:number;attributes:Record<string,any>};
 const collections=new Map<string,Map<string,Doc>>();let sequence=0;
 const fetcher=async(input:string|URL|Request,init:RequestInit={})=>{
  const url=new URL(String(input)),method=init.method??'GET',body=init.body?JSON.parse(String(init.body)):undefined;
  if(url.pathname==='/auth/me')return Response.json({id:'fixture-operator',email:'admin@catalisa.app',name:'Equipe fictícia'});
  if(url.pathname==='/auth/login')return Response.json({accessToken:'fixture-staff-token'});
  const match=url.pathname.match(/^\/data-store\/collections\/([a-z0-9_]+)(?:\/(query|documents)(?:\/([^/]+))?)?$/);if(!match)return Response.json({},{status:404});
  const [,collection,operation,id]=match,docs=collections.get(collection)??new Map<string,Doc>();collections.set(collection,docs);
  if(!operation)return Response.json({data:{pii:true,jsonSchema:{properties:{purpose:{enum:[collection==='site_catalisa_inbox_v1'?'catalisa-site-inbox-v1':collection==='site_catalisa_metrics_v1'?'catalisa-site-market-v1':'catalisa-site-v1']},packet:{encrypted:true},staffSession:{encrypted:true},payload:{encrypted:true},state:{encrypted:true},receipts:{encrypted:true}}}}});
  if(operation==='query'){
   const data=[...docs.values()].filter(doc=>Object.entries(body.where).every(([key,condition])=>{const {op,value}=condition as {op:string;value:any},actual=key==='$docKey'?doc.docKey:doc.attributes[key];return op==='eq'?actual===value:op==='gt'?actual>value:op==='lte'?actual<=value:op==='in'?value.includes(actual):op==='contains'?Array.isArray(actual)&&value.every((item:unknown)=>actual.includes(item)):false;}));
   return Response.json({data:structuredClone(data.slice((body.page-1)*body.pageSize,body.page*body.pageSize))},{status:201});
  }
  if(!id&&method==='POST'){
   if([...docs.values()].some(doc=>doc.docKey===body.docKey))return Response.json({},{status:409});
   const doc={id:'fixture_doc_'+(++sequence),docKey:body.docKey,version:1,attributes:structuredClone(body.data)};docs.set(doc.id,doc);return Response.json({data:structuredClone(doc)},{status:201});
  }
  const doc=docs.get(id);if(!doc)return Response.json({},{status:404});
  if(method==='GET')return Response.json({data:structuredClone(doc)});
  if(method==='PUT'){if(doc.version!==body.expectedVersion)return Response.json({},{status:409});doc.version++;doc.attributes=structuredClone(body.data);return Response.json({data:structuredClone(doc)});}
  if(method==='DELETE'){docs.delete(doc.id);return new Response(null,{status:204});}
  return Response.json({},{status:405});
 };
 return {fetch:fetcher as typeof fetch,collections};
}
