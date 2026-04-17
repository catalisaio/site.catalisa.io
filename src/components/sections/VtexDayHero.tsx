import { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowDown, FiMessageCircle, FiSearch, FiPackage, FiTruck, FiDollarSign } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { GradientText } from '../shared/GradientText';
import { CATALISA_WHATSAPP } from '../../data/vtexDay2026';

const MotionBox = motion(Box);

const STEPS = [
  { key: 'search', label: 'search-products', icon: FiSearch, x: 12, y: 20 },
  { key: 'inventory', label: 'get-inventory', icon: FiPackage, x: 70, y: 12 },
  { key: 'simulate', label: 'checkout-simulation', icon: FiTruck, x: 78, y: 62 },
  { key: 'price', label: 'get-price', icon: FiDollarSign, x: 22, y: 68 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
];

const STEP_DURATION_MS = 2200;

function WorkflowCanvas({ activeStep }: { activeStep: number }) {
  const points = STEPS.map((s) => ({ x: s.x, y: s.y }));
  return (
    <Box position="absolute" inset={0} pointerEvents="none" zIndex={0}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id="edgeActive" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#734B9C" stopOpacity="0" />
            <stop offset="50%" stopColor="#25D366" stopOpacity="1" />
            <stop offset="100%" stopColor="#734B9C" stopOpacity="0" />
          </linearGradient>
        </defs>
        {EDGES.map(([from, to], i) => {
          const p1 = points[from];
          const p2 = points[to];
          const isActive = activeStep === from;
          return (
            <motion.line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={isActive ? 'url(#edgeActive)' : 'rgba(255,255,255,0.08)'}
              strokeWidth={isActive ? 0.4 : 0.2}
              strokeLinecap="round"
              initial={false}
              animate={{ opacity: isActive ? 1 : 0.4 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
      </svg>

      {STEPS.map((step, i) => {
        const isActive = activeStep === i;
        return (
          <MotionBox
            key={step.key}
            position="absolute"
            left={`${step.x}%`}
            top={`${step.y}%`}
            transform="translate(-50%, -50%)"
            animate={{
              scale: isActive ? 1.1 : 0.92,
              opacity: isActive ? 1 : 0.55,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Box
              px={3}
              py={2}
              borderRadius="lg"
              bg={isActive ? 'rgba(115,75,156,0.35)' : 'rgba(255,255,255,0.04)'}
              border="1px solid"
              borderColor={isActive ? 'brand.300' : 'whiteAlpha.200'}
              backdropFilter="blur(8px)"
              boxShadow={isActive ? '0 0 28px rgba(115,75,156,0.55)' : 'none'}
              display="flex"
              alignItems="center"
              gap={2}
              minW="140px"
              transition="all 0.3s ease"
            >
              <Icon as={step.icon} color={isActive ? 'whatsapp.300' : 'whiteAlpha.600'} boxSize={3.5} />
              <Text
                fontSize="xs"
                fontFamily="mono"
                color={isActive ? 'white' : 'whiteAlpha.600'}
                fontWeight="600"
              >
                {step.label}
              </Text>
            </Box>
            {isActive && (
              <MotionBox
                position="absolute"
                inset={-1}
                borderRadius="lg"
                border="1px solid"
                borderColor="whatsapp.400"
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
          </MotionBox>
        );
      })}
    </Box>
  );
}

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  delay: number;
}

function ChatMockup({ activeStep }: { activeStep: number }) {
  const { t } = useTranslation('vtex-day-2026');

  const messages: ChatMessage[] = [
    { id: 'q', role: 'user', text: t('hero.chatCustomer'), delay: 0 },
    { id: 'a1', role: 'bot', text: t('hero.chatBot1'), delay: 1 },
    { id: 'a2', role: 'bot', text: t('hero.chatBot2'), delay: 2 },
  ];

  return (
    <Box
      w={{ base: '280px', sm: '320px' }}
      borderRadius="28px"
      bg="#0b141a"
      border="1px solid"
      borderColor="whiteAlpha.200"
      boxShadow="0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)"
      overflow="hidden"
      position="relative"
    >
      {/* WhatsApp header */}
      <Flex bg="#1f2c33" px={4} py={3} align="center" gap={3}>
        <Box
          w="36px"
          h="36px"
          borderRadius="full"
          bg="linear-gradient(135deg, #734B9C, #25D366)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          fontWeight="700"
          fontSize="sm"
        >
          C
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="600" color="white">
            Catalisa · sua loja
          </Text>
          <Text fontSize="xs" color="whatsapp.300">
            online
          </Text>
        </Box>
      </Flex>

      {/* Messages */}
      <Box
        bg="#0b141a"
        bgImage="radial-gradient(circle at 50% 0%, rgba(115,75,156,0.08), transparent 60%)"
        px={3}
        py={4}
        minH="260px"
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <AnimatePresence>
          {messages.map((m) => {
            if (activeStep < m.delay) return null;
            const isUser = m.role === 'user';
            return (
              <MotionBox
                key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                alignSelf={isUser ? 'flex-end' : 'flex-start'}
                bg={isUser ? '#005c4b' : '#202c33'}
                color="white"
                px={3}
                py={2}
                borderRadius={isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px'}
                maxW="80%"
                fontSize="sm"
                boxShadow="0 1px 1px rgba(0,0,0,0.3)"
              >
                {m.text}
              </MotionBox>
            );
          })}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

export function VtexDayHero() {
  const { t } = useTranslation('vtex-day-2026');
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, STEP_DURATION_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Box
      as="section"
      id="vtex-day-hero"
      data-hero-id="hero_vtex_day_2026"
      position="relative"
      bg="hero.bg"
      overflow="hidden"
      minH="100vh"
      display="flex"
      flexDirection="column"
    >
      <Box
        position="absolute"
        top="-20%"
        left="50%"
        transform="translateX(-50%)"
        w="120%"
        h="120%"
        bgGradient="radial(circle at 30% 40%, rgba(115,75,156,0.35) 0%, rgba(115,75,156,0.05) 40%, transparent 70%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="-10%"
        w="60%"
        h="60%"
        bgGradient="radial(circle, rgba(247,25,99,0.12) 0%, transparent 60%)"
        pointerEvents="none"
      />

      <Box
        position="absolute"
        inset={0}
        display={{ base: 'none', lg: 'block' }}
        opacity={0.9}
      >
        <WorkflowCanvas activeStep={step} />
      </Box>

      <Container
        maxW="1280px"
        position="relative"
        zIndex={1}
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        py={{ base: 12, md: 20 }}
      >
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="space-between"
          gap={{ base: 10, lg: 16 }}
        >
          <VStack align="flex-start" spacing={6} maxW="600px" flex={1}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                bg="whiteAlpha.100"
                color="whatsapp.300"
                px={4}
                py={1.5}
                borderRadius="full"
                fontSize="sm"
                fontWeight="600"
              >
                {t('hero.badge')}
              </Badge>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Heading
                as="h1"
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight="800"
                color="white"
                lineHeight="1.1"
              >
                {t('hero.headline')}{' '}
                <GradientText
                  gradient="linear(to-r, brand.300, whatsapp.400)"
                  fontSize="inherit"
                  fontWeight="inherit"
                >
                  {t('hero.headlineHighlight')}
                </GradientText>
              </Heading>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Text color="whiteAlpha.700" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7" maxW="540px">
                {t('hero.subtitle')}
              </Text>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <HStack spacing={4} flexWrap="wrap">
                <Button
                  as="a"
                  href={CATALISA_WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  bg="whatsapp.600"
                  color="white"
                  _hover={{
                    bg: 'whatsapp.700',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 30px rgba(37,211,102,0.35)',
                  }}
                  leftIcon={<FiMessageCircle />}
                >
                  {t('hero.ctaPrimary')}
                </Button>
                <Button
                  as="a"
                  href="#vtex-day-lead"
                  size="lg"
                  variant="ghost"
                  color="whiteAlpha.800"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  rightIcon={<FiArrowDown />}
                >
                  {t('hero.ctaSecondary')}
                </Button>
              </HStack>
            </MotionBox>
          </VStack>

          <MotionBox
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            w={{ base: '100%', lg: 'auto' }}
            display="flex"
            justifyContent={{ base: 'center', lg: 'flex-end' }}
          >
            <ChatMockup activeStep={step} />
          </MotionBox>
        </Flex>
      </Container>
    </Box>
  );
}
