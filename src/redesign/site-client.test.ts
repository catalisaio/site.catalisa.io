import{afterEach,describe,expect,it,vi}from'vitest';
import{siteRequest}from'./site-client';
afterEach(()=>vi.unstubAllGlobals());
describe('network response recovery',()=>{
 it('recovers a lost concept response using the identical reserved key and payload',async()=>{
  const fetch=vi.fn().mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValueOnce(Response.json({jobRef:'same-job',status:'running'}));vi.stubGlobal('fetch',fetch);
  expect(await siteRequest('concepts','POST',{briefVersion:3},'reserved-operation')).toEqual({jobRef:'same-job',status:'running'});
  expect(fetch).toHaveBeenCalledTimes(2);expect(fetch.mock.calls[0][1].body).toBe(fetch.mock.calls[1][1].body);expect(fetch.mock.calls[1][1].headers['Idempotency-Key']).toBe('reserved-operation');
 });
 it('recovers a read once and stops on a persistent network failure',async()=>{
  const fetch=vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));vi.stubGlobal('fetch',fetch);
  await expect(siteRequest('session')).rejects.toMatchObject({code:'network_error'});expect(fetch).toHaveBeenCalledTimes(2);
 });
 it.each(['sessions','handoffs'])('does not replay %s mutations on a network failure',async path=>{
  const fetch=vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));vi.stubGlobal('fetch',fetch);
  await expect(siteRequest(path,'POST',{},'reserved-operation')).rejects.toMatchObject({code:'network_error'});expect(fetch).toHaveBeenCalledTimes(1);
 });
 it.each([['messages','POST'],['identity','POST'],['contact','POST'],['briefing','PUT'],['lab/briefing','POST'],['direct/briefing','POST'],['concepts/concept-fixture/revisions','POST']])('recovers %s once with the exact receipt-protected method, body and key',async(path,method)=>{
  const fetch=vi.fn().mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValueOnce(Response.json({recovered:true}));vi.stubGlobal('fetch',fetch);
  expect(await siteRequest(path,method,{briefVersion:3},'reserved-operation')).toEqual({recovered:true});expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch.mock.calls[0][0]).toBe(fetch.mock.calls[1][0]);expect(fetch.mock.calls[0][1].method).toBe(method);expect(fetch.mock.calls[1][1].method).toBe(method);
  expect(fetch.mock.calls[0][1].body).toBe(fetch.mock.calls[1][1].body);expect(fetch.mock.calls[1][1].headers['Idempotency-Key']).toBe('reserved-operation');
 });
 it.each([['identity','POST',undefined],['briefing','POST','reserved-operation'],['identity','PUT','reserved-operation']])('does not recover an unprotected mutation %s %s',async(path,method,key)=>{
  const fetch=vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));vi.stubGlobal('fetch',fetch);
  await expect(siteRequest(path!,method,{},key)).rejects.toMatchObject({code:'network_error'});expect(fetch).toHaveBeenCalledTimes(1);
 });
 it('stops after one recovery of a receipt-protected mutation',async()=>{
  const fetch=vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));vi.stubGlobal('fetch',fetch);
  await expect(siteRequest('identity','POST',{},'reserved-operation')).rejects.toMatchObject({code:'network_error'});expect(fetch).toHaveBeenCalledTimes(2);
 });
 it('does not recover when the caller signal is already aborted, including a custom abort reason',async()=>{
  const controller=new AbortController();controller.abort(new Error('Caller cancelled'));
  const fetch=vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));vi.stubGlobal('fetch',fetch);
  await expect(siteRequest('identity','POST',{},'reserved-operation',controller.signal)).rejects.toMatchObject({code:'network_error'});expect(fetch).toHaveBeenCalledTimes(1);
 });
 it('does not retry provider HTTP errors or elapsed request budgets',async()=>{
  const fetch=vi.fn().mockResolvedValueOnce(Response.json({code:'provider_unavailable'},{status:503})).mockRejectedValueOnce(new DOMException('elapsed','TimeoutError'));vi.stubGlobal('fetch',fetch);
  await expect(siteRequest('concepts','POST',{},'reserved-operation')).rejects.toMatchObject({code:'provider_unavailable'});
  await expect(siteRequest('concepts','POST',{},'reserved-operation')).rejects.toMatchObject({code:'network_timeout'});expect(fetch).toHaveBeenCalledTimes(2);
 });
 it.each(['identity','contact','messages'])('does not retry %s HTTP errors, request timeouts or aborts',async path=>{
  const fetch=vi.fn().mockResolvedValueOnce(Response.json({code:'service_unavailable'},{status:503})).mockRejectedValueOnce(new DOMException('elapsed','TimeoutError')).mockRejectedValueOnce(new DOMException('aborted','AbortError'));vi.stubGlobal('fetch',fetch);
  await expect(siteRequest(path,'POST',{},'reserved-operation')).rejects.toMatchObject({status:503,code:'service_unavailable'});
  await expect(siteRequest(path,'POST',{},'reserved-operation')).rejects.toMatchObject({code:'network_timeout'});
  await expect(siteRequest(path,'POST',{},'reserved-operation')).rejects.toMatchObject({code:'network_timeout'});expect(fetch).toHaveBeenCalledTimes(3);
 });
});
