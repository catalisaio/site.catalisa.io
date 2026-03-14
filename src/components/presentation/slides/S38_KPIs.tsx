import { Heading, Text, SimpleGrid, VStack, Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S38_KPIs() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const indicatorsRaw = t('kpis.indicators', { returnObjects: true });
  const indicators = (Array.isArray(indicatorsRaw) ? indicatorsRaw : []) as Array<{
    label: string;
    target: string;
    description: string;
  }>;
  const healthRaw = t('kpis.healthMetrics', { returnObjects: true });
  const healthMetrics = (Array.isArray(healthRaw) ? healthRaw : []) as Array<{
    label: string;
    value: string;
    detail: string;
  }>;

  const healthColors = ['brand.400', 'whatsapp.400', 'catalisa.secondary'];

  return (
    <Slide>
      <VStack spacing={{ base: 5, md: 8 }} w="full">
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.15em"
            textTransform="uppercase"
            color="brand.400"
          >
            {t('kpis.badge')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('kpis.headline')}{' '}
            <Text as="span" color="brand.400">{t('kpis.headlineHighlight')}</Text>
          </Heading>
        </MotionBox>

        {/* KPI indicators grid */}
        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 3, md: 4 }} w="full">
          {indicators.map((ind, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 3, md: 4 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                h="full"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  h="2px"
                  bgGradient="linear(to-r, brand.500, whatsapp.400)"
                />
                <VStack spacing={1} align="flex-start" pt={1}>
                  <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }} fontWeight="600">
                    {ind.label}
                  </Text>
                  <Text
                    fontSize={{ base: 'xl', md: '2xl' }}
                    fontWeight="800"
                    bgGradient="linear(to-r, brand.300, whatsapp.400)"
                    bgClip="text"
                  >
                    {ind.target}
                  </Text>
                  <Text color={c.textSubtle} fontSize="xs" lineHeight="1.4">
                    {ind.description}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Business health */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          w="full"
        >
          <VStack align="flex-start" spacing={3} w="full">
            <HStack spacing={2}>
              <Box w={2} h={2} borderRadius="full" bg="brand.400" />
              <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.1em" color={c.textMuted}>
                {t('kpis.healthLabel')}
              </Text>
            </HStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 3, md: 4 }} w="full">
              {healthMetrics.map((hm, i) => (
                <Box
                  key={i}
                  bg={c.surfaceBg}
                  p={{ base: 3, md: 4 }}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={c.surfaceBorder}
                  position="relative"
                  overflow="hidden"
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="3px"
                    bg={healthColors[i % healthColors.length]}
                  />
                  <VStack spacing={1} align="flex-start" pt={1}>
                    <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" color={healthColors[i % healthColors.length]}>
                      {hm.label}
                    </Text>
                    <Text
                      fontSize={{ base: 'xl', md: '2xl' }}
                      fontWeight="800"
                      bgGradient="linear(to-r, brand.300, whatsapp.400)"
                      bgClip="text"
                    >
                      {hm.value}
                    </Text>
                    <Text color={c.textMuted} fontSize="xs" lineHeight="1.4">
                      {hm.detail}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
