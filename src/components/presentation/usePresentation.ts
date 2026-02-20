import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface UsePresentationOptions {
  totalSlides: number;
}

export function usePresentation({ totalSlides }: UsePresentationOptions) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialSlide = Math.max(0, Math.min(totalSlides - 1, Number(searchParams.get('slide') || 1) - 1));
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const progress = totalSlides > 1 ? currentSlide / (totalSlides - 1) : 0;

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(totalSlides - 1, index));
    setDirection(clamped >= currentSlide ? 'forward' : 'back');
    setCurrentSlide(clamped);
  }, [currentSlide, totalSlides]);

  const next = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setDirection('forward');
      setCurrentSlide(s => s + 1);
    }
  }, [currentSlide, totalSlides]);

  const prev = useCallback(() => {
    if (currentSlide > 0) {
      setDirection('back');
      setCurrentSlide(s => s - 1);
    }
  }, [currentSlide]);

  const exit = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // URL sync
  useEffect(() => {
    const slideNum = String(currentSlide + 1);
    if (searchParams.get('slide') !== slideNum) {
      setSearchParams({ slide: slideNum }, { replace: true });
    }
  }, [currentSlide, searchParams, setSearchParams]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if any input is focused
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          prev();
          break;
        case 'Escape':
          exit();
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, exit]);

  return { currentSlide, direction, next, prev, goTo, exit, progress, totalSlides };
}
