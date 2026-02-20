import { useState } from 'react';
import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Badge,
  Flex, Input, FormControl, FormLabel, Stat, StatLabel, StatNumber,
  StatHelpText, StatArrow,
} from '@chakra-ui/react';
import {
  FiShield, FiCode, FiTrendingUp, FiLayers, FiArrowRight, FiDollarSign,
  FiTarget, FiUserPlus, FiCpu, FiActivity,
} from 'react-icons/fi';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { AnimatedCounter } from '../components/shared/AnimatedCounter';
import { startupUseCases } from '../data/useCases';
import { categoryBadges } from '../data/capabilityClusters';
import { FinalCTA } from '../components/sections/FinalCTA';

function ROICalculator() {
  const [sdrs, setSdrs] = useState(3);
  const [leadsPerDay, setLeadsPerDay] = useState(30);
  const [costPerSdr, setCostPerSdr] = useState(4000);

  const currentMonthlyCost = sdrs * costPerSdr;
  const aiMonthlyCost = 500 + (leadsPerDay * 30 * 0.02);
  const savings = currentMonthlyCost - aiMonthlyCost;
  const savingsPercent = Math.round((savings / currentMonthlyCost) * 100);

  return (
    <Box bg="white" p={8} borderRadius="2xl" border="1px solid" borderColor="gray.200" boxShadow="lg">
      <VStack spacing={6} align="stretch">
        <Heading as="h3" size="md" fontWeight="700">Calculadora de ROI</Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm">SDRs atuais</FormLabel>
            <Input
              type="number"
              value={sdrs}
              onChange={(e) => setSdrs(Number(e.target.value) || 0)}
              focusBorderColor="cyan.500"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">Leads por dia</FormLabel>
            <Input
              type="number"
              value={leadsPerDay}
              onChange={(e) => setLeadsPerDay(Number(e.target.value) || 0)}
              focusBorderColor="cyan.500"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">Custo por SDR (R$)</FormLabel>
            <Input
              type="number"
              value={costPerSdr}
              onChange={(e) => setCostPerSdr(Number(e.target.value) || 0)}
              focusBorderColor="cyan.500"
            />
          </FormControl>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} pt={2}>
          <Stat>
            <StatLabel fontSize="xs" color="gray.500">Custo atual/mes</StatLabel>
            <StatNumber fontSize="xl" color="red.500">
              R$ {currentMonthlyCost.toLocaleString('pt-BR')}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="xs" color="gray.500">Com Catalisa/mes</StatLabel>
            <StatNumber fontSize="xl" color="green.500">
              R$ {Math.round(aiMonthlyCost).toLocaleString('pt-BR')}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="xs" color="gray.500">Economia mensal</StatLabel>
            <StatNumber fontSize="xl" color="cyan.500">
              R$ {Math.max(0, Math.round(savings)).toLocaleString('pt-BR')}
            </StatNumber>
            <StatHelpText>
              <StatArrow type={savings > 0 ? 'increase' : 'decrease'} />
              {Math.abs(savingsPercent)}% de reducao
            </StatHelpText>
          </Stat>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export function Startups() {
  return (
    <>
      {/* Hero */}
      <Box bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Badge colorScheme="cyan" fontSize="xs" px={3} py={1} borderRadius="full">
              STARTUPS
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" color="white" lineHeight="1.15">
              WhatsApp como motor de crescimento{' '}
              <GradientText gradient="linear(to-r, cyan.300, teal.400)">para startups</GradientText>
            </Heading>
            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" lineHeight="1.7">
              91% taxa de abertura. 10x mais barato que call center. Menos de 1 minuto de tempo de resposta.
            </Text>

            {/* Market stats */}
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6} pt={4}>
              <VStack>
                <AnimatedCounter target={91} suffix="%" fontSize="3xl" fontWeight="800" color="whatsapp.400" />
                <Text color="whiteAlpha.600" fontSize="xs">Taxa de abertura</Text>
              </VStack>
              <VStack>
                <Text fontSize="3xl" fontWeight="800" color="cyan.300">10x</Text>
                <Text color="whiteAlpha.600" fontSize="xs">Mais barato que call center</Text>
              </VStack>
              <VStack>
                <Text fontSize="3xl" fontWeight="800" color="teal.300">&lt;1min</Text>
                <Text color="whiteAlpha.600" fontSize="xs">Tempo de resposta</Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* 5 Startup Use Cases */}
      {startupUseCases.map((useCase, idx) => (
        <SectionWrapper key={useCase.id} bg={idx % 2 === 0 ? undefined : 'gray.50'}>
          <Flex direction={{ base: 'column', lg: 'row' }} gap={10} align="flex-start">
            {/* Left - Content */}
            <VStack align="flex-start" spacing={5} flex={1}>
              <Badge colorScheme="cyan" fontSize="xs">{useCase.industry}</Badge>
              <Heading as="h2" size="lg" fontWeight="800">{useCase.title}</Heading>
              <Text color="cyan.600" fontWeight="500" fontSize="md">{useCase.subtitle}</Text>
              <Text color="gray.500" lineHeight="1.7">{useCase.description}</Text>

              {/* Before/After */}
              <SimpleGrid columns={2} spacing={4} w="full" pt={2}>
                <Box bg="red.50" p={4} borderRadius="xl" border="1px solid" borderColor="red.100">
                  <Text fontSize="xs" fontWeight="700" color="red.500" mb={2}>ANTES</Text>
                  {useCase.before.map((item) => (
                    <HStack key={item.metric} justify="space-between" mb={1}>
                      <Text fontSize="xs" color="gray.600">{item.metric}</Text>
                      <Text fontSize="xs" fontWeight="600" color="red.600">{item.value}</Text>
                    </HStack>
                  ))}
                </Box>
                <Box bg="green.50" p={4} borderRadius="xl" border="1px solid" borderColor="green.100">
                  <Text fontSize="xs" fontWeight="700" color="green.500" mb={2}>DEPOIS</Text>
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
                  Workflow
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
                          w={6} h={6} borderRadius="full" bg="cyan.50"
                          display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                        >
                          <Text fontSize="2xs" fontWeight="700" color="cyan.500">{i + 1}</Text>
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
            Infraestrutura pronta para escalar
          </Heading>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} w="full" pt={4}>
            {[
              { icon: FiShield, label: 'Conformidade LGPD', description: 'Protecao de dados desde o dia zero', color: 'green.400' },
              { icon: FiCode, label: 'API-first', description: 'Integre com qualquer stack em minutos', color: 'cyan.400' },
              { icon: FiTrendingUp, label: 'Escalabilidade', description: 'De 10 a 10.000 conversas sem mudar nada', color: 'purple.400' },
              { icon: FiLayers, label: 'Isolamento Total', description: 'Multi-tenant com dados isolados por empresa', color: 'orange.400' },
            ].map((item, i) => (
              <MotionBox
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Box bg="whiteAlpha.50" p={5} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100" h="full">
                  <VStack spacing={3}>
                    <Icon as={item.icon} boxSize={6} color={item.color} />
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
        <VStack spacing={4} textAlign="center" mb={12}>
          <Badge colorScheme="cyan" fontSize="xs" px={3} py={1} borderRadius="full">
            CAPACIDADES PARA STARTUPS
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800">
            Cresça rapido com IA no WhatsApp
          </Heading>
          <Text color="gray.500" maxW="600px">
            Qualificacao automatica, onboarding inteligente, suporte escalavel e analytics em tempo real.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5}>
          {[
            { icon: FiTarget, title: 'Qualificacao IA', description: 'SDR automatizado que qualifica leads 24/7 sem intervencao humana.', color: 'cyan.500' },
            { icon: FiUserPlus, title: 'Onboarding Automatizado', description: 'Guie novos usuarios pelo produto com tutoriais conversacionais.', color: 'teal.500' },
            { icon: FiCpu, title: 'Suporte Inteligente', description: 'IA resolve 75% dos tickets sem escalar para humanos.', color: 'blue.500' },
            { icon: FiActivity, title: 'Analytics em Tempo Real', description: 'NPS, engajamento e metricas de conversao atualizados ao vivo.', color: 'purple.500' },
          ].map((item, i) => (
            <MotionBox
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.100" h="full"
                _hover={{ borderColor: item.color, boxShadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <VStack align="flex-start" spacing={3}>
                  <Icon as={item.icon} boxSize={6} color={item.color} />
                  <Heading as="h3" size="sm" fontWeight="700">{item.title}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.6">{item.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        <Box bg="cyan.50" p={6} borderRadius="xl" mt={8} textAlign="center" border="1px solid" borderColor="cyan.100">
          <Text color="gray.700" fontSize="md" fontWeight="500">
            <Text as="span" fontWeight="700" color="cyan.700">Pipeline completo:</Text>{' '}
            Lead &rarr; Qualificacao &rarr; Demo &rarr; Onboarding &rarr; Suporte &rarr; Retencao
          </Text>
        </Box>
      </SectionWrapper>

      {/* ROI Calculator */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={8}>
          <HStack>
            <Icon as={FiDollarSign} boxSize={6} color="cyan.500" />
            <Heading as="h2" size="xl" fontWeight="800">
              Quanto voce economiza?
            </Heading>
          </HStack>
          <Text color="gray.500" maxW="500px">
            Simule a economia mensal ao substituir SDRs manuais por agentes de IA.
          </Text>
        </VStack>
        <Box maxW="900px" mx="auto">
          <ROICalculator />
        </Box>
      </SectionWrapper>

      <FinalCTA />
    </>
  );
}
