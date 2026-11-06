import type {Config} from '@netlify/functions';
import {siteStore} from '../../server/site/runtime';
import {CatalisaSessionStore} from '../../server/site/catalisa-store';

/** Netlify scheduled function; only the site's expired private records are addressed. */
export default async()=>{
  const deadline=Date.now()+24000;
  try{
    const store=await siteStore(process.env,false);
    if(!(store instanceof CatalisaSessionStore))return Response.json({code:'retention_backend_not_configured'},{status:503});
    return Response.json(await store.cleanup(20,deadline));
  }catch{return Response.json({code:'retention_unavailable'},{status:503});}
};
export const config:Config={schedule:'15 * * * *'};
