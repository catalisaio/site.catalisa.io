import { supabase } from './supabase';

// ---- Types ----

export interface PresentationInvite {
  id: string;
  code: string;
  created_by: string;
  recipient_name: string;
  recipient_email: string | null;
  recipient_company: string | null;
  recipient_role: string | null;
  notes: string | null;
  allowed_decks: string[];
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  created_at: string;
  is_active: boolean;
}

export interface PresentationEvent {
  id: string;
  invite_code: string | null;
  event_type: string;
  deck: string | null;
  slide_index: number | null;
  seconds: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface CreateInviteInput {
  recipient_name: string;
  recipient_email?: string;
  recipient_company?: string;
  recipient_role?: string;
  notes?: string;
  allowed_decks: string[];
  max_uses?: number | null;
  expires_at?: string | null;
}

// ---- Helpers ----

function generateCode(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ---- Public (no auth needed) ----

export async function validateInvite(code: string): Promise<PresentationInvite | null> {
  const { data, error } = await supabase
    .from('presentation_invites')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  const invite = data as PresentationInvite;

  // Check expiration
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) return null;

  // Check max uses
  if (invite.max_uses !== null && invite.uses_count >= invite.max_uses) return null;

  return invite;
}

export async function incrementUses(code: string): Promise<void> {
  await supabase.rpc('increment_invite_uses', { invite_code: code });
}

export async function insertEvent(event: {
  invite_code: string | null;
  event_type: string;
  deck?: string | null;
  slide_index?: number | null;
  seconds?: number | null;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  await supabase.from('presentation_events').insert({
    invite_code: event.invite_code,
    event_type: event.event_type,
    deck: event.deck ?? null,
    slide_index: event.slide_index ?? null,
    seconds: event.seconds ?? null,
    metadata: event.metadata ?? null,
  });
}

// ---- Auth-required (admin) ----

export async function createInvite(input: CreateInviteInput): Promise<PresentationInvite> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const code = generateCode();

  const { data, error } = await supabase
    .from('presentation_invites')
    .insert({
      code,
      created_by: user.id,
      recipient_name: input.recipient_name,
      recipient_email: input.recipient_email || null,
      recipient_company: input.recipient_company || null,
      recipient_role: input.recipient_role || null,
      notes: input.notes || null,
      allowed_decks: input.allowed_decks,
      max_uses: input.max_uses ?? null,
      expires_at: input.expires_at ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as PresentationInvite;
}

export async function listInvites(): Promise<PresentationInvite[]> {
  const { data, error } = await supabase
    .from('presentation_invites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as PresentationInvite[];
}

export async function toggleInviteActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from('presentation_invites')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) throw error;
}

export async function listEvents(inviteCode?: string): Promise<PresentationEvent[]> {
  let query = supabase
    .from('presentation_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (inviteCode) {
    query = query.eq('invite_code', inviteCode);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as PresentationEvent[];
}
