import { Heading, Text, VStack, Box, HStack, Flex } from '@chakra-ui/react';
import { FiCpu, FiGitBranch, FiZap } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { GradientText } from '../../shared/GradientText';
import { BrowserFrame } from '../../shared/BrowserFrame';
import { usePresentationTheme, usePresentationColors } from '../PresentationThemeContext';

export function S09_LiveDemos() {
  const { t } = useTranslation('presentation');
  const { mode } = usePresentationTheme();
  const c = usePresentationColors();
  const stats = t('liveDemos.aiDemo.stats', { returnObjects: true }) as Array<{ value: string; label: string }>;

  return (
    <Slide>
      {/* Ambient glow */}
      <Box
        position="absolute"
        top="30%"
        left="30%"
        w="60%"
        h="60%"
        bgGradient={`radial(circle, ${c.glowPurple} 0%, transparent 60%)`}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="20%"
        right="10%"
        w="40%"
        h="40%"
        bgGradient="radial(circle, rgba(253, 194, 52, 0.06) 0%, transparent 60%)"
        pointerEvents="none"
      />

      <Flex
        direction={{ base: 'column', lg: 'row' }}
        align="center"
        justify="center"
        gap={{ base: 6, lg: 10 }}
        w="full"
        maxW="1100px"
      >
        {/* Left: Content */}
        <VStack
          align={{ base: 'center', lg: 'flex-start' }}
          spacing={{ base: 3, md: 4 }}
          textAlign={{ base: 'center', lg: 'left' }}
          flex={{ lg: '0 0 38%' }}
        >
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <HStack
              spacing={2}
              bg={c.surfaceBg}
              border="1px solid"
              borderColor={c.surfaceBorder}
              px={3}
              py={1.5}
              borderRadius="full"
            >
              <Box as={FiCpu} color="brand.400" fontSize="xs" />
              <Text fontSize="2xs" color="brand.400" fontWeight="700" letterSpacing="0.1em">
                {t('liveDemos.aiDemo.badge')}
              </Text>
            </HStack>
          </MotionBox>

          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Heading fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }} fontWeight="800" lineHeight="1.2">
              {t('liveDemos.aiDemo.headline')}{' '}
              <GradientText gradient="linear(to-r, brand.400, catalisa.secondary)">
                {t('liveDemos.aiDemo.headlineHighlight')}
              </GradientText>
            </Heading>
          </MotionBox>

          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}>
            <Text color={c.textSecondary} fontSize={{ base: 'sm', md: 'md' }} lineHeight="1.7" maxW="400px">
              {t('liveDemos.aiDemo.description')}
            </Text>
          </MotionBox>

          {/* Stats */}
          <MotionBox initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <HStack
              spacing={0}
              divider={<Box w="1px" h={8} bg={c.surfaceBorder} />}
              bg={c.surfaceBg}
              border="1px solid"
              borderColor={c.surfaceBorder}
              borderRadius="xl"
              overflow="hidden"
            >
              {stats.map((s, i) => (
                <VStack key={i} spacing={0} px={{ base: 4, md: 5 }} py={3}>
                  <HStack spacing={1}>
                    <Box as={[FiZap, FiGitBranch, FiCpu][i % 3]} color="brand.400" fontSize="xs" />
                    <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="800" color="brand.400">
                      {s.value}
                    </Text>
                  </HStack>
                  <Text fontSize="2xs" color={c.textMuted} fontWeight="500">
                    {s.label}
                  </Text>
                </VStack>
              ))}
            </HStack>
          </MotionBox>
        </VStack>

        {/* Right: Browser frame with video */}
        <MotionBox
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          flex={{ lg: '0 0 58%' }}
          w="full"
          position="relative"
        >
          {/* Glow ring behind frame */}
          <Box
            position="absolute"
            inset="-4px"
            borderRadius="2xl"
            bgGradient="linear(to-br, brand.500, whatsapp.400)"
            opacity={0.12}
            filter="blur(24px)"
            pointerEvents="none"
          />
          <BrowserFrame url="panel.catalisa.app/ai-assistant" variant={mode === 'dark' ? 'dark' : 'light'}>
            <Box position="relative" w="full" pt="56.25%" bg="black">
              <video
                ref={videoRef}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/videos/ai-demo-poster.jpg"
                controls
              >
                <source src="/videos/ai-demo-full.mp4" type="video/mp4" />
              </video>
            </Box>
          </BrowserFrame>
        </MotionBox>
      </Flex>
    </Slide>
  );
}
