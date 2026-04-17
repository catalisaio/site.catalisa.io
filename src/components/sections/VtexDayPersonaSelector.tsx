import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { PERSONAS, type PersonaKey } from '../../data/vtexDay2026';

const MotionBox = motion(Box);

interface ChatMsg {
  role: 'user' | 'bot';
  text: string;
}

const PERSONA_CHATS: Record<PersonaKey, ChatMsg[]> = {
  lojista: [
    { role: 'user', text: 'Cadê meu pedido #VTX-98765?' },
    { role: 'bot',  text: '📦 Em rota de entrega!\nTransportadora: Correios\nCódigo: BR10298765432\nPrevisão: hoje até 22h' },
    { role: 'user', text: 'Frete pra Moema SP?' },
    { role: 'bot',  text: '🚚 Expressa: R$18 (amanhã)\nPadrão: R$9 (3 dias)\nRetirada: Grátis (loja Pinheiros)' },
  ],
  agencia: [
    { role: 'user', text: 'Preciso ativar cliente novo: Loja XYZ VTEX' },
    { role: 'bot',  text: '✅ Certo! 3 passos:\n1. Cole AppKey + AppToken\n2. Confirme o nome da conta\n3. Conecte o WhatsApp Business' },
    { role: 'bot',  text: '⚡ Tempo médio: 4 min\nMulti-tenant nativo — o mesmo template serve todas as contas da agência.' },
  ],
  dev: [
    { role: 'user', text: 'GET vtex-oms-list-orders?status=invoiced' },
    { role: 'bot',  text: '200 OK · 47 pedidos\ncorrelation-id: wf_abc123\nlatency: 187ms\ncursor: 2026-04-17T10:22Z' },
    { role: 'bot',  text: '🔐 AppKey/AppToken: AES-256\nLogs por execução ativados\nvtex-oms-feed: sync incremental OK' },
  ],
  head: [
    { role: 'user', text: 'Resumo do canal WhatsApp hoje?' },
    { role: 'bot',  text: '📊 Hoje — 847 conversas\n✅ 94% resolvidas pelo bot\n⚡ Tempo médio: 8s\n💰 12 conversas → venda (R$14k)' },
    { role: 'bot',  text: 'Top 1 dúvida: status de pedido (38%)\nTop 2: frete por CEP (27%)\nNPS automático: 4.8 ⭐' },
  ],
};

function PersonaChat({ personaKey }: { personaKey: PersonaKey }) {
  const msgs = PERSONA_CHATS[personaKey];
  return (
    <Box
      borderRadius="2xl"
      bg="#0b141a"
      border="1px solid"
      borderColor="whiteAlpha.200"
      overflow="hidden"
      boxShadow="0 20px 60px -20px rgba(0,0,0,0.5)"
      h="100%"
    >
      <Flex bg="#1f2c33" px={4} py={3} align="center" gap={3}>
        <Box w="32px" h="32px" borderRadius="full" bg="linear-gradient(135deg,#734B9C,#25D366)"
          display="flex" alignItems="center" justifyContent="center" fontWeight="700" fontSize="xs" color="white">
          C
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="600" color="white">Catalisa · sua loja</Text>
          <HStack spacing={1}>
            <Box w="6px" h="6px" borderRadius="full" bg="whatsapp.400" />
            <Text fontSize="2xs" color="whatsapp.300">online agora</Text>
          </HStack>
        </Box>
      </Flex>
      <VStack spacing={2} p={3} align="stretch"
        sx={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(255,255,255,0.025)'/%3E%3C/svg%3E\")" }}
      >
        {msgs.map((m, i) => (
          <MotionBox
            key={`${personaKey}-${i}`}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.35, duration: 0.35 }}
            alignSelf={m.role === 'user' ? 'flex-end' : 'flex-start'}
            maxW="88%"
          >
            <Box
              bg={m.role === 'user' ? '#005c4b' : '#202c33'}
              color="white"
              px={3}
              py={2}
              borderRadius={m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px'}
              fontSize="xs"
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

export function VtexDayPersonaSelector() {
  const { t } = useTranslation('vtex-day-2026');
  const [active, setActive] = useState<PersonaKey>('lojista');

  const current = PERSONAS.find((p) => p.key === active)!;

  const onSelect = (key: PersonaKey) => {
    setActive(key);
    if (typeof window !== 'undefined' && 'dataLayer' in window) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
        event: 'persona_selected',
        persona: key,
        page: '/vtex-day-2026',
      });
    }
  };

  return (
    <Box as="section" id="vtex-day-persona" py={{ base: 16, md: 24 }} bg="bg-accent"
      position="relative" overflow="hidden">
      {/* Subtle background pattern */}
      <Box position="absolute" inset={0} opacity={0.03} pointerEvents="none"
        sx={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px', color: 'var(--chakra-colors-brand-500)' }} />

      <Container maxW="1200px" position="relative">
        <VStack spacing={4} textAlign="center" mb={10}>
          <Heading as="h2" size={{ base: 'lg', md: 'xl' }} color="text-primary">
            {t('persona.heading')}
          </Heading>
          <Text color="text-secondary" fontSize="md" maxW="560px">
            {t('persona.whyWeAsk')}
          </Text>
        </VStack>

        <Wrap spacing={3} justify="center" mb={10}>
          {PERSONAS.map((persona) => {
            const isActive = persona.key === active;
            return (
              <WrapItem key={persona.key}>
                <Button
                  onClick={() => onSelect(persona.key)}
                  variant="ghost"
                  size="lg"
                  bg={isActive ? 'brand.500' : 'transparent'}
                  color={isActive ? 'white' : 'text-primary'}
                  border="1px solid"
                  borderColor={isActive ? 'brand.500' : 'border-default'}
                  _hover={{ bg: isActive ? 'brand.600' : 'brand.50', color: isActive ? 'white' : 'brand.700' }}
                  px={6}
                  leftIcon={<Text fontSize="lg">{persona.icon}</Text>}
                  borderRadius="full"
                  fontWeight="600"
                  transition="all 0.2s"
                >
                  {persona.label}
                </Button>
              </WrapItem>
            );
          })}
        </Wrap>

        <AnimatePresence mode="wait">
          <MotionBox
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Flex
              direction={{ base: 'column', lg: 'row' }}
              gap={{ base: 6, lg: 8 }}
              align="stretch"
            >
              {/* Left: value props */}
              <Box flex={1} bg="bg-card" borderRadius="2xl" p={{ base: 6, md: 8 }}
                boxShadow="0 20px 50px -20px rgba(115,75,156,0.2)"
                border="1px solid" borderColor="border-default">

                <HStack mb={5} spacing={3}>
                  <Text fontSize="2xl">{current.icon}</Text>
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="brand.500" textTransform="uppercase" letterSpacing="wide">
                      {current.label}
                    </Text>
                    <Text fontSize={{ base: 'md', md: 'lg' }} color="text-primary" fontWeight="600">
                      {current.subtitle}
                    </Text>
                  </Box>
                </HStack>

                <VStack spacing={4} align="stretch">
                  {current.pains.map((pain, i) => (
                    <Box key={i} bg="bg-accent" borderRadius="xl" p={4}
                      border="1px solid" borderColor="border-default"
                      _hover={{ borderColor: 'brand.300', transform: 'translateX(4px)' }}
                      transition="all 0.2s">
                      <HStack spacing={3} align="flex-start" mb={2}>
                        <Box w="20px" h="20px" borderRadius="full" bg="brand.500" flexShrink={0}
                          display="flex" alignItems="center" justifyContent="center" mt={0.5}>
                          <Text fontSize="2xs" color="white" fontWeight="800">{i + 1}</Text>
                        </Box>
                        <Text fontSize="sm" color="text-muted" fontWeight="600">{pain.question}</Text>
                      </HStack>
                      <HStack spacing={2} align="flex-start" pl={8}>
                        <Icon as={FiCheck} color="whatsapp.500" boxSize={4} mt={0.5} flexShrink={0} />
                        <Text fontSize="sm" color="text-primary">{pain.answer}</Text>
                      </HStack>
                    </Box>
                  ))}
                </VStack>

                <HStack mt={5} spacing={2} p={3} bg="brand.50" borderRadius="lg"
                  border="1px dashed" borderColor="brand.200">
                  <Icon as={FiArrowRight} color="brand.500" boxSize={4} flexShrink={0} />
                  <Text fontSize="xs" color="brand.600" fontFamily="mono" fontWeight="600">
                    {current.microCopy}
                  </Text>
                </HStack>
              </Box>

              {/* Right: WhatsApp chat per persona */}
              <Box w={{ base: '100%', lg: '320px' }} flexShrink={0}>
                <AnimatePresence mode="wait">
                  <MotionBox key={`chat-${active}`}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35 }}
                    h="100%"
                  >
                    <PersonaChat personaKey={active} />
                  </MotionBox>
                </AnimatePresence>
              </Box>
            </Flex>
          </MotionBox>
        </AnimatePresence>
      </Container>
    </Box>
  );
}
