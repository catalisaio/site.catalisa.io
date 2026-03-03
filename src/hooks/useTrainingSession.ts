import { useEffect } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';
import { startLessonSession, endLessonSession, flushSessionTime } from '../lib/trainingTracking';

export function useTrainingSession(
  courseSlug: string | undefined,
  moduleSlug: string | undefined,
  lessonSlug: string | undefined,
) {
  const { user } = useSupabaseAuth();

  useEffect(() => {
    if (!user?.id || !courseSlug || !moduleSlug || !lessonSlug) return;

    startLessonSession(user.id, courseSlug, moduleSlug, lessonSlug);

    const handleBeforeUnload = () => {
      flushSessionTime(true);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      endLessonSession();
    };
  }, [user?.id, courseSlug, moduleSlug, lessonSlug]);
}
