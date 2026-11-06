import { createClient } from '@supabase/supabase-js';
import type { CommitResult, Receipt, SessionState, SessionStore, StoredSession } from './types';

/** Only the server service role may call the RPCs installed by the site migration. */
export class SupabaseSessionStore implements SessionStore {
  private client;
  constructor(url: string, serviceKey: string) {
    this.client = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  }
  private async rpc<T>(name: string, args: Record<string, unknown>): Promise<T> {
    const { data, error } = await this.client.rpc(name, args).abortSignal(AbortSignal.timeout(5000));
    if (error) throw new Error('Site persistence unavailable');
    return data as T;
  }
  async create(hash: string, state: SessionState, expiresAt: string) {
    await this.rpc('site_session_create', { p_hash: hash, p_state: state, p_expires: expiresAt });
  }
  read(hash: string) { return this.rpc<StoredSession | null>('site_session_read', { p_hash: hash }); }
  receipt(hash: string, key: string) { return this.rpc<Receipt | null>('site_session_receipt', { p_hash: hash, p_key: key }); }
  commit(hash: string, revision: number, state: SessionState, key: string, receipt: Receipt) {
    return this.rpc<CommitResult>('site_session_commit', { p_hash: hash, p_revision: revision, p_state: state, p_key: key, p_receipt: receipt });
  }
  quota(key: string, limit: number, expiresAt: string) {
    return this.rpc<boolean>('site_take_quota', { p_key: key, p_limit: limit, p_expires: expiresAt });
  }
  findHandoff(ref: string) { return this.rpc<string | null>('site_find_handoff', { p_ref: ref }); }
}
