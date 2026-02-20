import { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { Flex, Box, type FlexProps } from '@chakra-ui/react';
import { usePresentationColors } from './PresentationThemeContext';

interface SlideProps extends FlexProps {
  bgGradient?: string;
  bgImage?: string;
}

export function Slide({ children, bg, bgGradient, bgImage, color, ...props }: SlideProps) {
  const c = usePresentationColors();
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const recalc = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    // Reset scale to measure natural size
    el.style.transform = 'none';
    const natural = el.scrollHeight;
    const available = window.innerHeight;

    // Leave 48px total vertical padding (24px top + 24px bottom)
    const padding = 48;
    const usable = available - padding;

    if (natural > usable && natural > 0) {
      const s = Math.max(0.45, usable / natural);
      setScale(s);
    } else {
      setScale(1);
    }
  }, []);

  useLayoutEffect(() => {
    recalc();

    const onResize = () => recalc();
    window.addEventListener('resize', onResize);

    // Also recalc on fullscreen change (viewport changes)
    document.addEventListener('fullscreenchange', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('fullscreenchange', onResize);
    };
  }, [recalc, children]);

  return (
    <Flex
      w="100vw"
      h="100vh"
      position="relative"
      direction="column"
      align="center"
      justify="center"
      overflow="hidden"
      color={color ?? c.textPrimary}
      bg={bg}
      bgGradient={bgGradient}
      bgImage={bgImage}
      bgSize="cover"
      bgPosition="center"
      transition="background-color 0.3s ease, color 0.3s ease"
      {...props}
    >
      <Box
        ref={contentRef}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        maxW="1200px"
        w="full"
        position="relative"
        zIndex={1}
        px={{ base: 6, md: 10, lg: 16 }}
        py={{ base: 6, md: 8 }}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </Box>
    </Flex>
  );
}
