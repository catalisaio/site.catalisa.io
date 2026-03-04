import { useState, useCallback, useEffect } from 'react';

interface UseSlideNavigationReturn {
  currentSlide: number;
  totalSlides: number;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function useSlideNavigation(totalSlides: number): UseSlideNavigationReturn {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Reset to 0 when totalSlides changes (new lesson loaded)
  useEffect(() => {
    setCurrentSlide(0);
  }, [totalSlides]);

  const next = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const prev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, totalSlides - 1)));
  }, [totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't capture if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prev();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  return {
    currentSlide,
    totalSlides,
    next,
    prev,
    goTo,
    isFirst: currentSlide === 0,
    isLast: currentSlide === totalSlides - 1,
  };
}
