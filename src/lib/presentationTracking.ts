import { insertEvent } from './invites';

// ---- Global types ----
declare global {
  interface Window {
    clarity?: (method: string, ...args: unknown[]) => void;
  }
}

// ---- Session state ----
let _inviteCode: string | null = null;
let _recipientName: string | null = null;
let _recipientCompany: string | null = null;
let _deck: string | null = null;
let _sessionId: string | null = null;

export function initTrackingSession(opts: {
  inviteCode: string | null;
  recipientName?: string | null;
  recipientCompany?: string | null;
  deck: string;
}) {
  _inviteCode = opts.inviteCode;
  _recipientName = opts.recipientName ?? null;
  _recipientCompany = opts.recipientCompany ?? null;
  _deck = opts.deck;
  _sessionId = typeof crypto?.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  // Clarity: identify session
  if (window.clarity && _inviteCode) {
    window.clarity('identify', _inviteCode);
    window.clarity('set', 'invite_code', _inviteCode);
    window.clarity('set', 'deck', _deck);
    if (_recipientCompany) window.clarity('set', 'company', _recipientCompany);
    if (_recipientName) window.clarity('set', 'recipient', _recipientName);
  }

  // GTM: set user-scoped dimensions
  window.dataLayer?.push({
    event: 'presentation_context',
    invite_code: _inviteCode,
    recipient_name: _recipientName,
    recipient_company: _recipientCompany,
    deck: _deck,
    session_id: _sessionId,
  });
}

export function getTrackingContext() {
  return {
    inviteCode: _inviteCode,
    recipientName: _recipientName,
    recipientCompany: _recipientCompany,
    deck: _deck,
    sessionId: _sessionId,
  };
}

// ---- Track event (3 layers) ----

export function trackPresentationEvent(
  eventType: string,
  params: {
    slideIndex?: number;
    seconds?: number;
    extra?: Record<string, unknown>;
  } = {},
) {
  const metadata: Record<string, unknown> = {
    session_id: _sessionId,
    user_agent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    referrer: document.referrer || null,
    ...params.extra,
  };

  // 1. Supabase
  insertEvent({
    invite_code: _inviteCode,
    event_type: eventType,
    deck: _deck,
    slide_index: params.slideIndex ?? null,
    seconds: params.seconds ?? null,
    metadata,
  });

  // 2. GTM / GA4
  window.dataLayer?.push({
    event: `presentation_${eventType}`,
    invite_code: _inviteCode,
    recipient_name: _recipientName,
    recipient_company: _recipientCompany,
    deck: _deck,
    slide_index: params.slideIndex,
    seconds: params.seconds,
  });

  // 3. Clarity custom tag
  if (window.clarity) {
    window.clarity('event', eventType);
  }
}
