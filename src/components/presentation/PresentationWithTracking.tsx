import { useEffect, useRef, type ComponentType } from 'react';
import { Presentation } from './Presentation';
import { usePresentation } from './usePresentation';
import { getTrackingContext, trackPresentationEvent } from '../../lib/presentationTracking';
import { Box } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { MotionBox } from '../motion';
import { SlideNavigation } from './SlideNavigation';
import { PresentationThemeProvider, usePresentationColors } from './PresentationThemeContext';
import { presentationThemes } from './presentationTheme';

interface PresentationWithTrackingProps {
  slides: ComponentType[];
}

function TrackedPresentationInner({ slides }: PresentationWithTrackingProps) {
  const { currentSlide, direction, next, prev, exit, progress, totalSlides } = usePresentation({
    totalSlides: slides.length,
  });

  const c = usePresentationColors();
  const CurrentSlideComponent = slides[currentSlide];
  const slideStartRef = useRef(Date.now());
  const prevSlideRef = useRef(currentSlide);

  // Track slide views and engagement via 3-layer tracking
  useEffect(() => {
    const ctx = getTrackingContext();
    if (!ctx.sessionId) return; // No tracking session initialized

    // Track engagement time on previous slide
    const prevSeconds = Math.round((Date.now() - slideStartRef.current) / 1000);
    if (prevSeconds > 1 && prevSlideRef.current !== currentSlide) {
      trackPresentationEvent('slide_engagement', {
        slideIndex: prevSlideRef.current,
        seconds: prevSeconds,
      });
    }

    // Track new slide view
    slideStartRef.current = Date.now();
    prevSlideRef.current = currentSlide;
    trackPresentationEvent('slide_view', {
      slideIndex: currentSlide,
      extra: { total_slides: totalSlides, progress: Math.round((currentSlide / (totalSlides - 1)) * 100) },
    });
  }, [currentSlide]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track session end on unmount
  useEffect(() => {
    return () => {
      const ctx = getTrackingContext();
      if (ctx.sessionId) {
        trackPresentationEvent('session_end', {
          slideIndex: prevSlideRef.current,
          seconds: Math.round((Date.now() - slideStartRef.current) / 1000),
        });
      }
    };
  }, []);

  // Auto-fullscreen on mobile
  useEffect(() => {
    const isMobile = window.innerWidth <= 768 && 'ontouchstart' in window;
    if (isMobile && !document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  const dragThreshold = 100;
  const containerBg = currentSlide === 0 ? presentationThemes.light.containerBg : c.containerBg;

  return (
    <Box
      position="fixed"
      inset={0}
      bg={containerBg}
      overflow="hidden"
      zIndex={50}
      transition="background-color 0.3s ease"
    >
      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        progress={progress}
        onNext={next}
        onPrev={prev}
        onExit={exit}
      />

      <AnimatePresence mode="wait" initial={false}>
        <MotionBox
          key={currentSlide}
          initial={{ x: direction === 'forward' ? '100%' : '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction === 'forward' ? '-100%' : '100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          position="absolute"
          inset={0}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_e: unknown, info: { offset: { x: number } }) => {
            if (info.offset.x < -dragThreshold) next();
            else if (info.offset.x > dragThreshold) prev();
          }}
        >
          <CurrentSlideComponent />
        </MotionBox>
      </AnimatePresence>
    </Box>
  );
}

/**
 * Presentation wrapper that adds 3-layer tracking (Supabase + GTM + Clarity).
 * Falls back to the standard Presentation if no tracking session is active.
 */
export function PresentationWithTracking({ slides }: PresentationWithTrackingProps) {
  const ctx = getTrackingContext();

  // If no tracking session, use standard presentation
  if (!ctx.sessionId) {
    return <Presentation slides={slides} />;
  }

  return (
    <PresentationThemeProvider>
      <TrackedPresentationInner slides={slides} />
    </PresentationThemeProvider>
  );
}
