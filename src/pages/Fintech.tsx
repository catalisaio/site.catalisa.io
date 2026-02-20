import { useState } from 'react';
import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Badge,
  Flex, Input, FormControl, FormLabel, Stat, StatLabel, StatNumber,
  StatHelpText, StatArrow,
} from '@chakra-ui/react';
import {
  FiShield, FiLock, FiKey, FiUsers, FiArrowRight, FiDollarSign,
  FiPackage, FiTrendingUp, FiPercent, FiCheckCircle,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { AnimatedCounter } from '../components/shared/AnimatedCounter';
import { useTranslatedUseCases } from '../i18n/useTranslatedData';
import { categoryBadges } from '../data/capabilityClusters';
import { FinalCTA } from '../components/sections/FinalCTA';

function ROICalculator({ t, locale }: { t: (key: string) => string; locale: string }) {
  const [agents, setAgents] = useState(5);
  const [leadsPerDay, setLeadsPerDay] = useState(50);
  const [costPerAgent, setCostPerAgent] = useState(3000);

  const currentMonthlyCost = agents * costPerAgent;
  const aiMonthlyCost = 800 + (leadsPerDay * 30 * 0.02);
  const savings = currentMonthlyCost - aiMonthlyCost;
  const savingsPercent = Math.round((savings / currentMonthlyCost) * 100);

  return (
    <Box bg="white" p={8} borderRadius="2xl" border="1px solid" borderColor="gray.200" boxShadow="lg">
      <VStack spacing={6} align="stretch">
        <Heading as="h3" size="md" fontWeight="700">{t('roi.calc.title')}</Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm">{t('roi.calc.fields.agents')}</FormLabel>
            <Input
              type="number"
              value={agents}
              onChange={(e) => setAgents(Number(e.target.value) || 0)}
              focusBorderColor="brand.500"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">{t('roi.calc.fields.leadsPerDay')}</FormLabel>
            <Input
              type="number"
              value={leadsPerDay}
              onChange={(e) => setLeadsPerDay(Number(e.target.value) || 0)}
              focusBorderColor="brand.500"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">{t('roi.calc.fields.costPerAgent')}</FormLabel>
            <Input
              type="number"
              value={costPerAgent}
              onChange={(e) => setCostPerAgent(Number(e.target.value) || 0)}
              focusBorderColor="brand.500"
            />
          </FormControl>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} pt={2}>
          <Stat>
            <StatLabel fontSize="xs" color="gray.500">{t('roi.calc.stats.currentCost')}</StatLabel>
            <StatNumber fontSize="xl" color="red.500">
              {t('roi.calc.currency')} {currentMonthlyCost.toLocaleString(locale)}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="xs" color="gray.500">{t('roi.calc.stats.withCatalisa')}</StatLabel>
            <StatNumber fontSize="xl" color="green.500">
              {t('roi.calc.currency')} {Math.round(aiMonthlyCost).toLocaleString(locale)}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="xs" color="gray.500">{t('roi.calc.stats.monthlySavings')}</StatLabel>
            <StatNumber fontSize="xl" color="brand.500">
              {t('roi.calc.currency')} {Math.max(0, Math.round(savings)).toLocaleString(locale)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type={savings > 0 ? 'increase' : 'decrease'} />
              {Math.abs(savingsPercent)}% {t('roi.calc.reduction')}
            </StatHelpText>
          </Stat>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

const complianceIcons = [FiShield, FiLock, FiKey, FiUsers];
const complianceColors = ['green.400', 'blue.400', 'purple.400', 'orange.400'];
const capabilityIcons = [FiPackage, FiTrendingUp, FiPercent, FiCheckCircle];
const capabilityColors = ['yellow.500', 'green.500', 'blue.500', 'brand.500'];

export function Fintech() {
  const { t, i18n } = useTranslation('fintech');
  const { fintechUseCases } = useTranslatedUseCases();
  const locale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en-US';

  return (
    <>
      {/* Hero */}
      <Box bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Badge colorScheme="yellow" fontSize="xs" px={3} py={1} borderRadius="full">
              {t('hero.badge')}
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" color="white" lineHeight="1.15">
              {t('hero.heading')}{' '}
              <GradientText gradient="linear(to-r, catalisa.secondary, catalisa.accent)">{t('hero.headingGradient')}</GradientText>
            </Heading>
            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" lineHeight="1.7">
              {t('hero.subtitle')}
            </Text>

            {/* Market stats */}
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6} pt={4}>
              <VStack>
                <AnimatedCounter target={120} suffix="M" fontSize="3xl" fontWeight="800" color="white" />
                <Text color="whiteAlpha.600" fontSize="xs">{t('hero.stats.stat1.label')}</Text>
              </VStack>
              <VStack>
                <AnimatedCounter target={91} suffix="%" fontSize="3xl" fontWeight="800" color="whatsapp.400" />
                <Text color="whiteAlpha.600" fontSize="xs">{t('hero.stats.stat2.label')}</Text>
              </VStack>
              <VStack>
                <Text fontSize="3xl" fontWeight="800" color="catalisa.secondary">{t('hero.stats.stat3.value')}</Text>
                <Text color="whiteAlpha.600" fontSize="xs">{t('hero.stats.stat3.label')}</Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* 5 Fintech Use Cases */}
      {fintechUseCases.map((useCase, idx) => (
        <SectionWrapper key={useCase.id} bg={idx % 2 === 0 ? undefined : 'gray.50'}>
          <Flex direction={{ base: 'column', lg: 'row' }} gap={10} align="flex-start">
            {/* Left - Content */}
            <VStack align="flex-start" spacing={5} flex={1}>
              <Badge colorScheme="brand" fontSize="xs">{useCase.industry}</Badge>
              <Heading as="h2" size="lg" fontWeight="800">{useCase.title}</Heading>
              <Text color="brand.500" fontWeight="500" fontSize="md">{useCase.subtitle}</Text>
              <Text color="gray.500" lineHeight="1.7">{useCase.description}</Text>

              {/* Before/After */}
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

            {/* Right - Workflow Steps */}
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
                          w={6} h={6} borderRadius="full" bg="brand.50"
                          display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                        >
                          <Text fontSize="2xs" fontWeight="700" color="brand.500">{i + 1}</Text>
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
            {complianceIcons.map((icon, i) => (
              <MotionBox
                key={t(`compliance.items.${i}.label`)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Box bg="whiteAlpha.50" p={5} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100" h="full">
                  <VStack spacing={3}>
                    <Icon as={icon} boxSize={6} color={complianceColors[i]} />
                    <Text fontWeight="600" color="white" fontSize="sm">{t(`compliance.items.${i}.label`)}</Text>
                    <Text color="whiteAlpha.600" fontSize="xs">{t(`compliance.items.${i}.description`)}</Text>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </SectionWrapper>

      {/* Financial Products Building Blocks */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Badge colorScheme="yellow" fontSize="xs" px={3} py={1} borderRadius="full">
            {t('capabilities.badge')}
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('capabilities.heading')}
          </Heading>
          <Text color="gray.500" maxW="600px">
            {t('capabilities.subtitle')}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5}>
          {capabilityIcons.map((icon, i) => (
            <MotionBox
              key={t(`capabilities.items.${i}.title`)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.100" h="full"
                _hover={{ borderColor: capabilityColors[i], boxShadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <VStack align="flex-start" spacing={3}>
                  <Icon as={icon} boxSize={6} color={capabilityColors[i]} />
                  <Heading as="h3" size="sm" fontWeight="700">{t(`capabilities.items.${i}.title`)}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.6">{t(`capabilities.items.${i}.description`)}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        <Box bg="yellow.50" p={6} borderRadius="xl" mt={8} textAlign="center" border="1px solid" borderColor="yellow.100">
          <Text color="gray.700" fontSize="md" fontWeight="500">
            <Text as="span" fontWeight="700" color="yellow.700">{t('capabilities.pipelineLabel')}</Text>{' '}
            {t('capabilities.pipeline')}
          </Text>
        </Box>
      </SectionWrapper>

      {/* ROI Calculator */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={8}>
          <HStack>
            <Icon as={FiDollarSign} boxSize={6} color="brand.500" />
            <Heading as="h2" size="xl" fontWeight="800">
              {t('roi.heading')}
            </Heading>
          </HStack>
          <Text color="gray.500" maxW="500px">
            {t('roi.subtitle')}
          </Text>
        </VStack>
        <Box maxW="900px" mx="auto">
          <ROICalculator t={t} locale={locale} />
        </Box>
      </SectionWrapper>

      <FinalCTA />
    </>
  );
}
