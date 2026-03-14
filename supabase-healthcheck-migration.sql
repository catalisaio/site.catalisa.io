-- ============================================
-- Healthcheck table — keeps Supabase alive
-- Run this in the Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS healthcheck (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  ping_count int NOT NULL DEFAULT 0,
  last_ping timestamptz NOT NULL DEFAULT now()
);

-- Seed the single row
INSERT INTO healthcheck (id, ping_count, last_ping)
VALUES (1, 0, now())
ON CONFLICT (id) DO NOTHING;

-- Allow the anon key to read/write this table
ALTER TABLE healthcheck ENABLE ROW LEVEL SECURITY;

CREATE POLICY "healthcheck_anon_rw" ON healthcheck
  FOR ALL
  USING (true)
  WITH CHECK (true);
