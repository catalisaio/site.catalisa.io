import { useState } from 'react';
import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Badge,
  Flex, Input, FormControl, FormLabel, Stat, StatLabel, StatNumber,
  StatHelpText, StatArrow,
} from '@chakra-ui/react';
import {
  FiShield, FiLock, FiFileText, FiArrowRight, FiDollarSign,
  FiCamera, FiCpu, FiUploadCloud,
} from 'react-icons/fi';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { AnimatedCounter } from '../components/shared/AnimatedCounter';
import { insuranceUseCases } from '../data/useCases';
import { categoryBadges } from '../data/capabilityClusters';
import { FinalCTA } from '../components/sections/FinalCTA';

function InsuranceROICalculator() {
  const [brokers, setBrokers] = useState(20);
  const [claimsPerMonth, setClaimsPerMonth] = useState(100);
  const [costPerClaim, setCostPerClaim] = useState(120);

  const currentMonthlyCost = claimsPerMonth * costPerClaim + brokers * 2500;
  const aiMonthlyCost = 1500 + (claimsPerMonth * 8) + (brokers * 500);
  const savings = currentMonthlyCost - aiMonthlyCost;
  const savingsPercent = Math.round((savings / currentMonthlyCost) * 100);

  return (
    <Box bg="white" p={8} borderRadius="2xl" border="1px solid" borderColor="gray.200" boxShadow="lg">
      <VStack spacing={6} align="stretch">
        <Heading as="h3" size="md" fontWeight="700">Calculadora de ROI Seguros</Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm">Numero de corretores</FormLabel>
            <Input
              type="number"
              value={brokers}
              onChange={(e) => setBrokers(Number(e.target.value) || 0)}
              focusBorderColor="brand.500"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">Sinistros/mes</FormLabel>
            <Input
              type="number"
              value={claimsPerMonth}
              onChange={(e) => setClaimsPerMonth(Number(e.target.value) || 0)}
              focusBorderColor="brand.500"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">Custo por sinistro (R$)</FormLabel>
            <Input
              type="number"
              value={costPerClaim}
              onChange={(e) => setCostPerClaim(Number(e.target.value) || 0)}
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

export function Insurance() {
  return (
    <>
      {/* Hero */}
      <Box bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Badge colorScheme="purple" fontSize="xs" px={3} py={1} borderRadius="full">
              SEGUROS
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" color="white" lineHeight="1.15">
              Sinistros, cotacoes e renovacoes{' '}
              <GradientText gradient="linear(to-r, catalisa.secondary, catalisa.accent)">pelo WhatsApp</GradientText>
            </Heading>
            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" lineHeight="1.7">
              R$ 207B em premios (2024). 42% das vendas ja sao digitais. Sinistro resolvido por IA em menos de 10 minutos.
            </Text>

            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6} pt={4}>
              <VStack>
                <Text fontSize="3xl" fontWeight="800" color="white">R$ 207B</Text>
                <Text color="whiteAlpha.600" fontSize="xs">Premios 2024</Text>
              </VStack>
              <VStack>
                <AnimatedCounter target={42} suffix="%" fontSize="3xl" fontWeight="800" color="whatsapp.400" />
                <Text color="whiteAlpha.600" fontSize="xs">Vendas digitais</Text>
              </VStack>
              <VStack>
                <Text fontSize="3xl" fontWeight="800" color="catalisa.secondary">10min</Text>
                <Text color="whiteAlpha.600" fontSize="xs">Sinistro com IA</Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Market Context */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={10}>
          <Badge colorScheme="purple" fontSize="xs" px={3} py={1} borderRadius="full">
            MERCADO
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800">
            Seguradoras que ja usam WhatsApp com IA
          </Heading>
          <Text color="gray.500" maxW="700px" lineHeight="1.7">
            As maiores seguradoras do Brasil ja utilizam WhatsApp com IA para sinistros, cotacoes e atendimento.
            Insurtechs receberam R$ 350M em investimentos no primeiro semestre de 2025.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          {[
            {
              name: 'MAPFRE',
              description: '14K acessos, 1.6K sinistros, 50% resolvidos por IA, 90%+ satisfacao',
              highlight: '1o sinistro 100% IA',
            },
            {
              name: 'EZZE Seguros',
              description: 'Sinistro resolvido em menos de 10 minutos via WhatsApp com IA',
              highlight: '<10min por sinistro',
            },
            {
              name: 'Porto Seguro',
              description: 'Claims, tracking, upload de documentos — tudo pelo WhatsApp',
              highlight: 'Claims digitais',
            },
          ].map((insurer, i) => (
            <MotionBox
              key={insurer.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.100" h="full"
                _hover={{ borderColor: 'purple.300', boxShadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <VStack align="flex-start" spacing={3}>
                  <Badge colorScheme="purple" fontSize="2xs">{insurer.highlight}</Badge>
                  <Heading as="h3" size="sm" fontWeight="700">{insurer.name}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.6">{insurer.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        <Box bg="purple.50" p={5} borderRadius="xl" mt={8} textAlign="center" border="1px solid" borderColor="purple.100">
          <Text color="gray.700" fontSize="md" fontStyle="italic">
            "MAPFRE registrou o primeiro sinistro 100% resolvido por IA no WhatsApp, com 90%+ de satisfacao"
          </Text>
          <Text color="gray.400" fontSize="xs" mt={1}>— MAPFRE Brasil, 2024</Text>
        </Box>
      </SectionWrapper>

      {/* 5 Insurance Use Cases */}
      {insuranceUseCases.map((useCase, idx) => (
        <SectionWrapper key={useCase.id} bg={idx % 2 === 0 ? 'gray.50' : undefined}>
          <Flex direction={{ base: 'column', lg: 'row' }} gap={10} align="flex-start">
            <VStack align="flex-start" spacing={5} flex={1}>
              <Badge colorScheme="purple" fontSize="xs">{useCase.industry}</Badge>
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
                          w={6} h={6} borderRadius="full" bg="purple.50"
                          display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                        >
                          <Text fontSize="2xs" fontWeight="700" color="purple.500">{i + 1}</Text>
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

      {/* Compliance & SUSEP */}
      <SectionWrapper bg="gray.900">
        <VStack spacing={6} textAlign="center">
          <Heading as="h2" size="xl" fontWeight="800" color="white">
            Compliance SUSEP e regulatorio
          </Heading>
          <Text color="whiteAlpha.600" maxW="600px">
            Conformidade com Resolucao CNSP 382/2020, LGPD e normas da SUSEP integrada em cada capacidade.
          </Text>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} w="full" pt={4}>
            {[
              { icon: FiShield, label: 'Conformidade SUSEP', description: 'Resolucao CNSP 382/2020 integrada', color: 'green.400' },
              { icon: FiLock, label: 'Protecao LGPD', description: 'Mascaramento automatico de dados de segurados', color: 'blue.400' },
              { icon: FiFileText, label: 'Auditoria Completa', description: 'Trilha de auditoria imutavel e rastreavel', color: 'purple.400' },
              { icon: FiShield, label: 'Criptografia Avancada', description: 'Dados sensiveis protegidos por criptografia', color: 'orange.400' },
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

      {/* Insurtech Building Blocks */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Badge colorScheme="purple" fontSize="xs" px={3} py={1} borderRadius="full">
            INSURTECH
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800">
            Capacidades para seguros
          </Heading>
          <Text color="gray.500" maxW="600px">
            Vistorias por IA, extracao de documentos, subscricao automatica e mais — tudo dentro do workflow.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
          {[
            { icon: FiCamera, title: 'Vistoria por IA', description: 'Analise de fotos de veiculos e imoveis com visao computacional.', color: 'purple.500' },
            { icon: FiFileText, title: 'Extracao de Documentos', description: 'Leitura inteligente de apolices, CNH, CRLV e laudos.', color: 'blue.500' },
            { icon: FiCpu, title: 'Subscricao Automatica', description: 'Motor de decisao configuravel para aprovar ou rejeitar riscos.', color: 'green.500' },
            { icon: FiDollarSign, title: 'Precificacao', description: 'Calculo de premio baseado no perfil de risco.', color: 'yellow.600' },
            { icon: FiShield, title: 'Protecao LGPD', description: 'Mascaramento de dados de segurados em tempo real.', color: 'red.500' },
            { icon: FiUploadCloud, title: 'Gestao de Documentos', description: 'Receba e armazene fotos e documentos pelo WhatsApp.', color: 'brand.500' },
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

        <Box bg="purple.50" p={6} borderRadius="xl" mt={8} textAlign="center" border="1px solid" borderColor="purple.100">
          <Text color="gray.700" fontSize="md" fontWeight="500">
            <Text as="span" fontWeight="700" color="purple.700">Pipeline de sinistro:</Text>{' '}
            Detalhes → Fotos e docs → Analise visual → Extracao → Decisao → Arquivo → Confirmacao
          </Text>
        </Box>
      </SectionWrapper>

      {/* ROI Calculator */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={8}>
          <HStack>
            <Icon as={FiDollarSign} boxSize={6} color="brand.500" />
            <Heading as="h2" size="xl" fontWeight="800">
              Quanto sua seguradora economiza?
            </Heading>
          </HStack>
          <Text color="gray.500" maxW="500px">
            Simule a economia mensal ao automatizar sinistros e atendimento com IA no WhatsApp.
          </Text>
        </VStack>
        <Box maxW="900px" mx="auto">
          <InsuranceROICalculator />
        </Box>
      </SectionWrapper>

      <FinalCTA />
    </>
  );
}
