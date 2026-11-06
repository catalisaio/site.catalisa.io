import {ApiError} from './input';
/** Numeric metadata only: no upstream response body, endpoint, token or subject is retained. */
export function upstreamPressure(response:Response){
 if(response.status!==429)return undefined;
 const raw=response.headers.get('retry-after')??response.headers.get('retry-after-long')??response.headers.get('retry-after-medium')??response.headers.get('retry-after-short')??response.headers.get('x-ratelimit-reset-medium');
 const seconds=raw&&/^\d+$/.test(raw)?Number(raw):raw?Math.ceil((Date.parse(raw)-Date.now())/1000):60;
 const retryAfterMs=Math.min(3600000,Math.max(1000,Number.isFinite(seconds)?seconds*1000:60000));
 void response.body?.cancel().catch(()=>{});
 return Object.assign(new ApiError(503,'upstream_rate_limited','O serviço atingiu o limite temporário de uso. Tente novamente em instantes.'),{retryAfterMs,diagnostic:{httpStatus:429}});
}
