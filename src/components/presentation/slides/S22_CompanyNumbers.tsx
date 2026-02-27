import { Heading, Text, SimpleGrid, VStack, Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S22_CompanyNumbers() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const categories = t('companyNumbers.categories', { returnObjects: true }) as Array<{
    label: string;
    stats: Array<{ value: string; description: string }>;
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
            {t('companyNumbers.badge')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('companyNumbers.headline')}{' '}
            <Text as="span" color="brand.400">{t('companyNumbers.headlineHighlight')}</Text>
          </Heading>
        </MotionBox>

        {categories.map((cat, ci) => (
          <MotionBox
            key={ci}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + ci * 0.15 }}
            w="full"
          >
            <VStack align="stretch" spacing={3} w="full">
              <HStack spacing={2}>
                <Box w={2} h={2} borderRadius="full" bg="brand.400" />
                <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.1em" color={c.textMuted}>
                  {cat.label}
                </Text>
              </HStack>
              <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 3, md: 4 }}>
                {cat.stats.map((stat, si) => (
                  <Box
                    key={si}
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
                    <VStack spacing={1} pt={1}>
                      <Text
                        fontSize={{ base: 'xl', md: '3xl' }}
                        fontWeight="800"
                        bgGradient="linear(to-r, brand.300, whatsapp.400)"
                        bgClip="text"
                      >
                        {stat.value}
                      </Text>
                      <Text color={c.textSecondary} fontSize={{ base: 'xs', md: 'sm' }} lineHeight="1.4">
                        {stat.description}
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </MotionBox>
        ))}

        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
          <Text fontSize="xs" color={c.textGhost} fontStyle="italic">
            {t('companyNumbers.disclaimer')}
          </Text>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
