import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { Box, Container, Heading, Text, Button, HStack, Flex, VStack, useBreakpointValue } from '@chakra-ui/react';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { FiMessageCircle, FiArrowDown } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../motion';
import { GradientText } from '../shared/GradientText';
import { HeroShowcase, useHeroTabs } from '../shared/HeroShowcase';
import { BehindTheScenesHint } from '../shared/BehindTheScenesHint';
import { useBehindTheScenes } from '../shared/BehindTheScenesModal';

const BehindTheScenesModal = lazy(() => import('../shared/BehindTheScenesModal').then(m => ({ default: m.BehindTheScenesModal })));

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';
const DWELL_TIME = 4000;

export function HeroTeamBuilder() {
  const { t } = useTranslation('home');
  const subtitles = t('heroTeamBuilder.subtitles', { returnObjects: true }) as string[];
  const behindTheScenes = useBehindTheScenes();
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const showShowcase = useBreakpointValue({ base: false, md: true });

  // Showcase tabs state
  const heroTabs = useHeroTabs();
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [showcasePaused, setShowcasePaused] = useState(false);
  const showcaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % subtitles.length);
  }, [subtitles.length]);

  useEffect(() => {
    timerRef.current = setTimeout(goToNext, DWELL_TIME);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, goToNext]);

  // Showcase tab auto-cycling
  useEffect(() => {
    if (showcasePaused) return;
    const dwell = heroTabs[showcaseIndex]?.dwellTime || 7000;
    showcaseTimerRef.current = setTimeout(() => {
      setShowcaseIndex((prev) => (prev + 1) % heroTabs.length);
    }, dwell);
    return () => {
      if (showcaseTimerRef.current) clearTimeout(showcaseTimerRef.current);
    };
  }, [showcaseIndex, showcasePaused, heroTabs]);

  const handleShowcaseTabChange = useCallback((index: number) => {
    setShowcaseIndex(index);
    setShowcasePaused(true);
    setTimeout(() => setShowcasePaused(false), 3000);
  }, []);

  return (
    <Box
      id="hero"
      position="relative"
      bg="hero.bg"
      overflow="hidden"
      mt="-64px"
      pt="64px"
      minH="100vh"
      display="flex"
      flexDirection="column"
    >
      {/* Radial gradient backgrounds */}
      <Box
        position="absolute"
        top="-20%"
        left="50%"
        transform="translateX(-50%)"
        w="120%"
        h="120%"
        bgGradient="radial(circle at 30% 40%, rgba(115, 75, 156, 0.25) 0%, rgba(115, 75, 156, 0.05) 40%, transparent 70%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="-10%"
        w="60%"
        h="60%"
        bgGradient="radial(circle, rgba(37, 211, 102, 0.08) 0%, transparent 60%)"
        pointerEvents="none"
      />

      <Container maxW="1280px" position="relative" zIndex={1} flex={1} display="flex" flexDirection="column">
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="space-between"
          gap={{ base: 12, lg: 16 }}
          py={{ base: 12, lg: 10 }}
          flex={1}
        >
          {/* Left content */}
          <VStack align="flex-start" spacing={6} maxW="600px" flex={1}>
            {/* Badge — no animation wrapper to avoid hiding above-the-fold content */}
            <HStack
              bg="whiteAlpha.100"
              px={4}
              py={1.5}
              borderRadius="full"
              border="1px solid"
              borderColor="whiteAlpha.200"
              spacing={2}
            >
              <Box w={2} h={2} borderRadius="full" bg="whatsapp.400" />
              <Text color="whiteAlpha.800" fontSize="sm">{t('badges.gartnerValidated', { ns: 'common' })}</Text>
            </HStack>

            {/* Headline — no animation wrapper so LCP element renders immediately */}
            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
              fontWeight="800"
              color="white"
              lineHeight="1.1"
            >
              {t('heroTeamBuilder.headline')}{' '}
              <GradientText
                gradient="linear(to-r, brand.300, brand.400, catalisa.accent)"
                fontSize="inherit"
                fontWeight="inherit"
              >
                {t('heroTeamBuilder.headlineGradient')}
              </GradientText>
            </Heading>

            {/* Dynamic subtitle */}
            <MotionBox
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              minH="56px"
            >
              <AnimatePresence mode="wait">
                <MotionBox
                  key={activeIndex}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
                >
                  <Text color="whiteAlpha.700" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7" maxW="520px">
                    {subtitles[activeIndex]}
                  </Text>
                </MotionBox>
              </AnimatePresence>
            </MotionBox>

            {/* CTAs */}
            <MotionBox
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <HStack spacing={4} flexWrap="wrap">
                <Button
                  as="a"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  bg="whatsapp.600"
                  color="white"
                  _hover={{ bg: 'whatsapp.700', transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)' }}
                  leftIcon={<FiMessageCircle />}
                  transition="all 0.2s"
                >
                  {t('cta.letsChat', { ns: 'common' })}
                </Button>
                <Button
                  as="a"
                  href="#meet-your-team"
                  size="lg"
                  variant="ghost"
                  color="whiteAlpha.800"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  leftIcon={<FiArrowDown />}
                >
                  {t('heroTeamBuilder.ctaMeetTeam')}
                </Button>
              </HStack>
            </MotionBox>

            {/* Trust badges */}
            <MotionBox
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <HStack spacing={4} flexWrap="wrap" fontSize="xs" color="whiteAlpha.600">
                <HStack><Box w={1.5} h={1.5} borderRadius="full" bg="whatsapp.400" /><Text>{t('badges.lgpd', { ns: 'common' })}</Text></HStack>
                <HStack><Box w={1.5} h={1.5} borderRadius="full" bg="brand.400" /><Text>{t('badges.metaWhatsApp', { ns: 'common' })}</Text></HStack>
                <HStack><Box w={1.5} h={1.5} borderRadius="full" bg="catalisa.secondary" /><Text>{t('badges.composableRevenue', { ns: 'common' })}</Text></HStack>
              </HStack>
              <BehindTheScenesHint onOpen={behindTheScenes.onOpen} variant="dark" />
            </MotionBox>
          </VStack>

          {/* Right visual - Showcase Tabs (not rendered on mobile to reduce TBT) */}
          {showShowcase && (
            <MotionBox
              initial={prefersReducedMotion ? false : { opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              maxW="540px"
              flex={1}
            >
              <HeroShowcase
                activeIndex={showcaseIndex}
                onTabChange={handleShowcaseTabChange}
                paused={showcasePaused}
              />
            </MotionBox>
          )}
        </Flex>
      </Container>

      {behindTheScenes.isOpen && (
        <Suspense fallback={null}>
          <BehindTheScenesModal isOpen={behindTheScenes.isOpen} onClose={behindTheScenes.onClose} />
        </Suspense>
      )}
    </Box>
  );
}
