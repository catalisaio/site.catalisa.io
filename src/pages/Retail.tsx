import { useState } from 'react';
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
import { retailUseCases } from '../data/useCases';
import { categoryBadges } from '../data/capabilityClusters';
import { FinalCTA } from '../components/sections/FinalCTA';

function ROICalculator() {
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
        <Heading as="h3" size="md" fontWeight="700">Calculadora de ROI</Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm">Numero de atendentes</FormLabel>
            <Input
              type="number"
              value={agents}
              onChange={(e) => setAgents(Number(e.target.value) || 0)}
              focusBorderColor="orange.500"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">Pedidos por dia</FormLabel>
            <Input
              type="number"
              value={ordersPerDay}
              onChange={(e) => setOrdersPerDay(Number(e.target.value) || 0)}
              focusBorderColor="orange.500"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">Custo por atendente (R$)</FormLabel>
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
            <StatNumber fontSize="xl" color="orange.500">
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

export function Retail() {
  return (
    <>
      {/* Hero */}
      <Box bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Badge colorScheme="orange" fontSize="xs" px={3} py={1} borderRadius="full">
              VAREJO
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" color="white" lineHeight="1.15">
              WhatsApp como canal de vendas{' '}
              <GradientText gradient="linear(to-r, orange.300, orange.400)">para o varejo</GradientText>
            </Heading>
            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" lineHeight="1.7">
              120M de brasileiros no WhatsApp. 91% taxa de abertura. 67% ja compram pelo aplicativo.
            </Text>

            {/* Market stats */}
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6} pt={4}>
              <VStack>
                <AnimatedCounter target={120} suffix="M" fontSize="3xl" fontWeight="800" color="white" />
                <Text color="whiteAlpha.600" fontSize="xs">Brasileiros no WhatsApp</Text>
              </VStack>
              <VStack>
                <AnimatedCounter target={91} suffix="%" fontSize="3xl" fontWeight="800" color="whatsapp.400" />
                <Text color="whiteAlpha.600" fontSize="xs">Taxa de abertura</Text>
              </VStack>
              <VStack>
                <AnimatedCounter target={67} suffix="%" fontSize="3xl" fontWeight="800" color="orange.300" />
                <Text color="whiteAlpha.600" fontSize="xs">Compram pelo app</Text>
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
            Seguranca e conformidade para o varejo
          </Heading>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} w="full" pt={4}>
            {[
              { icon: FiShield, label: 'Conformidade LGPD', description: 'Protecao automatica de dados dos clientes', color: 'green.400' },
              { icon: FiCreditCard, label: 'Pagamentos Seguros', description: 'Links de pagamento protegidos e rastreados', color: 'blue.400' },
              { icon: FiLock, label: 'Dados Protegidos', description: 'Criptografia de ponta a ponta em todas as conversas', color: 'purple.400' },
              { icon: FiGrid, label: 'Multi-loja', description: 'Gerencie multiplas lojas em uma unica plataforma', color: 'orange.400' },
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
          <Badge colorScheme="orange" fontSize="xs" px={3} py={1} borderRadius="full">
            CAPACIDADES PARA VAREJO
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800">
            Tudo que o varejo precisa em um so lugar
          </Heading>
          <Text color="gray.500" maxW="600px">
            Catalogo digital, gestao de pedidos, fidelizacao e atendimento multicanal — integrados ao WhatsApp.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5}>
          {[
            { icon: FiShoppingBag, title: 'Catalogo Digital', description: 'Apresente produtos com fotos, precos e disponibilidade pelo WhatsApp.', color: 'orange.500' },
            { icon: FiClipboard, title: 'Gestao de Pedidos', description: 'Receba, processe e acompanhe pedidos automaticamente.', color: 'green.500' },
            { icon: FiHeart, title: 'Programa de Fidelidade', description: 'Engaje clientes com recompensas e ofertas personalizadas.', color: 'pink.500' },
            { icon: FiHeadphones, title: 'Atendimento Multicanal', description: 'WhatsApp, site e loja fisica em uma unica plataforma.', color: 'blue.500' },
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

        <Box bg="orange.50" p={6} borderRadius="xl" mt={8} textAlign="center" border="1px solid" borderColor="orange.100">
          <Text color="gray.700" fontSize="md" fontWeight="500">
            <Text as="span" fontWeight="700" color="orange.700">Pipeline completo:</Text>{' '}
            Contato &rarr; Catalogo &rarr; Pedido &rarr; Pagamento &rarr; Entrega &rarr; Feedback
          </Text>
        </Box>
      </SectionWrapper>

      {/* ROI Calculator */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={8}>
          <HStack>
            <Icon as={FiDollarSign} boxSize={6} color="orange.500" />
            <Heading as="h2" size="xl" fontWeight="800">
              Quanto voce economiza?
            </Heading>
          </HStack>
          <Text color="gray.500" maxW="500px">
            Simule a economia mensal ao automatizar o atendimento e pedidos do seu negocio.
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
