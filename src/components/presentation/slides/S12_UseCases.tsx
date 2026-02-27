import { Heading, Text, SimpleGrid, VStack, Box, HStack, Wrap, WrapItem, Tag } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S12_UseCases() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const scenarios = t('useCases.scenarios', { returnObjects: true }) as Array<{
    title: string;
    before: { label: string; detail: string };
    after: { label: string; detail: string };
    blocks: string[];
  }>;

  return (
    <Slide>
      <VStack spacing={{ base: 6, md: 8 }} w="full">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('useCases.headline')}{' '}
            <Text as="span" color="brand.400">{t('useCases.headlineHighlight')}</Text>
          </Heading>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 5 }} w="full">
          {scenarios.map((scenario, i) => (
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
              >
                <VStack align="stretch" spacing={3}>
                  <Text fontWeight="800" fontSize={{ base: 'md', md: 'lg' }}>{scenario.title}</Text>

                  {/* Before / After */}
                  <HStack spacing={3}>
                    <Box flex={1} bg={c.problemBg} px={3} py={2} borderRadius="lg" border="1px solid" borderColor={c.problemBorder}>
                      <Text fontSize="xs" color={c.problemAccent} fontWeight="700" mb={1}>ANTES</Text>
                      <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="600" color={c.problemAccent}>{scenario.before.label}</Text>
                      <Text fontSize="xs" color={c.textMuted}>{scenario.before.detail}</Text>
                    </Box>
                    <Box flex={1} bg={c.successBg} px={3} py={2} borderRadius="lg" border="1px solid" borderColor={c.successBorder}>
                      <Text fontSize="xs" color={c.successAccent} fontWeight="700" mb={1}>DEPOIS</Text>
                      <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="600" color={c.successAccent}>{scenario.after.label}</Text>
                      <Text fontSize="xs" color={c.textMuted}>{scenario.after.detail}</Text>
                    </Box>
                  </HStack>

                  {/* Blocks */}
                  <Wrap spacing={1}>
                    {scenario.blocks.map((block, j) => (
                      <WrapItem key={j}>
                        <Tag size="sm" bg={c.tagBg} color={c.tagColor} fontSize="xs" borderRadius="md">
                          {block}
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Slide>
  );
}
