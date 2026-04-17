import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  Text,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiLoader, FiPackage, FiShoppingCart, FiTag, FiTruck, FiUser, FiDollarSign } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// ─── Scenario data ────────────────────────────────────────────────────────────
// Each scenario tells a real customer story (Jobs-to-Be-Done),
// revealing the VTEX machinery only *after* the human context is established.
// Inspired by Stripe Radar "rules firing" and Intercom's conversation-first demos.

const CATEGORY_STYLE: Record<string, { color: string; bg: string }> = {
  catalog:    { color: '#67E8F9', bg: 'rgba(6,182,212,0.12)' },
  oms:        { color: '#C084FC', bg: 'rgba(115,75,156,0.18)' },
  customers:  { color: '#93C5FD', bg: 'rgba(59,130,246,0.12)' },
  checkout:   { color: '#FCA444', bg: 'rgba(249,115,22,0.12)' },
  pricing:    { color: '#FDE047', bg: 'rgba(234,179,8,0.12)' },
  logistics:  { color: '#86EFAC', bg: 'rgba(34,197,94,0.12)' },
  promotions: { color: '#F9A8D4', bg: 'rgba(236,72,153,0.12)' },
};

const CATEGORY_ICON: Record<string, React.ElementType> = {
  catalog:    FiPackage,
  oms:        FiShoppingCart,
  customers:  FiUser,
  checkout:   FiDollarSign,
  pricing:    FiTag,
  logistics:  FiTruck,
  promotions: FiTag,
};

interface ScenarioStep {
  icon: string;
  label: string;
  detail: string;
  ms: number;
  category: string;
}

interface Scenario {
  id: string;
  tabLabel: string;
  tabIcon: string;
  customerName: string;
  customerAvatar: string;
  customerMsg: string;
  steps: ScenarioStep[];
  botReply: string;
  outcome: { value: string; label: string; color: string };
}

const SCENARIOS: Scenario[] = [
  {
    id: 'order',
    tabLabel: 'Rastreio de pedido',
    tabIcon: '📦',
    customerName: 'Rafael M.',
    customerAvatar: '👨',
    customerMsg: 'Oi, cadê meu pedido #VTX-98765? Era pra ter chegado hoje',
    steps: [
      { icon: '🔍', label: 'Identificou o cliente', detail: 'pelo número WhatsApp · Master Data', ms: 42, category: 'customers' },
      { icon: '📋', label: 'Consultou o pedido', detail: '#VTX-98765 · status + NF + itens', ms: 89, category: 'oms' },
      { icon: '🚚', label: 'Buscou o rastreio', detail: 'Correios · código BR10298765432', ms: 61, category: 'oms' },
    ],
    botReply: '📦 Pedido #VTX-98765\nStatus: Em rota de entrega ✅\n\nTransportadora: Correios\nCódigo: BR10298765432\nPrevisão: hoje até 22h 🕙\n\nAlgo mais que eu possa ajudar?',
    outcome: { value: '192ms', label: 'ticket de SAC evitado', color: '#86EFAC' },
  },
  {
    id: 'product',
    tabLabel: 'Busca de produto',
    tabIcon: '👕',
    customerName: 'Beatriz S.',
    customerAvatar: '👩',
    customerMsg: 'Tem camiseta P feminina na cor verde? Qual o preço?',
    steps: [
      { icon: '🔎', label: 'Buscou no catálogo', detail: '"camiseta P feminina verde" · Intelligent Search', ms: 115, category: 'catalog' },
      { icon: '📊', label: 'Verificou estoque', detail: '3 SKUs com saldo disponível nos depósitos', ms: 58, category: 'pricing' },
      { icon: '💰', label: 'Consultou preços', detail: 'tabela base + promoções ativas aplicáveis', ms: 44, category: 'pricing' },
    ],
    botReply: '✅ Encontrei 3 opções em P feminino verde:\n\n• Colcci Basic P · R$89 · ✅ estoque\n• Farm Estampada P · R$149 · ✅ 4 unids\n• Animale Slim P · R$199 · ⚠ última\n\nMonto o carrinho pra você? 🛒',
    outcome: { value: '217ms', label: 'do WhatsApp à vitrine', color: '#67E8F9' },
  },
  {
    id: 'freight',
    tabLabel: 'Simulação de frete',
    tabIcon: '🚚',
    customerName: 'Marcos A.',
    customerAvatar: '🧑',
    customerMsg: 'Qual o frete pra 04538-133? To em Moema, SP',
    steps: [
      { icon: '🗺️', label: 'Interpretou o CEP', detail: 'Moema · São Paulo · SP · via IA', ms: 25, category: 'customers' },
      { icon: '📦', label: 'Simulou frete', detail: '3 modalidades · regras da sua loja VTEX', ms: 147, category: 'checkout' },
      { icon: '🏪', label: 'Checou retirada', detail: 'loja Pinheiros · 4,2km de distância', ms: 38, category: 'logistics' },
    ],
    botReply: '🚚 Frete pra Moema (04538-133):\n\n⚡ Expressa: R$18 · amanhã até 22h\n📦 Padrão: R$9 · 3 dias úteis\n🏪 Retirada grátis: Pinheiros (4,2km)\n\nQual você prefere?',
    outcome: { value: '210ms', label: 'abandono no frete evitado', color: '#FCA444' },
  },
  {
    id: 'promo',
    tabLabel: 'Promoção ativa',
    tabIcon: '🏷️',
    customerName: 'Ana C.',
    customerAvatar: '👩‍💼',
    customerMsg: 'Tem alguma promoção hoje? Quero comprar mais itens',
    steps: [
      { icon: '🎯', label: 'Buscou campanhas ativas', detail: 'Rules & Benefits · em tempo real', ms: 78, category: 'promotions' },
      { icon: '🛒', label: 'Calculou elegibilidade', detail: 'histórico + carrinho atual da cliente', ms: 94, category: 'checkout' },
      { icon: '✨', label: 'Compôs a oferta', detail: 'IA selecionou as 3 mais relevantes', ms: 52, category: 'catalog' },
    ],
    botReply: '🏷️ Promoções ativas agora:\n\n👗 Leve 3, pague 2 em moda feminina\n💳 15% OFF acima de R$200 com PIX\n🚚 Frete grátis SP capital hoje\n\nAplico no seu carrinho?',
    outcome: { value: '224ms', label: 'de ticket médio a mais', color: '#F9A8D4' },
  },
];

// ─── Step timing constants ─────────────────────────────────────────────────────
// phase: 0=start, 1=customer msg, 2=step0, 3=step1, 4=step2, 5=typing, 6=reply, 7=metric
const PHASE_DELAYS = [0, 350, 700, 1050, 1400, 1750, 2800, 3300];
const SCENARIO_DWELL = 8000; // ms before auto-advancing

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepRow({ step, state }: { step: ScenarioStep; state: 'waiting' | 'running' | 'done' }) {
  const cs = CATEGORY_STYLE[step.category] ?? CATEGORY_STYLE.catalog;
  const CatIcon = CATEGORY_ICON[step.category] ?? FiPackage;

  return (
    <Box
      px={4}
      py={3}
      borderRadius="xl"
      bg={state === 'done' ? 'rgba(34,197,94,0.06)' : state === 'running' ? 'rgba(115,75,156,0.12)' : 'rgba(255,255,255,0.03)'}
      border="1px solid"
      borderColor={state === 'done' ? 'rgba(34,197,94,0.25)' : state === 'running' ? 'rgba(115,75,156,0.35)' : 'rgba(255,255,255,0.06)'}
      transition="all 0.4s ease"
    >
      <Flex align="center" justify="space-between" gap={3}>
        <HStack spacing={3} flex={1} minW={0}>
          {/* Category icon */}
          <Box
            w="32px"
            h="32px"
            flexShrink={0}
            borderRadius="lg"
            bg={cs.bg}
            border="1px solid"
            borderColor={`${cs.color}30`}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box as={CatIcon} boxSize="14px" color={cs.color} />
          </Box>

          {/* Labels */}
          <Box flex={1} minW={0}>
            <Text fontSize="sm" fontWeight="600" color="white" noOfLines={1}>
              {step.label}
            </Text>
            <Text fontSize="xs" color="whiteAlpha.500" noOfLines={1}>
              {step.detail}
            </Text>
          </Box>
        </HStack>

        {/* Status indicator */}
        <Box flexShrink={0}>
          {state === 'waiting' && (
            <Box w="8px" h="8px" borderRadius="full" bg="whiteAlpha.200" />
          )}
          {state === 'running' && (
            <MotionBox
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <HStack spacing={1}>
                <Box as={FiLoader} boxSize="12px" color="brand.400" />
                <Text fontSize="2xs" color="brand.400" fontWeight="600">em curso</Text>
              </HStack>
            </MotionBox>
          )}
          {state === 'done' && (
            <MotionBox
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              <HStack spacing={1}>
                <Box as={FiCheck} boxSize="12px" color="#86EFAC" />
                <Text fontSize="2xs" color="#86EFAC" fontWeight="700">{step.ms}ms</Text>
              </HStack>
            </MotionBox>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

function TypingDots() {
  return (
    <HStack spacing={1} px={3} py={2.5} bg="#202c33" borderRadius="14px 14px 14px 4px" w="fit-content">
      {[0, 1, 2].map((i) => (
        <MotionBox
          key={i}
          w="6px" h="6px"
          borderRadius="full"
          bg="whiteAlpha.500"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </HStack>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function VtexDayWorkflowScroll() {
  const { t } = useTranslation('vtex-day-2026');
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  }, []);

  const runAnimation = useCallback(() => {
    clearTimers();
    setPhase(0);
    PHASE_DELAYS.forEach((delay, i) => {
      const id = setTimeout(() => setPhase(i), delay);
      timerRefs.current.push(id);
    });
  }, [clearTimers]);

  // Auto-advance scenarios
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      setScenarioIdx((i) => (i + 1) % SCENARIOS.length);
    }, SCENARIO_DWELL);
    return () => clearTimeout(id);
  }, [scenarioIdx, paused]);

  // Restart animation when scenario changes
  useEffect(() => {
    runAnimation();
    return clearTimers;
  }, [scenarioIdx, runAnimation, clearTimers]);

  const scenario = SCENARIOS[scenarioIdx];
  const stepStates = scenario.steps.map((_, i): 'waiting' | 'running' | 'done' => {
    if (phase > i + 2) return 'done';
    if (phase === i + 2) return 'running';
    return 'waiting';
  });

  const showCustomer = phase >= 1;
  const showTyping   = phase >= 5;
  const showReply    = phase >= 6;
  const showMetric   = phase >= 7;

  return (
    <Box
      as="section"
      id="vtex-day-workflow"
      py={{ base: 16, md: 24 }}
      bg="hero.bg"
      color="white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Container maxW="1200px">

        {/* ── Header ── */}
        <VStack spacing={4} textAlign="center" mb={12}>
          <HStack spacing={3} justify="center" flexWrap="wrap">
            <Badge bg="whiteAlpha.100" color="whatsapp.300" px={4} py={1.5}
              borderRadius="full" fontSize="xs" fontWeight="600">
              Assistente E-commerce · ao vivo
            </Badge>
            <HStack px={3} py={1.5} borderRadius="full" bg="#F7196318"
              border="1px solid" borderColor="#F7196340" spacing={2}>
              <Box w="8px" h="8px" borderRadius="full" bg="#F71963"
                boxShadow="0 0 6px #F71963"
                sx={{ animation: 'vtxPulse 2s ease-in-out infinite', '@keyframes vtxPulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.45 } } }} />
              <Text fontSize="xs" fontWeight="700" color="#F71963" letterSpacing="wide">POWERED BY VTEX</Text>
            </HStack>
          </HStack>

          <Heading as="h2" size={{ base: 'lg', md: 'xl' }}>
            {t('workflow.heading')}
          </Heading>
          <Text color="whiteAlpha.600" fontSize="md" maxW="600px">
            Seu cliente manda uma mensagem. Abaixo você vê o que acontece nos
            próximos <Text as="span" color="whatsapp.300" fontWeight="700">200 milissegundos</Text>.
          </Text>
        </VStack>

        {/* ── Scenario tabs ── */}
        <HStack spacing={2} justify="center" flexWrap="wrap" mb={8}>
          {SCENARIOS.map((s, i) => {
            const isActive = i === scenarioIdx;
            return (
              <Box
                key={s.id}
                as="button"
                onClick={() => { setScenarioIdx(i); setPaused(true); setTimeout(() => setPaused(false), 300); }}
                px={4}
                py={2}
                borderRadius="full"
                bg={isActive ? 'whiteAlpha.150' : 'whiteAlpha.50'}
                border="1px solid"
                borderColor={isActive ? 'whiteAlpha.250' : 'transparent'}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ bg: 'whiteAlpha.150' }}
                position="relative"
                overflow="hidden"
              >
                <HStack spacing={1.5}>
                  <Text fontSize="sm">{s.tabIcon}</Text>
                  <Text
                    fontSize="xs"
                    fontWeight={isActive ? '600' : '400'}
                    color={isActive ? 'white' : 'whiteAlpha.500'}
                  >
                    {s.tabLabel}
                  </Text>
                </HStack>
                {isActive && !paused && (
                  <Box
                    position="absolute" bottom={0} left={0} w="full" h="2px"
                    bg="brand.400"
                    as={motion.div}
                    style={{ transformOrigin: 'left' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: SCENARIO_DWELL / 1000, ease: 'linear' } as any}
                  />
                )}
              </Box>
            );
          })}
        </HStack>

        {/* ── Main panel ── */}
        <AnimatePresence mode="wait">
          <MotionBox
            key={scenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Flex
              direction={{ base: 'column', lg: 'row' }}
              gap={{ base: 4, lg: 6 }}
              align="stretch"
            >

              {/* ── LEFT: WhatsApp conversation ── */}
              <Box
                flex="1"
                borderRadius="2xl"
                overflow="hidden"
                bg="#0b141a"
                border="1px solid"
                borderColor="whiteAlpha.100"
                boxShadow="0 20px 60px -20px rgba(0,0,0,0.6)"
                display="flex"
                flexDirection="column"
              >
                {/* Chat header */}
                <Flex bg="#1f2c33" px={4} py={3} align="center" gap={3}
                  borderBottom="1px solid" borderColor="whiteAlpha.100">
                  <Box
                    w="40px" h="40px" borderRadius="full" flexShrink={0}
                    bg="linear-gradient(135deg,#734B9C,#25D366)"
                    display="flex" alignItems="center" justifyContent="center"
                    fontSize="lg" fontWeight="700" color="white"
                  >
                    C
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="600" color="white">Catalisa · sua loja</Text>
                    <HStack spacing={1}>
                      <Box w="7px" h="7px" borderRadius="full" bg="whatsapp.400" />
                      <Text fontSize="xs" color="whatsapp.300">online agora</Text>
                    </HStack>
                  </Box>
                  <HStack spacing={1.5} px={2.5} py={1} borderRadius="full"
                    bg="#F7196318" border="1px solid" borderColor="#F7196340">
                    <Box w="6px" h="6px" borderRadius="full" bg="#F71963"
                      sx={{ animation: 'vtxPulse 2s ease-in-out infinite' }} />
                    <Text fontSize="2xs" fontWeight="700" color="#F71963">VTEX</Text>
                  </HStack>
                </Flex>

                {/* Messages area */}
                <Box
                  flex={1}
                  px={4}
                  py={4}
                  display="flex"
                  flexDirection="column"
                  gap={3}
                  minH={{ base: '280px', md: '320px' }}
                  sx={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(255,255,255,0.02)'/%3E%3C/svg%3E\")",
                  }}
                >
                  {/* Customer message */}
                  <AnimatePresence>
                    {showCustomer && (
                      <MotionFlex
                        key="customer-msg"
                        justify="flex-end"
                        initial={{ opacity: 0, x: 20, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box maxW="80%">
                          <Box
                            bg="#005c4b"
                            color="white"
                            px={3.5}
                            py={2.5}
                            borderRadius="14px 14px 4px 14px"
                            fontSize="sm"
                            lineHeight="1.55"
                            boxShadow="0 1px 2px rgba(0,0,0,0.3)"
                          >
                            {scenario.customerMsg}
                          </Box>
                          <Text fontSize="2xs" color="whiteAlpha.400" textAlign="right" mt={1}>
                            {scenario.customerName} · agora
                          </Text>
                        </Box>
                      </MotionFlex>
                    )}
                  </AnimatePresence>

                  {/* Typing indicator */}
                  <AnimatePresence>
                    {showTyping && !showReply && (
                      <MotionFlex
                        key="typing"
                        justify="flex-start"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TypingDots />
                      </MotionFlex>
                    )}
                  </AnimatePresence>

                  {/* Bot reply */}
                  <AnimatePresence>
                    {showReply && (
                      <MotionFlex
                        key="bot-reply"
                        justify="flex-start"
                        initial={{ opacity: 0, x: -16, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        <Box maxW="85%">
                          <Box
                            bg="#202c33"
                            color="white"
                            px={3.5}
                            py={2.5}
                            borderRadius="14px 14px 14px 4px"
                            fontSize="sm"
                            whiteSpace="pre-line"
                            lineHeight="1.6"
                            boxShadow="0 1px 2px rgba(0,0,0,0.3)"
                          >
                            {scenario.botReply}
                          </Box>
                          <HStack mt={1} spacing={1}>
                            <Box w="6px" h="6px" borderRadius="full" bg="whatsapp.400" />
                            <Text fontSize="2xs" color="whatsapp.400" fontWeight="600">
                              Respondido via Catalisa
                            </Text>
                          </HStack>
                        </Box>
                      </MotionFlex>
                    )}
                  </AnimatePresence>
                </Box>
              </Box>

              {/* ── RIGHT: Nos bastidores ── */}
              <Box
                w={{ base: '100%', lg: '380px' }}
                flexShrink={0}
                display="flex"
                flexDirection="column"
                gap={3}
              >
                {/* Header */}
                <Box
                  px={5}
                  py={4}
                  borderRadius="2xl"
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                >
                  <HStack mb={1} spacing={2}>
                    <Box w="8px" h="8px" borderRadius="full" bg="brand.400"
                      sx={{ animation: 'vtxPulse 1.5s ease-in-out infinite' }} />
                    <Text fontSize="xs" fontWeight="700" color="brand.300" textTransform="uppercase" letterSpacing="widest">
                      Nos bastidores
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="whiteAlpha.600">
                    Ações VTEX disparadas em tempo real
                  </Text>
                </Box>

                {/* Steps */}
                <VStack spacing={2} align="stretch">
                  {scenario.steps.map((step, i) => (
                    <MotionBox
                      key={`${scenario.id}-step-${i}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                    >
                      <StepRow step={step} state={stepStates[i]} />
                    </MotionBox>
                  ))}
                </VStack>

                {/* Outcome metric */}
                <AnimatePresence>
                  {showMetric && (
                    <MotionBox
                      key="metric"
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 24 }}
                    >
                      <Box
                        px={5}
                        py={4}
                        borderRadius="2xl"
                        bg={`${scenario.outcome.color}12`}
                        border="1px solid"
                        borderColor={`${scenario.outcome.color}30`}
                        boxShadow={`0 0 30px ${scenario.outcome.color}18`}
                      >
                        <HStack spacing={3} align="center">
                          <Box>
                            <Text
                              fontSize="2xl"
                              fontWeight="800"
                              color={scenario.outcome.color}
                              lineHeight="1"
                            >
                              {scenario.outcome.value}
                            </Text>
                            <Text fontSize="sm" color="whiteAlpha.700" mt={0.5}>
                              {scenario.outcome.label}
                            </Text>
                          </Box>
                          <Box flex={1} />
                          <Box
                            w="40px" h="40px" borderRadius="full"
                            bg={`${scenario.outcome.color}18`}
                            display="flex" alignItems="center" justifyContent="center"
                            fontSize="xl"
                          >
                            ✅
                          </Box>
                        </HStack>
                      </Box>
                    </MotionBox>
                  )}
                </AnimatePresence>

                {/* Total actions footnote */}
                <Box
                  px={4}
                  py={3}
                  borderRadius="xl"
                  bg="rgba(247,25,99,0.06)"
                  border="1px solid"
                  borderColor="rgba(247,25,99,0.18)"
                  mt="auto"
                >
                  <Text fontSize="xs" color="rgba(247,25,99,0.9)" fontWeight="600" textAlign="center">
                    23 ações VTEX prontas · 7 módulos · 1 template · instala em 5 min
                  </Text>
                </Box>
              </Box>
            </Flex>
          </MotionBox>
        </AnimatePresence>

        {/* ── Bottom summary strip ── */}
        <MotionBox
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          mt={12}
        >
          <Flex
            gap={{ base: 4, md: 8 }}
            justify="center"
            flexWrap="wrap"
          >
            {[
              { value: '23', label: 'ações VTEX', color: '#C084FC' },
              { value: '< 250ms', label: 'tempo de resposta', color: '#86EFAC' },
              { value: '7', label: 'módulos integrados', color: '#67E8F9' },
              { value: '0', label: 'linhas de código pra subir', color: '#FCA444' },
            ].map((stat) => (
              <Box key={stat.label} textAlign="center">
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800" color={stat.color}>
                  {stat.value}
                </Text>
                <Text fontSize="xs" color="whiteAlpha.500" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                  {stat.label}
                </Text>
              </Box>
            ))}
          </Flex>
        </MotionBox>

      </Container>
    </Box>
  );
}
