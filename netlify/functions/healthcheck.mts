import type { Config } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const MAX_COUNT = 1_000_000;

export default async function handler() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return new Response(JSON.stringify({ error: 'Missing Supabase env vars' }), { status: 500 });
  }

  const supabase = createClient(url, key);

  // Read current count
  const { data: current } = await supabase
    .from('healthcheck')
    .select('ping_count')
    .eq('id', 1)
    .single();

  const nextCount = current ? (current.ping_count + 1) % MAX_COUNT : 1;

  // Upsert the single row — resets counter at MAX_COUNT
  const { data, error } = await supabase
    .from('healthcheck')
    .upsert({ id: 1, ping_count: nextCount, last_ping: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, ping_count: data.ping_count, last_ping: data.last_ping }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Run every 12 hours
export const config: Config = {
  schedule: '0 */12 * * *',
};
