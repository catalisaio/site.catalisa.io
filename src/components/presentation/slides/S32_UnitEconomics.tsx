import { Heading, Text, SimpleGrid, VStack, Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S32_UnitEconomics() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const marginsRaw = t('unitEconomics.margins', { returnObjects: true });
  const margins = (Array.isArray(marginsRaw) ? marginsRaw : []) as Array<{
    plan: string;
    price: string;
    worstCase: string;
    median: string;
  }>;
  const benchmarksRaw = t('unitEconomics.benchmarks', { returnObjects: true });
  const benchmarks = (Array.isArray(benchmarksRaw) ? benchmarksRaw : []) as Array<{
    label: string;
    range: string;
    highlight?: boolean;
  }>;

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
            {t('unitEconomics.badge')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('unitEconomics.headline')}{' '}
            <Text as="span" color="brand.400">{t('unitEconomics.headlineHighlight')}</Text>
          </Heading>
        </MotionBox>

        {/* Margins by plan */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 3, md: 4 }} w="full">
          {margins.map((m, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
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
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  h="2px"
                  bgGradient="linear(to-r, brand.500, whatsapp.400)"
                />
                <VStack spacing={3} align="flex-start" pt={1}>
                  <HStack spacing={2} align="baseline">
                    <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="800" color={c.textSecondary}>
                      {m.plan}
                    </Text>
                    <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="600" color={c.textMuted}>
                      {m.price}
                    </Text>
                  </HStack>
                  <VStack spacing={1} align="flex-start" w="full">
                    <HStack spacing={2} w="full" justify="space-between">
                      <Text fontSize="xs" color={c.textMuted} fontWeight="600">
                        Worst Case
                      </Text>
                      <Text
                        fontSize={{ base: 'sm', md: 'md' }}
                        fontWeight="800"
                        color={c.textSecondary}
                      >
                        {m.worstCase}
                      </Text>
                    </HStack>
                    <HStack spacing={2} w="full" justify="space-between">
                      <Text fontSize="xs" color={c.textMuted} fontWeight="600">
                        Median
                      </Text>
                      <Text
                        fontSize={{ base: 'sm', md: 'md' }}
                        fontWeight="800"
                        bgGradient="linear(to-r, brand.300, whatsapp.400)"
                        bgClip="text"
                      >
                        {m.median}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Benchmarks */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          w="full"
        >
          <VStack spacing={2} w="full">
            {benchmarks.map((b, i) => (
              <Box
                key={i}
                bg={c.surfaceBg}
                px={{ base: 4, md: 5 }}
                py={{ base: 2, md: 3 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                w="full"
                position="relative"
                overflow="hidden"
              >
                {b.highlight && (
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
                <HStack spacing={3} justify="space-between" pl={b.highlight ? 2 : 0}>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="600" color={c.textSecondary}>
                    {b.label}
                  </Text>
                  <Text
                    fontSize={{ base: 'xs', md: 'sm' }}
                    fontWeight="800"
                    color={b.highlight ? 'brand.400' : c.textMuted}
                  >
                    {b.range}
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        </MotionBox>

        {/* WhatsApp advantage */}
        <MotionBox
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          w="full"
        >
          <Box
            bg={c.surfaceBg}
            p={{ base: 4, md: 5 }}
            borderRadius="xl"
            border="1px solid"
            borderColor="whatsapp.400"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              h="2px"
              bg="whatsapp.400"
            />
            <VStack spacing={1} pt={1}>
              <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="800" color="whatsapp.400">
                {t('unitEconomics.whatsappAdvantage')}
              </Text>
              <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }} textAlign="center">
                {t('unitEconomics.whatsappDetail')}
              </Text>
            </VStack>
          </Box>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
