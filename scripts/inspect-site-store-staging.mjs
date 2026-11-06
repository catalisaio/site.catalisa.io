import fs from'node:fs/promises';
const config=JSON.parse(await fs.readFile('.local/site/staging-connection.json','utf8'));if(config.origin!=='https://panel-api.wpp.bb.stg.catalisa.app')throw Error('Staging required');
const response=await fetch(config.origin+'/data-store/collections',{headers:{Authorization:'Bearer '+config.token},signal:AbortSignal.timeout(20000),redirect:'error'});const data=await response.json().catch(()=>({}));
await fs.writeFile('.local/site/store-discovery.json',JSON.stringify(data),{mode:0o600});
const rows=Array.isArray(data)?data:data.data??data.items??[];
console.log(JSON.stringify({readOnly:true,httpStatus:response.status,envelopeKeys:Object.keys(data),count:Array.isArray(rows)?rows.length:undefined,siteCollections:Array.isArray(rows)?rows.filter(item=>/site.catalisa|site-catalisa|catalisa.site/.test(item.name)).map(({name,pii,acl})=>({name,pii,acl})):[],error:response.ok?undefined:typeof data.message==='string'?data.message.slice(0,160):data.code}));
