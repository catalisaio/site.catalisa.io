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

interface LessonProgress {
  completedAt: string;
}

type ProgressMap = Record<string, LessonProgress>;

function lessonKey(courseSlug: string, moduleSlug: string, lessonSlug: string): string {
  return `${courseSlug}/${moduleSlug}/${lessonSlug}`;
}

export function useTrainingProgress() {
  const { user } = useSupabaseAuth();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loaded, setLoaded] = useState(false);
  const syncedRef = useRef(false);

  // Load progress from Supabase when user is available
  useEffect(() => {
    if (!user?.id) {
      setProgress({});
      setLoaded(false);
      syncedRef.current = false;
      return;
    }

    // Avoid double-sync in strict mode
    if (syncedRef.current) return;
    syncedRef.current = true;

    initTrainingUser(user.id);

    fetchUserProgress().then((rows) => {
      const serverMap: ProgressMap = {};
      for (const row of rows) {
        const key = lessonKey(row.course_slug, row.module_slug, row.lesson_slug);
        serverMap[key] = { completedAt: row.completed_at };
      }
      setProgress(serverMap);
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

      // Optimistic update (state only)
      setProgress((prev) => {
        const updated = { ...prev, [key]: { completedAt: now } };
        if (modules) {
          detectMilestones(courseSlug, moduleSlug, lessonSlug, modules, updated);
        }
        return updated;
      });

      markSessionCompleted();

      insertTrainingEvent('lesson_complete', {
        course: courseSlug,
        module: moduleSlug,
        lesson: lessonSlug,
        seconds,
      });

      // Persist to Supabase; rollback on failure
      completeLessonInSupabase(courseSlug, moduleSlug, lessonSlug, seconds).catch(() => {
        setProgress((prev) => {
          const rolled = { ...prev };
          delete rolled[key];
          return rolled;
        });
      });
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
