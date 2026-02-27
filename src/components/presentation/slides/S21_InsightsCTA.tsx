import { Heading, Text, SimpleGrid, VStack, Box, HStack, Icon } from '@chakra-ui/react';
import { FiTrendingUp, FiShoppingCart, FiClock, FiUsers, FiArrowRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

const CASE_ICONS = [FiTrendingUp, FiShoppingCart, FiClock, FiUsers];

export function S21_InsightsCTA() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const cases = t('insightsCta.cases', { returnObjects: true }) as Array<{
    company: string;
    industry: string;
    metric: string;
    metricLabel: string;
    highlight: string;
  }>;

  return (
    <Slide>
      <VStack spacing={{ base: 5, md: 7 }} w="full">
        {/* Header */}
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <VStack spacing={2} textAlign="center">
            <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="widest" color="brand.400">
              {t('insightsCta.badge')}
            </Text>
            <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" lineHeight="1.15">
              {t('insightsCta.headline')}{' '}
              <Text as="span" color="brand.400">{t('insightsCta.headlineHighlight')}</Text>
            </Heading>
            <Text fontSize={{ base: 'sm', md: 'md' }} color={c.textMuted} maxW="650px">
              {t('insightsCta.subtitle')}
            </Text>
          </VStack>
        </MotionBox>

        {/* Case cards grid */}
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
                  {/* Company + industry tag */}
                  <HStack justify="space-between" align="center">
                    <HStack spacing={2}>
                      <Box
                        p={1.5}
                        borderRadius="md"
                        bg={c.iconContainerBg}
                      >
                        <Icon as={CASE_ICONS[i % CASE_ICONS.length]} boxSize={4} color="brand.400" />
                      </Box>
                      <Text fontWeight="700" fontSize={{ base: 'sm', md: 'md' }}>
                        {item.company}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color={c.textSubtle} fontWeight="500">
                      {item.industry}
                    </Text>
                  </HStack>

                  {/* Big metric */}
                  <HStack spacing={3} align="baseline">
                    <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800" color="brand.400" lineHeight="1">
                      {item.metric}
                    </Text>
                    <Text fontSize={{ base: 'xs', md: 'sm' }} color={c.textMuted} fontWeight="500">
                      {item.metricLabel}
                    </Text>
                  </HStack>

                  {/* One-liner highlight */}
                  <Text fontSize={{ base: 'xs', md: 'sm' }} color={c.textSecondary} lineHeight="1.4">
                    {item.highlight}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Bottom insight link */}
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.7 }}>
          <HStack
            as="a"
            href="https://catalisa.io/insights"
            target="_blank"
            rel="noopener noreferrer"
            spacing={2}
            color="brand.400"
            fontSize="sm"
            fontWeight="600"
            _hover={{ color: 'brand.300', textDecoration: 'underline' }}
            cursor="pointer"
          >
            <Text>{t('insightsCta.moreInsights')}</Text>
            <Icon as={FiArrowRight} boxSize={4} />
          </HStack>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
