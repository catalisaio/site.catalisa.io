import {
  Box, Heading, Text, VStack, HStack, Icon, SimpleGrid,
} from '@chakra-ui/react';
import { FiMessageCircle, FiZap, FiCpu, FiTrendingUp } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { PageHero } from '../components/shared/PageHero';
import { SectionHeader } from '../components/shared/SectionHeader';
import { PageCTA } from '../components/shared/PageCTA';
import { MotionBox } from '../components/motion';
import { useLocalizedPath } from '../i18n/useLocalizedPath';

const stepIcons = [FiMessageCircle, FiCpu, FiTrendingUp];

export function HowItWorks() {
  const { t } = useTranslation('how-it-works');
  const { t: tc } = useTranslation('common');
  const lp = useLocalizedPath();
  const steps = t('steps', { returnObjects: true }) as Array<{
    title: string;
    description: string;
    detail: string;
  }>;
  const benefits = t('benefits', { returnObjects: true }) as string[];

  return (
    <>
      <PageHero
        badge={t('hero.badge')}
        badgeIcon={FiZap}
        heading={t('hero.heading')}
        headingGradient={t('hero.headingGradient')}
        subtitle={t('hero.subtitle')}
        primaryCTA={{ label: tc('cta.letsChat') }}
        secondaryCTA={{ label: t('cta.secondary'), to: lp('/building-blocks') }}
      />

      {/* Steps */}
      <SectionWrapper>
        <SectionHeader heading={t('stepsHeading')} />

        <VStack spacing={8} maxW="800px" mx="auto">
          {steps.map((step, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              w="full"
            >
              <HStack
                spacing={6}
                p={6}
                bg="white"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ borderColor: 'brand.400', boxShadow: 'md', transform: 'translateY(-4px)' }}
                transition="all 0.2s"
                align="flex-start"
              >
                <VStack spacing={0} flexShrink={0}>
                  <Box
                    w={12}
                    h={12}
                    borderRadius="xl"
                    bg="brand.50"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={stepIcons[i] || FiZap} boxSize={6} color="brand.500" />
                  </Box>
                  <Text fontSize="xs" fontWeight="800" color="brand.500" mt={1}>
                    {String(i + 1).padStart(2, '0')}
                  </Text>
                </VStack>

                <VStack align="flex-start" spacing={2} flex={1}>
                  <Heading as="h3" size="sm" fontWeight="700">
                    {step.title}
                  </Heading>
                  <Text color="gray.600" fontSize="sm" lineHeight="tall">
                    {step.description}
                  </Text>
                  <Text color="gray.400" fontSize="xs" fontStyle="italic">
                    {step.detail}
                  </Text>
                </VStack>
              </HStack>
            </MotionBox>
          ))}
        </VStack>
      </SectionWrapper>

      {/* Benefits */}
      <SectionWrapper bg="gray.50">
        <SectionHeader heading={t('benefitsHeading')} />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} maxW="700px" mx="auto">
          {benefits.map((benefit, i) => (
            <HStack key={i} spacing={3} p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
              <Icon as={FiZap} color="catalisa.accent" boxSize={4} />
              <Text fontSize="sm" color="gray.700">{benefit}</Text>
            </HStack>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      <PageCTA
        heading={t('cta.heading')}
        subtitle={t('cta.subtitle')}
        primaryCTA={{ label: t('cta.primary') }}
        secondaryCTA={{ label: t('cta.secondary'), to: lp('/building-blocks') }}
      />
    </>
  );
}
