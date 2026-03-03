-- ============================================================
-- Training Progress & Analytics — Supabase Migration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. training_progress — one row per user per lesson (replaces localStorage)
CREATE TABLE IF NOT EXISTS training_progress (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug text NOT NULL,
  module_slug text NOT NULL,
  lesson_slug text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  time_spent_seconds int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_slug, module_slug, lesson_slug)
);

ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own progress"
  ON training_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own progress"
  ON training_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own progress"
  ON training_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- 2. training_sessions — one row per lesson visit
CREATE TABLE IF NOT EXISTS training_sessions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug   text NOT NULL,
  module_slug   text NOT NULL,
  lesson_slug   text NOT NULL,
  session_id    text NOT NULL,
  started_at    timestamptz NOT NULL DEFAULT now(),
  ended_at      timestamptz,
  active_seconds int NOT NULL DEFAULT 0,
  idle_seconds   int NOT NULL DEFAULT 0,
  completed     boolean NOT NULL DEFAULT false,
  user_agent    text,
  viewport      text,
  locale        text
);

ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own sessions"
  ON training_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own sessions"
  ON training_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own sessions"
  ON training_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- 3. training_events — audit trail (mirrors presentation_events pattern)
CREATE TABLE IF NOT EXISTS training_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id    text,
  event_type    text NOT NULL,
  course_slug   text,
  module_slug   text,
  lesson_slug   text,
  seconds       numeric,
  metadata      jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE training_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own events"
  ON training_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own events"
  ON training_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_training_progress_user
  ON training_progress (user_id);

CREATE INDEX IF NOT EXISTS idx_training_sessions_user
  ON training_sessions (user_id);

CREATE INDEX IF NOT EXISTS idx_training_sessions_session_id
  ON training_sessions (session_id);

CREATE INDEX IF NOT EXISTS idx_training_events_user
  ON training_events (user_id);

CREATE INDEX IF NOT EXISTS idx_training_events_session
  ON training_events (session_id);

-- 5. RPC: complete_training_lesson — idempotent UPSERT
CREATE OR REPLACE FUNCTION complete_training_lesson(
  p_course text,
  p_module text,
  p_lesson text,
  p_time_spent int DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO training_progress (user_id, course_slug, module_slug, lesson_slug, completed_at, time_spent_seconds)
  VALUES (auth.uid(), p_course, p_module, p_lesson, now(), p_time_spent)
  ON CONFLICT (user_id, course_slug, module_slug, lesson_slug)
  DO UPDATE SET
    time_spent_seconds = GREATEST(training_progress.time_spent_seconds, EXCLUDED.time_spent_seconds),
    completed_at = COALESCE(training_progress.completed_at, EXCLUDED.completed_at);
END;
$$;

-- 6. RPC: update_session_time — absolute values, idempotent
CREATE OR REPLACE FUNCTION update_session_time(
  p_session_id text,
  p_active int,
  p_idle int,
  p_ended_at timestamptz DEFAULT NULL,
  p_completed boolean DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE training_sessions
  SET
    active_seconds = p_active,
    idle_seconds = p_idle,
    ended_at = COALESCE(p_ended_at, ended_at),
    completed = completed OR p_completed
  WHERE session_id = p_session_id
    AND user_id = auth.uid();
END;
$$;
