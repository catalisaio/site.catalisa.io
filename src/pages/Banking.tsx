import { useState } from 'react';
import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Badge,
  Flex, Input, FormControl, FormLabel, Stat, StatLabel, StatNumber,
  StatHelpText, StatArrow,
} from '@chakra-ui/react';
import {
  FiShield, FiLock, FiKey, FiUsers, FiArrowRight, FiDollarSign,
  FiGlobe, FiDatabase, FiCheckCircle, FiCpu,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { AnimatedCounter } from '../components/shared/AnimatedCounter';
import { useTranslatedUseCases } from '../i18n/useTranslatedData';
import { categoryBadges } from '../data/capabilityClusters';
import { FinalCTA } from '../components/sections/FinalCTA';

function BankingROICalculator({ t, locale }: { t: (key: string) => string; locale: string }) {
  const [branches, setBranches] = useState(10);
  const [transactionsPerDay, setTransactionsPerDay] = useState(200);
  const [costPerTransaction, setCostPerTransaction] = useState(8);

  const currentMonthlyCost = branches * transactionsPerDay * 22 * costPerTransaction;
  const aiMonthlyCost = 1200 + (transactionsPerDay * 22 * 0.15 * branches);
  const savings = currentMonthlyCost - aiMonthlyCost;
  const savingsPercent = Math.round((savings / currentMonthlyCost) * 100);

  return (
    <Box bg="white" p={8} borderRadius="2xl" border="1px solid" borderColor="gray.200" boxShadow="lg">
      <VStack spacing={6} align="stretch">
        <Heading as="h3" size="md" fontWeight="700">{t('roi.calc.title')}</Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm">{t('roi.calc.fields.branches')}</FormLabel>
            <Input
              type="number"
              value={branches}
              onChange={(e) => setBranches(Number(e.target.value) || 0)}
              focusBorderColor="brand.500"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">{t('roi.calc.fields.transactionsPerDay')}</FormLabel>
            <Input
              type="number"
              value={transactionsPerDay}
              onChange={(e) => setTransactionsPerDay(Number(e.target.value) || 0)}
              focusBorderColor="brand.500"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">{t('roi.calc.fields.costPerTransaction')}</FormLabel>
            <Input
              type="number"
              value={costPerTransaction}
              onChange={(e) => setCostPerTransaction(Number(e.target.value) || 0)}
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
const capabilityIcons = [FiGlobe, FiDatabase, FiCpu, FiCheckCircle];
const capabilityColors = ['blue.500', 'green.500', 'purple.500', 'brand.500'];

export function Banking() {
  const { t, i18n } = useTranslation('banking');
  const { bankingUseCases } = useTranslatedUseCases();
  const locale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en-US';

  return (
    <>
      {/* Hero */}
      <Box id="hero" bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Badge colorScheme="blue" fontSize="xs" px={3} py={1} borderRadius="full">
              {t('hero.badge')}
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" color="white" lineHeight="1.15">
              {t('hero.heading')}{' '}
              <GradientText gradient="linear(to-r, catalisa.secondary, catalisa.accent)">{t('hero.headingGradient')}</GradientText>
            </Heading>
            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" lineHeight="1.7">
              {t('hero.subtitle')}
            </Text>

            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6} pt={4}>
              <VStack>
                <AnimatedCounter target={148} suffix="M" fontSize="3xl" fontWeight="800" color="white" />
                <Text color="whiteAlpha.600" fontSize="xs">{t('hero.stats.stat1.label')}</Text>
              </VStack>
              <VStack>
                <AnimatedCounter target={82} suffix="%" fontSize="3xl" fontWeight="800" color="whatsapp.400" />
                <Text color="whiteAlpha.600" fontSize="xs">{t('hero.stats.stat2.label')}</Text>
              </VStack>
              <VStack>
                <AnimatedCounter target={76} suffix="%" fontSize="3xl" fontWeight="800" color="catalisa.secondary" />
                <Text color="whiteAlpha.600" fontSize="xs">{t('hero.stats.stat3.label')}</Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Market Context */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={10}>
          <Badge colorScheme="blue" fontSize="xs" px={3} py={1} borderRadius="full">
            {t('market.badge')}
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('market.heading')}
          </Heading>
          <Text color="gray.500" maxW="700px" lineHeight="1.7">
            {t('market.subtitle')}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5}>
          {[0, 1, 2, 3].map((i) => (
            <MotionBox
              key={t(`market.banks.${i}.name`)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Box bg="white" p={5} borderRadius="xl" border="1px solid" borderColor="gray.100" h="full"
                _hover={{ borderColor: 'blue.300', boxShadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <VStack align="flex-start" spacing={2}>
                  <Badge colorScheme="blue" fontSize="2xs">{t(`market.banks.${i}.highlight`)}</Badge>
                  <Heading as="h3" size="sm" fontWeight="700">{t(`market.banks.${i}.name`)}</Heading>
                  <Text color="gray.500" fontSize="sm">{t(`market.banks.${i}.description`)}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        <Box bg="blue.50" p={5} borderRadius="xl" mt={8} textAlign="center" border="1px solid" borderColor="blue.100">
          <Text color="gray.700" fontSize="md" fontStyle="italic">
            {t('market.quote')}
          </Text>
          <Text color="gray.400" fontSize="xs" mt={1}>{t('market.quoteSource')}</Text>
        </Box>
      </SectionWrapper>

      {/* 5 Banking Use Cases */}
      {bankingUseCases.map((useCase, idx) => (
        <SectionWrapper key={useCase.id} bg={idx % 2 === 0 ? 'gray.50' : undefined}>
          <Flex direction={{ base: 'column', lg: 'row' }} gap={10} align="flex-start">
            <VStack align="flex-start" spacing={5} flex={1}>
              <Badge colorScheme="blue" fontSize="xs">{useCase.industry}</Badge>
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
                          w={6} h={6} borderRadius="full" bg="blue.50"
                          display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                        >
                          <Text fontSize="2xs" fontWeight="700" color="blue.500">{i + 1}</Text>
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

      {/* Compliance & Regulatorio */}
      <SectionWrapper bg="gray.900">
        <VStack spacing={6} textAlign="center">
          <Heading as="h2" size="xl" fontWeight="800" color="white">
            {t('compliance.heading')}
          </Heading>
          <Text color="whiteAlpha.600" maxW="600px">
            {t('compliance.subtitle')}
          </Text>

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

      {/* Open Finance Integration */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Badge colorScheme="blue" fontSize="xs" px={3} py={1} borderRadius="full">
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

        <Box bg="blue.50" p={6} borderRadius="xl" mt={8} textAlign="center" border="1px solid" borderColor="blue.100">
          <Text color="gray.700" fontSize="md" fontWeight="500">
            <Text as="span" fontWeight="700" color="blue.700">{t('capabilities.pipelineLabel')}</Text>{' '}
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
          <BankingROICalculator t={t} locale={locale} />
        </Box>
      </SectionWrapper>

      <FinalCTA />
    </>
  );
}
