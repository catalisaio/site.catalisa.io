import catalog from '../src/redesign/data/catalog.json';
/** Node-free DTOs and allowlists. Safe for browser-facing type imports. */
export const MARKET_EVENT_NAMES=['session.started','brief.answer_recorded','identity.provisioned','concept.requested','concept.ready','concept.failed','concept.refined','handoff.requested','handoff.delivered','human.assigned'] as const;
export const MARKET_TAXONOMY={
 revision:'2026-10-25-draft-1',status:'draft',
 sectorCategory:['unknown','financial','retail','health','education','services','other'],
 problemCategory:['unknown','acquisition','service','operations','collection','credit','legacy'],
 productCategory:['unknown','financial','credit','commerce','operations','customer-service','integration'],
 intentCategory:['unknown','explore','build','modernize','replace'],
 outcome:['unknown','recorded','requested','ready','failed','delivered','assigned'],
 channel:['here','email','whatsapp'],capabilitySlug:catalog.blocks.map(block=>block.slug),
} as const;
export type MarketEventName=typeof MARKET_EVENT_NAMES[number];
export type MarketCategories=Partial<Record<'sectorCategory'|'problemCategory'|'productCategory'|'intentCategory'|'outcome'|'channel'|'capabilitySlug',string>>;
export interface MarketPolicyApproval {status:'approved';version:string;publishedPolicySha256:string;approvedBy:string;approvedAt:string;retentionDays:number;minimumSubjects:number;taxonomyRevision:string}
export interface MarketFrame {name:MarketEventName;subjectKey:string;briefVersion:number;eventDay:string;taxonomyRevision:string;policyVersion?:string;categories:MarketCategories;classification?:{origin:'server-event';confidence:'observed-state-unclassified-demand'}}
export interface MarketReview {subjectKey:string;categories:MarketCategories;revision:number;reviewerKey:string;reviewedAt:string;origin?:'operator';confidence?:'human-reviewed';history?:Omit<MarketReview,'history'>[]}
export interface PreparedMarketEvent {eventKey:string;frame:MarketFrame;expiresAt:string;proof:string}
export interface MarketStorage {
 append(eventKey:string,frame:MarketFrame,expiresAt:string):Promise<void|'suppressed'>;
 readReview(subjectKey:string):Promise<MarketReview|null>;
 reviews?(subjectKeys:string[]):Promise<Map<string,MarketReview|null>>;
 writeReview(review:MarketReview,expectedRevision:number,expiresAt:string):Promise<void>;
 events(fromDay:string,toDay:string):Promise<MarketFrame[]>;
 cleanup?():Promise<void>;
 eraseSubject?(subjectKey:string,expiresAt:string):Promise<{removed:number;remaining:number}>;
}
export interface MarketActor {id:string;email:string}
export interface MarketOutboxEntry {event:PreparedMarketEvent;attempts:number;nextAttemptAt:string;leaseId?:string;lastError?:'delivery_unavailable'}
export type MarketOutbox=Record<string,MarketOutboxEntry>;
export interface MarketOutboxOwner {marketOutbox?:MarketOutbox}
export interface MarketOutboxSource {pending(limit:number):Promise<string[]>;update(key:string,change:(owner:MarketOutboxOwner)=>boolean):Promise<boolean>}
