import { useState, useCallback } from 'react';

const STORAGE_KEY = 'catalisa_training_progress';

interface LessonProgress {
  completedAt: string;
}

type ProgressMap = Record<string, LessonProgress>;

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: ProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function lessonKey(courseSlug: string, moduleSlug: string, lessonSlug: string): string {
  return `${courseSlug}/${moduleSlug}/${lessonSlug}`;
}

export function useTrainingProgress() {
  const [progress, setProgress] = useState<ProgressMap>(loadProgress);

  const isLessonComplete = useCallback(
    (courseSlug: string, moduleSlug: string, lessonSlug: string) => {
      return !!progress[lessonKey(courseSlug, moduleSlug, lessonSlug)];
    },
    [progress],
  );

  const completeLesson = useCallback(
    (courseSlug: string, moduleSlug: string, lessonSlug: string) => {
      const key = lessonKey(courseSlug, moduleSlug, lessonSlug);
      const updated = { ...progress, [key]: { completedAt: new Date().toISOString() } };
      saveProgress(updated);
      setProgress(updated);
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
  };
}
