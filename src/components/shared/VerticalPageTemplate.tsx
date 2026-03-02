import { useState } from 'react';
import {
  Box, Heading, Text, VStack, SimpleGrid, HStack, Icon, Badge,
  Flex, Input, FormControl, FormLabel, Stat, StatLabel, StatNumber,
  StatHelpText, StatArrow,
} from '@chakra-ui/react';
import {
  FiShield, FiLock, FiKey, FiUsers, FiArrowRight, FiDollarSign,
  FiPackage, FiTrendingUp, FiPercent, FiCheckCircle, FiGlobe, FiDatabase,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { MotionBox } from '../motion';
import { SectionWrapper } from './SectionWrapper';
import { PageHero } from './PageHero';
import { SectionHeader } from './SectionHeader';
import { FinalCTA } from '../sections/FinalCTA';
import { categoryBadges } from '../../data/capabilityClusters';

interface UseCaseData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  industry: string;
  before: { metric: string; value: string }[];
  after: { metric: string; value: string }[];
  workflowSteps: { category: string; label: string }[];
}

interface StatData {
  value: string;
  label: string;
  numericValue?: number;
  suffix?: string;
  color?: string;
}

interface ComplianceItem {
  label: string;
  description: string;
}

interface CapabilityItem {
  title: string;
  description: string;
}

interface ROIField {
  label: string;
  defaultValue: number;
  key: string;
}

interface ROIConfig {
  title: string;
  currency: string;
  fields: ROIField[];
  calculate: (values: Record<string, number>) => { current: number; ai: number };
  stats: { currentCost: string; withCatalisa: string; monthlySavings: string; reduction: string };
}

interface VerticalPageTemplateProps {
  t: (key: string, opts?: Record<string, unknown>) => string;
  locale: string;
  accentColor: string;
  useCases: UseCaseData[];
  heroStats: StatData[];
  heroGradient?: string;
  complianceItems: ComplianceItem[];
  capabilities: CapabilityItem[];
  capabilityBadge: string;
  capabilityPipeline?: { label: string; text: string };
  roiConfig: ROIConfig;
  ctaLabel: string;
  heroId?: string;
}

const complianceIcons: IconType[] = [FiShield, FiLock, FiKey, FiUsers];
const complianceColors = ['green.400', 'blue.400', 'purple.400', 'orange.400'];
const capabilityIcons: IconType[] = [FiPackage, FiTrendingUp, FiPercent, FiCheckCircle, FiGlobe, FiDatabase];
const capabilityColors = ['yellow.500', 'green.500', 'blue.500', 'brand.500', 'purple.500', 'teal.500'];

function ROICalculator({ config, locale }: { config: ROIConfig; locale: string }) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(config.fields.map(f => [f.key, f.defaultValue]))
  );

  const updateValue = (key: string, val: number) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const { current: currentMonthlyCost, ai: aiMonthlyCost } = config.calculate(values);
  const savings = currentMonthlyCost - aiMonthlyCost;
  const savingsPercent = currentMonthlyCost > 0 ? Math.round((savings / currentMonthlyCost) * 100) : 0;

  return (
    <Box bg="white" p={8} borderRadius="2xl" border="1px solid" borderColor="gray.200" boxShadow="lg">
      <VStack spacing={6} align="stretch">
        <Heading as="h3" size="md" fontWeight="700">{config.title}</Heading>

        <SimpleGrid columns={{ base: 1, md: config.fields.length }} spacing={4}>
          {config.fields.map((field) => (
            <FormControl key={field.key}>
              <FormLabel fontSize="sm">{field.label}</FormLabel>
              <Input
                type="number"
                value={values[field.key]}
                onChange={(e) => updateValue(field.key, Number(e.target.value) || 0)}
                focusBorderColor="brand.500"
              />
            </FormControl>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} pt={2}>
          <Stat>
            <StatLabel fontSize="xs" color="gray.500">{config.stats.currentCost}</StatLabel>
            <StatNumber fontSize="xl" color="red.500">
              {config.currency} {currentMonthlyCost.toLocaleString(locale)}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="xs" color="gray.500">{config.stats.withCatalisa}</StatLabel>
            <StatNumber fontSize="xl" color="green.500">
              {config.currency} {Math.round(aiMonthlyCost).toLocaleString(locale)}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="xs" color="gray.500">{config.stats.monthlySavings}</StatLabel>
            <StatNumber fontSize="xl" color="brand.500">
              {config.currency} {Math.max(0, Math.round(savings)).toLocaleString(locale)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type={savings > 0 ? 'increase' : 'decrease'} />
              {Math.abs(savingsPercent)}% {config.stats.reduction}
            </StatHelpText>
          </Stat>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export function VerticalPageTemplate({
  t,
  locale,
  accentColor,
  useCases,
  heroStats,
  heroGradient,
  complianceItems,
  capabilities,
  capabilityBadge,
  capabilityPipeline,
  roiConfig,
  ctaLabel,
  heroId,
}: VerticalPageTemplateProps) {
  return (
    <>
      {/* Hero */}
      <PageHero
        badge={t('hero.badge')}
        heading={t('hero.heading')}
        headingGradient={t('hero.headingGradient')}
        subtitle={t('hero.subtitle')}
        accentColor={accentColor}
        gradient={heroGradient || `linear(to-r, ${accentColor}.300, ${accentColor}.400, catalisa.accent)`}
        primaryCTA={{ label: ctaLabel }}
        stats={heroStats}
        heroId={heroId}
      />

      {/* Use Cases */}
      {useCases.map((useCase, idx) => (
        <SectionWrapper key={useCase.id} bg={idx % 2 === 0 ? undefined : 'gray.50'}>
          <Flex direction={{ base: 'column', lg: 'row' }} gap={10} align="flex-start">
            <VStack align="flex-start" spacing={5} flex={1}>
              <Badge colorScheme={accentColor} fontSize="xs">{useCase.industry}</Badge>
              <Heading as="h2" size="lg" fontWeight="800">{useCase.title}</Heading>
              <Text color="brand.500" fontWeight="500" fontSize="md">{useCase.subtitle}</Text>
              <Text color="gray.500" lineHeight="1.7">{useCase.description}</Text>

              <SimpleGrid columns={2} spacing={4} w="full" pt={2}>
                <Box bg="red.50" p={4} borderRadius="xl" border="1px solid" borderColor="red.100">
                  <Text fontSize="xs" fontWeight="700" color="red.500" mb={2}>{t('beforeAfter.before')}</Text>
                  {useCase.before.map((item) => (
                    <HStack key={item.metric} justify="space-between" mb={1}>
                      <Text fontSize="xs" color="gray.600">{item.metric}</Text>
                      <Text fontSize="xs" fontWeight="600" color="red.600">{item.value}</Text>
                    </HStack>
                  ))}
                </Box>
                <Box bg="green.50" p={4} borderRadius="xl" border="1px solid" borderColor="green.100">
                  <Text fontSize="xs" fontWeight="700" color="green.500" mb={2}>{t('beforeAfter.after')}</Text>
                  {useCase.after.map((item) => (
                    <HStack key={item.metric} justify="space-between" mb={1}>
                      <Text fontSize="xs" color="gray.600">{item.metric}</Text>
                      <Text fontSize="xs" fontWeight="600" color="green.600">{item.value}</Text>
                    </HStack>
                  ))}
                </Box>
              </SimpleGrid>
            </VStack>

            <Box flex={1} maxW={{ lg: '400px' }}>
              <Box bg="white" p={5} borderRadius="xl" border="1px solid" borderColor="gray.200">
                <Text fontSize="xs" fontWeight="700" color="gray.400" mb={3} textTransform="uppercase">
                  {t('workflow')}
                </Text>
                <VStack align="stretch" spacing={2}>
                  {useCase.workflowSteps.map((step, i) => (
                    <MotionBox
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                    >
                      <HStack spacing={3} p={2} borderRadius="lg" _hover={{ bg: 'gray.50' }}>
                        <Box
                          w={6} h={6} borderRadius="full" bg={`${accentColor}.50`}
                          display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                        >
                          <Text fontSize="2xs" fontWeight="700" color={`${accentColor}.500`}>{i + 1}</Text>
                        </Box>
                        <VStack align="flex-start" spacing={0}>
                          <Badge colorScheme={categoryBadges[step.category]?.color || 'gray'} fontSize="2xs">{step.category}</Badge>
                          <Text fontSize="sm" fontWeight="500">{step.label}</Text>
                        </VStack>
                        {i < useCase.workflowSteps.length - 1 && (
                          <Icon as={FiArrowRight} color="gray.300" boxSize={3} ml="auto" />
                        )}
                      </HStack>
                    </MotionBox>
                  ))}
                </VStack>
              </Box>
            </Box>
          </Flex>
        </SectionWrapper>
      ))}

      {/* Compliance & Security */}
      <SectionWrapper bg="gray.900">
        <VStack spacing={6} textAlign="center">
          <Heading as="h2" size="xl" fontWeight="800" color="white">
            {t('compliance.heading')}
          </Heading>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} w="full" pt={4}>
            {complianceItems.map((item, i) => (
              <MotionBox
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Box
                  bg="whiteAlpha.50"
                  p={5}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  h="full"
                  _hover={{ bg: 'whiteAlpha.100', transform: 'translateY(-4px)' }}
                  transition="all 0.2s"
                >
                  <VStack spacing={3}>
                    <Icon as={complianceIcons[i % complianceIcons.length]} boxSize={6} color={complianceColors[i % complianceColors.length]} />
                    <Text fontWeight="600" color="white" fontSize="sm">{item.label}</Text>
                    <Text color="whiteAlpha.600" fontSize="xs">{item.description}</Text>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </SectionWrapper>

      {/* Capabilities */}
      <SectionWrapper>
        <SectionHeader
          badge={capabilityBadge}
          heading={t('capabilities.heading')}
          subtitle={t('capabilities.subtitle')}
        />

        <SimpleGrid columns={{ base: 1, sm: 2, lg: Math.min(capabilities.length, 4) }} spacing={5}>
          {capabilities.map((cap, i) => (
            <MotionBox
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Box
                bg="white"
                p={6}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                h="full"
                _hover={{ borderColor: capabilityColors[i % capabilityColors.length], boxShadow: 'md', transform: 'translateY(-4px)' }}
                transition="all 0.2s"
              >
                <VStack align="flex-start" spacing={3}>
                  <Icon as={capabilityIcons[i % capabilityIcons.length]} boxSize={6} color={capabilityColors[i % capabilityColors.length]} />
                  <Heading as="h3" size="sm" fontWeight="700">{cap.title}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.6">{cap.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {capabilityPipeline && (
          <Box bg={`${accentColor}.50`} p={6} borderRadius="xl" mt={8} textAlign="center" border="1px solid" borderColor={`${accentColor}.100`}>
            <Text color="gray.700" fontSize="md" fontWeight="500">
              <Text as="span" fontWeight="700" color={`${accentColor}.700`}>{capabilityPipeline.label}</Text>{' '}
              {capabilityPipeline.text}
            </Text>
          </Box>
        )}
      </SectionWrapper>

      {/* ROI Calculator */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={8}>
          <HStack>
            <Icon as={FiDollarSign} boxSize={6} color="brand.500" />
            <Heading as="h2" size="xl" fontWeight="800">{t('roi.heading')}</Heading>
          </HStack>
          <Text color="gray.500" maxW="500px">{t('roi.subtitle')}</Text>
        </VStack>
        <Box maxW="900px" mx="auto">
          <ROICalculator config={roiConfig} locale={locale} />
        </Box>
      </SectionWrapper>

      <FinalCTA />
    </>
  );
}
