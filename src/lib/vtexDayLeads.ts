import { supabase } from './supabase';
import type { PersonaKey } from '../data/vtexDay2026';

export interface VtexDayLeadInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  persona: PersonaKey | 'outro';
  vtex_store_name?: string;
  monthly_orders_range?: string;
  interests: string[];
  privacy_accepted: boolean;
}

export interface VtexDayLead extends VtexDayLeadInput {
  id: string;
  created_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  source_path: string;
}

function readUtm() {
  if (typeof window === 'undefined') {
    return { utm_source: null, utm_medium: null, utm_campaign: null };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  };
}

export async function insertVtexDayLead(input: VtexDayLeadInput): Promise<void> {
  const utm = readUtm();
  const { error } = await supabase.from('vtex_day_leads').insert({
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    company: input.company || null,
    role: input.role || null,
    persona: input.persona,
    vtex_store_name: input.vtex_store_name || null,
    monthly_orders_range: input.monthly_orders_range || null,
    interests: input.interests,
    privacy_accepted: input.privacy_accepted,
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    source_path: '/vtex-day-2026',
  });
  if (error) throw error;
}
