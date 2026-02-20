import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Badge,
  Code, Flex,
} from '@chakra-ui/react';
import {
  FiLayout, FiZap, FiGitBranch, FiMessageCircle, FiUsers, FiCalendar,
  FiArrowRight, FiPlay, FiClock, FiGlobe, FiRefreshCw, FiCpu,
} from 'react-icons/fi';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { FinalCTA } from '../components/sections/FinalCTA';
import { WorkflowShowcase } from '../components/sections/WorkflowShowcase';
import { ProductScreenshot } from '../components/sections/ProductScreenshot';

const workflowSteps = [
  {
    step: '01',
    title: 'Arraste capacidades no canvas',
    description: 'Escolha entre 150+ capacidades. Cada bloco e configuravel com interface visual.',
    icon: FiLayout,
    color: 'blue.500',
  },
  {
    step: '02',
    title: 'Conecte triggers a capacidades',
    description: 'Defina o que dispara o workflow: mensagem recebida, lead criado, webhook, agendamento.',
    icon: FiZap,
    color: 'orange.500',
  },
  {
    step: '03',
    title: 'Configure cada bloco',
    description: 'Parametrize variaveis, defina condicoes e conecte com APIs externas.',
    icon: FiGitBranch,
    color: 'brand.500',
  },
  {
    step: '04',
    title: 'Ative com um clique',
    description: 'Publique e monitore. Veja execucoes em tempo real. Rollback a qualquer versao.',
    icon: FiPlay,
    color: 'whatsapp.500',
  },
];

const triggers = [
  { icon: FiUsers, label: 'Lead criado', description: 'Quando um novo lead e registrado', color: 'orange.500' },
  { icon: FiUsers, label: 'Lead atualizado', description: 'Quando dados de um lead mudam', color: 'orange.400' },
  { icon: FiMessageCircle, label: 'Mensagem recebida', description: 'Quando chega mensagem no WhatsApp', color: 'whatsapp.500' },
  { icon: FiMessageCircle, label: 'Mensagem enviada', description: 'Apos envio de mensagem', color: 'green.400' },
  { icon: FiGlobe, label: 'Webhook recebido', description: 'Sistema externo dispara evento', color: 'cyan.500' },
  { icon: FiRefreshCw, label: 'Workflow completado', description: 'Quando outro workflow termina', color: 'blue.500' },
  { icon: FiCalendar, label: 'Agendamento', description: 'Execucao programada (cron)', color: 'purple.500' },
  { icon: FiPlay, label: 'Manual', description: 'Disparado manualmente pela equipe', color: 'gray.500' },
];

const variableExamples = [
  { variable: '{{trigger.payload.phone}}', description: 'Telefone do trigger' },
  { variable: '{{actions.createLead.output.id}}', description: 'ID do lead criado' },
  { variable: '{{actions.aiAgent.output.response}}', description: 'Resposta do agente IA' },
  { variable: '{{trigger.payload.message.text}}', description: 'Texto da mensagem' },
];

export function Workflows() {
  return (
    <>
      {/* Hero */}
      <Box bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Badge colorScheme="blue" fontSize="xs" px={3} py={1} borderRadius="full">
              WORKFLOWS
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" color="white" lineHeight="1.15">
              Monte automacoes visuais.{' '}
              <GradientText gradient="linear(to-r, blue.300, brand.400)">Sem codigo.</GradientText>
            </Heading>
            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" lineHeight="1.7">
              Drag & drop com 150+ building blocks, execucao paralela (DAG), teste A/B nativo e interpolacao de variaveis entre blocos.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* How it works - Steps */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            Como funciona
          </Heading>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {workflowSteps.map((step, i) => (
            <MotionBox
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.100" h="full" position="relative">
                <Text position="absolute" top={3} right={4} fontSize="3xl" fontWeight="900" color="gray.100">{step.step}</Text>
                <VStack align="flex-start" spacing={4}>
                  <Icon as={step.icon} boxSize={6} color={step.color} />
                  <Heading as="h3" size="sm" fontWeight="700">{step.title}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.7">{step.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Trigger Types */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            O que pode disparar um workflow?
          </Heading>
          <Text color="gray.500" maxW="500px">
            8 tipos de triggers para iniciar automacoes automaticamente ou sob demanda.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          {triggers.map((trigger, i) => (
            <MotionBox
              key={trigger.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Box
                bg="white"
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ borderColor: trigger.color, transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                h="full"
              >
                <VStack spacing={2}>
                  <Icon as={trigger.icon} boxSize={5} color={trigger.color} />
                  <Text fontWeight="600" fontSize="sm" textAlign="center">{trigger.label}</Text>
                  <Text color="gray.400" fontSize="xs" textAlign="center">{trigger.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Interactive Workflow Showcase */}
      <WorkflowShowcase />

      {/* Real Product Screenshot */}
      <ProductScreenshot />

      {/* DAG Execution */}
      <SectionWrapper>
        <Flex direction={{ base: 'column', lg: 'row' }} gap={12} align="center">
          <VStack align="flex-start" spacing={5} flex={1}>
            <Badge colorScheme="blue" fontSize="xs">EXECUCAO DAG</Badge>
            <Heading as="h2" size="xl" fontWeight="800">
              Paralelo + Sequencial
            </Heading>
            <Text color="gray.500" lineHeight="1.7">
              Workflows executam como grafos aciclicos direcionados (DAG). Blocos sem dependencias
              rodam em paralelo. Blocos com dependencias esperam automaticamente.
            </Text>
            <VStack align="flex-start" spacing={3} w="full">
              <HStack spacing={3} p={3} bg="green.50" borderRadius="lg" w="full">
                <Icon as={FiZap} color="green.500" />
                <Text fontSize="sm" fontWeight="500">Blocos independentes rodam em paralelo</Text>
              </HStack>
              <HStack spacing={3} p={3} bg="blue.50" borderRadius="lg" w="full">
                <Icon as={FiGitBranch} color="blue.500" />
                <Text fontSize="sm" fontWeight="500">Logica de branching com condicoes</Text>
              </HStack>
              <HStack spacing={3} p={3} bg="purple.50" borderRadius="lg" w="full">
                <Icon as={FiClock} color="purple.500" />
                <Text fontSize="sm" fontWeight="500">Aguarda resposta por ate 7 dias</Text>
              </HStack>
              <HStack spacing={3} p={3} bg="orange.50" borderRadius="lg" w="full">
                <Icon as={FiCpu} color="orange.500" />
                <Text fontSize="sm" fontWeight="500">Deteccao automatica de dependencias circulares</Text>
              </HStack>
            </VStack>
          </VStack>

          {/* Visual DAG example */}
          <Box flex={1} maxW="400px">
            <Box bg="gray.50" p={6} borderRadius="2xl" border="1px solid" borderColor="gray.200">
              <VStack spacing={4}>
                <Box bg="whatsapp.50" p={3} borderRadius="lg" w="full" textAlign="center" border="1px solid" borderColor="whatsapp.200">
                  <Text fontSize="sm" fontWeight="600" color="whatsapp.600">Trigger: Mensagem</Text>
                </Box>
                <Icon as={FiArrowRight} transform="rotate(90deg)" color="gray.300" />
                <HStack spacing={4} w="full">
                  <Box flex={1} bg="purple.50" p={3} borderRadius="lg" textAlign="center" border="1px solid" borderColor="purple.200">
                    <Text fontSize="xs" fontWeight="600" color="purple.600">Sentimento</Text>
                  </Box>
                  <Box flex={1} bg="blue.50" p={3} borderRadius="lg" textAlign="center" border="1px solid" borderColor="blue.200">
                    <Text fontSize="xs" fontWeight="600" color="blue.600">Extrair dados</Text>
                  </Box>
                </HStack>
                <Icon as={FiArrowRight} transform="rotate(90deg)" color="gray.300" />
                <Box bg="brand.50" p={3} borderRadius="lg" w="full" textAlign="center" border="1px solid" borderColor="brand.200">
                  <Text fontSize="sm" fontWeight="600" color="brand.600">Condicional</Text>
                </Box>
                <HStack spacing={4} w="full">
                  <Box flex={1} bg="green.50" p={3} borderRadius="lg" textAlign="center" border="1px solid" borderColor="green.200">
                    <Text fontSize="xs" fontWeight="600" color="green.600">Aprovado</Text>
                  </Box>
                  <Box flex={1} bg="red.50" p={3} borderRadius="lg" textAlign="center" border="1px solid" borderColor="red.200">
                    <Text fontSize="xs" fontWeight="600" color="red.600">Rejeitado</Text>
                  </Box>
                </HStack>
              </VStack>
            </Box>
          </Box>
        </Flex>
      </SectionWrapper>

      {/* Variable Interpolation */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            Capacidades conversam entre si
          </Heading>
          <Text color="gray.500" maxW="500px">
            Use variaveis para passar dados entre blocos. O output de uma capacidade alimenta a proxima.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} maxW="800px" mx="auto">
          {variableExamples.map((example, i) => (
            <MotionBox
              key={example.variable}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <HStack bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="gray.100" spacing={3}>
                <Code colorScheme="brand" fontSize="xs" px={2} py={1} borderRadius="md">
                  {example.variable}
                </Code>
                <Text fontSize="sm" color="gray.500">{example.description}</Text>
              </HStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Versioning */}
      <SectionWrapper>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {[
            { icon: FiRefreshCw, title: 'Versionamento', description: 'Cada salvamento cria uma versao. Rollback a qualquer ponto.', color: 'blue.500' },
            { icon: FiClock, title: 'Historico de execucoes', description: 'Veja cada execucao com detalhes: inputs, outputs, duracoes.', color: 'brand.500' },
            { icon: FiPlay, title: 'Replay', description: 'Reexecute qualquer workflow com os mesmos dados para depurar.', color: 'green.500' },
          ].map((feature, i) => (
            <MotionBox
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.100" h="full">
                <VStack align="flex-start" spacing={3}>
                  <Icon as={feature.icon} boxSize={6} color={feature.color} />
                  <Heading as="h3" size="sm" fontWeight="700">{feature.title}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.7">{feature.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      <FinalCTA />
    </>
  );
}
