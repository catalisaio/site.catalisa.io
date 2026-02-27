import { Heading, Text, SimpleGrid, VStack, Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S02_MarketOpportunity() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const stats = t('marketOpportunity.stats', { returnObjects: true }) as Array<{
    value: string;
    label: string;
    source: string;
  }>;

  return (
    <Slide>
      <VStack spacing={{ base: 6, md: 10 }} w="full">
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.15em"
            textTransform="uppercase"
            color="brand.400"
          >
            {t('marketOpportunity.badge')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('marketOpportunity.headline')}{' '}
            <Text as="span" color="brand.400">{t('marketOpportunity.headlineHighlight')}</Text>
          </Heading>
        </MotionBox>

        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 3, md: 5 }} w="full">
          {stats.map((stat, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 4, md: 6 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                textAlign="center"
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
                <VStack spacing={2} pt={1}>
                  <Text
                    fontSize={{ base: '2xl', md: '4xl' }}
                    fontWeight="800"
                    bgGradient="linear(to-r, brand.300, whatsapp.400)"
                    bgClip="text"
                  >
                    {stat.value}
                  </Text>
                  <Text color={c.textSecondary} fontSize={{ base: 'xs', md: 'sm' }} lineHeight="1.5">
                    {stat.label}
                  </Text>
                  <HStack spacing={1}>
                    <Box w={1.5} h={1.5} borderRadius="full" bg="brand.400" />
                    <Text fontSize="xs" color={c.textSubtle} fontWeight="600">
                      {stat.source}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.9 }}>
          <Text fontSize="xs" color={c.textGhost} fontStyle="italic">
            {t('marketOpportunity.disclaimer')}
          </Text>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
