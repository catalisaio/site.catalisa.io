export type BriefStep = 'idea' | 'context' | 'goal';
export type Briefing = Partial<Record<BriefStep, string>>;
export interface Session {
  entryMode?:'direct';
  sessionRef: string;
  briefVersion: number;
  identityStatus: 'anonymous' | 'provisional' | 'verified';
  leadStatus: 'none' | 'pending' | 'created' | 'failed';
}
export interface Identity {
  contactRef: string;
  leadRef: string;
  identityStatus: 'provisional' | 'verified';
  briefVersion: number;
}
export interface Message {
  messageRef: string;
  role: 'visitor' | 'system';
  step: string;
  text: string;
  occurredAt: string;
  briefVersion: number;
}
export interface SessionState {
  marketOutbox?:import('../../shared/site-market').MarketOutbox;
  session: Session;
  briefing: Briefing;
  messages: Message[];
  identity?: Identity;
  name?: string;
  contactDetails?:import('../../shared/site-contact').ContactDetails;
  jobs?: Record<string, { job: ConceptJob; startedAt: string; deadline: string; failureDiagnostic?:{stage:string;httpStatus?:number} }>;
  concepts?: Concept[];
  handoffs?: Record<string, { receipt: Handoff; packet: HandoffPacket; deadline: string; lastSequence: number; events: Record<string, string> }>;
}
export interface GenerationInput { briefing: Briefing; previous?: ConceptContent; refinement?: string;locale?:import('../../shared/site-concept-locale').ConceptLocale }
export interface ConceptGenerator { generate(input: GenerationInput, signal: AbortSignal): Promise<unknown> }
export interface HandoffPacket {
  marketContext?:{subjectKey:string;policyVersion:string};
  schemaVersion: '1.0'; handoffRef: string; channel: HandoffChannel; address?: string;
  contact: { contactRef: string; leadRef: string; name: string;email?:string;phone?:string };
  briefing: Briefing; briefVersion: number; messages: Message[]; concept?: Concept;
  confirmation: { confirmed: true; occurredAt: string };
}
export interface HandoffTransport {
  channels: HandoffChannel[];
  send(packet: HandoffPacket, signal: AbortSignal): Promise<void>;
  observe?(ref:string,signal:AbortSignal):Promise<import('./concept-types').HandoffEvent[]>;
  readThread?(access:import('../../shared/site-thread').SiteVisitorAccess,signal:AbortSignal,acknowledgeReplies?:boolean):Promise<import('../../shared/site-thread').SiteVisitorThread>;
  appendVisitorMessage?(access:import('../../shared/site-thread').SiteVisitorAccess,input:{clientMessageId:string;text:string},signal:AbortSignal):Promise<import('../../shared/site-thread').SiteVisitorThread>;
}
export interface StoredSession { revision: number; state: SessionState; expiresAt: string }
export interface Receipt { digest: string; status: number; body: unknown }
export type CommitResult = { kind: 'committed' | 'replay'; receipt: Receipt } | { kind: 'conflict' | 'mismatch' | 'missing' };
export interface SessionStore {
  pendingMarketSessions?(limit:number):Promise<string[]>;
  create(hash: string, state: SessionState, expiresAt: string): Promise<void>;
  read(hash: string): Promise<StoredSession | null>;
  receipt(hash: string, key: string): Promise<Receipt | null>;
  commit(hash: string, revision: number, state: SessionState, key: string, receipt: Receipt): Promise<CommitResult>;
  quota(key: string, limit: number, expiresAt: string): Promise<boolean>;
  findHandoff(ref: string): Promise<string | null>;
}
import type { Concept, ConceptContent, ConceptJob, Handoff, HandoffChannel } from './concept-types';
