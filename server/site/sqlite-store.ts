import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { CommitResult, Receipt, SessionState, SessionStore, StoredSession } from './types';

/** Durable local development only. Production uses the shared transactional store. */
export class SqliteSessionStore implements SessionStore {
  private db: DatabaseSync;
  constructor(filename: string) {
    if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(filename);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY, revision INTEGER NOT NULL DEFAULT 0, state TEXT NOT NULL, expires_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS receipts(session_hash TEXT NOT NULL REFERENCES sessions(hash) ON DELETE CASCADE, key TEXT NOT NULL, value TEXT NOT NULL, expires_at TEXT NOT NULL, PRIMARY KEY(session_hash,key));
      CREATE TABLE IF NOT EXISTS quotas(key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at TEXT NOT NULL);`);
  }
  async create(hash: string, state: SessionState, expiresAt: string) {
    this.db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(new Date().toISOString());
    this.db.prepare('INSERT INTO sessions(hash,state,expires_at) VALUES(?,?,?)').run(hash, JSON.stringify(state), expiresAt);
  }
  async read(hash: string): Promise<StoredSession | null> {
    const row = this.db.prepare('SELECT revision,state,expires_at FROM sessions WHERE hash=? AND expires_at>?').get(hash, new Date().toISOString());
    return row ? { revision: Number(row.revision), state: JSON.parse(String(row.state)), expiresAt: String(row.expires_at) } : null;
  }
  async receipt(hash: string, key: string): Promise<Receipt | null> {
    const row = this.db.prepare('SELECT value FROM receipts WHERE session_hash=? AND key=? AND expires_at>?').get(hash, key, new Date().toISOString());
    return row ? JSON.parse(String(row.value)) : null;
  }
  async commit(hash: string, revision: number, state: SessionState, key: string, receipt: Receipt): Promise<CommitResult> {
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const now = new Date().toISOString();
      const session = this.db.prepare('SELECT revision FROM sessions WHERE hash=? AND expires_at>?').get(hash, now);
      let result: CommitResult;
      const previous = this.db.prepare('SELECT value FROM receipts WHERE session_hash=? AND key=? AND expires_at>?').get(hash, key, now);
      if (!session) result = { kind: 'missing' };
      else if (previous) {
        const saved: Receipt = JSON.parse(String(previous.value));
        result = saved.digest === receipt.digest ? { kind: 'replay', receipt: saved } : { kind: 'mismatch' };
      } else if (Number(session.revision) !== revision) result = { kind: 'conflict' };
      else {
        this.db.prepare('UPDATE sessions SET state=?, revision=revision+1 WHERE hash=?').run(JSON.stringify(state), hash);
        this.db.prepare('INSERT INTO receipts VALUES(?,?,?,?) ON CONFLICT(session_hash,key) DO UPDATE SET value=excluded.value,expires_at=excluded.expires_at').run(hash, key, JSON.stringify(receipt), new Date(Date.now() + 86400000).toISOString());
        result = { kind: 'committed', receipt };
      }
      this.db.exec('COMMIT');
      return result;
    } catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }
  async quota(key: string, limit: number, expiresAt: string): Promise<boolean> {
    this.db.prepare('DELETE FROM quotas WHERE expires_at<=?').run(new Date().toISOString());
    const row = this.db.prepare('INSERT INTO quotas VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count<? RETURNING count').get(key, expiresAt, limit);
    return !!row;
  }
  async findHandoff(ref: string): Promise<string | null> {
    const row = this.db.prepare("SELECT hash FROM sessions WHERE expires_at>? AND json_type(state,'$.handoffs.'||?) IS NOT NULL LIMIT 1").get(new Date().toISOString(), ref);
    return row ? String(row.hash) : null;
  }
  async pendingMarketSessions(limit:number){
    const rows=this.db.prepare("SELECT hash FROM sessions WHERE expires_at>? AND EXISTS (SELECT 1 FROM json_each(sessions.state,'$.marketOutbox') WHERE json_extract(value,'$.attempts')<8 AND json_extract(value,'$.nextAttemptAt')<=?) LIMIT ?").all(new Date().toISOString(),new Date().toISOString(),Math.min(20,Math.max(1,limit)));
    return rows.map(row=>String(row.hash));
  }
  close() { this.db.close(); }
}
