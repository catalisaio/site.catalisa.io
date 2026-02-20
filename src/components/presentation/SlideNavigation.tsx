import { useState, useCallback, useEffect } from 'react';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiX, FiSun, FiMoon, FiMaximize, FiMinimize } from 'react-icons/fi';
import { usePresentationTheme } from './PresentationThemeContext';
import { presentationThemes } from './presentationTheme';

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  progress: number;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}

export function SlideNavigation({ currentSlide, totalSlides, progress, onNext, onPrev, onExit }: SlideNavigationProps) {
  const { mode, toggleMode } = usePresentationTheme();
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Keyboard: F to toggle fullscreen
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleFullscreen]);

  // Slide 0 (Cover) always uses light nav chrome
  const c = currentSlide === 0 ? presentationThemes.light : (mode === 'dark' ? presentationThemes.dark : presentationThemes.light);

  return (
    <>
      {/* Progress bar */}
      <Box position="fixed" top={0} left={0} right={0} h="3px" bg={c.progressBg} zIndex={100}>
        <Box
          h="full"
          bgGradient="linear(to-r, brand.500, whatsapp.400)"
          w={`${progress * 100}%`}
          transition="width 0.4s ease"
        />
      </Box>

      {/* Top-left: Toggle + Fullscreen */}
      <Flex position="fixed" top={4} left={4} zIndex={100} gap={1}>
        <IconButton
          aria-label="Toggle light/dark mode"
          icon={mode === 'dark' ? <FiSun /> : <FiMoon />}
          variant="ghost"
          color={c.navColor}
          fontSize="xl"
          _hover={{ color: c.navHoverColor, bg: c.navHoverBg }}
          onClick={toggleMode}
        />
        <IconButton
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          icon={isFullscreen ? <FiMinimize /> : <FiMaximize />}
          variant="ghost"
          color={c.navColor}
          fontSize="xl"
          _hover={{ color: c.navHoverColor, bg: c.navHoverBg }}
          onClick={toggleFullscreen}
        />
      </Flex>

      {/* Exit button */}
      <IconButton
        aria-label="Exit presentation"
        icon={<FiX />}
        position="fixed"
        top={4}
        right={4}
        zIndex={100}
        variant="ghost"
        color={c.textMuted}
        fontSize="xl"
        _hover={{ color: c.navHoverColor, bg: c.navHoverBg }}
        onClick={onExit}
      />

      {/* Arrow navigation */}
      <IconButton
        aria-label="Previous slide"
        icon={<FiChevronLeft />}
        position="fixed"
        left={{ base: 2, md: 4 }}
        top="50%"
        transform="translateY(-50%)"
        zIndex={100}
        variant="ghost"
        color={c.navColor}
        fontSize="2xl"
        w={{ base: 10, md: 12 }}
        h={{ base: 10, md: 12 }}
        borderRadius="full"
        bg={c.navBg}
        _hover={{ color: c.navHoverColor, bg: c.navHoverBg }}
        onClick={onPrev}
        opacity={currentSlide === 0 ? 0.3 : 1}
        disabled={currentSlide === 0}
      />

      <IconButton
        aria-label="Next slide"
        icon={<FiChevronRight />}
        position="fixed"
        right={{ base: 2, md: 4 }}
        top="50%"
        transform="translateY(-50%)"
        zIndex={100}
        variant="ghost"
        color={c.navColor}
        fontSize="2xl"
        w={{ base: 10, md: 12 }}
        h={{ base: 10, md: 12 }}
        borderRadius="full"
        bg={c.navBg}
        _hover={{ color: c.navHoverColor, bg: c.navHoverBg }}
        onClick={onNext}
        opacity={currentSlide === totalSlides - 1 ? 0.3 : 1}
        disabled={currentSlide === totalSlides - 1}
      />

      {/* Slide counter */}
      <Flex
        position="fixed"
        bottom={4}
        right={4}
        zIndex={100}
        align="center"
        gap={1}
      >
        <Text fontSize="sm" color={c.textSubtle} fontWeight="500">
          {currentSlide + 1} / {totalSlides}
        </Text>
      </Flex>
    </>
  );
}
