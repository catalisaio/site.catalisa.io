/** Read-only contract for local HTML snapshot servers. Never imported by deployed application/API. */
export function anonymousSnapshotApi(pathname, method = 'GET') {
  if (pathname !== '/api' && !pathname.startsWith('/api/')) return null;
  const headers = {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'};
  if (!['GET','HEAD'].includes(method)) return {status:405,headers,body:{code:'snapshot_read_only',message:'Snapshot servers do not accept mutations.'}};
  if (pathname === '/api/site/session') return {status:401,headers,body:{code:'session_required',message:'Comece uma conversa para continuar.'}};
  return {status:404,headers,body:{code:'snapshot_api_not_found',message:'No API implementation exists in this local snapshot server.'}};
}
