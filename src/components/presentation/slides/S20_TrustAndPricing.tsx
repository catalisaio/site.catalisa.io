import { Heading, Text, SimpleGrid, VStack, Box, HStack, Icon } from '@chakra-ui/react';
import { FiShield, FiGlobe, FiServer, FiLock } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

const badgeIcons = [FiShield, FiGlobe, FiServer, FiLock];
const modelColors = ['brand.400', 'whatsapp.400', 'catalisa.secondary'];

export function S20_TrustAndPricing() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const badges = t('trustAndPricing.badges', { returnObjects: true }) as Array<{ label: string; description: string }>;
  const highlights = t('trustAndPricing.highlights', { returnObjects: true }) as string[];
  const models = t('trustAndPricing.models', { returnObjects: true }) as Array<{ title: string; description: string }>;
  const roiBars = t('trustAndPricing.roiBars', { returnObjects: true }) as Array<{ label: string; pct: number }>;

  return (
    <Slide>
      <VStack spacing={{ base: 5, md: 7 }} w="full">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center">
            {t('trustAndPricing.headline')}
          </Heading>
        </MotionBox>

        {/* Security badges */}
        <SimpleGrid columns={{ base: 4 }} spacing={{ base: 2, md: 4 }} w="full">
          {badges.map((badge, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
            >
              <VStack
                bg={c.surfaceBg}
                p={{ base: 3, md: 4 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                spacing={2}
                textAlign="center"
              >
                <Box p={2} borderRadius="full" bg={c.iconContainerBg}>
                  <Icon as={badgeIcons[i]} boxSize={{ base: 4, md: 6 }} color="whatsapp.400" />
                </Box>
                <Text fontWeight="800" fontSize={{ base: 'xs', md: 'md' }}>{badge.label}</Text>
                <Text color={c.textMuted} fontSize="xs">{badge.description}</Text>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Highlights row */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2} w="full">
          {highlights.map((h, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
            >
              <Box bg={c.surfaceBg} px={3} py={2} borderRadius="lg" textAlign="center">
                <Text fontSize="xs" color={c.textSecondary} fontWeight="500">{h}</Text>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Pricing models */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 3, md: 4 }} w="full">
          {models.map((model, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 4, md: 5 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                h="full"
                position="relative"
                overflow="hidden"
              >
                <Box position="absolute" top={0} left={0} right={0} h="3px" bg={modelColors[i]} />
                <VStack spacing={2} textAlign="center" pt={1}>
                  <Text fontWeight="800" fontSize={{ base: 'md', md: 'lg' }} color={modelColors[i]}>
                    {model.title}
                  </Text>
                  <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }} lineHeight="1.6">
                    {model.description}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* ROI bars */}
        <MotionBox
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          w="full"
        >
          <Box
            bg={c.surfaceBg}
            p={{ base: 4, md: 5 }}
            borderRadius="xl"
            border="1px solid"
            borderColor={c.surfaceBorder}
          >
            <Text fontSize="xs" color={c.textSubtle} mb={3} fontWeight="600">{t('trustAndPricing.roiLabel')}</Text>
            <VStack spacing={2} align="stretch">
              {roiBars.map((bar, i) => (
                <HStack key={i} spacing={3}>
                  <Text fontSize="xs" color={c.textMuted} minW="65px">{bar.label}</Text>
                  <Box flex={1} h="6px" bg={c.progressBg} borderRadius="full" overflow="hidden">
                    <Box h="full" w={`${bar.pct}%`} bg={modelColors[i]} borderRadius="full" />
                  </Box>
                  <Text fontSize="xs" color={modelColors[i]} fontWeight="700">{bar.pct}%</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
