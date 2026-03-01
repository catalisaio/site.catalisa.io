import { Heading, Text, SimpleGrid, VStack, Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S28_GTMStrategy() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const colsRaw = t('gtmStrategy.columns', { returnObjects: true });
  const columns = (Array.isArray(colsRaw) ? colsRaw : []) as Array<{
    title: string;
    steps: string[];
    highlights: string[];
  }>;
  const statsRaw = t('gtmStrategy.stats', { returnObjects: true });
  const stats = (Array.isArray(statsRaw) ? statsRaw : []) as Array<{
    value: string;
    label: string;
  }>;

  const columnColors = ['brand.400', 'whatsapp.400'];

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
            {t('gtmStrategy.badge')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('gtmStrategy.headline')}{' '}
            <Text as="span" color="brand.400">{t('gtmStrategy.headlineHighlight')}</Text>
          </Heading>
          <Text color={c.textMuted} fontSize={{ base: 'sm', md: 'md' }} textAlign="center" mt={2}>
            {t('gtmStrategy.subtitle')}
          </Text>
        </MotionBox>

        {/* Two columns: PLG and Sales-Led */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }} w="full">
          {columns.map((col, ci) => (
            <MotionBox
              key={ci}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + ci * 0.15 }}
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
                  bg={columnColors[ci]}
                />
                <VStack align="flex-start" spacing={3} pt={1}>
                  <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="800" color={columnColors[ci]}>
                    {col.title}
                  </Text>

                  {/* Steps flow */}
                  <HStack spacing={2} flexWrap="wrap">
                    {col.steps.map((step, si) => (
                      <HStack key={si} spacing={1}>
                        {si > 0 && (
                          <Text color={c.textSubtle} fontSize="xs">→</Text>
                        )}
                        <Box
                          px={2}
                          py={1}
                          borderRadius="md"
                          bg={c.tagBg}
                          border="1px solid"
                          borderColor={c.surfaceBorder}
                        >
                          <Text fontSize="xs" fontWeight="600" color={c.textSecondary}>
                            {step}
                          </Text>
                        </Box>
                      </HStack>
                    ))}
                  </HStack>

                  {/* Highlights */}
                  <VStack align="flex-start" spacing={1}>
                    {col.highlights.map((h, hi) => (
                      <HStack key={hi} spacing={2}>
                        <Box w={1.5} h={1.5} borderRadius="full" bg={columnColors[ci]} />
                        <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }}>
                          {h}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Convergence bar */}
        <MotionBox
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          w="full"
        >
          <Box
            bg={c.surfaceBg}
            p={{ base: 3, md: 4 }}
            borderRadius="xl"
            border="1px solid"
            borderColor={c.surfaceBorder}
            textAlign="center"
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
            <Text color={c.textSecondary} fontSize={{ base: 'sm', md: 'md' }} fontWeight="600" pt={1}>
              {t('gtmStrategy.convergence')}
            </Text>
          </Box>
        </MotionBox>

        {/* Bottom stats */}
        <MotionBox
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          w="full"
        >
          <HStack spacing={{ base: 4, md: 8 }} justify="center" flexWrap="wrap">
            {stats.map((s, i) => (
              <VStack key={i} spacing={0}>
                <Text
                  fontSize={{ base: 'xl', md: '2xl' }}
                  fontWeight="800"
                  bgGradient="linear(to-r, brand.300, whatsapp.400)"
                  bgClip="text"
                >
                  {s.value}
                </Text>
                <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }}>
                  {s.label}
                </Text>
              </VStack>
            ))}
          </HStack>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
