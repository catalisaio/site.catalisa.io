import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { presentationThemes } from '../presentationTheme';

// S01_Cover is ALWAYS light — brand identity: purple+gold logo on light background
const c = presentationThemes.light;

export function S01_Cover() {
  const { t } = useTranslation('presentation');

  return (
    <Slide color={c.textPrimary}>
      {/* Radial glow */}
      <Box
        position="absolute"
        top="30%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="80%"
        h="80%"
        bgGradient={`radial(circle, ${c.glowPurple} 0%, ${c.glowGreen} 40%, transparent 70%)`}
        pointerEvents="none"
      />

      <VStack spacing={{ base: 6, md: 8 }} textAlign="center">
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Heading
            fontSize={{ base: '5xl', md: '7xl', lg: '8xl' }}
            fontWeight="800"
            letterSpacing="-0.02em"
          >
            <Text as="span" color="brand.500">Catalisa</Text>
            <Text as="span" color="catalisa.secondary">.</Text>
          </Heading>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Text
            fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
            color={c.textMuted}
            maxW="700px"
            lineHeight="1.6"
          >
            {t('cover.tagline')}
          </Text>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Text
            fontSize={{ base: 'xs', md: 'sm' }}
            color={c.textGhost}
            fontWeight="500"
            letterSpacing="0.1em"
            textTransform="uppercase"
          >
            {t('cover.badge')}
          </Text>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
