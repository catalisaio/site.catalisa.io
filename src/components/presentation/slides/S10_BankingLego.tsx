import { Heading, Text, VStack, HStack, Box } from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { GradientText } from '../../shared/GradientText';
import { usePresentationColors } from '../PresentationThemeContext';

export function S10_BankingLego() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const highlights = t('bankingLego.highlights', { returnObjects: true }) as string[];

  return (
    <Slide>
      {/* Yellow/gold glow */}
      <Box
        position="absolute"
        top="20%"
        right="10%"
        w="50%"
        h="50%"
        bgGradient={`radial(circle, ${c.glowGold} 0%, transparent 70%)`}
        pointerEvents="none"
      />

      <VStack spacing={{ base: 8, md: 12 }} textAlign="center">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }} fontWeight="800">
            <GradientText gradient="linear(to-r, catalisa.secondary, catalisa.accent, brand.400)">
              {t('bankingLego.headline')}
            </GradientText>
          </Heading>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Text fontSize={{ base: 'md', md: 'xl' }} color={c.textSecondary} maxW="700px">
            {t('bankingLego.subtitle')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <Text fontSize={{ base: 'lg', md: '2xl' }} fontWeight="700" color="catalisa.secondary">
            {t('bankingLego.tagline')}
          </Text>
        </MotionBox>

        {/* Visual blocks */}
        <MotionBox
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <HStack spacing={3} flexWrap="wrap" justify="center">
            {[0, 1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                w={{ base: '50px', md: '70px' }}
                h={{ base: '50px', md: '70px' }}
                borderRadius="lg"
                bg={`rgba(253, 194, 52, ${c.glowGoldBlock + i * c.glowGoldStep})`}
                border="1px solid"
                borderColor="rgba(253, 194, 52, 0.3)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  w={{ base: '30px', md: '40px' }}
                  h={{ base: '30px', md: '40px' }}
                  borderRadius="md"
                  bg={`rgba(253, 194, 52, ${c.glowGoldBlock + 0.05 + i * (c.glowGoldStep + 0.03)})`}
                />
              </Box>
            ))}
          </HStack>
        </MotionBox>

        {/* Highlights */}
        <HStack spacing={{ base: 4, md: 8 }} flexWrap="wrap" justify="center">
          {highlights.map((h, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
            >
              <HStack spacing={2}>
                <Box as={FiCheck} color="catalisa.secondary" />
                <Text color={c.textSecondary} fontSize={{ base: 'sm', md: 'md' }}>{h}</Text>
              </HStack>
            </MotionBox>
          ))}
        </HStack>
      </VStack>
    </Slide>
  );
}
