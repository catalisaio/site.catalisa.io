import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowDown, FiMessageCircle, FiGitBranch } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { GradientText } from '../shared/GradientText';
import { WorkflowPreview } from '../workflow-preview/WorkflowPreview';
import { CATALISA_WHATSAPP } from '../../data/vtexDay2026';
import type { WorkflowPreviewData } from '../workflow-preview/types';

const MotionBox = motion(Box);

const VTEX_WORKFLOW: WorkflowPreviewData = {
  id: 'vtex-hero-flow',
  title: 'Assistente VTEX',
  subtitle: 'Template produtivo',
  description: '23 ações VTEX prontas',
  badge: 'VTEX',
  badgeColor: '#F71963',
  nodes: [
    { id: 'wpp-in',    label: 'WhatsApp In',      category: 'Trigger',    x: 8,  y: 50 },
    { id: 'catalog',   label: 'Busca Produto',    category: 'Integracao', x: 33, y: 16 },
    { id: 'inventory', label: 'Consulta Estoque', category: 'Integracao', x: 33, y: 50 },
    { id: 'freight',   label: 'Simula Frete',     category: 'Integracao', x: 33, y: 84 },
    { id: 'ai',        label: 'IA Responde',      category: 'IA',         x: 65, y: 50 },
    { id: 'wpp-out',   label: 'Envia Resposta',   category: 'WhatsApp',   x: 88, y: 50 },
  ],
  edges: [
    { from: 'wpp-in', to: 'catalog' },
    { from: 'wpp-in', to: 'inventory' },
    { from: 'wpp-in', to: 'freight' },
    { from: 'catalog', to: 'ai' },
    { from: 'inventory', to: 'ai' },
    { from: 'freight', to: 'ai' },
    { from: 'ai', to: 'wpp-out' },
  ],
  executionOrder: ['wpp-in', ['catalog', 'inventory', 'freight'], 'ai', 'wpp-out'],
};

const CHAT_MSGS = [
  { id: 'q',  role: 'user', text: 'Tem camiseta P azul? Qual o frete pra 01310?', delay: 0 },
  { id: 'r1', role: 'bot',  text: '✅ Encontrei 3 opções:\nNike Dry-Fit P (R$89)\nHering Basic P (R$49)\nAramis Slim P (R$129)', delay: 1 },
  { id: 'r2', role: 'bot',  text: '📦 Estoque confirmado nos 3.\n\n🚚 Frete p/ 01310:\n• Expressa: R$18 (amanhã)\n• Padrão: R$9 (3 dias)', delay: 2 },
  { id: 'r3', role: 'bot',  text: 'Qual opção você prefere? Posso já montar o carrinho 🛒', delay: 3 },
] as const;

const STATS = [
  { value: '23', label: 'ações VTEX' },
  { value: '< 2s', label: 'de resposta' },
  { value: '5 min', label: 'pra subir' },
];

const PANELS = [
  { id: 'workflow', label: 'Workflow', icon: FiGitBranch,     color: 'brand.400',      dwellTime: 9000 },
  { id: 'chat',     label: 'WhatsApp', icon: FiMessageCircle, color: 'whatsapp.400',   dwellTime: 8000 },
] as const;

const panelVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

function VtexBadge() {
  return (
    <HStack
      px={3}
      py={1.5}
      borderRadius="full"
      border="1px solid"
      borderColor="#F7196340"
      bg="#F7196310"
      spacing={2}
    >
      <Box
        w="8px"
        h="8px"
        borderRadius="full"
        bg="#F71963"
        boxShadow="0 0 8px #F71963"
        sx={{ animation: 'pulse 2s ease-in-out infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } } }}
      />
      <Text fontSize="xs" fontWeight="700" color="#F71963" letterSpacing="wide">
        VTEX INTEGRATION
      </Text>
    </HStack>
  );
}

function WorkflowPanel() {
  return (
    <Box>
      {/* macOS-style header */}
      <Flex px={5} py={3} align="center" justify="space-between"
        borderBottom="1px solid" borderColor="whiteAlpha.100" bg="rgba(0,0,0,0.2)">
        <HStack spacing={2}>
          <HStack spacing={1}>
            {['#F71963', '#ECC94B', '#25D366'].map((c) => (
              <Box key={c} w="10px" h="10px" borderRadius="full" bg={c} opacity={0.8} />
            ))}
          </HStack>
          <Text fontSize="xs" fontFamily="mono" color="whiteAlpha.500">
            assistente-ecommerce-vtex.wf
          </Text>
        </HStack>
        <HStack spacing={1}>
          <Box w="6px" h="6px" borderRadius="full" bg="whatsapp.400"
            sx={{ animation: 'ping 2s ease-in-out infinite', '@keyframes ping': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
          <Text fontSize="2xs" color="whatsapp.300" fontWeight="600">running</Text>
        </HStack>
      </Flex>
      <Box p={4}>
        <WorkflowPreview workflow={VTEX_WORKFLOW} variant="dark" autoPlay={true} />
      </Box>
    </Box>
  );
}

function ChatPanel() {
  return (
    <Box>
      {/* WhatsApp header */}
      <Flex bg="#1f2c33" px={4} py={3} align="center" gap={3}
        borderBottom="1px solid" borderColor="whiteAlpha.100">
        <Box w="36px" h="36px" borderRadius="full"
          bg="linear-gradient(135deg,#734B9C,#25D366)"
          display="flex" alignItems="center" justifyContent="center"
          fontWeight="700" fontSize="sm" color="white" flexShrink={0}>
          C
        </Box>
        <Box flex={1}>
          <Text fontSize="sm" fontWeight="600" color="white">Catalisa · sua loja</Text>
          <HStack spacing={1}>
            <Box w="6px" h="6px" borderRadius="full" bg="whatsapp.400" />
            <Text fontSize="xs" color="whatsapp.300">online agora</Text>
          </HStack>
        </Box>
        <HStack spacing={1} px={2} py={1} borderRadius="full" bg="#F7196318"
          border="1px solid" borderColor="#F7196340">
          <Box w="6px" h="6px" borderRadius="full" bg="#F71963"
            sx={{ animation: 'vtexPing 2s ease-in-out infinite', '@keyframes vtexPing': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
          <Text fontSize="2xs" fontWeight="700" color="#F71963">VTEX</Text>
        </HStack>
      </Flex>

      {/* Chat messages */}
      <VStack spacing={2.5} p={4} align="stretch" bg="#0b141a" minH="300px"
        sx={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(255,255,255,0.025)'/%3E%3C/svg%3E\")" }}>
        {CHAT_MSGS.map((m, i) => (
          <MotionBox
            key={m.id}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.55 + 0.3, duration: 0.35 }}
            alignSelf={m.role === 'user' ? 'flex-end' : 'flex-start'}
            maxW="85%"
          >
            <Box
              bg={m.role === 'user' ? '#005c4b' : '#202c33'}
              color="white"
              px={3.5}
              py={2.5}
              borderRadius={m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px'}
              fontSize="sm"
              whiteSpace="pre-line"
              lineHeight="1.55"
              boxShadow="0 1px 2px rgba(0,0,0,0.3)"
            >
              {m.text}
            </Box>
          </MotionBox>
        ))}
      </VStack>
    </Box>
  );
}

export function VtexDayHero() {
  const { t } = useTranslation('vtex-day-2026');
  const [activePanel, setActivePanel] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToNext = useCallback(() => {
    setActivePanel((p) => (p + 1) % PANELS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const dwell = PANELS[activePanel].dwellTime;
    timerRef.current = setTimeout(goToNext, dwell);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activePanel, paused, goToNext]);

  return (
    <Box
      as="section"
      id="vtex-day-hero"
      data-hero-id="hero_vtex_day_2026"
      position="relative"
      bg="hero.bg"
      overflow="hidden"
      minH={{ base: 'auto', md: '100vh' }}
      display="flex"
      flexDirection="column"
    >
      {/* Background gradients */}
      <Box position="absolute" inset={0} pointerEvents="none">
        <Box position="absolute" top="-20%" left="-10%" w="70%" h="80%"
          bgGradient="radial(circle, rgba(115,75,156,0.3) 0%, transparent 65%)" />
        <Box position="absolute" bottom="-20%" right="-10%" w="50%" h="60%"
          bgGradient="radial(circle, rgba(247,25,99,0.12) 0%, transparent 65%)" />
        <Box position="absolute" top="30%" right="20%" w="40%" h="50%"
          bgGradient="radial(circle, rgba(37,211,102,0.06) 0%, transparent 60%)" />
      </Box>

      <Container maxW="1280px" position="relative" zIndex={1} flex={1}
        display="flex" flexDirection="column" justifyContent="center"
        pt={{ base: 24, md: 28 }} pb={{ base: 14, md: 20 }}>

        <Flex direction={{ base: 'column', lg: 'row' }} align={{ base: 'flex-start', lg: 'center' }}
          justify="space-between" gap={{ base: 12, lg: 16 }}>

          {/* ── LEFT: text ── */}
          <VStack align="flex-start" spacing={7} maxW={{ base: '100%', lg: '520px' }} flex="0 0 auto">

            <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <VStack align="flex-start" spacing={2}>
                <Badge bg="whiteAlpha.100" color="whatsapp.300" px={4} py={1.5}
                  borderRadius="full" fontSize="sm" fontWeight="600">
                  {t('hero.badge')}
                </Badge>
                <VtexBadge />
              </VStack>
            </MotionBox>

            <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <Heading as="h1" fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight="800" color="white" lineHeight="1.1">
                {t('hero.headline')}{' '}
                <GradientText gradient="linear(to-r, brand.300, whatsapp.400)"
                  fontSize="inherit" fontWeight="inherit">
                  {t('hero.headlineHighlight')}
                </GradientText>
              </Heading>
            </MotionBox>

            <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Text color="whiteAlpha.700" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7">
                {t('hero.subtitle')}
              </Text>
            </MotionBox>

            {/* Stats */}
            <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              w="100%">
              <SimpleGrid columns={3} spacing={4}>
                {STATS.map((s) => (
                  <Box key={s.label} bg="whiteAlpha.50" borderRadius="xl" p={4} textAlign="center"
                    border="1px solid" borderColor="whiteAlpha.100"
                    _hover={{ borderColor: '#F7196340', bg: '#F7196308' }}
                    transition="all 0.2s">
                    <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color="white">{s.value}</Text>
                    <Text fontSize="2xs" color="whiteAlpha.600" fontWeight="600" textTransform="uppercase" letterSpacing="wide">{s.label}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </MotionBox>

            <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <HStack spacing={4} flexWrap="wrap">
                <Button as="a" href={CATALISA_WHATSAPP} target="_blank" rel="noopener noreferrer"
                  size="lg" bg="whatsapp.600" color="white"
                  _hover={{ bg: 'whatsapp.700', transform: 'translateY(-2px)', boxShadow: '0 10px 30px rgba(37,211,102,0.35)' }}
                  leftIcon={<FiMessageCircle />} transition="all 0.2s">
                  {t('hero.ctaPrimary')}
                </Button>
                <Button as="a" href="#vtex-day-lead" size="lg" variant="ghost"
                  color="whiteAlpha.800" _hover={{ bg: 'whiteAlpha.100' }}
                  rightIcon={<FiArrowDown />}>
                  {t('hero.ctaSecondary')}
                </Button>
              </HStack>
            </MotionBox>
          </VStack>

          {/* ── RIGHT: cycling panels (workflow ↔ chat) ── */}
          <MotionBox
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            flex={1}
            minW={0}
            maxW={{ base: '100%', lg: '620px' }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* VTEX label top-right */}
            <Box position="relative">
              <Box position="absolute" top={-4} right={0} zIndex={6}>
                <HStack px={3} py={1} bg="#F71963" borderRadius="full" spacing={1.5}>
                  <Text fontSize="xs" fontWeight="800" color="white" letterSpacing="wide">VTEX</Text>
                  <Text fontSize="2xs" fontWeight="600" color="whiteAlpha.800">Integration</Text>
                </HStack>
              </Box>

              <Box
                borderRadius="2xl"
                border="1px solid"
                borderColor="whiteAlpha.100"
                overflow="hidden"
                bg="rgba(17,24,32,0.6)"
                backdropFilter="blur(8px)"
                boxShadow="0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(115,75,156,0.15)"
                position="relative"
                sx={{
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '2xl',
                    background: 'linear-gradient(135deg, rgba(115,75,156,0.08) 0%, transparent 50%, rgba(247,25,99,0.04) 100%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  },
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={PANELS[activePanel].id}
                    variants={panelVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    style={{ width: '100%' }}
                  >
                    {activePanel === 0 ? <WorkflowPanel /> : <ChatPanel />}
                  </motion.div>
                </AnimatePresence>
              </Box>
            </Box>

            {/* Panel tab indicators */}
            <HStack spacing={2} justify="center" mt={4}>
              {PANELS.map((panel, i) => {
                const isActive = i === activePanel;
                const PanelIcon = panel.icon;
                return (
                  <Box
                    key={panel.id}
                    as="button"
                    onClick={() => { setActivePanel(i); setPaused(true); setTimeout(() => setPaused(false), 300); }}
                    px={2.5}
                    py={1.5}
                    borderRadius="full"
                    bg={isActive ? 'whiteAlpha.150' : 'whiteAlpha.50'}
                    border="1px solid"
                    borderColor={isActive ? 'whiteAlpha.200' : 'transparent'}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ bg: 'whiteAlpha.150' }}
                    position="relative"
                    overflow="hidden"
                  >
                    <HStack spacing={1}>
                      <Box as={PanelIcon} color={isActive ? panel.color : 'whiteAlpha.500'} boxSize="12px" />
                      <Text color={isActive ? 'white' : 'whiteAlpha.500'} fontSize="2xs"
                        fontWeight={isActive ? '600' : '400'}>
                        {panel.label}
                      </Text>
                    </HStack>
                    {/* Progress bar */}
                    {isActive && !paused && (
                      <Box
                        position="absolute" bottom={0} left={0} w="full" h="2px"
                        bg={panel.color}
                        as={motion.div}
                        style={{ transformOrigin: 'left' }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: panel.dwellTime / 1000, ease: 'linear' } as any}
                      />
                    )}
                  </Box>
                );
              })}
            </HStack>
          </MotionBox>
        </Flex>
      </Container>
    </Box>
  );
}
