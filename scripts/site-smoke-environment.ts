import fs from 'node:fs/promises';
import type {BrowserContextOptions,Route} from '@playwright/test';

/** Allowlisted local/staging browser targets. TLS validation remains enabled. */
export async function siteSmokeEnvironment(){
 const origin=process.env.SITE_SMOKE_ORIGIN||'http://127.0.0.1:5175';
 if(!['http://127.0.0.1:5175','https://site-staging.catalisa.io','https://catalisa.io'].includes(origin))throw Error('Unsupported website smoke origin');
 const staging=origin==='https://site-staging.catalisa.io';
 const production=origin==='https://catalisa.io';
 if(production){
  const release=process.env.SITE_SMOKE_RELEASE;
  if(process.env.SITE_SMOKE_ALLOW_PRODUCTION!=='1'||!release||!/^[A-Za-z0-9_-]{1,64}$/.test(release))throw Error('Production smoke requires explicit opt-in and an expected published release');
  const record=JSON.parse(await fs.readFile('.local/site/production-approval-'+release+'.json','utf8'));
  if(record.releaseId!==release||record.userAuthorizedProduction!==true||record.stagingValidated!==true)throw Error('Production release authorization mismatch');
  const response=await fetch(origin+'/',{method:'HEAD',redirect:'error',signal:AbortSignal.timeout(15000)});
  if(!response.ok||response.headers.get('x-catalisa-site-release')!==release)throw Error('Production release changed; stop before creating synthetic sessions');
 }
 // Integration probes explicitly decline optional analytics. Consent accept,
 // decline and revocation have their own production-host SDK browser audit.
 const browserOptions:BrowserContextOptions={storageState:{cookies:[],origins:[{origin,localStorage:[{name:'catalisa_cookie_consent',value:'denied'},{name:'catalisa_site_locale',value:'pt-BR'}]}]}};
 if(staging){
  const access=JSON.parse(await fs.readFile('.local/site/staging-https/access.json','utf8'));
  if(access.url!==origin)throw Error('Staging access does not match the smoke origin');
  if(access.basicAuth!==false){
   if(typeof access.username!=='string'||!access.username||typeof access.password!=='string'||!access.password)throw Error('Private staging access is missing');
   browserOptions.httpCredentials={origin,username:access.username,password:access.password};
  }
 }
 const hostMap=process.env.SITE_SMOKE_HOST_MAP;
 if(hostMap&&(!staging||hostMap!=='MAP site-staging.catalisa.io 177.104.184.38'))throw Error('Only the dedicated staging hostname to its known edge IP can be mapped');
 return {origin,staging,production,browserOptions,launchArgs:['--no-sandbox',...(hostMap?['--host-resolver-rules='+hostMap]:[])],
  outputSuffix:production?'-production':staging?'-staging':'',privatePrefix:production?'smoke-production-real-':staging?'smoke-staging-real-':'smoke-real-',
  restrictOrigin:(route:Route)=>new URL(route.request().url()).origin===origin?route.continue():route.abort()};
}
