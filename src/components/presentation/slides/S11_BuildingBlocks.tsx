import { Heading, Text, SimpleGrid, VStack, HStack, Box, Wrap, WrapItem, Tag } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

const categoryColors = ['catalisa.secondary', 'red.300', 'whatsapp.400', 'brand.400', 'catalisa.info'];

export function S11_BuildingBlocks() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const categories = t('buildingBlocks.categories', { returnObjects: true }) as Array<{
    name: string;
    items: string[];
  }>;

  return (
    <Slide>
      <VStack spacing={{ base: 6, md: 8 }} w="full">
        <VStack spacing={2} textAlign="center">
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800">
              {t('buildingBlocks.headline')}
            </Heading>
          </MotionBox>
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Text color={c.textMuted} fontSize={{ base: 'sm', md: 'md' }} maxW="600px">
              {t('buildingBlocks.subtitle')}
            </Text>
          </MotionBox>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 3, md: 4 }} w="full">
          {categories.map((cat, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 4, md: 5 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                h="full"
              >
                <HStack mb={3} spacing={2}>
                  <Box w={2} h={2} borderRadius="full" bg={categoryColors[i % categoryColors.length]} />
                  <Text fontWeight="700" fontSize={{ base: 'sm', md: 'md' }} color={categoryColors[i % categoryColors.length]}>
                    {cat.name}
                  </Text>
                </HStack>
                <Wrap spacing={2}>
                  {cat.items.map((item, j) => (
                    <WrapItem key={j}>
                      <Tag
                        size="sm"
                        bg={c.tagBg}
                        color={c.tagColor}
                        borderRadius="md"
                        fontSize="xs"
                      >
                        {item}
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Slide>
  );
}
