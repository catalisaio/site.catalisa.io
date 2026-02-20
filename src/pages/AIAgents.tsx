import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Flex, Badge,
  List, ListItem, ListIcon,
} from '@chakra-ui/react';
import {
  FiCpu, FiMessageCircle, FiTool, FiDatabase, FiUsers, FiArrowRight,
  FiCheck, FiMic, FiSmile, FiEdit3, FiGlobe, FiImage, FiFileText,
  FiSearch, FiCalendar, FiGitBranch, FiSettings, FiSend, FiUserPlus,
  FiClipboard, FiBarChart2,
} from 'react-icons/fi';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { agentTemplates } from '../data/useCases';
import { FinalCTA } from '../components/sections/FinalCTA';

const comparisonItems = [
  {
    type: 'Chatbot',
    description: 'Responde perguntas com base em FAQ',
    capabilities: ['Respostas pre-definidas', 'Menu de opcoes', 'Encaminha para humano'],
    color: 'gray',
    level: 'Informacional',
  },
  {
    type: 'AI Agent',
    description: 'Executa tarefas com ferramentas reais',
    capabilities: ['Qualifica leads', 'Agenda reunioes', 'Atualiza CRM', 'Processa documentos', 'Envia mensagens'],
    color: 'brand',
    level: 'Operacional',
    highlight: true,
  },
  {
    type: 'Time de Agents',
    description: 'Cada agente e especialista em uma area',
    capabilities: ['SDR qualifica', 'Suporte resolve', 'Cobranca negocia', 'Onboarding guia', 'Orquestracao via workflow'],
    color: 'purple',
    level: 'Orquestrado',
  },
];

const aiCapabilities = [
  { icon: FiSmile, label: 'Analise de Sentimento', description: 'Detecta emocao e urgencia' },
  { icon: FiFileText, label: 'Sumarizacao', description: 'Resume conversas longas' },
  { icon: FiDatabase, label: 'Classificacao', description: 'Categoriza automaticamente' },
  { icon: FiEdit3, label: 'Geracao de Texto', description: 'Cria conteudo personalizado' },
  { icon: FiGlobe, label: 'Traducao', description: 'Multi-idioma em tempo real' },
  { icon: FiTool, label: 'Extracao de Dados', description: 'Estrutura texto livre' },
  { icon: FiImage, label: 'Analise de Imagem', description: 'OCR e visao computacional' },
  { icon: FiMic, label: 'Transcricao', description: 'Audio para texto' },
];

export function AIAgents() {
  return (
    <>
      {/* Hero */}
      <Box bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Badge colorScheme="purple" fontSize="xs" px={3} py={1} borderRadius="full">
              AI AGENTS
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" color="white" lineHeight="1.15">
              Crie especialistas de IA que trabalham{' '}
              <GradientText gradient="linear(to-r, brand.300, whatsapp.400)">24/7 no WhatsApp</GradientText>
            </Heading>
            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" lineHeight="1.7">
              Nao e um chatbot. E uma equipe inteira. Cada agente tem personalidade, ferramentas e contexto proprios.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Comparison: Chatbot vs Agent vs Team */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            A diferenca: Assistant vs Agent vs <Text as="span" color="brand.500">Time</Text>
          </Heading>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {comparisonItems.map((item, i) => (
            <MotionBox
              key={item.type}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <Box
                bg="white"
                p={7}
                borderRadius="xl"
                border="2px solid"
                borderColor={item.highlight ? 'brand.400' : 'gray.100'}
                boxShadow={item.highlight ? 'lg' : 'sm'}
                h="full"
                position="relative"
              >
                {item.highlight && (
                  <Badge
                    position="absolute"
                    top={-3}
                    left="50%"
                    transform="translateX(-50%)"
                    colorScheme="brand"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                  >
                    SEU PRODUTO
                  </Badge>
                )}
                <VStack align="flex-start" spacing={4}>
                  <Badge colorScheme={item.color} variant="subtle" fontSize="xs">{item.level}</Badge>
                  <Heading as="h3" size="md" fontWeight="700">{item.type}</Heading>
                  <Text color="gray.500" fontSize="sm">{item.description}</Text>
                  <List spacing={2}>
                    {item.capabilities.map((cap) => (
                      <ListItem key={cap} fontSize="sm" color="gray.600">
                        <ListIcon as={FiCheck} color={item.highlight ? 'brand.500' : 'gray.400'} />
                        {cap}
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        <Box bg="brand.50" p={6} borderRadius="xl" mt={8} textAlign="center">
          <Text color="gray.700" fontSize="md" fontWeight="500">
            <Text as="span" fontWeight="700" color="brand.600">Seu agente nao apenas informa.</Text>{' '}
            Ele qualifica leads, agenda reunioes, processa documentos, atualiza o CRM, envia mensagens — tudo de forma autonoma.
          </Text>
        </Box>
      </SectionWrapper>

      {/* How Agents Work */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            Como agentes funcionam
          </Heading>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {[
            { icon: FiEdit3, title: 'System Prompt', description: 'Voce define a personalidade, regras e objetivo do agente.', color: 'brand.500' },
            { icon: FiTool, title: 'Ferramentas', description: 'Escolha quais ferramentas o agente pode usar (150+ built-in).', color: 'orange.500' },
            { icon: FiMessageCircle, title: 'Conversas', description: 'Contexto persistente por lead. Memoria de todas as interacoes.', color: 'whatsapp.500' },
            { icon: FiCpu, title: 'Workflows', description: 'Agentes embutidos em automacoes. Acionados por triggers.', color: 'blue.500' },
          ].map((item, i) => (
            <MotionBox
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.100" h="full">
                <VStack align="flex-start" spacing={3}>
                  <Icon as={item.icon} boxSize={6} color={item.color} />
                  <Heading as="h3" size="sm" fontWeight="700">{item.title}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.7">{item.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Agent Marketplace */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            Marketplace de Templates
          </Heading>
          <Text color="gray.500" maxW="500px">
            Instale agentes pre-configurados com um clique. Prompts otimizados e ferramentas pre-selecionadas.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
          {agentTemplates.map((template, i) => (
            <MotionBox
              key={template.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Box
                bg="white"
                p={6}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ borderColor: 'brand.200', boxShadow: 'md' }}
                transition="all 0.2s"
                h="full"
              >
                <VStack align="flex-start" spacing={3}>
                  <HStack justify="space-between" w="full">
                    <Heading as="h3" size="sm" fontWeight="700">{template.name}</Heading>
                    <Badge colorScheme="brand" fontSize="2xs">{template.category}</Badge>
                  </HStack>
                  <Text color="gray.500" fontSize="sm">{template.description}</Text>
                  <HStack spacing={1} flexWrap="wrap">
                    {template.tools.map((tool) => (
                      <Badge key={tool} variant="outline" fontSize="2xs" colorScheme="gray">
                        {tool}
                      </Badge>
                    ))}
                  </HStack>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* AI Processing Powers */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            Poderes de processamento IA
          </Heading>
          <Text color="gray.500" maxW="500px">
            Cada capacidade e uma ferramenta que voce combina livremente.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={5}>
          {aiCapabilities.map((cap, i) => (
            <MotionBox
              key={cap.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Box
                bg="white"
                p={5}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ borderColor: 'brand.200', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                textAlign="center"
              >
                <VStack spacing={3}>
                  <Icon as={cap.icon} boxSize={6} color="brand.500" />
                  <Text fontWeight="600" fontSize="sm">{cap.label}</Text>
                  <Text color="gray.400" fontSize="xs">{cap.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Real-World Example */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            Exemplo real: Lead qualificado pelo WhatsApp
          </Heading>
        </VStack>

        <Flex justify="center" overflow="auto" pb={4}>
          <HStack spacing={3} px={4}>
            {[
              { action: 'Mensagem recebida', color: 'green.500', icon: FiMessageCircle },
              { action: 'Transcreve audio', color: 'purple.500', icon: FiMic },
              { action: 'Analisa sentimento', color: 'orange.500', icon: FiSmile },
              { action: 'Agente SDR qualifica', color: 'brand.500', icon: FiCpu },
              { action: 'Cria lead no CRM', color: 'blue.500', icon: FiUsers },
              { action: 'Envia proposta', color: 'whatsapp.500', icon: FiMessageCircle },
            ].map((step, i) => (
              <MotionBox
                key={step.action}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
              >
                <HStack spacing={3}>
                  <VStack
                    bg="white"
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.200"
                    minW="130px"
                    spacing={2}
                  >
                    <Icon as={step.icon} boxSize={5} color={step.color} />
                    <Text fontSize="xs" fontWeight="600" textAlign="center">{step.action}</Text>
                  </VStack>
                  {i < 5 && <Icon as={FiArrowRight} color="gray.300" />}
                </HStack>
              </MotionBox>
            ))}
          </HStack>
        </Flex>
      </SectionWrapper>

      {/* Available Tools Grid */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={12}>
          <Badge colorScheme="purple" fontSize="xs" px={3} py={1} borderRadius="full">
            FERRAMENTAS
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800">
            21+ categorias de ferramentas para agentes
          </Heading>
          <Text color="gray.500" maxW="600px">
            Cada agente escolhe quais ferramentas pode usar. Aqui estao as categorias disponiveis.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
          {[
            { icon: FiSearch, title: 'Buscar Leads', description: 'Pesquisa e filtra leads no CRM', color: 'orange.500' },
            { icon: FiUserPlus, title: 'Gerenciar Leads', description: 'Cria, atualiza e qualifica leads', color: 'orange.500' },
            { icon: FiMessageCircle, title: 'WhatsApp', description: 'Envia mensagens e midia', color: 'green.500' },
            { icon: FiCalendar, title: 'Calendario', description: 'Agenda e consulta eventos', color: 'blue.500' },
            { icon: FiGitBranch, title: 'Workflows', description: 'Dispara e consulta workflows', color: 'blue.500' },
            { icon: FiCpu, title: 'Outros Agentes', description: 'Orquestra time de agentes', color: 'purple.500' },
            { icon: FiSettings, title: 'Acoes Customizadas', description: 'Executa logica customizada', color: 'gray.500' },
            { icon: FiSend, title: 'Notificacoes', description: 'Email e webhooks', color: 'cyan.500' },
            { icon: FiClipboard, title: 'Captura', description: 'Links de captura de leads', color: 'pink.500' },
            { icon: FiBarChart2, title: 'Metricas', description: 'Estatisticas e performance', color: 'teal.500' },
            { icon: FiDatabase, title: 'Dados', description: 'Extracao e transformacao', color: 'teal.500' },
            { icon: FiGlobe, title: 'APIs Externas', description: 'Integracao HTTP generica', color: 'cyan.500' },
          ].map((category, i) => (
            <MotionBox
              key={category.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Box
                bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="gray.100"
                _hover={{ borderColor: category.color, transform: 'translateY(-2px)' }}
                transition="all 0.2s" h="full"
              >
                <VStack align="flex-start" spacing={2}>
                  <Icon as={category.icon} boxSize={5} color={category.color} />
                  <Text fontWeight="600" fontSize="sm">{category.title}</Text>
                  <Text color="gray.400" fontSize="xs">{category.description}</Text>
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
