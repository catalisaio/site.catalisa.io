import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Badge,
  Flex, Input, FormControl, FormLabel, Stat, StatLabel, StatNumber,
  StatHelpText, StatArrow,
} from '@chakra-ui/react';
import {
  FiShield, FiLock, FiCreditCard, FiGrid, FiArrowRight, FiDollarSign,
  FiShoppingBag, FiClipboard, FiHeart, FiHeadphones,
} from 'react-icons/fi';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { AnimatedCounter } from '../components/shared/AnimatedCounter';
import { useTranslatedUseCases } from '../i18n/useTranslatedData';
import { categoryBadges } from '../data/capabilityClusters';
import { FinalCTA } from '../components/sections/FinalCTA';

function ROICalculator({ t }: { t: (key: string) => string }) {
  const [agents, setAgents] = useState(4);
  const [ordersPerDay, setOrdersPerDay] = useState(80);
  const [costPerAgent, setCostPerAgent] = useState(2500);

  const currentMonthlyCost = agents * costPerAgent;
  const aiMonthlyCost = 600 + (ordersPerDay * 30 * 0.015);
  const savings = currentMonthlyCost - aiMonthlyCost;
  const savingsPercent = Math.round((savings / currentMonthlyCost) * 100);

  return (
    <Box bg="white" p={8} borderRadius="2xl" border="1px solid" borderColor="gray.200" boxShadow="lg">
      <VStack spacing={6} align="stretch">
        <Heading as="h3" size="md" fontWeight="700">{t('roi.calculatorTitle')}</Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm">{t('roi.agentsLabel')}</FormLabel>
            <Input
              type="number"
              value={agents}
              onChange={(e) => setAgents(Number(e.target.value) || 0)}
              focusBorderColor="orange.500"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">{t('roi.ordersLabel')}</FormLabel>
            <Input
              type="number"
              value={ordersPerDay}
              onChange={(e) => setOrdersPerDay(Number(e.target.value) || 0)}
              focusBorderColor="orange.500"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">{t('roi.costLabel')}</FormLabel>
            <Input
              type="number"
              value={costPerAgent}
              onChange={(e) => setCostPerAgent(Number(e.target.value) || 0)}
              focusBorderColor="orange.500"
            />
          </FormControl>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} pt={2}>
          <Stat>
            <StatLabel fontSize="xs" color="gray.500">{t('roi.currentCost')}</StatLabel>
            <StatNumber fontSize="xl" color="red.500">
              R$ {currentMonthlyCost.toLocaleString('pt-BR')}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="xs" color="gray.500">{t('roi.withCatalisa')}</StatLabel>
            <StatNumber fontSize="xl" color="green.500">
              R$ {Math.round(aiMonthlyCost).toLocaleString('pt-BR')}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="xs" color="gray.500">{t('roi.monthlySavings')}</StatLabel>
            <StatNumber fontSize="xl" color="orange.500">
              R$ {Math.max(0, Math.round(savings)).toLocaleString('pt-BR')}
            </StatNumber>
            <StatHelpText>
              <StatArrow type={savings > 0 ? 'increase' : 'decrease'} />
              {Math.abs(savingsPercent)}% {t('roi.reduction')}
            </StatHelpText>
          </Stat>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export function Retail() {
  const { t } = useTranslation('retail');
  const { retailUseCases } = useTranslatedUseCases();

  const complianceIcons = [FiShield, FiCreditCard, FiLock, FiGrid];
  const complianceColors = ['green.400', 'blue.400', 'purple.400', 'orange.400'];

  const capabilityIcons = [FiShoppingBag, FiClipboard, FiHeart, FiHeadphones];
  const capabilityColors = ['orange.500', 'green.500', 'pink.500', 'blue.500'];

  return (
    <>
      {/* Hero */}
      <Box id="hero" bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Badge colorScheme="orange" fontSize="xs" px={3} py={1} borderRadius="full">
              {t('hero.badge')}
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" color="white" lineHeight="1.15">
              {t('hero.heading')}{' '}
              <GradientText gradient="linear(to-r, orange.300, orange.400)">{t('hero.headingGradient')}</GradientText>
            </Heading>
            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" lineHeight="1.7">
              {t('hero.subtitle')}
            </Text>

            {/* Market stats */}
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6} pt={4}>
              <VStack>
                <AnimatedCounter target={120} suffix="M" fontSize="3xl" fontWeight="800" color="white" />
                <Text color="whiteAlpha.600" fontSize="xs">{t('hero.stats.whatsappUsers')}</Text>
              </VStack>
              <VStack>
                <AnimatedCounter target={91} suffix="%" fontSize="3xl" fontWeight="800" color="whatsapp.400" />
                <Text color="whiteAlpha.600" fontSize="xs">{t('hero.stats.openRate')}</Text>
              </VStack>
              <VStack>
                <AnimatedCounter target={67} suffix="%" fontSize="3xl" fontWeight="800" color="orange.300" />
                <Text color="whiteAlpha.600" fontSize="xs">{t('hero.stats.buyViaApp')}</Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* 5 Retail Use Cases */}
      {retailUseCases.map((useCase, idx) => (
        <SectionWrapper key={useCase.id} bg={idx % 2 === 0 ? undefined : 'gray.50'}>
          <Flex direction={{ base: 'column', lg: 'row' }} gap={10} align="flex-start">
            {/* Left - Content */}
            <VStack align="flex-start" spacing={5} flex={1}>
              <Badge colorScheme="orange" fontSize="xs">{useCase.industry}</Badge>
              <Heading as="h2" size="lg" fontWeight="800">{useCase.title}</Heading>
              <Text color="orange.500" fontWeight="500" fontSize="md">{useCase.subtitle}</Text>
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
                          w={6} h={6} borderRadius="full" bg="orange.50"
                          display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                        >
                          <Text fontSize="2xs" fontWeight="700" color="orange.500">{i + 1}</Text>
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
            {[0, 1, 2, 3].map((i) => (
              <MotionBox
                key={t(`compliance.items.${i}.label`)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Box bg="whiteAlpha.50" p={5} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100" h="full">
                  <VStack spacing={3}>
                    <Icon as={complianceIcons[i]} boxSize={6} color={complianceColors[i]} />
                    <Text fontWeight="600" color="white" fontSize="sm">{t(`compliance.items.${i}.label`)}</Text>
                    <Text color="whiteAlpha.600" fontSize="xs">{t(`compliance.items.${i}.description`)}</Text>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </SectionWrapper>

      {/* Capabilities */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Badge colorScheme="orange" fontSize="xs" px={3} py={1} borderRadius="full">
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
          {[0, 1, 2, 3].map((i) => (
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
                  <Icon as={capabilityIcons[i]} boxSize={6} color={capabilityColors[i]} />
                  <Heading as="h3" size="sm" fontWeight="700">{t(`capabilities.items.${i}.title`)}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.6">{t(`capabilities.items.${i}.description`)}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        <Box bg="orange.50" p={6} borderRadius="xl" mt={8} textAlign="center" border="1px solid" borderColor="orange.100">
          <Text color="gray.700" fontSize="md" fontWeight="500">
            <Text as="span" fontWeight="700" color="orange.700">{t('capabilities.pipelineLabel')}</Text>{' '}
            {t('capabilities.pipelineSteps')}
          </Text>
        </Box>
      </SectionWrapper>

      {/* ROI Calculator */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={8}>
          <HStack>
            <Icon as={FiDollarSign} boxSize={6} color="orange.500" />
            <Heading as="h2" size="xl" fontWeight="800">
              {t('roi.heading')}
            </Heading>
          </HStack>
          <Text color="gray.500" maxW="500px">
            {t('roi.subtitle')}
          </Text>
        </VStack>
        <Box maxW="900px" mx="auto">
          <ROICalculator t={t} />
        </Box>
      </SectionWrapper>

      <FinalCTA />
    </>
  );
}
