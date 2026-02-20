import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Flex, Badge, Button, Image,
  List, ListItem, ListIcon,
} from '@chakra-ui/react';
import {
  FiCheck, FiX, FiCode, FiClock, FiShield, FiMessageCircle,
  FiCpu, FiMail, FiUserPlus, FiRefreshCw, FiBarChart2,
  FiLayers, FiGitBranch, FiZap,
} from 'react-icons/fi';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { CatalisaStudioShowcase } from '../components/sections/CatalisaStudioShowcase';
import { WorkflowShowcase } from '../components/sections/WorkflowShowcase';
import { FinalCTA } from '../components/sections/FinalCTA';
import { BrowserFrame } from '../components/shared/BrowserFrame';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

/* ── Before vs After ── */
const beforeItems = [
  'Briefing confuso que ninguem entende',
  'Semanas esperando a equipe de TI',
  'Resultado diferente do que foi pedido',
  'Voltar ao inicio toda vez que algo muda',
  'Depender de dev pra qualquer ajuste',
];

const afterItems = [
  'Descreva em linguagem natural',
  'Pronto em minutos, nao semanas',
  'Especificacao validada antes de executar',
  'IA refina antes de construir',
  'Voce ajusta com um clique',
];

/* ── Templates ── */
const templates = [
  {
    icon: FiMessageCircle,
    title: 'Boas-vindas WhatsApp',
    description: 'Enviar mensagem personalizada para novos leads automaticamente.',
    color: 'whatsapp.500',
  },
  {
    icon: FiCpu,
    title: 'Qualificacao IA',
    description: 'Qualificar leads automaticamente com agente inteligente.',
    color: 'purple.500',
  },
  {
    icon: FiMail,
    title: 'Notificacao',
    description: 'Notificar equipe quando um lead e atualizado.',
    color: 'blue.500',
  },
  {
    icon: FiUserPlus,
    title: 'Auto-criar Lead',
    description: 'Criar lead automaticamente ao receber mensagem no WhatsApp.',
    color: 'orange.500',
  },
  {
    icon: FiRefreshCw,
    title: 'Reengajar Inativos',
    description: 'Enviar mensagem para leads sem interacao ha dias.',
    color: 'red.400',
  },
  {
    icon: FiBarChart2,
    title: 'Relatorio Semanal',
    description: 'Gerar e enviar metricas de desempenho automaticamente.',
    color: 'teal.500',
  },
];

/* ── Why Studio ── */
const differentiators = [
  {
    icon: FiShield,
    title: 'Especificacao antes da execucao',
    description:
      'A IA nao sai fazendo. Ela gera requisitos, design e tarefas pra voce validar ANTES de construir. Zero desperdicio.',
  },
  {
    icon: FiMessageCircle,
    title: 'Linguagem natural, resultado profissional',
    description:
      'Voce fala como fala. A IA traduz para uma especificacao tecnica completa. Sem intermediarios.',
  },
  {
    icon: FiLayers,
    title: 'Do Builder ao Canvas, tudo conectado',
    description:
      'O que o Builder cria aparece no canvas visual pronto. Triggers, acoes, conexoes — tudo configurado.',
  },
];

export function Studio() {
  return (
    <>
      {/* ─── Section 1: Hero (dark bg) ─── */}
      <Box bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <HStack
              bg="whiteAlpha.100"
              px={4}
              py={1.5}
              borderRadius="full"
              border="1px solid"
              borderColor="whiteAlpha.200"
              spacing={2}
            >
              <Text color="brand.300" fontSize="sm" fontWeight="600">
                &#10022; CATALISA STUDIO
              </Text>
            </HStack>

            <Heading as="h1" size="2xl" fontWeight="800" color="white" lineHeight="1.15">
              Da ideia a producao.{' '}
              <GradientText gradient="linear(to-r, brand.300, brand.400, catalisa.accent)">
                Sem codigo.
              </GradientText>
            </Heading>

            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" lineHeight="1.7">
              Descreva o que precisa em linguagem natural. A IA entende,
              especifica e constroi — workflows, triggers, acoes, tudo.
            </Text>

            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                as="a"
                href={WHATSAPP_URL}
                target="_blank"
                size="lg"
                bg="whatsapp.500"
                color="white"
                _hover={{ bg: 'whatsapp.600', transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)' }}
                leftIcon={<FiMessageCircle />}
                transition="all 0.2s"
                fontWeight="700"
              >
                Vamos conversar
              </Button>
              <Button
                as="a"
                href="#builder"
                size="lg"
                variant="ghost"
                color="whiteAlpha.800"
                borderColor="whiteAlpha.300"
                border="1px solid"
                _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
              >
                Ver em acao
              </Button>
            </HStack>

            <HStack spacing={{ base: 4, md: 8 }} flexWrap="wrap" justify="center" pt={4}>
              {[
                { icon: FiCode, label: 'Zero codigo' },
                { icon: FiClock, label: 'Minutos, nao meses' },
                { icon: FiShield, label: 'Spec-driven' },
              ].map((stat) => (
                <HStack key={stat.label} spacing={2}>
                  <Icon as={stat.icon} color="brand.300" boxSize={4} />
                  <Text color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                    {stat.label}
                  </Text>
                </HStack>
              ))}
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* ─── Section 2: Antes vs Depois (light bg) ─── */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            Antes vs{' '}
            <Text as="span" color="brand.500">Com Studio</Text>
          </Heading>
          <Text color="gray.500" maxW="500px">
            Chega de semanas perdidas. Com Studio, voce descreve e a IA entrega.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} maxW="900px" mx="auto">
          {/* Before */}
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Box
              bg="red.50"
              p={7}
              borderRadius="2xl"
              border="1px solid"
              borderColor="red.100"
              h="full"
            >
              <Text fontWeight="700" color="red.600" fontSize="sm" textTransform="uppercase" mb={5}>
                Antes
              </Text>
              <List spacing={4}>
                {beforeItems.map((item) => (
                  <ListItem key={item} display="flex" alignItems="flex-start" fontSize="sm" color="gray.700">
                    <ListIcon as={FiX} color="red.400" mt={1} />
                    {item}
                  </ListItem>
                ))}
              </List>
            </Box>
          </MotionBox>

          {/* After */}
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Box
              bg="green.50"
              p={7}
              borderRadius="2xl"
              border="1px solid"
              borderColor="green.100"
              h="full"
            >
              <Text fontWeight="700" color="green.600" fontSize="sm" textTransform="uppercase" mb={5}>
                Com Studio
              </Text>
              <List spacing={4}>
                {afterItems.map((item) => (
                  <ListItem key={item} display="flex" alignItems="flex-start" fontSize="sm" color="gray.700">
                    <ListIcon as={FiCheck} color="green.500" mt={1} />
                    {item}
                  </ListItem>
                ))}
              </List>
            </Box>
          </MotionBox>
        </SimpleGrid>
      </SectionWrapper>

      {/* ─── Section 3: Builder em 4 Passos (dark bg) ─── */}
      <Box id="builder">
        <CatalisaStudioShowcase />
      </Box>

      {/* ─── Section 4: Canvas Visual (light bg) ─── */}
      <SectionWrapper>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: 8, lg: 12 }}
          align="center"
        >
          <VStack align="flex-start" spacing={5} flex={1} maxW={{ lg: '400px' }}>
            <Badge colorScheme="green" fontSize="xs" px={3} py={1} borderRadius="full">
              CANVAS VISUAL
            </Badge>
            <Heading as="h2" size="xl" fontWeight="800" lineHeight="1.2">
              O resultado?{' '}
              <Text as="span" color="brand.500">Workflows visuais prontos para producao.</Text>
            </Heading>
            <Text color="gray.500" fontSize="md" lineHeight="1.7">
              O Builder gera workflows completos no canvas visual.
              Drag & drop, execucao paralela, 150+ building blocks.
            </Text>

            <VStack align="flex-start" spacing={3} w="full" pt={2}>
              <HStack spacing={3} p={3} bg="green.50" borderRadius="lg" w="full">
                <Icon as={FiLayers} color="green.500" />
                <Text fontSize="sm" fontWeight="500">Canvas drag & drop intuitivo</Text>
              </HStack>
              <HStack spacing={3} p={3} bg="blue.50" borderRadius="lg" w="full">
                <Icon as={FiGitBranch} color="blue.500" />
                <Text fontSize="sm" fontWeight="500">Execucao paralela automatica (DAG)</Text>
              </HStack>
              <HStack spacing={3} p={3} bg="purple.50" borderRadius="lg" w="full">
                <Icon as={FiZap} color="purple.500" />
                <Text fontSize="sm" fontWeight="500">150+ building blocks composiveis</Text>
              </HStack>
            </VStack>
          </VStack>

          <MotionBox
            flex={2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box
              borderRadius="xl"
              overflow="hidden"
              boxShadow="2xl"
              border="1px solid"
              borderColor="gray.200"
            >
              <Image
                src="/screenshots/workflow-editor.png"
                alt="Canvas visual do Catalisa com workflows drag & drop e execucao paralela"
                w="100%"
                h="auto"
                loading="lazy"
              />
            </Box>
          </MotionBox>
        </Flex>
      </SectionWrapper>

      {/* ─── Section 5: Dashboard Real (dark premium bg) ─── */}
      <Box as="section" position="relative" bg="gray.900" overflow="hidden">
        {/* Background gradients */}
        <Box
          position="absolute"
          top="-30%"
          left="20%"
          w="60%"
          h="80%"
          bgGradient="radial(circle, rgba(115, 75, 156, 0.15) 0%, transparent 60%)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-20%"
          right="10%"
          w="50%"
          h="50%"
          bgGradient="radial(circle, rgba(37, 211, 102, 0.06) 0%, transparent 60%)"
          pointerEvents="none"
        />

        <Container maxW="1280px" py={{ base: 16, md: 24 }}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 14 }}>
              <HStack
                bg="whiteAlpha.100"
                px={4}
                py={1.5}
                borderRadius="full"
                border="1px solid"
                borderColor="whiteAlpha.200"
                spacing={2}
              >
                <Text color="brand.300" fontSize="sm" fontWeight="600">
                  &#10022; PLATAFORMA COMPLETA
                </Text>
              </HStack>

              <Heading as="h2" fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight="800" color="white" lineHeight="1.2">
                Tudo num so lugar.{' '}
                <GradientText gradient="linear(to-r, brand.300, brand.400, catalisa.accent)" fontSize="inherit" fontWeight="inherit">
                  Dashboard, CRM e automacao.
                </GradientText>
              </Heading>
              <Text color="whiteAlpha.600" fontSize={{ base: 'md', md: 'lg' }} maxW="550px">
                Leads, metricas, mensagens e workflows — tudo integrado num painel unico.
                Sem alternar entre ferramentas.
              </Text>
            </VStack>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <Box
              position="relative"
              boxShadow="0 25px 60px -12px rgba(115, 75, 156, 0.3), 0 0 40px rgba(115, 75, 156, 0.1)"
              borderRadius="2xl"
              _before={{
                content: '""',
                position: 'absolute',
                inset: '-1px',
                borderRadius: '2xl',
                padding: '1px',
                background: 'linear-gradient(135deg, rgba(115,75,156,0.4), transparent 50%, rgba(37,211,102,0.2))',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              <BrowserFrame url="panel.catalisa.app/dashboard">
                <Box overflow="hidden" maxH={{ base: '280px', sm: '360px', md: '480px', lg: '560px' }}>
                  <Image
                    src="/screenshots/dashboard.jpeg"
                    alt="Dashboard do Catalisa Studio com metricas de leads, volume de mensagens e pipeline"
                    w="100%"
                    h="auto"
                    mt={{ base: '-50px', md: '-70px', lg: '-90px' }}
                    loading="lazy"
                  />
                </Box>
              </BrowserFrame>
            </Box>
          </MotionBox>

          {/* Stats bar below screenshot */}
          <MotionBox
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Flex
              justify="center"
              mt={{ base: 8, md: 12 }}
              gap={{ base: 6, md: 12 }}
              flexWrap="wrap"
            >
              {[
                { value: '98%', label: 'Uptime garantido' },
                { value: '150+', label: 'Building blocks' },
                { value: '<3min', label: 'Setup completo' },
              ].map((stat) => (
                <VStack key={stat.label} spacing={0}>
                  <Text color="white" fontWeight="700" fontSize={{ base: 'md', md: 'lg' }}>
                    {stat.value}
                  </Text>
                  <Text color="whiteAlpha.500" fontSize="xs">
                    {stat.label}
                  </Text>
                </VStack>
              ))}
            </Flex>
          </MotionBox>
        </Container>
      </Box>

      {/* ─── Section 6: Workflows Interativos ─── */}
      <WorkflowShowcase />

      {/* ─── Section 6: Templates do Builder ─── */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Badge colorScheme="brand" fontSize="xs" px={3} py={1} borderRadius="full">
            TEMPLATES
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800">
            Comece com um template pronto
          </Heading>
          <Text color="gray.500" maxW="500px">
            Escolha um caso de uso e o Builder monta tudo pra voce. Personalize depois se quiser.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
          {templates.map((template, i) => (
            <MotionBox
              key={template.title}
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
                _hover={{ borderColor: 'brand.200', boxShadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                h="full"
              >
                <VStack align="flex-start" spacing={3}>
                  <Icon as={template.icon} boxSize={6} color={template.color} />
                  <Heading as="h3" size="sm" fontWeight="700">{template.title}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.7">{template.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* ─── Section 7: Por que Studio? (dark bg) ─── */}
      <Box bg="gray.900" py={{ base: 16, md: 24 }}>
        <Container maxW="1280px">
          <VStack spacing={4} textAlign="center" mb={12}>
            <Heading as="h2" size="xl" fontWeight="800" color="white">
              Por que Studio?
            </Heading>
            <Text color="whiteAlpha.600" maxW="500px">
              Tres diferenciais que mudam a forma como voce cria automacoes.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {differentiators.map((diff, i) => (
              <MotionBox
                key={diff.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Box
                  bg="whiteAlpha.50"
                  p={7}
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  h="full"
                  _hover={{ bg: 'whiteAlpha.100', borderColor: 'brand.400' }}
                  transition="all 0.2s"
                >
                  <VStack align="flex-start" spacing={4}>
                    <Box p={3} borderRadius="xl" bg="whiteAlpha.100">
                      <Icon as={diff.icon} boxSize={6} color="brand.300" />
                    </Box>
                    <Heading as="h3" size="md" fontWeight="700" color="white">
                      {diff.title}
                    </Heading>
                    <Text color="whiteAlpha.600" fontSize="sm" lineHeight="1.8">
                      {diff.description}
                    </Text>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ─── Section 8: FinalCTA ─── */}
      <FinalCTA />
    </>
  );
}
