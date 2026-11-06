import type {ConceptDisclaimer,ConceptLocale} from '../../shared/site-concept-locale';
export interface ConceptContent {
  schemaVersion: '1.0';
  title: string;
  summary: string;
  hypothesis: string;
  roles: string[];
  screens: { id: string; title: string; description: string; items: { label: string; value: string }[]; action: { label: string; nextScreenId: string | null } }[];
  blocks: { slug: string; role: string }[];
  journey: { id: string; label: string; description: string; blockSlugs: string[]; humanReview: boolean }[];
  limitations: string[];
  disclaimer: ConceptDisclaimer;
}
export interface Concept { conceptRef: string; version: number; briefVersion: number; content: ConceptContent;locale?:ConceptLocale }
export interface OperationError { code: string; message: string; requestId: string; retryable: boolean }
export interface ConceptJob { jobRef: string; status: 'running' | 'succeeded' | 'failed' | 'expired'; requestId: string; concept?: Concept; error?: OperationError }
export type HandoffChannel = 'here' | 'email' | 'whatsapp';
export interface Handoff { handoffRef: string; status: 'accepted' | 'queued' | 'delivered' | 'assigned' | 'failed'; requestId: string; updatedAt: string }
export interface HandoffEvent { eventId: string; handoffRef: string; sequence: number; status: Exclude<Handoff['status'], 'accepted'>; occurredAt: string }
