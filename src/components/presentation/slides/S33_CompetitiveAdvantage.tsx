import { Heading, Text, SimpleGrid, VStack, Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S33_CompetitiveAdvantage() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const competitorsRaw = t('competitiveAdvantage.competitors', { returnObjects: true });
  const competitors = (Array.isArray(competitorsRaw) ? competitorsRaw : []) as Array<{
    name: string;
    price: string;
    includes: string;
    multiplier: string;
    highlight?: boolean;
  }>;
  const differentialsRaw = t('competitiveAdvantage.differentials', { returnObjects: true });
  const differentials = (Array.isArray(differentialsRaw) ? differentialsRaw : []) as string[];

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
            {t('competitiveAdvantage.badge')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('competitiveAdvantage.headline')}{' '}
            <Text as="span" color="brand.400">{t('competitiveAdvantage.headlineHighlight')}</Text>
          </Heading>
        </MotionBox>

        {/* Table header */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          w="full"
        >
          <SimpleGrid columns={4} spacing={2} px={{ base: 2, md: 4 }}>
            {['name', 'price', 'includes', 'multiplier'].map((col) => (
              <Text
                key={col}
                fontSize="xs"
                fontWeight="700"
                color={c.textSubtle}
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                {t(`competitiveAdvantage.header.${col}`)}
              </Text>
            ))}
          </SimpleGrid>
        </MotionBox>

        {/* Table rows */}
        <VStack spacing={2} w="full">
          {competitors.map((comp, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
              w="full"
            >
              <Box
                bg={c.surfaceBg}
                px={{ base: 3, md: 4 }}
                py={{ base: 2, md: 3 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={comp.highlight ? 'brand.400' : c.surfaceBorder}
                position="relative"
                overflow="hidden"
              >
                {comp.highlight && (
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    w="4px"
                    h="full"
                    bg="brand.400"
                    borderRadius="full"
                  />
                )}
                <SimpleGrid columns={4} spacing={2} pl={comp.highlight ? 2 : 0}>
                  <Text
                    fontSize={{ base: 'xs', md: 'sm' }}
                    fontWeight={comp.highlight ? '800' : '600'}
                    color={comp.highlight ? 'brand.400' : c.textSecondary}
                  >
                    {comp.name}
                  </Text>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" color={c.textSecondary}>
                    {comp.price}
                  </Text>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} color={c.textMuted}>
                    {comp.includes}
                  </Text>
                  <Text
                    fontSize={{ base: 'xs', md: 'sm' }}
                    fontWeight="800"
                    color={comp.highlight ? 'brand.400' : c.textMuted}
                  >
                    {comp.multiplier}
                  </Text>
                </SimpleGrid>
              </Box>
            </MotionBox>
          ))}
        </VStack>

        {/* Differentials */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 3, md: 4 }} w="full">
          {differentials.map((diff, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 3, md: 4 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                position="relative"
                overflow="hidden"
                h="full"
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  w="4px"
                  h="full"
                  bg="brand.400"
                  borderRadius="full"
                />
                <HStack spacing={2} pl={2}>
                  <Text color={c.textSecondary} fontSize={{ base: 'xs', md: 'sm' }} fontWeight="600" lineHeight="1.5">
                    {diff}
                  </Text>
                </HStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Slide>
  );
}
