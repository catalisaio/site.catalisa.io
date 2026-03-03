import { useState, useCallback, useEffect, useRef } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';
import {
  initTrainingUser,
  fetchUserProgress,
  completeLessonInSupabase,
  getActiveSeconds,
  markSessionCompleted,
  insertTrainingEvent,
} from '../lib/trainingTracking';

const STORAGE_KEY = 'catalisa_training_progress';

interface LessonProgress {
  completedAt: string;
}

type ProgressMap = Record<string, LessonProgress>;

function loadLocalProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalProgress(progress: ProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function lessonKey(courseSlug: string, moduleSlug: string, lessonSlug: string): string {
  return `${courseSlug}/${moduleSlug}/${lessonSlug}`;
}

export function useTrainingProgress() {
  const { user } = useSupabaseAuth();
  const [progress, setProgress] = useState<ProgressMap>(loadLocalProgress);
  const [loaded, setLoaded] = useState(false);
  const syncedRef = useRef(false);

  // Init tracking module and sync from Supabase when user is available
  useEffect(() => {
    if (!user?.id) {
      syncedRef.current = false;
      return;
    }

    // Avoid double-sync in strict mode
    if (syncedRef.current) return;
    syncedRef.current = true;

    initTrainingUser(user.id);

    fetchUserProgress().then((rows) => {
      if (rows.length === 0) {
        setLoaded(true);
        return;
      }

      // Merge: server wins
      const serverMap: ProgressMap = {};
      for (const row of rows) {
        const key = lessonKey(row.course_slug, row.module_slug, row.lesson_slug);
        serverMap[key] = { completedAt: row.completed_at };
      }

      setProgress((prev) => {
        const merged = { ...prev, ...serverMap };
        saveLocalProgress(merged);
        return merged;
      });
      setLoaded(true);
    });
  }, [user?.id]);

  const isLessonComplete = useCallback(
    (courseSlug: string, moduleSlug: string, lessonSlug: string) => {
      return !!progress[lessonKey(courseSlug, moduleSlug, lessonSlug)];
    },
    [progress],
  );

  const completeLesson = useCallback(
    (
      courseSlug: string,
      moduleSlug: string,
      lessonSlug: string,
      modules?: Array<{ slug: string; lessons: Array<{ slug: string }> }>,
    ) => {
      const key = lessonKey(courseSlug, moduleSlug, lessonSlug);
      const now = new Date().toISOString();
      const seconds = Math.round(getActiveSeconds());

      // Optimistic: localStorage + state
      const updated = { ...progress, [key]: { completedAt: now } };
      saveLocalProgress(updated);
      setProgress(updated);

      // Mark session as completed
      markSessionCompleted();

      // Fire lesson_complete event
      insertTrainingEvent('lesson_complete', {
        course: courseSlug,
        module: moduleSlug,
        lesson: lessonSlug,
        seconds,
      });

      // Persist to Supabase (async, fire-and-forget)
      completeLessonInSupabase(courseSlug, moduleSlug, lessonSlug, seconds).catch(() => {
        // localStorage already has the data; next load will retry sync
      });

      // Detect milestones
      if (modules) {
        detectMilestones(courseSlug, moduleSlug, lessonSlug, modules, updated);
      }
    },
    [progress],
  );

  const getModuleProgress = useCallback(
    (courseSlug: string, moduleSlug: string, lessonSlugs: string[]): number => {
      if (lessonSlugs.length === 0) return 0;
      const completed = lessonSlugs.filter((ls) =>
        !!progress[lessonKey(courseSlug, moduleSlug, ls)],
      ).length;
      return Math.round((completed / lessonSlugs.length) * 100);
    },
    [progress],
  );

  const getCourseProgress = useCallback(
    (courseSlug: string, modules: Array<{ slug: string; lessons: Array<{ slug: string }> }>): number => {
      const total = modules.reduce((acc, m) => acc + m.lessons.length, 0);
      if (total === 0) return 0;
      const completed = modules.reduce(
        (acc, m) =>
          acc + m.lessons.filter((l) => !!progress[lessonKey(courseSlug, m.slug, l.slug)]).length,
        0,
      );
      return Math.round((completed / total) * 100);
    },
    [progress],
  );

  return {
    isLessonComplete,
    completeLesson,
    getModuleProgress,
    getCourseProgress,
    loaded,
  };
}

// ---- Milestone detection (fire events) ----

function detectMilestones(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string,
  modules: Array<{ slug: string; lessons: Array<{ slug: string }> }>,
  progressMap: ProgressMap,
) {
  // Check module complete
  const currentModule = modules.find((m) => m.slug === moduleSlug);
  if (currentModule) {
    const allModuleDone = currentModule.lessons.every(
      (l) => !!progressMap[lessonKey(courseSlug, moduleSlug, l.slug)],
    );
    if (allModuleDone) {
      insertTrainingEvent('module_complete', {
        course: courseSlug,
        module: moduleSlug,
        lesson: lessonSlug,
      });
    }
  }

  // Check course complete
  const allCourseDone = modules.every((m) =>
    m.lessons.every((l) => !!progressMap[lessonKey(courseSlug, m.slug, l.slug)]),
  );
  if (allCourseDone) {
    insertTrainingEvent('course_complete', {
      course: courseSlug,
      module: moduleSlug,
      lesson: lessonSlug,
    });
  }
}
