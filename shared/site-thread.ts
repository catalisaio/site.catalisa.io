export interface SiteVisitorAccess {handoffRef:string;contactRef:string;leadRef:string}
export interface SiteThreadMessage {messageId:string;clientMessageId:string;sequence:number;role:'visitor'|'team';text:string;occurredAt:string;actorId?:string;displayName?:string}
export interface SiteVisitorThread {
  handoffRef:string;channel:'here';status:'accepted'|'assigned';updatedAt:string;
  owner?:{displayName:string;claimedAt:string};messages:Omit<SiteThreadMessage,'actorId'>[];lastSequence:number;
}
