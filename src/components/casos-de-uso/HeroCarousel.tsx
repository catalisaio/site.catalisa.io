import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Box, Flex, Heading, Text, Badge, Button, HStack, Container, VStack,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiArrowRight, FiMessageCircle, FiServer, FiLayers,
  FiCpu, FiUsers, FiDollarSign, FiShield, FiGlobe,
  FiCalendar, FiFileText, FiDatabase, FiBarChart2,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useTranslation } from 'react-i18next';
import { WhatsAppChatPreview } from '../shared/WhatsAppChatPreview';
import type { ChatMessage } from '../shared/WhatsAppChatPreview';
import { APIPreview } from '../shared/APIPreview';
import type { APIMessage } from '../shared/APIPreview';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { playbooks, categoryMeta, getPlaybookIcon } from '../../data/playbooks';

const DWELL_TIME = 8000;

const panelVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

/** Map playbook ID → i18n prefix for chat messages */
const playbookPrefixMap: Record<string, string> = {
  'sdr-automatizado': 'sdr',
  'app-originacao-credito': 'appOriginacaoCredito',
  'onboarding-kyc': 'kycOnboarding',
  'cobranca-inteligente': 'collections',
  'app-portal-cliente': 'appPortalCliente',
};

interface SlideData {
  id: string;
  headline: string;
  description: string;
  preview: 'whatsapp' | 'api' | 'workflow';
}

/** Block name → icon + color (same map as PlaybookDetail) */
const blockMeta: Record<string, { icon: IconType; color: string }> = {
  'AI Agents': { icon: FiCpu, color: 'purple' },
  'WhatsApp': { icon: FiMessageCircle, color: 'green' },
  'CRM': { icon: FiUsers, color: 'orange' },
  'Financial': { icon: FiDollarSign, color: 'yellow' },
  'Security': { icon: FiShield, color: 'red' },
  'Webhooks': { icon: FiGlobe, color: 'cyan' },
  'Calendar': { icon: FiCalendar, color: 'teal' },
  'Docs': { icon: FiFileText, color: 'pink' },
  'Knowledge Base': { icon: FiDatabase, color: 'teal' },
  'Data': { icon: FiDatabase, color: 'teal' },
  'Open Finance': { icon: FiBarChart2, color: 'cyan' },
};

/** Diagram layout constants */
const DG = { w: 420, h: 420, r: 140 };
const CX = DG.w / 2;
const CY = DG.h / 2;

function BlocksDiagramPreview({ playbookId }: { playbookId: string }) {
  const { t } = useTranslation('playbooks');
  const pb = useMemo(() => playbooks.find((p) => p.id === playbookId), [playbookId]);

  const catMeta = pb ? categoryMeta[pb.category] : null;
  const Icon = pb ? getPlaybookIcon(pb.icon) : FiLayers;

  const blockPositions = useMemo(() => {
    if (!pb) return [];
    const count = pb.blocks.length;
    return pb.blocks.map((_, i) => {
      const angle = (2 * Math.PI * i) / count - Math.PI / 2;
      return { x: Math.cos(angle) * DG.r, y: Math.sin(angle) * DG.r };
    });
  }, [pb]);

  if (!pb || !catMeta) return null;

  return (
    <Box
      position="relative" w={`${DG.w}px`} h={`${DG.h}px`}
      transform={{ base: 'scale(0.6)', sm: 'scale(0.72)', md: 'scale(0.85)', lg: 'scale(1)' }}
      transformOrigin="center center"
      flexShrink={0}
    >
      {/* SVG connecting lines */}
      <motion.svg
        viewBox={`0 0 ${DG.w} ${DG.h}`}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        {blockPositions.map((pos, i) => (
          <motion.line
            key={i}
            x1={CX} y1={CY}
            x2={CX + pos.x} y2={CY + pos.y}
            stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="6 4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
          />
        ))}
      </motion.svg>

      {/* Center node — playbook */}
      <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
        <VStack
          spacing={2} p={5} borderRadius="2xl"
          bg="whiteAlpha.100"
          border="2px solid" borderColor={`${catMeta.color}.400`}
          boxShadow={`0 0 50px var(--chakra-colors-${catMeta.color}-900), 0 4px 20px rgba(0,0,0,0.3)`}
          w="130px" textAlign="center"
        >
          <Flex w="44px" h="44px" borderRadius="xl" bg={`${catMeta.color}.900`} align="center" justify="center">
            <Box as={Icon} color={`${catMeta.color}.300`} boxSize="22px" />
          </Flex>
          <Text fontSize="xs" fontWeight="700" color="white" lineHeight="short" noOfLines={2}>
            {t(pb.nameKey)}
          </Text>
          <Badge bg={`${catMeta.color}.900`} color={`${catMeta.color}.300`} fontSize="2xs" borderRadius="full">
            {t(catMeta.labelKey)}
          </Badge>
        </VStack>
      </Box>

      {/* Orbiting block nodes */}
      {pb.blocks.map((block, i) => {
        const meta = blockMeta[block] || { icon: FiGlobe, color: 'gray' };
        const BlkIcon = meta.icon;
        const pos = blockPositions[i];
        return (
          <Box
            key={block}
            position="absolute"
            top={`calc(50% + ${pos.y}px)`}
            left={`calc(50% + ${pos.x}px)`}
            transform="translate(-50%, -50%)"
          >
            <VStack
              spacing={1.5} p={3} borderRadius="xl"
              bg="whiteAlpha.100"
              border="1px solid" borderColor="whiteAlpha.200"
              w="100px" textAlign="center"
              _hover={{ bg: 'whiteAlpha.200', borderColor: `${meta.color}.400` }}
              transition="all 0.2s"
            >
              <Flex w="32px" h="32px" borderRadius="lg" bg={`${meta.color}.900`} align="center" justify="center">
                <Box as={BlkIcon} color={`${meta.color}.300`} boxSize="16px" />
              </Flex>
              <Text fontSize="2xs" fontWeight="600" color="whiteAlpha.800">{block}</Text>
            </VStack>
          </Box>
        );
      })}
    </Box>
  );
}

function SlidePreview({ slide }: { slide: SlideData }) {
  const { t } = useTranslation('playbooks');
  const prefix = playbookPrefixMap[slide.id] || '';

  const messages = useMemo(() => {
    if (!prefix) return [];
    const msgs = t(`${prefix}.chatMessages`, { returnObjects: true });
    return Array.isArray(msgs) ? msgs : [];
  }, [prefix, t]);

  const pb = useMemo(() => playbooks.find((p) => p.id === slide.id), [slide.id]);
  const pbName = pb ? t(pb.nameKey) : '';

  if (slide.preview === 'whatsapp') {
    return (
      <WhatsAppChatPreview
        triggerMode="auto"
        title={pbName}
        messages={messages as ChatMessage[]}
      />
    );
  }

  if (slide.preview === 'api') {
    return (
      <APIPreview
        triggerMode="auto"
        title={pbName}
        messages={messages as APIMessage[]}
      />
    );
  }

  return <BlocksDiagramPreview playbookId={slide.id} />;
}

export function HeroCarousel() {
  const { t } = useTranslation('casos-de-uso');
  const { t: tp } = useTranslation('playbooks');
  const lp = useLocalizedPath();

  const slides = useMemo(
    () => t('hero.slides', { returnObjects: true }) as SlideData[],
    [t],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(advance, DWELL_TIME);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeIndex, paused, advance]);

  const handleTabClick = useCallback((index: number) => {
    setActiveIndex(index);
    setPaused(true);
    setTimeout(() => setPaused(false), 3000);
  }, []);

  const slide = slides[activeIndex];
  if (!slide) return null;

  const pb = playbooks.find((p) => p.id === slide.id);
  const catMeta = pb ? categoryMeta[pb.category] : null;
  const pbType = pb?.type || 'agent';

  return (
    <Box
      bg="hero.bg"
      position="relative"
      overflow="hidden"
      mt="-64px"
      pt="64px"
      minH="100vh"
      display="flex"
      alignItems="center"
    >
      {/* Gradient overlays */}
      <Box
        position="absolute"
        top="-20%"
        left="30%"
        w="60%"
        h="80%"
        bgGradient="radial(circle, rgba(115, 75, 156, 0.2) 0%, transparent 60%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="10%"
        w="40%"
        h="50%"
        bgGradient="radial(circle, rgba(0, 188, 212, 0.08) 0%, transparent 60%)"
        pointerEvents="none"
      />

      <Container maxW="1280px" position="relative" zIndex={1} py={16}>
        {/* Badge */}
        <Badge
          bg="whiteAlpha.100"
          color="whiteAlpha.800"
          px={4}
          py={1.5}
          borderRadius="full"
          fontSize="xs"
          fontWeight="600"
          border="1px solid"
          borderColor="whiteAlpha.200"
          mb={8}
        >
          {t('hero.badge')}
        </Badge>

        <Flex direction={{ base: 'column', lg: 'row' }} gap={{ base: 10, lg: 16 }} align="center">
          {/* Left: text content */}
          <Box flex={1} minW={0}>
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <Heading
                  as="h1"
                  fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                  fontWeight="800"
                  color="white"
                  lineHeight="1.15"
                  mb={4}
                >
                  {slide.headline}
                </Heading>
                <Text color="whiteAlpha.700" fontSize={{ base: 'md', lg: 'lg' }} lineHeight="1.7" mb={6} maxW="550px">
                  {slide.description}
                </Text>

                {/* Badges */}
                <HStack spacing={2} mb={6} flexWrap="wrap">
                  {pbType === 'app' ? (
                    <Badge colorScheme="orange" px={3} py={1} borderRadius="full" fontSize="xs">App</Badge>
                  ) : (
                    <Badge colorScheme="purple" px={3} py={1} borderRadius="full" fontSize="xs">Agent</Badge>
                  )}
                  {catMeta && (
                    <Badge colorScheme={catMeta.color} px={3} py={1} borderRadius="full" fontSize="xs">
                      {tp(catMeta.labelKey)}
                    </Badge>
                  )}
                </HStack>

                {/* CTA */}
                <Button
                  as="a"
                  href={lp(`/playbooks/${slide.id}`)}
                  size="lg"
                  bgGradient="linear(to-r, brand.500, brand.600)"
                  color="white"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(115, 75, 156, 0.4)',
                  }}
                  rightIcon={<FiArrowRight />}
                  transition="all 0.2s"
                >
                  {pb ? tp(pb.nameKey) : slide.headline}
                </Button>
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* Right: preview */}
          <Box flex={1} minW={0} maxW={{ base: '100%', lg: '400px' }} w="full">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              >
                <SlidePreview slide={slide} />
              </motion.div>
            </AnimatePresence>
          </Box>
        </Flex>

        {/* Tab indicators with progress bars */}
        <HStack spacing={1} justify="center" flexWrap="wrap" rowGap={1.5} mt={10}>
          {slides.map((s, i) => {
            const isActive = i === activeIndex;
            const previewIcon = s.preview === 'whatsapp' ? FiMessageCircle : s.preview === 'api' ? FiServer : FiLayers;
            return (
              <Box
                key={s.id}
                as="button"
                onClick={() => handleTabClick(i)}
                px={3}
                py={2}
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
                <HStack spacing={1.5}>
                  <Box as={previewIcon} color={isActive ? 'brand.400' : 'whiteAlpha.500'} boxSize="12px" />
                  <Text
                    color={isActive ? 'white' : 'whiteAlpha.500'}
                    fontSize="2xs"
                    fontWeight={isActive ? '600' : '400'}
                    noOfLines={1}
                    display={{ base: 'none', sm: 'block' }}
                  >
                    {s.headline.split(' ').slice(0, 2).join(' ')}
                  </Text>
                </HStack>

                {isActive && (
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    h="2px"
                    bg="brand.400"
                    as={motion.div}
                    initial={{ width: '0%' }}
                    animate={{ width: paused ? undefined : '100%' }}
                    transition={{ duration: DWELL_TIME / 1000, ease: 'linear' } as any}
                  />
                )}
              </Box>
            );
          })}
        </HStack>
      </Container>
    </Box>
  );
}
