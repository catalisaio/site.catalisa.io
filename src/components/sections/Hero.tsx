import { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Container, Heading, Text, Button, HStack, Flex, VStack } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiPlay } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../motion';
import { HeroShowcase, useHeroTabs } from '../shared/HeroShowcase';
import { GradientText } from '../shared/GradientText';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

export function Hero() {
  const { t } = useTranslation('home');
  const subtitles = t('hero.subtitles', { returnObjects: true }) as string[];
  const heroTabs = useHeroTabs();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % heroTabs.length);
  }, [heroTabs.length]);

  const handleTabChange = useCallback((index: number) => {
    setActiveIndex(index);
    // Reset timer when manually changing tabs
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // Auto-cycling with per-panel dwell time
  useEffect(() => {
    if (paused) return;

    const dwellTime = heroTabs[activeIndex].dwellTime;
    timerRef.current = setTimeout(goToNext, dwellTime);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, paused, goToNext, heroTabs]);

  return (
    <Box
      id="hero"
      position="relative"
      minH="100vh"
      bg="hero.bg"
      overflow="hidden"
      display="flex"
      alignItems="center"
      mt="-64px"
      pt="64px"
    >
      {/* Radial gradient background */}
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

      <Container maxW="1280px" position="relative" zIndex={1}>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="space-between"
          gap={{ base: 12, lg: 16 }}
          py={{ base: 12, lg: 0 }}
        >
          {/* Left content */}
          <VStack align="flex-start" spacing={6} maxW="600px" flex={1}>
            {/* Badge */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
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
                <Text color="whiteAlpha.800" fontSize="sm">{t('badges.whatsapp247', { ns: 'common' })}</Text>
              </HStack>
            </MotionBox>

            {/* Headline */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Heading
                as="h1"
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight="800"
                color="white"
                lineHeight="1.1"
              >
                {t('hero.headline')}{' '}
                <GradientText
                  gradient="linear(to-r, brand.300, brand.400, catalisa.accent)"
                  fontSize="inherit"
                  fontWeight="inherit"
                >
                  {t('hero.headlineGradient')}
                </GradientText>
              </Heading>
            </MotionBox>

            {/* Dynamic subtitle synced with active tab */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              minH="56px"
            >
              <AnimatePresence mode="wait">
                <MotionBox
                  key={activeIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Text color="whiteAlpha.700" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7" maxW="520px">
                    {subtitles[activeIndex]}
                  </Text>
                </MotionBox>
              </AnimatePresence>
            </MotionBox>

            {/* CTAs */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <HStack spacing={4} flexWrap="wrap">
                <Button
                  as="a"
                  href={WHATSAPP_URL}
                  target="_blank"
                  size="lg"
                  bg="whatsapp.500"
                  color="white"
                  _hover={{ bg: 'whatsapp.600', transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)' }}
                  leftIcon={<FiMessageCircle />}
                  transition="all 0.2s"
                >
                  {t('cta.letsChat', { ns: 'common' })}
                </Button>
                <Button
                  as="a"
                  href="#how-it-works"
                  size="lg"
                  variant="ghost"
                  color="whiteAlpha.800"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  leftIcon={<FiPlay />}
                >
                  {t('cta.seeHowItWorks', { ns: 'common' })}
                </Button>
              </HStack>
            </MotionBox>

            {/* Trust badges */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <HStack spacing={4} flexWrap="wrap" fontSize="xs" color="whiteAlpha.500">
                <HStack><Box w={1.5} h={1.5} borderRadius="full" bg="whatsapp.400" /><Text>{t('badges.lgpd', { ns: 'common' })}</Text></HStack>
                <HStack><Box w={1.5} h={1.5} borderRadius="full" bg="brand.400" /><Text>{t('badges.metaWhatsApp', { ns: 'common' })}</Text></HStack>
                <HStack><Box w={1.5} h={1.5} borderRadius="full" bg="catalisa.secondary" /><Text>{t('badges.setupMinutes', { ns: 'common' })}</Text></HStack>
              </HStack>
            </MotionBox>
          </VStack>

          {/* Right visual - Hero Showcase with tabs */}
          <MotionBox
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            display={{ base: 'none', lg: 'block' }}
            maxW="580px"
            flex={1}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <HeroShowcase
              activeIndex={activeIndex}
              onTabChange={handleTabChange}
              paused={paused}
            />
          </MotionBox>
        </Flex>
      </Container>
    </Box>
  );
}
