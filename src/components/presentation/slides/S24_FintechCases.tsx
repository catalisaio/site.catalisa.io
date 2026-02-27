import { Heading, Text, SimpleGrid, VStack, Box, HStack, Icon } from '@chakra-ui/react';
import { FiDollarSign, FiShield, FiGlobe, FiSmartphone } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

const ICONS = [FiDollarSign, FiShield, FiSmartphone, FiGlobe];

export function S24_FintechCases() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const cases = t('fintechCases.cases', { returnObjects: true }) as Array<{
    company: string;
    segment: string;
    metric: string;
    metricLabel: string;
    highlight: string;
    source: string;
  }>;

  return (
    <Slide>
      <VStack spacing={{ base: 5, md: 7 }} w="full">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <VStack spacing={2} textAlign="center">
            <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="widest" color="brand.400">
              {t('fintechCases.badge')}
            </Text>
            <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" lineHeight="1.15">
              {t('fintechCases.headline')}{' '}
              <Text as="span" color="brand.400">{t('fintechCases.headlineHighlight')}</Text>
            </Heading>
            <Text fontSize={{ base: 'sm', md: 'md' }} color={c.textMuted} maxW="650px">
              {t('fintechCases.subtitle')}
            </Text>
          </VStack>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 4 }} w="full">
          {cases.map((item, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 + i * 0.1 }}
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
                  <HStack justify="space-between" align="center">
                    <HStack spacing={2}>
                      <Box p={1.5} borderRadius="md" bg={c.iconContainerBg}>
                        <Icon as={ICONS[i % ICONS.length]} boxSize={4} color="brand.400" />
                      </Box>
                      <Text fontWeight="700" fontSize={{ base: 'sm', md: 'md' }}>
                        {item.company}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color={c.textSubtle} fontWeight="500">
                      {item.segment}
                    </Text>
                  </HStack>

                  <HStack spacing={3} align="baseline">
                    <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800" color="brand.400" lineHeight="1">
                      {item.metric}
                    </Text>
                    <Text fontSize={{ base: 'xs', md: 'sm' }} color={c.textMuted} fontWeight="500">
                      {item.metricLabel}
                    </Text>
                  </HStack>

                  <Text fontSize={{ base: 'xs', md: 'sm' }} color={c.textSecondary} lineHeight="1.4">
                    {item.highlight}
                  </Text>

                  <HStack spacing={1}>
                    <Box w={1.5} h={1.5} borderRadius="full" bg="brand.400" />
                    <Text fontSize="xs" color={c.textGhost} fontWeight="600">
                      {item.source}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Slide>
  );
}
