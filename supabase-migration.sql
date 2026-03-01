-- ============================================
-- Catalisa Presentation Invites & Tracking
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Create tables
-- ============================================

CREATE TABLE IF NOT EXISTS presentation_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(8) UNIQUE NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  recipient_name text NOT NULL,
  recipient_email text,
  recipient_company text,
  recipient_role text,
  notes text,
  allowed_decks text[] NOT NULL DEFAULT '{*}',
  max_uses int,
  uses_count int NOT NULL DEFAULT 0,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS presentation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code varchar(8),
  event_type text NOT NULL,
  deck text,
  slide_index int,
  seconds numeric,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_invites_code ON presentation_invites(code);
CREATE INDEX IF NOT EXISTS idx_invites_active ON presentation_invites(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_events_invite_code ON presentation_events(invite_code);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON presentation_events(created_at DESC);

-- 3. Enable RLS
-- ============================================

ALTER TABLE presentation_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentation_events ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies — Invites
-- ============================================

-- Public: can read active invites (for validation)
CREATE POLICY "Public validate invite"
  ON presentation_invites
  FOR SELECT
  USING (is_active = true);

-- Authenticated: can read ALL invites (admin dashboard)
CREATE POLICY "Auth read all invites"
  ON presentation_invites
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Authenticated: can create invites
CREATE POLICY "Auth create invite"
  ON presentation_invites
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated: can update invites (toggle active, etc.)
CREATE POLICY "Auth update invite"
  ON presentation_invites
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- 5. RLS Policies — Events
-- ============================================

-- Public: can insert events (tracking from invite users)
CREATE POLICY "Public insert events"
  ON presentation_events
  FOR INSERT
  WITH CHECK (true);

-- Authenticated: can read events (analytics dashboard)
CREATE POLICY "Auth read events"
  ON presentation_events
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- 6. RPC: Increment invite uses (callable by anon)
-- ============================================

CREATE OR REPLACE FUNCTION increment_invite_uses(invite_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE presentation_invites
  SET uses_count = uses_count + 1
  WHERE code = invite_code
    AND is_active = true;
END;
$$;

-- Grant execute to anon role
GRANT EXECUTE ON FUNCTION increment_invite_uses(text) TO anon;
GRANT EXECUTE ON FUNCTION increment_invite_uses(text) TO authenticated;
