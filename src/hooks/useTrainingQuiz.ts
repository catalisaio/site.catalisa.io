import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface QuizResult {
  quizId: string;
  answer: unknown;
  isCorrect: boolean;
  attempts: number;
  firstAttemptCorrect: boolean;
}

interface QuizState {
  results: Record<string, QuizResult>;
}

const STORAGE_KEY = 'catalisa_training_quiz';

function loadLocal(): QuizState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { results: {} };
  } catch {
    return { results: {} };
  }
}

function saveLocal(state: QuizState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function quizKey(courseSlug: string, moduleSlug: string, lessonSlug: string, quizId: string) {
  return `${courseSlug}/${moduleSlug}/${lessonSlug}/${quizId}`;
}

export function useTrainingQuiz() {
  const [state, setState] = useState<QuizState>(loadLocal);

  useEffect(() => {
    saveLocal(state);
  }, [state]);

  const submitAnswer = useCallback(
    async (
      courseSlug: string,
      moduleSlug: string,
      lessonSlug: string,
      quizId: string,
      answer: unknown,
      correctAnswer: unknown,
    ): Promise<{ correct: boolean; explanation?: string }> => {
      const key = quizKey(courseSlug, moduleSlug, lessonSlug, quizId);
      const existing = state.results[key];
      const attempts = (existing?.attempts || 0) + 1;

      let correct = false;
      if (Array.isArray(correctAnswer)) {
        correct = Array.isArray(answer) &&
          JSON.stringify(answer) === JSON.stringify(correctAnswer);
      } else {
        correct = answer === correctAnswer;
      }

      const result: QuizResult = {
        quizId,
        answer,
        isCorrect: correct,
        attempts,
        firstAttemptCorrect: attempts === 1 && correct,
      };

      setState(prev => ({
        results: { ...prev.results, [key]: result },
      }));

      // Persist to Supabase (fire and forget)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('training_quiz_answers').upsert({
            user_id: user.id,
            course_slug: courseSlug,
            module_slug: moduleSlug,
            lesson_slug: lessonSlug,
            quiz_id: quizId,
            answer: JSON.stringify(answer),
            is_correct: correct,
            attempts,
          }, { onConflict: 'user_id,course_slug,module_slug,lesson_slug,quiz_id' });
        }
      } catch {
        // offline-safe
      }

      return { correct };
    },
    [state],
  );

  const getQuizResult = useCallback(
    (courseSlug: string, moduleSlug: string, lessonSlug: string, quizId: string): QuizResult | null => {
      const key = quizKey(courseSlug, moduleSlug, lessonSlug, quizId);
      return state.results[key] || null;
    },
    [state],
  );

  const getLessonQuizScore = useCallback(
    (courseSlug: string, moduleSlug: string, lessonSlug: string): { total: number; correct: number; percentage: number } => {
      const prefix = `${courseSlug}/${moduleSlug}/${lessonSlug}/`;
      const relevant = Object.entries(state.results).filter(([k]) => k.startsWith(prefix));
      const total = relevant.length;
      const correct = relevant.filter(([, v]) => v.isCorrect).length;
      return { total, correct, percentage: total > 0 ? Math.round((correct / total) * 100) : 0 };
    },
    [state],
  );

  const allLessonQuizzesPassed = useCallback(
    (courseSlug: string, moduleSlug: string, lessonSlug: string, quizIds: string[]): boolean => {
      return quizIds.every(qid => {
        const result = getQuizResult(courseSlug, moduleSlug, lessonSlug, qid);
        return result?.isCorrect === true;
      });
    },
    [getQuizResult],
  );

  return {
    submitAnswer,
    getQuizResult,
    getLessonQuizScore,
    allLessonQuizzesPassed,
  };
}
