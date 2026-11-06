import { createHash, createHmac, randomBytes, randomUUID } from 'node:crypto';
import type { Briefing, BriefStep, Receipt, SessionState, SessionStore } from './types';
import {ApiError,fields,text,version} from './input';
import {ContactOperations} from './contact-operations';
import type {ContactOperationOptions} from './contact-operations';
import {parseContactDetails} from '../../shared/site-contact';
import {stageMarketEvent} from './site-market-outbox';
import {validConceptLocale} from '../../shared/site-concept-locale';

export interface SiteApiOptions extends ContactOperationOptions { store: SessionStore; secret: string; secure: boolean; origins: string[];requestBudgetMs?:number }
const cookieName = 'catalisa_site';
const digest = (text: string) => createHash('sha256').update(text).digest('hex');
function canonical(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => JSON.stringify(k) + ':' + canonical(v)).join(',') + '}';
  return JSON.stringify(value);
}
async function jsonBody(request: Request) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new ApiError(415, 'invalid_content_type', 'Envie os dados em JSON.');
  const reader = request.body?.getReader(); let size = 0; const chunks: Uint8Array[] = [];
  if (!reader) throw new ApiError(400, 'invalid_json', 'Não foi possível ler a resposta.');
  while (true) { const chunk = await reader.read(); if (chunk.done) break; size += chunk.value.byteLength; if (size > 16000) { await reader.cancel(); throw new ApiError(413, 'body_too_large', 'A resposta excedeu o tamanho permitido.'); } chunks.push(chunk.value); }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new ApiError(400, 'invalid_json', 'Não foi possível ler a resposta.'); }
}
export function createSiteApi(options: SiteApiOptions) {
  if (options.secret.length < 32) throw new Error('SITE_SESSION_SECRET must contain at least 32 characters');
  if(options.requestBudgetMs!==undefined&&(!Number.isSafeInteger(options.requestBudgetMs)||options.requestBudgetMs<=0))throw Error('Invalid site request budget');
  const requestBudget=Math.max(55000,Math.min(options.requestBudgetMs??55000,90000));
  const { store } = options;
  const workflows = new ContactOperations(store, options);
  const snapshot = (state: SessionState) => ({session:state.session,briefing:state.briefing,messages:state.messages.slice(-500),...workflows.snapshot(state),...(state.identity?{identity:state.identity,displayName:state.name}:{}),...(state.contactDetails?{contactDetails:state.contactDetails}:{})});
  return async function handle(request: Request, ip: string): Promise<Response> {
    const requestId = randomUUID();
    const requestDeadline=Date.now()+requestBudget;
    const reply = (body: unknown, status = 200, cookie?: string) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow', 'X-Request-Id': requestId, ...(cookie ? { 'Set-Cookie': cookie } : {}) } });
    try {
      const path = new URL(request.url).pathname.replace(/\/$/, '');
      if(path==='/api/internal/handoff-events'){if(request.method!=='POST')throw new ApiError(405,'method_not_allowed','Método indisponível.');return reply(await workflows.webhook(request));}
      const mutating = request.method !== 'GET';
      if (mutating && !options.origins.includes(request.headers.get('origin') || '')) throw new ApiError(403, 'invalid_origin', 'Abra a conversa pelo site da Catalisa.');
      if (!['GET', 'POST', 'PUT'].includes(request.method)) throw new ApiError(405, 'method_not_allowed', 'Método indisponível.');
      const locale=request.headers.get('x-site-locale')??'pt-BR';
      if(!validConceptLocale(locale))throw new ApiError(422,'invalid_locale','Escolha um dos idiomas disponíveis no site.');
      const hour = Math.floor(Date.now() / 3600000);
      const quotaKey = createHmac('sha256', options.secret).update(ip + ':' + hour + ':' + (path === '/api/site/sessions' ? 'sessions' : 'requests')).digest('hex');
      if (!await store.quota(quotaKey, path === '/api/site/sessions' ? 20 : 600, new Date((hour + 1) * 3600000).toISOString())) throw new ApiError(429, 'rate_limit', 'Aguarde um pouco antes de continuar.');
      const token = request.headers.get('cookie')?.split(';').map(item => item.trim()).find(item => item.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
      const hash = token && /^[A-Za-z0-9_-]{43}$/.test(token) ? digest(token) : '';
      const stored = hash ? await store.read(hash) : null;
      if (path === '/api/site/sessions' && request.method === 'POST') {
        if (stored) return reply(stored.state.session, 201);
        const raw = randomBytes(32).toString('base64url');
        const state: SessionState = { session: { sessionRef: randomUUID(), briefVersion: 0, identityStatus: 'anonymous', leadStatus: 'none' }, briefing: {}, messages: [] };
        stageMarketEvent(options.insights,state,'session.started',state.session.sessionRef,requestId,undefined,{outcome:'recorded'});
        await store.create(digest(raw), state, new Date(Date.now() + 7 * 86400000).toISOString());
        return reply(state.session, 201, `${cookieName}=${raw}; Path=/api/site; HttpOnly; SameSite=Strict; Max-Age=604800${options.secure ? '; Secure' : ''}`);
      }
      if (!stored) throw new ApiError(401, 'session_required', 'Comece uma conversa para continuar.');
      const state = stored.state;
      if (path === '/api/site/session' && request.method === 'GET') {
        // Identity name is an explicit server contract extension for reload/resume.
        await workflows.refresh(state);
        return reply(snapshot(state));
      }
      if(/^\/api\/site\/handoffs\/[\w-]{1,100}\/messages$/.test(path)){
        if(!['GET','POST'].includes(request.method))throw new ApiError(405,'method_not_allowed','Método indisponível.');
        return reply(await workflows.thread(path,state,request.method==='POST'?await jsonBody(request):undefined));
      }
      if(request.method==='GET'){const operation=await workflows.read(path,state);if(operation)return reply(operation);}
      const operations: Record<string, string> = { '/api/site/messages': 'POST', '/api/site/identity': 'POST', '/api/site/contact': 'POST', '/api/site/briefing': 'PUT', '/api/site/lab/briefing': 'POST', '/api/site/direct/briefing':'POST' };
      if(workflows.matches(path))operations[path]='POST';
      if (!(path in operations)) {
        if (path === '/api/site/concepts' || path === '/api/site/handoffs') throw new ApiError(503, 'service_not_configured', 'Esta etapa ainda está sendo conectada. Sua conversa está salva.');
        throw new ApiError(404, 'not_found', 'Esta operação não está disponível.');
      }
      if (request.method !== operations[path]) throw new ApiError(405, 'method_not_allowed', 'Método indisponível.');
      const idempotencyKey = request.headers.get('idempotency-key');
      if (!idempotencyKey || !/^[A-Za-z0-9_-]{8,100}$/.test(idempotencyKey)) throw new ApiError(422, 'idempotency_required', 'Não foi possível identificar esta resposta. Tente novamente.');
      const body: unknown = await jsonBody(request);
      const conceptRequest=path==='/api/site/concepts'||/^\/api\/site\/concepts\/[\w-]{1,100}\/revisions$/.test(path);
      // Preserve historic/default Portuguese receipts byte for byte. Locale is
      // part of a generation's intent, never a reason to rewrite the session.
      const payloadDigest = digest(request.method + path + canonical(body)+(conceptRequest&&locale!=='pt-BR'?'\nX-Site-Locale:'+locale:''));
      const previous = await store.receipt(hash, idempotencyKey);
      if (previous) {
        if (previous.digest !== payloadDigest) throw new ApiError(409, 'idempotency_mismatch', 'Esta tentativa já foi usada para outra resposta.');
        return reply(previous.body, previous.status);
      }
      if(workflows.matches(path)){const receipt=await workflows.create(path,body,hash,stored,idempotencyKey,payloadDigest,requestId,requestDeadline,locale);return reply(receipt.body,receipt.status);}
      let receipt: Receipt;
      const firstIdentity=!state.identity;
      if(path==='/api/site/direct/briefing'){
        const input=fields(body,['expectedVersion','idea']);version(input.expectedVersion,state.session.briefVersion);
        if(input.idea!==undefined&&typeof input.idea!=='string')throw new ApiError(422,'invalid_input','Revise a ideia antes de continuar.');
        const idea=typeof input.idea==='string'&&input.idea.trim()?text(input.idea,4000):undefined;
        const defaults:Briefing={},providedIdea=!state.briefing.idea&&idea;
        if(!state.briefing.idea&&!providedIdea)defaults.idea='Ideia não informada; confirmar com o visitante.';
        if(!state.briefing.context)defaults.context='Contexto não informado; confirmar com o visitante.';
        if(!state.briefing.goal)defaults.goal='Continuar com a equipe sem gerar conceito.';
        const addedMessages=1+(providedIdea?1:0)+(Object.keys(defaults).length?1:0);
        if(state.messages.length+addedMessages>500)throw new ApiError(429,'history_limit','Esta conversa chegou ao limite de respostas.');
        if(providedIdea||Object.keys(defaults).length)state.session.briefVersion++;
        const occurredAt=new Date().toISOString();state.session.entryMode='direct';
        state.messages.push({messageRef:randomUUID(),role:'visitor',step:'contact-direct',text:'Prefiro falar direto com a equipe.',occurredAt,briefVersion:state.session.briefVersion});
        if(providedIdea){state.briefing.idea=providedIdea;state.messages.push({messageRef:randomUUID(),role:'visitor',step:'idea',text:providedIdea,occurredAt,briefVersion:state.session.briefVersion});}
        state.briefing={...state.briefing,...defaults};
        if(Object.keys(defaults).length)state.messages.push({messageRef:randomUUID(),role:'system',step:'direct-context',text:JSON.stringify(defaults),occurredAt,briefVersion:state.session.briefVersion});
        receipt={digest:payloadDigest,status:200,body:{briefVersion:state.session.briefVersion,entryMode:'direct'}};
      }else if(path==='/api/site/lab/briefing'){
        const input=fields(body,['idea','expectedVersion']);version(input.expectedVersion,state.session.briefVersion);
        const idea=text(input.idea,1200);
        if(state.messages.length>=498)throw new ApiError(429,'history_limit','Esta conversa chegou ao limite de respostas.');
        state.session.briefVersion++;
        delete state.session.entryMode;
        state.briefing={idea,context:'Exploração no Catalisa Lab. Público e contexto não informados explicitamente devem aparecer como hipóteses a confirmar.',goal:'Explorar uma composição de produto e seus próximos passos, sem executar operações.'};
        state.messages.push({messageRef:randomUUID(),role:'visitor',step:'idea',text:idea,occurredAt:new Date().toISOString(),briefVersion:state.session.briefVersion});
        state.messages.push({messageRef:randomUUID(),role:'system',step:'lab-context',text:JSON.stringify({context:state.briefing.context,goal:state.briefing.goal}),occurredAt:new Date().toISOString(),briefVersion:state.session.briefVersion});
        receipt={digest:payloadDigest,status:200,body:{briefVersion:state.session.briefVersion}};
      }else if(path==='/api/site/contact'){
        const input=fields(body,['email','phone','briefVersion']);version(input.briefVersion,state.session.briefVersion);
        if(!state.identity)throw new ApiError(409,'identity_required','Informe seu nome antes do canal de retorno.');
        const contact=parseContactDetails(input,{requireCountryCode:locale!=='pt-BR'});if(!contact.ok)throw new ApiError(422,'contact_required',contact.message);
        state.contactDetails=contact.value;
        receipt={digest:payloadDigest,status:200,body:{contactDetails:state.contactDetails}};
      }else if (path === '/api/site/messages') {
        const input = fields(body, ['clientMessageId', 'step', 'text', 'briefVersion']);
        version(input.briefVersion, state.session.briefVersion);
        const step = input.step;
        if (!['idea', 'context', 'goal'].includes(String(step))) throw new ApiError(422, 'invalid_step', 'Esta resposta não pertence ao briefing.');
        const order: BriefStep[] = ['idea', 'context', 'goal'];
        const target = order.indexOf(step as BriefStep);
        if (order.slice(0, target).some(key => !state.briefing[key])) throw new ApiError(409, 'step_order', 'Conclua a resposta anterior primeiro.');
        if(state.briefing[step as BriefStep])throw new ApiError(409,'step_already_answered','Essa pergunta já foi respondida. Use a edição para atualizar sua resposta.');
        const clientId = text(input.clientMessageId, 100);
        if (state.messages.some(message => message.messageRef === clientId)) throw new ApiError(409, 'message_exists', 'Essa resposta já foi recebida. Atualize a conversa.');
        const answer = text(input.text, 4000);
        if (state.messages.length >= 500) throw new ApiError(429, 'history_limit', 'Esta conversa chegou ao limite de respostas.');
        state.session.briefVersion++;
        delete state.session.entryMode;
        state.briefing[step as BriefStep] = answer;
        state.messages.push({ messageRef: clientId, role: 'visitor', step: String(step), text: answer, occurredAt: new Date().toISOString(), briefVersion: state.session.briefVersion });
        receipt = { digest: payloadDigest, status: 201, body: { messageRef: clientId, briefVersion: state.session.briefVersion } };
      } else if (path === '/api/site/identity') {
        const input = fields(body, ['name', 'briefVersion']);
        version(input.briefVersion, state.session.briefVersion);
        if (!state.briefing.idea || !state.briefing.context || !state.briefing.goal) throw new ApiError(409, 'brief_incomplete', 'Responda às três perguntas antes de continuar.');
        const name = text(input.name, 160);
        state.name = name;
        state.identity ??= { contactRef: 'site_contact_' + randomUUID(), leadRef: 'site_lead_' + randomUUID(), identityStatus: 'provisional', briefVersion: state.session.briefVersion };
        state.session.identityStatus = 'provisional';
        // Site lead is durable; CRM creation waits for a real contact channel.
        state.session.leadStatus = 'pending';
        receipt = { digest: payloadDigest, status: 201, body: state.identity };
      } else {
        const input = fields(body, ['expectedVersion', 'briefing']);
        version(input.expectedVersion, state.session.briefVersion);
        const patch = fields(input.briefing, ['idea', 'context', 'goal']);
        if (!Object.keys(patch).length) throw new ApiError(422, 'empty_edit', 'Escolha uma resposta para editar.');
        const next: Briefing = { ...state.briefing };
        for (const [step, value] of Object.entries(patch)) next[step as BriefStep] = text(value, 4000);
        if (state.messages.length >= 500) throw new ApiError(429, 'history_limit', 'Esta conversa chegou ao limite de respostas.');
        state.session.briefVersion++;
        delete state.session.entryMode;
        state.briefing = next;
        state.messages.push({ messageRef: randomUUID(), role: 'system', step: 'briefing-edited', text: JSON.stringify(patch), occurredAt: new Date().toISOString(), briefVersion: state.session.briefVersion });
        receipt = { digest: payloadDigest, status: 200, body: {briefVersion:state.session.briefVersion} };
      }
      if(['/api/site/messages','/api/site/lab/briefing','/api/site/briefing','/api/site/direct/briefing'].includes(path)){
        const message=path==='/api/site/direct/briefing'?state.messages.findLast(message=>message.step==='contact-direct'):path==='/api/site/lab/briefing'?state.messages.at(-2):state.messages.at(-1);
        if(message)stageMarketEvent(options.insights,state,'brief.answer_recorded',message.messageRef,requestId,message.occurredAt,{outcome:'recorded'});
      }
      if(path==='/api/site/identity'&&firstIdentity)stageMarketEvent(options.insights,state,'identity.provisioned',state.identity!.contactRef,requestId,undefined,{outcome:'recorded'});
      const result = await store.commit(hash, stored.revision, state, idempotencyKey, receipt);
      if (result.kind === 'mismatch') throw new ApiError(409, 'idempotency_mismatch', 'Esta tentativa já foi usada para outra resposta.');
      if (result.kind === 'conflict') throw new ApiError(409, 'brief_conflict', 'A conversa foi atualizada em outra aba. Recarregue as respostas antes de continuar.');
      if (result.kind === 'missing') throw new ApiError(401, 'session_required', 'Sua sessão expirou. Comece uma nova conversa.');
      if (result.kind === 'committed' || result.kind === 'replay') return reply(result.receipt.body, result.receipt.status);
      throw new Error('Unexpected transaction result');
    } catch (error) {
      const known = error instanceof ApiError;
      return reply({ code: known ? error.code : 'service_unavailable', message: known ? error.message : 'Não foi possível salvar agora. Tente novamente.', requestId, retryable: !known || error.status >= 500 || error.status === 429 }, known ? error.status : 503);
    }
  };
}
