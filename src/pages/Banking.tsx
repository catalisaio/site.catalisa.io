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
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { AnimatedCounter } from '../components/shared/AnimatedCounter';
import { bankingUseCases } from '../data/useCases';
import { categoryBadges } from '../data/capabilityClusters';
import { FinalCTA } from '../components/sections/FinalCTA';

function BankingROICalculator() {
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
        <Heading as="h3" size="md" fontWeight="700">Calculadora de ROI Bancario</Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm">Numero de agencias</FormLabel>
            <Input
              type="number"
              value={branches}
              onChange={(e) => setBranches(Number(e.target.value) || 0)}
              focusBorderColor="brand.500"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">Transacoes/dia por agencia</FormLabel>
            <Input
              type="number"
              value={transactionsPerDay}
              onChange={(e) => setTransactionsPerDay(Number(e.target.value) || 0)}
              focusBorderColor="brand.500"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">Custo por transacao (R$)</FormLabel>
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
            <StatNumber fontSize="xl" color="brand.500">
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

export function Banking() {
  return (
    <>
      {/* Hero */}
      <Box bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Badge colorScheme="blue" fontSize="xs" px={3} py={1} borderRadius="full">
              BANCARIO
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" color="white" lineHeight="1.15">
              WhatsApp como canal bancario{' '}
              <GradientText gradient="linear(to-r, catalisa.secondary, catalisa.accent)">inteligente</GradientText>
            </Heading>
            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" lineHeight="1.7">
              148M de brasileiros no WhatsApp. 82% das transacoes bancarias sao digitais. 85% dos bancos ja tem chatbot.
            </Text>

            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6} pt={4}>
              <VStack>
                <AnimatedCounter target={148} suffix="M" fontSize="3xl" fontWeight="800" color="white" />
                <Text color="whiteAlpha.600" fontSize="xs">Usuarios WhatsApp BR</Text>
              </VStack>
              <VStack>
                <AnimatedCounter target={82} suffix="%" fontSize="3xl" fontWeight="800" color="whatsapp.400" />
                <Text color="whiteAlpha.600" fontSize="xs">Transacoes digitais</Text>
              </VStack>
              <VStack>
                <AnimatedCounter target={76} suffix="%" fontSize="3xl" fontWeight="800" color="catalisa.secondary" />
                <Text color="whiteAlpha.600" fontSize="xs">Crescimento messaging YoY</Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Market Context */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={10}>
          <Badge colorScheme="blue" fontSize="xs" px={3} py={1} borderRadius="full">
            MERCADO
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800">
            O mercado bancario ja esta no WhatsApp
          </Heading>
          <Text color="gray.500" maxW="700px" lineHeight="1.7">
            Os maiores bancos do Brasil ja utilizam WhatsApp com IA para atender clientes.
            As transacoes por messaging cresceram 76% em um ano (70.9M para 125.2M).
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5}>
          {[
            { name: 'Itau', description: 'IA generativa + Pix pelo WhatsApp', highlight: 'Pioneiro em IA' },
            { name: 'Nubank', description: '109M clientes, suporte 100% digital', highlight: '109M clientes' },
            { name: 'PicPay', description: 'Pix por audio com IA no WhatsApp', highlight: 'Pix por audio' },
            { name: 'C6 Bank', description: 'Assistente IA para operacoes bancarias', highlight: 'Assistente IA' },
          ].map((bank, i) => (
            <MotionBox
              key={bank.name}
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
                  <Badge colorScheme="blue" fontSize="2xs">{bank.highlight}</Badge>
                  <Heading as="h3" size="sm" fontWeight="700">{bank.name}</Heading>
                  <Text color="gray.500" fontSize="sm">{bank.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        <Box bg="blue.50" p={5} borderRadius="xl" mt={8} textAlign="center" border="1px solid" borderColor="blue.100">
          <Text color="gray.700" fontSize="md" fontStyle="italic">
            "85% dos bancos brasileiros tem chatbot no WhatsApp"
          </Text>
          <Text color="gray.400" fontSize="xs" mt={1}>— Finsiders / FEBRABAN, 2024</Text>
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
            Compliance e regulatorio bancario
          </Heading>
          <Text color="whiteAlpha.600" maxW="600px">
            Conformidade com BACEN, LGPD e Open Finance integrada em cada capacidade.
          </Text>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} w="full" pt={4}>
            {[
              { icon: FiShield, label: 'Conformidade BACEN/LGPD', description: 'Protecao automatica de dados sensiveis', color: 'green.400' },
              { icon: FiLock, label: 'Criptografia Bancaria', description: 'Dados protegidos com criptografia avancada', color: 'blue.400' },
              { icon: FiKey, label: 'Auditoria Digital', description: 'Trilha de auditoria completa e imutavel', color: 'purple.400' },
              { icon: FiUsers, label: 'Isolamento e Controle', description: 'Multi-tenant com controle de acesso granular', color: 'orange.400' },
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

      {/* Open Finance Integration */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Badge colorScheme="blue" fontSize="xs" px={3} py={1} borderRadius="full">
            OPEN FINANCE
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800">
            Integracao com Open Finance
          </Heading>
          <Text color="gray.500" maxW="600px">
            62M de consentimentos ativos e R$ 18B em operacoes de credito. Conecte dados abertos aos seus workflows.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5}>
          {[
            { icon: FiGlobe, title: 'APIs Open Finance', description: 'Conecte a qualquer instituicao participante.', color: 'blue.500' },
            { icon: FiDatabase, title: 'Validacao de Dados', description: 'Valide consentimentos e dados recebidos.', color: 'green.500' },
            { icon: FiCpu, title: 'Motor de Decisao', description: 'Regras configuraveis para scoring com dados enriquecidos.', color: 'purple.500' },
            { icon: FiCheckCircle, title: 'Scoring Personalizado', description: 'Taxa de juros baseada no historico real.', color: 'brand.500' },
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

        <Box bg="blue.50" p={6} borderRadius="xl" mt={8} textAlign="center" border="1px solid" borderColor="blue.100">
          <Text color="gray.700" fontSize="md" fontWeight="500">
            <Text as="span" fontWeight="700" color="blue.700">Pipeline Open Finance:</Text>{' '}
            Consentimento → Consulta Open Finance → Historico → Scoring → Decisao → Resultado
          </Text>
        </Box>
      </SectionWrapper>

      {/* ROI Calculator */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={8}>
          <HStack>
            <Icon as={FiDollarSign} boxSize={6} color="brand.500" />
            <Heading as="h2" size="xl" fontWeight="800">
              Quanto seu banco economiza?
            </Heading>
          </HStack>
          <Text color="gray.500" maxW="500px">
            Simule a economia mensal ao migrar transacoes de agencia para WhatsApp com IA.
          </Text>
        </VStack>
        <Box maxW="900px" mx="auto">
          <BankingROICalculator />
        </Box>
      </SectionWrapper>

      <FinalCTA />
    </>
  );
}
