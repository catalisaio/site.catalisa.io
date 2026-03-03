import { supabase } from './supabase';

// ---- Global types ----
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

// ---- Types ----

export interface TrainingProgressRow {
  course_slug: string;
  module_slug: string;
  lesson_slug: string;
  completed_at: string;
  time_spent_seconds: number;
}

// ---- Module-level state ----

let _userId: string | null = null;
let _sessionId: string | null = null;
let _courseSlugs: { course: string; module: string; lesson: string } | null = null;

// Time tracking
let _activeStart: number | null = null;
let _activeAccumulated = 0;
let _idleStart: number | null = null;
let _idleAccumulated = 0;

// Heartbeat
let _heartbeatTimer: ReturnType<typeof setInterval> | null = null;

// Listeners (stored for cleanup)
let _visibilityHandler: (() => void) | null = null;

// ---- Init ----

export function initTrainingUser(userId: string) {
  _userId = userId;
}

// ---- Supabase queries ----

export async function fetchUserProgress(): Promise<TrainingProgressRow[]> {
  if (!_userId) return [];

  const { data, error } = await supabase
    .from('training_progress')
    .select('course_slug, module_slug, lesson_slug, completed_at, time_spent_seconds')
    .eq('user_id', _userId);

  if (error) {
    console.warn('[trainingTracking] fetchUserProgress error:', error.message);
    return [];
  }

  return (data ?? []) as TrainingProgressRow[];
}

export async function completeLessonInSupabase(
  course: string,
  module: string,
  lesson: string,
  seconds: number,
): Promise<void> {
  const { error } = await supabase.rpc('complete_training_lesson', {
    p_course: course,
    p_module: module,
    p_lesson: lesson,
    p_time_spent: seconds,
  });

  if (error) {
    console.warn('[trainingTracking] completeLessonInSupabase error:', error.message);
  }
}

// ---- Session lifecycle ----

export function startLessonSession(
  userId: string,
  course: string,
  module: string,
  lesson: string,
): void {
  // End any existing session first
  endLessonSession();

  _userId = userId;
  _courseSlugs = { course, module, lesson };
  _sessionId = typeof crypto?.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  // Reset timers
  _activeAccumulated = 0;
  _idleAccumulated = 0;

  // Start active timer (tab is visible)
  if (document.visibilityState === 'visible') {
    _activeStart = Date.now();
    _idleStart = null;
  } else {
    _idleStart = Date.now();
    _activeStart = null;
  }

  // Insert session row
  supabase
    .from('training_sessions')
    .insert({
      user_id: userId,
      course_slug: course,
      module_slug: module,
      lesson_slug: lesson,
      session_id: _sessionId,
      user_agent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      locale: navigator.language,
    })
    .then(({ error }) => {
      if (error) console.warn('[trainingTracking] startLessonSession insert error:', error.message);
    });

  // Visibility change handler
  _visibilityHandler = () => {
    if (document.visibilityState === 'hidden') {
      // Pause active, start idle
      if (_activeStart) {
        _activeAccumulated += (Date.now() - _activeStart) / 1000;
        _activeStart = null;
      }
      _idleStart = Date.now();
    } else {
      // Pause idle, resume active
      if (_idleStart) {
        _idleAccumulated += (Date.now() - _idleStart) / 1000;
        _idleStart = null;
      }
      _activeStart = Date.now();
    }
  };
  document.addEventListener('visibilitychange', _visibilityHandler);

  // Heartbeat every 30s
  _heartbeatTimer = setInterval(() => {
    flushSessionTime(false);
  }, 30_000);

  // Fire lesson_open event
  insertTrainingEvent('lesson_open', {
    course, module, lesson,
    extra: {
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      user_agent: navigator.userAgent,
      locale: navigator.language,
    },
  });
}

export function endLessonSession(): void {
  if (!_sessionId) return;

  // Flush final time
  flushSessionTime(true);

  // Fire session_end event
  const active = getActiveSeconds();
  const idle = getIdleSeconds();
  insertTrainingEvent('session_end', {
    course: _courseSlugs?.course,
    module: _courseSlugs?.module,
    lesson: _courseSlugs?.lesson,
    seconds: active + idle,
    extra: { active_seconds: active, idle_seconds: idle },
  });

  // Cleanup
  if (_heartbeatTimer) {
    clearInterval(_heartbeatTimer);
    _heartbeatTimer = null;
  }
  if (_visibilityHandler) {
    document.removeEventListener('visibilitychange', _visibilityHandler);
    _visibilityHandler = null;
  }

  _sessionId = null;
  _courseSlugs = null;
  _activeStart = null;
  _activeAccumulated = 0;
  _idleStart = null;
  _idleAccumulated = 0;
}

export function flushSessionTime(ending: boolean): void {
  if (!_sessionId) return;

  const active = getActiveSeconds();
  const idle = getIdleSeconds();

  supabase
    .rpc('update_session_time', {
      p_session_id: _sessionId,
      p_active: Math.round(active),
      p_idle: Math.round(idle),
      p_ended_at: ending ? new Date().toISOString() : null,
      p_completed: false,
    })
    .then(({ error }) => {
      if (error) console.warn('[trainingTracking] flushSessionTime error:', error.message);
    });
}

export function markSessionCompleted(): void {
  if (!_sessionId) return;

  supabase
    .rpc('update_session_time', {
      p_session_id: _sessionId,
      p_active: Math.round(getActiveSeconds()),
      p_idle: Math.round(getIdleSeconds()),
      p_ended_at: null,
      p_completed: true,
    })
    .then(({ error }) => {
      if (error) console.warn('[trainingTracking] markSessionCompleted error:', error.message);
    });
}

// ---- Time helpers ----

export function getActiveSeconds(): number {
  let total = _activeAccumulated;
  if (_activeStart) {
    total += (Date.now() - _activeStart) / 1000;
  }
  return total;
}

function getIdleSeconds(): number {
  let total = _idleAccumulated;
  if (_idleStart) {
    total += (Date.now() - _idleStart) / 1000;
  }
  return total;
}

// ---- Events ----

export function insertTrainingEvent(
  eventType: string,
  params: {
    course?: string | null;
    module?: string | null;
    lesson?: string | null;
    seconds?: number | null;
    extra?: Record<string, unknown>;
  } = {},
): void {
  if (!_userId) return;

  const metadata: Record<string, unknown> = {
    session_id: _sessionId,
    user_agent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    locale: navigator.language,
    referrer: document.referrer || null,
    ...params.extra,
  };

  // 1. Supabase (fire-and-forget)
  supabase
    .from('training_events')
    .insert({
      user_id: _userId,
      session_id: _sessionId,
      event_type: eventType,
      course_slug: params.course ?? null,
      module_slug: params.module ?? null,
      lesson_slug: params.lesson ?? null,
      seconds: params.seconds ?? null,
      metadata,
    })
    .then(({ error }) => {
      if (error) console.warn('[trainingTracking] insertTrainingEvent error:', error.message);
    });

  // 2. GTM / GA4
  window.dataLayer?.push({
    event: `training_${eventType}`,
    course_slug: params.course,
    module_slug: params.module,
    lesson_slug: params.lesson,
    seconds: params.seconds,
    session_id: _sessionId,
  });
}
