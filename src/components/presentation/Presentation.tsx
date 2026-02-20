import { Box } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { MotionBox } from '../motion';
import { SlideNavigation } from './SlideNavigation';
import { usePresentation } from './usePresentation';
import { PresentationThemeProvider, usePresentationColors } from './PresentationThemeContext';
import { presentationThemes } from './presentationTheme';
import { useEffect, type ComponentType } from 'react';

interface PresentationProps {
  slides: ComponentType[];
}

function PresentationInner({ slides }: PresentationProps) {
  const { currentSlide, direction, next, prev, exit, progress, totalSlides } = usePresentation({
    totalSlides: slides.length,
  });

  const c = usePresentationColors();
  const CurrentSlideComponent = slides[currentSlide];

  // Auto-fullscreen on mobile
  useEffect(() => {
    const isMobile = window.innerWidth <= 768 && 'ontouchstart' in window;
    if (isMobile && !document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  // Touch/drag handling
  const dragThreshold = 100;

  // S01_Cover (slide 0) always uses light container bg
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

export function Presentation({ slides }: PresentationProps) {
  return (
    <PresentationThemeProvider>
      <PresentationInner slides={slides} />
    </PresentationThemeProvider>
  );
}
