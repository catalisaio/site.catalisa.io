import { createHash, createHmac } from 'node:crypto';
import { IntegrationError } from './concept';
import type { HandoffPacket, HandoffTransport } from './types';
import type { HandoffChannel, HandoffEvent } from './concept-types';

/**
 * Real handoff into the Catalisa panel (staging first), using only existing product routes:
 * - dedup ledger: Data Store collection (pii, `packet` encrypted), one document per handoffRef;
 * - team destination: a CRM lead of the dedicated "Site Catalisa" lead type, born in the first stage
 *   of the dedicated pipeline, with briefing, concept version, confirmation and history in `notes`.
 *
 * A lead requires a valid phone in the product, so a packet without one is rejected BEFORE any side
 * effect; no phone is ever derived or fabricated. `send` resolving means "recorded in the team queue",
 * never delivered or assigned: those come only from `observe`, from real product evidence.
 */
export interface CatalisaHandoffConfig {
  origin: string; token: string; ownerEmail: string;
  collection: string; leadType: string; stageId: string; channels: string; local?: boolean;
}
export interface HandoffObservations { delivered?: { at: string; basis: 'whatsapp-message-status' }; assigned?: { at: string; basis: 'lead-assignee-observed' } }
interface LedgerAttributes {
  purpose: typeof purpose; kind: 'handoff'; handoffRef: string; digest: string; channel: HandoffChannel;
  status: 'reserved' | 'lead_created' | 'blocked_existing_lead'; packet: unknown; messagesOmitted: number;
  leadId?: string; acceptedAt?: string; observations?: HandoffObservations; createdAt: string; expiresAt: string;
}
interface LedgerDocument { id: string; docKey: string; version: number; attributes: LedgerAttributes }

const purpose = 'catalisa-site-handoff-v1' as const;
const e164 = /^\+[1-9]\d{9,14}$/;
const sha = (value: string) => createHash('sha256').update(value).digest('hex');
const record = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
const list = (value: unknown): unknown[] => Array.isArray(value) ? value : Array.isArray(record(value).data) ? record(value).data as unknown[] : [];
const pending = (stage: string, httpStatus?: number) => new IntegrationError('handoff_unconfirmed', 'Ainda não recebemos a confirmação do encaminhamento. Sua conversa está salva.', true, { stage, ...(httpStatus ? { httpStatus } : {}) });
const NOTES_BUDGET = 40000, LEDGER_PACKET_BUDGET = 400000, LEDGER_RETENTION_MS = 180 * 86400000;

/** Customer-visible text is pt-BR data; it is read by the account team in the lead. */
export function leadNotes(packet: HandoffPacket, collection: string): string {
  const channel = { here: 'Continuar pelo site', email: 'E-mail', whatsapp: 'WhatsApp' }[packet.channel];
  const head = ['Encaminhamento do site Catalisa', 'Referência: ' + packet.handoffRef, 'Confirmado pelo visitante em: ' + packet.confirmation.occurredAt,
    'Canal preferido: ' + channel + (packet.address ? ' — ' + packet.address : ''),
    'Contato: ' + [packet.contact.name, packet.contact.email, packet.contact.phone].filter(Boolean).join(' · '), '',
    'Briefing (versão ' + packet.briefVersion + ')', '• Ideia: ' + (packet.briefing.idea ?? '—'), '• Contexto: ' + (packet.briefing.context ?? '—'), '• Objetivo: ' + (packet.briefing.goal ?? '—')];
  const concept = packet.concept;
  if (concept) {
    const c = concept.content;
    head.push('', 'Conceito exploratório (versão ' + concept.version + ', ' + concept.conceptRef + ')', c.title, c.summary, 'Hipótese: ' + c.hypothesis,
      'Papéis: ' + c.roles.join(', '), 'Telas:', ...c.screens.map(screen => '• ' + screen.title + ' — ' + screen.description),
      'Jornada:', ...c.journey.map((step, index) => (index + 1) + '. ' + step.label + (step.humanReview ? ' [revisão humana]' : '') + ' — ' + step.description + ' (' + step.blockSlugs.join(', ') + ')'),
      'Peças: ' + c.blocks.map(block => block.slug + ' (' + block.role + ')').join('; '), 'Limitações:', ...c.limitations.map(item => '• ' + item), c.disclaimer);
  } else head.push('', 'Sem conceito gerado: o visitante encaminhou só o briefing.');
  const body = head.join('\n');
  const history: string[] = [];
  let used = body.length + 200;
  for (let index = packet.messages.length - 1; index >= 0; index--) {
    const m = packet.messages[index];
    const line = '[' + m.occurredAt + '] ' + (m.role === 'visitor' ? 'Visitante' : 'Site') + ' (' + m.step + ', briefing v' + m.briefVersion + '): ' + m.text;
    if (used + line.length + 1 > NOTES_BUDGET) break;
    history.unshift(line); used += line.length + 1;
  }
  const omitted = packet.messages.length - history.length;
  return body + '\n\nHistórico (' + packet.messages.length + ' mensagens)\n' + (omitted ? '… ' + omitted + ' mensagens mais antigas omitidas aqui; registro integral no Data Store, coleção ' + collection + ', chave handoff:' + packet.handoffRef + '\n' : '') + history.join('\n');
}

/** Body and headers accepted by ContactOperations.webhook (same HMAC as the site contract). */
export function signHandoffEvent(event: HandoffEvent, secret: string, now = Date.now()) {
  const body = JSON.stringify({ eventId: event.eventId, handoffRef: event.handoffRef, sequence: event.sequence, status: event.status, occurredAt: event.occurredAt });
  const timestamp = String(Math.floor(now / 1000));
  return { body, headers: { 'Content-Type': 'application/json', 'X-Catalisa-Timestamp': timestamp, 'X-Catalisa-Signature': createHmac('sha256', secret).update(timestamp + '.' + body).digest('hex') } };
}

export class CatalisaHandoffTransport implements HandoffTransport {
  readonly channels: HandoffChannel[];
  private origin: string;
  private base: string;
  private ready?: Promise<void>;
  constructor(private config: CatalisaHandoffConfig) {
    const url = new URL(config.origin);
    if (url.username || url.password || url.search || url.hash || url.pathname !== '/' || (url.protocol !== 'https:' && !(config.local && url.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(url.hostname)))) throw Error('Invalid handoff origin');
    if (!/^[a-z][a-z0-9_-]{0,62}$/.test(config.collection) || !config.token || !config.ownerEmail || !/^[A-Z][A-Z0-9_]{0,49}$/.test(config.leadType) || !/^[\w-]{1,120}$/.test(config.stageId)) throw Error('Invalid handoff configuration');
    const channels = [...new Set(config.channels.split(',').map(value => value.trim()).filter(Boolean))];
    // `here` would need the team to answer inside the site; the product has no such route.
    if (!channels.length || channels.some(value => !['email', 'whatsapp'].includes(value))) throw Error('Invalid handoff channels: only email and whatsapp have a team destination');
    this.channels = channels as HandoffChannel[];
    this.origin = url.origin; this.base = '/data-store/collections/' + config.collection;
  }

  private async call(route: string, signal: AbortSignal, stage: string, method = 'GET', body?: unknown): Promise<{ status: number; body: unknown }> {
    let response: Response;
    try {
      response = await fetch(this.origin + route, { method, headers: { Authorization: 'Bearer ' + this.config.token, Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.any([signal, AbortSignal.timeout(8000)]), redirect: 'error' });
    } catch { throw pending(stage); }
    if (response.status === 204) return { status: 204, body: {} };
    const reader = response.body?.getReader(), parts: Uint8Array[] = [];
    let bytes = 0;
    if (reader) while (true) { const part = await reader.read(); if (part.done) break; bytes += part.value.byteLength; if (bytes > 2000000) { await reader.cancel(); throw pending(stage, response.status); } parts.push(part.value); }
    let decoded: unknown = {};
    try { if (bytes) decoded = JSON.parse(Buffer.concat(parts).toString('utf8')); } catch { throw pending(stage, response.status); }
    return { status: response.status, body: decoded };
  }
  private async verify(signal: AbortSignal) {
    const me = await this.call('/auth/me', signal, 'owner-check');
    if (me.status !== 200 || (record(me.body).email ?? record(record(me.body).user).email) !== this.config.ownerEmail) throw pending('owner-check', me.status);
    const meta = await this.call(this.base, signal, 'ledger-schema');
    const collection = record(record(meta.body).data ?? meta.body), properties = record(record(collection.jsonSchema).properties);
    if (meta.status !== 200 || collection.pii !== true || record(properties.packet).encrypted !== true || !(record(properties.purpose).enum as unknown[] | undefined)?.includes(purpose)) throw pending('ledger-schema', meta.status);
  }
  private ensureReady(signal: AbortSignal) { return this.ready ??= this.verify(signal).catch(reason => { this.ready = undefined; throw reason; }); }
  private ledger(value: unknown, ref: string): LedgerDocument {
    const doc = value as LedgerDocument;
    if (!doc?.id || !Number.isSafeInteger(doc.version) || doc.attributes?.purpose !== purpose || doc.attributes.handoffRef !== ref || doc.docKey !== 'handoff:' + ref) throw pending('ledger-document');
    return doc;
  }
  private async find(ref: string, signal: AbortSignal): Promise<LedgerDocument | null> {
    const result = await this.call(this.base + '/query', signal, 'ledger-query', 'POST', { where: { $docKey: { op: 'eq', value: 'handoff:' + ref } }, page: 1, pageSize: 2 });
    const docs = list(result.body);
    if (![200, 201].includes(result.status) || !Array.isArray(record(result.body).data) || docs.length > 1) throw pending('ledger-query', result.status);
    return docs.length ? this.ledger(docs[0], ref) : null;
  }
  /** CAS write; on conflict re-reads and lets `merge` decide from the current document. */
  private async write(doc: LedgerDocument, signal: AbortSignal, merge: (current: LedgerAttributes) => LedgerAttributes | null) {
    for (let attempt = 0, current: LedgerDocument | null = doc; attempt < 4 && current; attempt++) {
      const next = merge(current.attributes);
      if (!next) return current.attributes;
      const result = await this.call(this.base + '/documents/' + encodeURIComponent(current.id), signal, 'ledger-write', 'PUT', { expectedVersion: current.version, data: next });
      if (result.status === 200) return next;
      if (result.status !== 409) throw pending('ledger-write', result.status);
      current = await this.find(doc.attributes.handoffRef, signal);
    }
    throw pending('ledger-write');
  }
  private async siteLead(leadId: string, ref: string, signal: AbortSignal): Promise<Record<string, unknown> | null> {
    const result = await this.call('/leads/' + encodeURIComponent(leadId), signal, 'lead-read');
    if (result.status === 404) return null;
    if (result.status !== 200) throw pending('lead-read', result.status);
    const lead = record(result.body);
    return record(lead.customData).siteHandoffRef === ref ? lead : null;
  }

  async send(packet: HandoffPacket, signal: AbortSignal) {
    const ref = packet.handoffRef;
    if (!/^handoff_[\w-]{1,90}$/.test(ref) || packet.confirmation?.confirmed !== true || !this.channels.includes(packet.channel) || !packet.contact?.name) throw new IntegrationError('handoff_rejected', 'O serviço não aceitou este encaminhamento. Sua conversa está salva.');
    // The CRM lead needs a phone. Use only what the visitor typed: WhatsApp address or contact phone.
    const phone = packet.channel === 'whatsapp' ? packet.address : packet.contact.phone;
    if (!phone || !e164.test(phone)) throw new IntegrationError('handoff_rejected', 'Para encaminhar à equipe, informe um telefone com DDD. Sua conversa está salva.');
    await this.ensureReady(signal);
    const digest = sha(JSON.stringify(packet));
    let doc = await this.find(ref, signal);
    if (!doc) {
      const stored = structuredClone(packet);
      let messagesOmitted = 0;
      while (stored.messages.length && Buffer.byteLength(JSON.stringify(stored)) > LEDGER_PACKET_BUDGET) { stored.messages.shift(); messagesOmitted++; }
      const now = Date.now();
      const data: LedgerAttributes = { purpose, kind: 'handoff', handoffRef: ref, digest, channel: packet.channel, status: 'reserved', packet: stored, messagesOmitted, createdAt: new Date(now).toISOString(), expiresAt: new Date(now + LEDGER_RETENTION_MS).toISOString() };
      const created = await this.call(this.base + '/documents', signal, 'ledger-create', 'POST', { docKey: 'handoff:' + ref, data });
      if (created.status === 201) doc = this.ledger(record(created.body).data ?? created.body, ref);
      else if (created.status === 409) doc = await this.find(ref, signal);
      else throw pending('ledger-create', created.status);
      if (!doc) throw pending('ledger-create');
    }
    if (doc.attributes.digest !== digest) throw pending('ledger-mismatch');
    if (doc.attributes.status === 'lead_created' && doc.attributes.leadId) return;
    if (doc.attributes.status === 'blocked_existing_lead') throw pending('existing-lead');

    // Second dedup layer: a lost response may have created the lead already.
    const lookup = await this.call('/leads/filter/custom-data?' + new URLSearchParams({ field: 'siteHandoffRef', value: ref, limit: '2' }), signal, 'lead-lookup');
    const rows = list(lookup.body);
    if (lookup.status !== 200 || (!Array.isArray(lookup.body) && !Array.isArray(record(lookup.body).data)) || rows.length > 1) throw pending('lead-lookup', lookup.status);
    let leadId = typeof record(rows[0]).id === 'string' ? record(rows[0]).id as string : undefined;
    if (!leadId) {
      const email = packet.channel === 'email' ? packet.address : packet.contact.email;
      const customData = { source: 'site-catalisa', siteHandoffRef: ref, siteContactRef: packet.contact.contactRef, siteLeadRef: packet.contact.leadRef, siteChannel: packet.channel,
        ...(packet.address ? { siteChannelAddress: packet.address } : {}), siteBriefVersion: packet.briefVersion, siteConfirmedAt: packet.confirmation.occurredAt,
        ...(packet.concept ? { siteConceptRef: packet.concept.conceptRef, siteConceptVersion: packet.concept.version } : {}) };
      const created = await this.call('/leads', signal, 'lead-create', 'POST', { name: packet.contact.name, phone, ...(email ? { email } : {}), type: this.config.leadType, stageId: this.config.stageId, notes: leadNotes(packet, this.config.collection), customData });
      if (created.status === 200 || created.status === 201) leadId = record(created.body).id as string;
      else if (created.status === 409) {
        // Same phone already in the account. Ours only if it carries this handoffRef (concurrent send).
        // Someone else's lead is never modified: the handoff is held for a human decision.
        const existing = record(created.body).existingLeadId;
        if (typeof existing === 'string' && await this.siteLead(existing, ref, signal)) leadId = existing;
        else { await this.write(doc, signal, current => current.status === 'reserved' ? { ...current, status: 'blocked_existing_lead' } : null); throw pending('existing-lead', 409); }
      } else throw pending('lead-create', created.status);
      if (typeof leadId !== 'string' || !leadId) throw pending('lead-create', created.status);
    }
    const id = leadId, acceptedAt = new Date().toISOString();
    const saved = await this.write(doc, signal, current => {
      if (current.leadId && current.leadId !== id) throw pending('ledger-lead-mismatch');
      return current.status === 'lead_created' ? null : { ...current, status: 'lead_created', leadId: id, acceptedAt: current.acceptedAt ?? acceptedAt };
    });
    if (saved.leadId !== id) throw pending('ledger-write');
  }

  /**
   * Evidence-only reconciliation. Never infers anything from the ACK or from a workflow run:
   * - assigned: the site lead has an assignee (a panel user) — first observation time is persisted;
   * - delivered (WhatsApp only): an outbound message in the lead's chat with a real delivered/read
   *   status after acceptance. E-mail has no delivery evidence in the product, so it never emits it.
   * Observations are persisted so repeated calls produce byte-identical events (webhook dedup).
   */
  async observe(ref: string, signal: AbortSignal): Promise<HandoffEvent[]> {
    if (!/^handoff_[\w-]{1,90}$/.test(ref)) return [];
    await this.ensureReady(signal);
    const doc = await this.find(ref, signal);
    if (!doc || doc.attributes.status !== 'lead_created' || !doc.attributes.leadId || !doc.attributes.acceptedAt) return [];
    const lead = await this.siteLead(doc.attributes.leadId, ref, signal);
    if (!lead) return [];
    const found: HandoffObservations = {};
    if (doc.attributes.channel === 'whatsapp' && !doc.attributes.observations?.delivered) {
      const since = Date.parse(doc.attributes.acceptedAt);
      const chats = await this.call('/chats?' + new URLSearchParams({ 'filter[leadId][eq]': doc.attributes.leadId }), signal, 'chat-list');
      if (chats.status !== 200) throw pending('chat-list', chats.status);
      let first: number | undefined;
      for (const chat of list(chats.body).slice(0, 5)) {
        const chatId = record(chat).id;
        if (typeof chatId !== 'string' || record(chat).leadId !== doc.attributes.leadId) continue;
        const messages = await this.call('/chats/' + encodeURIComponent(chatId) + '/messages?limit=50', signal, 'chat-messages');
        if (messages.status !== 200) throw pending('chat-messages', messages.status);
        for (const message of list(messages.body).map(record)) {
          const at = Date.parse(String(message.deliveredAt ?? message.readAt ?? ''));
          if (message.fromMe === true && Number.isFinite(at) && at >= since && (first === undefined || at < first)) first = at;
        }
      }
      if (first !== undefined) found.delivered = { at: new Date(first).toISOString(), basis: 'whatsapp-message-status' };
    }
    const assignee = lead.assignedToId ?? record(lead.assignedTo).id;
    if (!doc.attributes.observations?.assigned && typeof assignee === 'string' && assignee) found.assigned = { at: new Date().toISOString(), basis: 'lead-assignee-observed' };
    const saved = Object.keys(found).length ? await this.write(doc, signal, current => {
      const merged = { ...found, ...current.observations };
      return JSON.stringify(merged) === JSON.stringify(current.observations ?? {}) ? null : { ...current, observations: merged };
    }) : doc.attributes;
    const observations = saved.observations ?? {}, events: HandoffEvent[] = [];
    if (observations.delivered) events.push({ eventId: ref + '-delivered', handoffRef: ref, sequence: 2, status: 'delivered', occurredAt: observations.delivered.at });
    if (observations.assigned) events.push({ eventId: ref + '-assigned', handoffRef: ref, sequence: 3, status: 'assigned', occurredAt: observations.assigned.at });
    return events;
  }
}

export function catalisaHandoff(env: Record<string, string | undefined>, local: boolean) {
  if (env.SITE_HANDOFF_BACKEND !== 'catalisa') return undefined;
  const { SITE_CATALISA_ORIGIN: origin, SITE_CATALISA_TOKEN: token, SITE_CATALISA_OWNER_EMAIL: ownerEmail, SITE_HANDOFF_COLLECTION: collection, SITE_HANDOFF_LEAD_TYPE: leadType, SITE_HANDOFF_STAGE_ID: stageId, SITE_HANDOFF_CHANNELS: channels } = env;
  if (!origin || !token || !ownerEmail || !collection || !leadType || !stageId || !channels) throw Error('Catalisa handoff configuration missing');
  return new CatalisaHandoffTransport({ origin, token, ownerEmail, collection, leadType, stageId, channels, local });
}
