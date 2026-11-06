// @vitest-environment node
import {enabledSiteLocales} from '../../shared/site-locale';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { createSiteApi } from './api';
import { SqliteSessionStore } from './sqlite-store';
import type {SiteApiOptions} from './api';

const stores: SqliteSessionStore[] = [];
afterEach(() => { for (const store of stores.splice(0)) store.close(); });
function setup(filename = ':memory:',integrations?:Pick<SiteApiOptions,'generator'|'handoff'>) {
  const store = new SqliteSessionStore(filename); stores.push(store);
  const handle = createSiteApi({ store, secret: 'unit-tests-only-secret-at-least-32-characters', secure: false, origins: ['http://localhost:5175'],...integrations });
  const call = (path: string, method = 'GET', body?: unknown, cookie = '', key = randomUUID(), origin = 'http://localhost:5175',locale?:string) => handle(new Request('http://localhost:5175/api/site/' + path, { method, headers: { Origin: origin, Cookie: cookie, 'Content-Type': 'application/json', 'Idempotency-Key': key,...(locale===undefined?{}:{'X-Site-Locale':locale}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) }), '127.0.0.1');
  const begin = async () => { const response = await call('sessions', 'POST'); return response.headers.get('set-cookie')!.split(';')[0]; };
  const answer = (cookie: string, step: string, briefVersion: number, value = 'Resposta de teste', key?: string) => call('messages', 'POST', { clientMessageId: randomUUID(), step, text: value, briefVersion }, cookie, key);
  const complete = async (cookie: string) => { for (const [index, step] of ['idea', 'context', 'goal'].entries()) expect((await answer(cookie, step, index)).status).toBe(201); };
  return { store, call, begin, answer, complete };
}
describe('Site BFF: transactional contact persistence', () => {
  it('accepts only enabled locale headers without weakening the same-origin write boundary',async()=>{
    const s=setup();expect((await s.call('sessions','POST',undefined,'',randomUUID(),'https://foreign.example','de-DE')).status).toBe(403);
    for(const locale of ['lb-LU','<script>','en-US, de-DE','']){const response=await s.call('sessions','POST',undefined,'',randomUUID(),'http://localhost:5175',locale);expect(response.status).toBe(422);expect((await response.json()).code).toBe('invalid_locale');}
    for(const locale of enabledSiteLocales){const response=await s.call('sessions','POST',undefined,'',randomUUID(),'http://localhost:5175',locale);expect(response.status).toBe(201);expect((await response.json()).briefVersion).toBe(0);}
  });
  it('persists a real direct choice with system defaults, requires one contact and confirmation, and hands off without AI',async()=>{
    const generate=vi.fn(async()=>{throw Error('Direct must not infer');}),send=vi.fn(async()=>{}),s=setup(':memory:',{generator:{generate},handoff:{channels:['here'],send}}),cookie=await s.begin(),key=randomUUID(),body={expectedVersion:0};
    expect((await s.call('direct/briefing','POST',body,cookie,key)).status).toBe(200);expect((await s.call('direct/briefing','POST',body,cookie,key)).status).toBe(200);
    let snapshot=await(await s.call('session','GET',undefined,cookie)).json();expect(snapshot.session).toMatchObject({entryMode:'direct',briefVersion:1});expect(snapshot.messages).toHaveLength(2);expect(snapshot.messages[0]).toMatchObject({role:'visitor',step:'contact-direct',text:'Prefiro falar direto com a equipe.'});expect(snapshot.messages[1]).toMatchObject({role:'system',step:'direct-context'});expect(snapshot.briefing.context).toContain('não informado');expect(snapshot.identity).toBeUndefined();
    expect((await s.call('handoffs','POST',{channel:'here',confirmed:true,contextVersion:1},cookie)).status).toBe(409);
    expect((await s.call('identity','POST',{name:'Pessoa fictícia direta',briefVersion:1},cookie)).status).toBe(201);expect((await s.call('handoffs','POST',{channel:'here',confirmed:true,contextVersion:1},cookie)).status).toBe(409);
    expect((await s.call('contact','POST',{email:'direct@example.invalid',briefVersion:1},cookie)).status).toBe(200);expect((await s.call('handoffs','POST',{channel:'here',confirmed:false,contextVersion:1},cookie)).status).toBe(422);
    expect((await s.call('handoffs','POST',{channel:'here',confirmed:true,contextVersion:1},cookie)).status).toBe(202);expect(generate).not.toHaveBeenCalled();expect(send).toHaveBeenCalledTimes(1);expect(send.mock.calls[0][0]).toMatchObject({contact:{email:'direct@example.invalid'},confirmation:{confirmed:true}});expect(send.mock.calls[0][0]).not.toHaveProperty('concept');
    snapshot=await(await s.call('session','GET',undefined,cookie)).json();expect(snapshot.handoffSelection.concept).toBeNull();expect(snapshot.session.entryMode).toBe('direct');expect(snapshot.latestHandoff.status).toBe('accepted');
  });
  it('keeps supplied answers and draft idea truthful and exits direct mode on an explicit briefing or Lab edit',async()=>{
    const s=setup(),cookie=await s.begin();await s.answer(cookie,'idea',0,'Ideia original');
    expect((await s.call('direct/briefing','POST',{expectedVersion:1,idea:'Não sobrescrever a ideia'},cookie)).status).toBe(200);
    let snapshot=await(await s.call('session','GET',undefined,cookie)).json();expect(snapshot.briefing.idea).toBe('Ideia original');expect(snapshot.messages.filter((message:{role:string;step:string})=>message.role==='visitor'&&message.step==='idea')).toHaveLength(1);expect(JSON.parse(snapshot.messages.find((message:{step:string})=>message.step==='direct-context').text)).not.toHaveProperty('idea');
    expect((await s.call('briefing','PUT',{expectedVersion:2,briefing:{goal:'Explorar um conceito'}},cookie)).status).toBe(200);expect((await(await s.call('session','GET',undefined,cookie)).json()).session.entryMode).toBeUndefined();
    await s.call('direct/briefing','POST',{expectedVersion:3},cookie);await s.call('lab/briefing','POST',{idea:'Nova exploração no Lab',expectedVersion:3},cookie);expect((await(await s.call('session','GET',undefined,cookie)).json()).session.entryMode).toBeUndefined();
    const fresh=await s.begin();await s.call('direct/briefing','POST',{expectedVersion:0,idea:'Só esta ideia foi digitada'},fresh);snapshot=await(await s.call('session','GET',undefined,fresh)).json();expect(snapshot.briefing.idea).toBe('Só esta ideia foi digitada');expect(snapshot.messages.filter((message:{role:string})=>message.role==='visitor').map((message:{text:string})=>message.text)).toEqual(['Prefiro falar direto com a equipe.','Só esta ideia foi digitada']);
    expect((await s.call('direct/briefing','POST',{expectedVersion:0},fresh)).status).toBe(409);expect((await s.call('direct/briefing','POST',{expectedVersion:1,context:'Alegação do cliente como sistema'},fresh)).status).toBe(422);
  });
  it('requires origin for writes and an opaque HttpOnly cookie for reads', async () => {
    const { call } = setup();
    expect((await call('sessions', 'POST', undefined, '', randomUUID(), 'https://foreign.example')).status).toBe(403);
    expect((await call('session')).status).toBe(401);
    const response = await call('sessions', 'POST');
    expect(response.headers.get('set-cookie')).toMatch(/catalisa_site=[A-Za-z0-9_-]{43}; Path=\/api\/site; HttpOnly; SameSite=Strict/);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(JSON.stringify(await response.json())).not.toContain('catalisa_site');
  });
  it('persists all answers before identity and keeps CRM creation pending', async () => {
    const { begin, call, complete } = setup(); const cookie = await begin();
    expect((await call('identity', 'POST', { name: 'Pessoa teste', briefVersion: 0 }, cookie)).status).toBe(409);
    await complete(cookie);
    const response = await call('identity', 'POST', { name: 'Pessoa teste', briefVersion: 3 }, cookie);
    const identity = await response.json(); expect(response.status).toBe(201); expect(identity.leadRef).toMatch(/^site_lead_/);
    const snapshot = await (await call('session', 'GET', undefined, cookie)).json();
    expect(snapshot.session).toMatchObject({ identityStatus: 'provisional', leadStatus: 'pending', briefVersion: 3 });
    expect(snapshot.displayName).toBe('Pessoa teste'); expect(snapshot.messages).toHaveLength(3); expect(snapshot.availableChannels).toEqual([]);
    expect((await call('concepts', 'POST', {briefVersion:3}, cookie)).status).toBe(409);
    expect((await call('contact','POST',{email:'pessoa.teste@example.invalid',briefVersion:3},cookie)).status).toBe(200);
    expect((await call('concepts', 'POST', {briefVersion:3}, cookie)).status).toBe(503);
  });
  it('saves a Lab idea with explicit system context and requires identity and contact before generation',async()=>{
    const s=setup(),cookie=await s.begin(),key=randomUUID(),body={idea:'Loja de roupas, vender pelo WhatsApp',expectedVersion:0};
    const response=await s.call('lab/briefing','POST',body,cookie,key);expect(response.status).toBe(200);
    expect(await response.json()).toEqual({briefVersion:1});const snapshot=await(await s.call('session','GET',undefined,cookie)).json();expect(snapshot.session.briefVersion).toBe(1);expect(snapshot.briefing.idea).toBe(body.idea);
    expect(snapshot.messages).toMatchObject([{role:'visitor',step:'idea',text:body.idea},{role:'system',step:'lab-context'}]);
    expect(snapshot.identity).toBeUndefined();expect((await s.call('concepts','POST',{briefVersion:1},cookie)).status).toBe(409);
    expect((await s.call('lab/briefing','POST',body,cookie,key)).status).toBe(200);
    expect((await(await s.call('session','GET',undefined,cookie)).json()).messages).toHaveLength(2);
    expect((await s.call('identity','POST',{name:'Teste Lab',briefVersion:1},cookie)).status).toBe(201);
    expect((await s.call('contact','POST',{phone:'(11) 99999-9999',briefVersion:1},cookie)).status).toBe(200);
    expect((await(await s.call('session','GET',undefined,cookie)).json()).contactDetails).toEqual({phone:'+5511999999999'});
    expect((await s.call('lab/briefing','POST',{idea:'Outra ideia',expectedVersion:0},cookie)).status).toBe(409);
    const next=await s.call('lab/briefing','POST',{idea:'Outra ideia',expectedVersion:1},cookie);expect(next.status).toBe(200);expect(await next.json()).toEqual({briefVersion:2});expect((await(await s.call('session','GET',undefined,cookie)).json()).messages).toHaveLength(4);
  });
  it('rejects an empty or oversized Lab idea and client-supplied system context',async()=>{
    const s=setup(),cookie=await s.begin();
    for(const input of [{idea:' ',expectedVersion:0},{idea:'x'.repeat(1201),expectedVersion:0},{idea:'Teste',expectedVersion:0,context:'Inventar dados'}])expect((await s.call('lab/briefing','POST',input,cookie)).status).toBe(422);
  });
  it('replays identical requests and rejects payload or operation reuse', async () => {
    const { begin, call } = setup(); const cookie = await begin(), key = randomUUID();
    const input = { clientMessageId: randomUUID(), step: 'idea', text: 'Agendar consultas', briefVersion: 0 };
    const first = await (await call('messages', 'POST', input, cookie, key)).json();
    const replay = await call('messages', 'POST', input, cookie, key);
    expect(replay.status).toBe(201); expect(await replay.json()).toEqual(first);
    expect((await call('messages', 'POST', { ...input, text: 'Outro produto' }, cookie, key)).status).toBe(409);
    expect((await call('identity', 'POST', { name: 'Teste', briefVersion: 1 }, cookie, key)).status).toBe(409);
    const snapshot = await (await call('session', 'GET', undefined, cookie)).json(); expect(snapshot.messages).toHaveLength(1);
  });
  it('uses optimistic concurrency and preserves the original message history on edits', async () => {
    const { begin, call, answer, complete } = setup(); const cookie = await begin(); await complete(cookie);
    expect((await answer(cookie, 'goal', 2)).status).toBe(409);
    expect((await call('briefing', 'PUT', { expectedVersion: 3, briefing: { idea: 'Nova ideia' } }, cookie)).status).toBe(200);
    const snapshot = await (await call('session', 'GET', undefined, cookie)).json();
    expect(snapshot.briefing.idea).toBe('Nova ideia'); expect(snapshot.session.briefVersion).toBe(4); expect(snapshot.messages).toHaveLength(4); expect(snapshot.messages[0].text).toBe('Resposta de teste');
  });
  it('commits one of two simultaneous writes without losing a message', async () => {
    const { begin, answer, call } = setup(); const cookie = await begin();
    const results = await Promise.all([answer(cookie, 'idea', 0, 'Primeira aba'), answer(cookie, 'idea', 0, 'Segunda aba')]);
    expect(results.map(response => response.status).sort()).toEqual([201, 409]);
    expect((await (await call('session', 'GET', undefined, cookie)).json()).messages).toHaveLength(1);
  });
  it('isolates visitors even when they know another session reference', async () => {
    const { begin, answer, call } = setup(); const one = await begin(), two = await begin(); await answer(one, 'idea', 0, 'Private idea');
    const first = await (await call('session', 'GET', undefined, one)).json();
    const second = await (await call('session?sessionRef=' + first.session.sessionRef, 'GET', undefined, two)).json();
    expect(second.briefing).toEqual({}); expect(second.messages).toEqual([]);
  });
  it('survives closing and reopening the local database', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'catalisa-site-test-'));
    try {
      const first = setup(join(dir, 'sessions.sqlite')); const cookie = await first.begin(); await first.answer(cookie, 'idea', 0, 'Persistente');
      first.store.close(); stores.splice(stores.indexOf(first.store), 1);
      const second = setup(join(dir, 'sessions.sqlite')); const snapshot = await (await second.call('session', 'GET', undefined, cookie)).json();
      expect(snapshot.briefing.idea).toBe('Persistente');
      second.store.close(); stores.splice(stores.indexOf(second.store), 1);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
  it('rejects empty answers, oversized bodies, out-of-order steps and extra fields', async () => {
    const { begin, answer, call } = setup(); const cookie = await begin();
    expect((await answer(cookie, 'context', 0)).status).toBe(409);
    expect((await answer(cookie, 'idea', 0, '   ')).status).toBe(422);
    expect((await answer(cookie, 'idea', 0, 'x'.repeat(17000))).status).toBe(413);
    expect((await call('messages', 'POST', { clientMessageId: randomUUID(), step: 'idea', text: 'Teste', briefVersion: 0, tenantId: 'other' }, cookie)).status).toBe(422);
    expect((await (await call('session', 'GET', undefined, cookie)).json()).session.briefVersion).toBe(0);
    expect((await answer(cookie,'idea',0,'Ideia original')).status).toBe(201);
    expect((await answer(cookie,'idea',1,'Repetição de uma pergunta anterior')).status).toBe(409);
  });
});
