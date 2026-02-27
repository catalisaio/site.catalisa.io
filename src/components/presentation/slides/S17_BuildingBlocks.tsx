import { Heading, Text, SimpleGrid, VStack, HStack, Box, Wrap, WrapItem, Tag, Flex } from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { GradientText } from '../../shared/GradientText';
import { usePresentationColors } from '../PresentationThemeContext';

const categoryColors = ['catalisa.secondary', 'red.300', 'whatsapp.400', 'brand.400', 'catalisa.info'];

export function S17_BuildingBlocks() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const highlights = t('buildingBlocksMerged.highlights', { returnObjects: true }) as string[];
  const categories = t('buildingBlocksMerged.categories', { returnObjects: true }) as Array<{
    name: string;
    items: string[];
  }>;

  return (
    <Slide>
      {/* Gold glow */}
      <Box
        position="absolute"
        top="15%"
        right="10%"
        w="40%"
        h="40%"
        bgGradient={`radial(circle, ${c.glowGold} 0%, transparent 70%)`}
        pointerEvents="none"
      />

      <VStack spacing={{ base: 5, md: 7 }} w="full">
        <VStack spacing={2} textAlign="center">
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800">
              <GradientText gradient="linear(to-r, catalisa.secondary, catalisa.accent, brand.400)">
                {t('buildingBlocksMerged.headline')}
              </GradientText>
            </Heading>
          </MotionBox>
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Text color={c.textSecondary} fontSize={{ base: 'sm', md: 'md' }} maxW="600px">
              {t('buildingBlocksMerged.subtitle')}
            </Text>
          </MotionBox>
        </VStack>

        <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 4, md: 6 }} w="full" align="stretch">
          {/* Left: LEGO visual + highlights */}
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            flex={{ base: 'none', md: '0 0 30%' }}
          >
            <VStack spacing={4} h="full" justify="center">
              {/* Visual blocks */}
              <HStack spacing={2} flexWrap="wrap" justify="center">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Box
                    key={i}
                    w={{ base: '40px', md: '50px' }}
                    h={{ base: '40px', md: '50px' }}
                    borderRadius="lg"
                    bg={`rgba(253, 194, 52, ${c.glowGoldBlock + i * c.glowGoldStep})`}
                    border="1px solid"
                    borderColor="rgba(253, 194, 52, 0.3)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box
                      w={{ base: '24px', md: '30px' }}
                      h={{ base: '24px', md: '30px' }}
                      borderRadius="md"
                      bg={`rgba(253, 194, 52, ${c.glowGoldBlock + 0.05 + i * (c.glowGoldStep + 0.03)})`}
                    />
                  </Box>
                ))}
              </HStack>

              {/* Highlights */}
              <VStack spacing={2} align="flex-start">
                {highlights.map((h, i) => (
                  <HStack key={i} spacing={2}>
                    <Box as={FiCheck} color="catalisa.secondary" />
                    <Text color={c.textSecondary} fontSize={{ base: 'xs', md: 'sm' }}>{h}</Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </MotionBox>

          {/* Right: Categories grid */}
          <Box flex={1}>
            <SimpleGrid columns={{ base: 2, lg: 3 }} spacing={{ base: 2, md: 3 }}>
              {categories.map((cat, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                >
                  <Box
                    bg={c.surfaceBg}
                    p={{ base: 3, md: 4 }}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={c.surfaceBorder}
                    h="full"
                  >
                    <HStack mb={2} spacing={2}>
                      <Box w={2} h={2} borderRadius="full" bg={categoryColors[i % categoryColors.length]} />
                      <Text fontWeight="700" fontSize={{ base: 'xs', md: 'sm' }} color={categoryColors[i % categoryColors.length]}>
                        {cat.name}
                      </Text>
                    </HStack>
                    <Wrap spacing={1}>
                      {cat.items.map((item, j) => (
                        <WrapItem key={j}>
                          <Tag size="sm" bg={c.tagBg} color={c.tagColor} borderRadius="md" fontSize="xs">
                            {item}
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>
          </Box>
        </Flex>
      </VStack>
    </Slide>
  );
}
