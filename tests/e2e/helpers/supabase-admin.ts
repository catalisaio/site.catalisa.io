import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

/**
 * Create a Supabase client authenticated as the E2E test user.
 * Uses the anon key + user session so RLS policies apply normally.
 */
export async function createTestClient() {
  const client = createClient(supabaseUrl, supabaseAnonKey);

  const email = process.env.E2E_TEST_EMAIL!;
  const password = process.env.E2E_TEST_PASSWORD!;

  if (!email || !password) {
    throw new Error('E2E_TEST_EMAIL and E2E_TEST_PASSWORD must be set in .env');
  }

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(`Supabase sign-in failed: ${error.message}`);
  }

  return client;
}

/**
 * Query training_progress rows for the test user.
 */
export async function getProgressRows(userId: string) {
  const client = await createTestClient();
  const { data, error } = await client
    .from('training_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new Error(`Query training_progress failed: ${error.message}`);
  return data ?? [];
}

/**
 * Query training_sessions rows for the test user.
 */
export async function getSessionRows(userId: string) {
  const client = await createTestClient();
  const { data, error } = await client
    .from('training_sessions')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new Error(`Query training_sessions failed: ${error.message}`);
  return data ?? [];
}

/**
 * Query training_events rows for the test user.
 */
export async function getEventRows(userId: string) {
  const client = await createTestClient();
  const { data, error } = await client
    .from('training_events')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new Error(`Query training_events failed: ${error.message}`);
  return data ?? [];
}

/**
 * Delete all test data for the given user from training tables.
 */
export async function cleanupTestData(userId: string) {
  const client = await createTestClient();

  // Delete in order: events → sessions → progress (no FK constraints expected, but safe order)
  await client.from('training_events').delete().eq('user_id', userId);
  await client.from('training_sessions').delete().eq('user_id', userId);
  await client.from('training_progress').delete().eq('user_id', userId);
}
