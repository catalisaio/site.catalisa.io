import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box, Heading, Text, VStack, HStack, SimpleGrid, Badge, Button,
  Flex, Container,
} from '@chakra-ui/react';
import {
  FiArrowLeft, FiMessageCircle, FiArrowRight,
  FiCpu, FiUsers, FiDollarSign, FiShield, FiGlobe,
  FiCalendar, FiFileText, FiDatabase, FiBarChart2, FiGitBranch,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { PageCTA } from '../components/shared/PageCTA';
import { PlaybookCard } from '../components/playbooks/PlaybookCard';
import { MotionBox, staggerContainer, staggerItem, nodeReveal } from '../components/motion';
import { playbooks, categoryMeta, getPlaybookIcon } from '../data/playbooks';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { categoryBadges } from '../data/capabilityClusters';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20ativar%20um%20playbook%20da%20Catalisa.';

/** Block name → icon + color */
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

/** Workflow step category → icon */
const stepIconMap: Record<string, IconType> = {
  IA: FiCpu,
  WhatsApp: FiMessageCircle,
  CRM: FiUsers,
  Financeiro: FiDollarSign,
  Seguranca: FiShield,
  Integracao: FiGlobe,
  Logica: FiGitBranch,
  Dados: FiDatabase,
  Documentos: FiFileText,
  Agenda: FiCalendar,
};

/** Diagram layout constants */
const DG = { w: 480, h: 420, r: 155 };
const CX = DG.w / 2;
const CY = DG.h / 2;

export function PlaybookDetail() {
  const { playbookId } = useParams<{ playbookId: string }>();
  const { t } = useTranslation('playbooks');
  const { t: tc } = useTranslation('common');
  const lp = useLocalizedPath();

  const playbook = useMemo(() => playbooks.find((p) => p.id === playbookId), [playbookId]);

  const related = useMemo(() => {
    if (!playbook) return [];
    return playbooks
      .filter((p) => p.id !== playbook.id && p.category === playbook.category)
      .slice(0, 3);
  }, [playbook]);

  const blockPositions = useMemo(() => {
    if (!playbook) return [];
    const count = playbook.blocks.length;
    return playbook.blocks.map((_, i) => {
      const angle = (2 * Math.PI * i) / count - Math.PI / 2;
      return { x: Math.cos(angle) * DG.r, y: Math.sin(angle) * DG.r };
    });
  }, [playbook]);

  if (!playbook) {
    return (
      <Container maxW="1280px" py={32} textAlign="center">
        <Heading size="lg" mb={4}>Playbook not found</Heading>
        <Button as={Link} to={lp('/playbooks')} leftIcon={<FiArrowLeft />}>
          {t('detail.backToTemplates')}
        </Button>
      </Container>
    );
  }

  const catMeta = categoryMeta[playbook.category];
  const Icon = getPlaybookIcon(playbook.icon);
  const before = playbook.metrics
    ? (t(playbook.metrics.beforeKey, { returnObjects: true }) as { metric: string; value: string }[])
    : [];
  const after = playbook.metrics
    ? (t(playbook.metrics.afterKey, { returnObjects: true }) as { metric: string; value: string }[])
    : [];

  return (
    <>
      {/* ── 1. Hero (DARK) ───────────────────────────────── */}
      <Box
        bg="hero.bg" pb={16} color="white"
        position="relative" overflow="hidden"
        mt="-64px" pt="calc(64px + 7rem)"
      >
        <Box
          position="absolute" top="-20%" left="20%" w="60%" h="80%"
          bgGradient={`radial(circle, var(--chakra-colors-${catMeta.color}-500) 0%, transparent 70%)`}
          opacity={0.08} pointerEvents="none"
        />
        <Container maxW="1280px" position="relative" zIndex={1}>
          <Button
            as={Link} to={lp('/playbooks')} variant="ghost"
            color="whiteAlpha.700" _hover={{ color: 'white' }}
            leftIcon={<FiArrowLeft />} mb={6} size="sm"
          >
            {t('detail.backToTemplates')}
          </Button>

          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <HStack spacing={4} mb={4}>
              <Flex
                w="56px" h="56px" borderRadius="full"
                bg="whiteAlpha.100" backdropFilter="blur(8px)"
                border="1px solid" borderColor="whiteAlpha.200"
                align="center" justify="center" flexShrink={0}
              >
                <Box as={Icon} color={`${catMeta.color}.300`} boxSize="28px" />
              </Flex>
              <VStack align="flex-start" spacing={1}>
                <Heading as="h1" size="xl" fontWeight="800">{t(playbook.nameKey)}</Heading>
                <HStack spacing={2}>
                  <Badge colorScheme={catMeta.color}>{t(catMeta.labelKey)}</Badge>
                  <Badge variant="outline" color="whiteAlpha.700" borderColor="whiteAlpha.300">
                    {t(`industries.${playbook.industry}`)}
                  </Badge>
                </HStack>
              </VStack>
            </HStack>
            <Text color="whiteAlpha.800" fontSize="lg" maxW="700px" lineHeight="1.8">
              {t(playbook.descriptionKey)}
            </Text>
          </MotionBox>

          <HStack spacing={4} mt={8}>
            <Button
              as="a" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              size="lg" bgGradient="linear(to-r, brand.500, brand.600)" color="white"
              _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(115, 75, 156, 0.4)' }}
              leftIcon={<FiMessageCircle />} transition="all 0.2s"
            >
              {t('detail.cta')}
            </Button>
            <Button
              as="a" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              size="lg" variant="outline" borderColor="whiteAlpha.400" color="white"
              _hover={{ bg: 'whiteAlpha.100' }}
            >
              {t('detail.ctaSecondary')}
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* ── 2. Agent Diagram (DARK) ──────────────────────── */}
      <SectionWrapper bg="hero.bg">
        <Heading as="h2" size="md" fontWeight="700" mb={10} textAlign="center" color="white">
          {t('detail.blocksUsed')}
        </Heading>

        {/* Desktop: radial diagram */}
        <Box
          display={{ base: 'none', md: 'block' }}
          position="relative"
          w={`${DG.w}px`} h={`${DG.h}px`}
          mx="auto"
        >
          {/* Ambient glow behind center */}
          <Box
            position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)"
            w="200px" h="200px" borderRadius="full"
            bgGradient={`radial(circle, var(--chakra-colors-${catMeta.color}-500) 0%, transparent 70%)`}
            opacity={0.12} pointerEvents="none"
          />

          {/* SVG dashed connector lines */}
          <motion.svg
            viewBox={`0 0 ${DG.w} ${DG.h}`}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            {blockPositions.map((pos, i) => (
              <motion.line
                key={i}
                x1={CX} y1={CY}
                x2={CX + pos.x} y2={CY + pos.y}
                stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="6 4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              />
            ))}
          </motion.svg>

          {/* Center agent card */}
          <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
            <MotionBox {...nodeReveal}>
              <VStack
                spacing={2} p={5} borderRadius="2xl"
                bg="whiteAlpha.100" backdropFilter="blur(12px)"
                border="1px solid" borderColor={`${catMeta.color}.400`}
                boxShadow={`0 0 60px var(--chakra-colors-${catMeta.color}-500), 0 0 20px rgba(0,0,0,0.3)`}
                w="140px" textAlign="center"
              >
                <Flex w="44px" h="44px" borderRadius="xl" bg={`${catMeta.color}.500`} align="center" justify="center">
                  <Box as={Icon} color="white" boxSize="22px" />
                </Flex>
                <Text fontSize="xs" fontWeight="700" color="white" lineHeight="short" noOfLines={2}>
                  {t(playbook.nameKey)}
                </Text>
                <Badge colorScheme={catMeta.color} fontSize="2xs" borderRadius="full">
                  {t(catMeta.labelKey)}
                </Badge>
              </VStack>
            </MotionBox>
          </Box>

          {/* Surrounding block cards */}
          {playbook.blocks.map((block, i) => {
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
                <MotionBox {...nodeReveal} transition={{ ...nodeReveal.transition, delay: 0.15 + i * 0.1 }}>
                  <VStack
                    spacing={1.5} p={3} borderRadius="xl"
                    bg="whiteAlpha.100" backdropFilter="blur(8px)"
                    border="1px solid" borderColor="whiteAlpha.200"
                    w="110px" textAlign="center"
                    _hover={{ borderColor: `${meta.color}.400`, bg: 'whiteAlpha.200' }}
                    transition="all 0.2s"
                  >
                    <Flex w="32px" h="32px" borderRadius="lg" bg={`${meta.color}.500`} align="center" justify="center">
                      <Box as={BlkIcon} color="white" boxSize="16px" />
                    </Flex>
                    <Text fontSize="2xs" fontWeight="600" color="whiteAlpha.800">{block}</Text>
                  </VStack>
                </MotionBox>
              </Box>
            );
          })}
        </Box>

        {/* Mobile: grid fallback */}
        <Box display={{ base: 'block', md: 'none' }}>
          <Flex justify="center" mb={4}>
            <VStack
              spacing={2} p={4} borderRadius="2xl"
              bg="whiteAlpha.100" backdropFilter="blur(12px)"
              border="1px solid" borderColor={`${catMeta.color}.400`}
              boxShadow={`0 0 40px var(--chakra-colors-${catMeta.color}-500)`}
              textAlign="center" w="full" maxW="200px"
            >
              <Flex w="40px" h="40px" borderRadius="xl" bg={`${catMeta.color}.500`} align="center" justify="center">
                <Box as={Icon} color="white" boxSize="20px" />
              </Flex>
              <Text fontSize="sm" fontWeight="700" color="white">{t(playbook.nameKey)}</Text>
              <Badge colorScheme={catMeta.color} fontSize="2xs">{t(catMeta.labelKey)}</Badge>
            </VStack>
          </Flex>
          <SimpleGrid columns={2} spacing={3} maxW="300px" mx="auto">
            {playbook.blocks.map((block) => {
              const meta = blockMeta[block] || { icon: FiGlobe, color: 'gray' };
              const BlkIcon = meta.icon;
              return (
                <VStack
                  key={block} spacing={1} p={3} borderRadius="xl"
                  bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200"
                  textAlign="center"
                >
                  <Flex w="28px" h="28px" borderRadius="md" bg={`${meta.color}.500`} align="center" justify="center">
                    <Box as={BlkIcon} color="white" boxSize="14px" />
                  </Flex>
                  <Text fontSize="2xs" fontWeight="600" color="whiteAlpha.800">{block}</Text>
                </VStack>
              );
            })}
          </SimpleGrid>
        </Box>
      </SectionWrapper>

      {/* ── 3. Vertical Workflow (LIGHT) ─────────────────── */}
      <SectionWrapper>
        <Heading as="h2" size="md" fontWeight="700" mb={10} textAlign="center">
          {t('detail.workflow')}
        </Heading>

        <MotionBox {...staggerContainer} maxW="480px" mx="auto">
          {playbook.workflowSteps.map((step, i) => {
            const clr = categoryBadges[step.category]?.color || 'gray';
            const SIcon = stepIconMap[step.category];
            return (
              <MotionBox key={i} {...staggerItem}>
                <HStack spacing={4} align="flex-start">
                  <VStack spacing={0} align="center" flexShrink={0} w="40px">
                    <Flex
                      w="40px" h="40px" borderRadius="full"
                      bg={`${clr}.100`} border="2px solid" borderColor={`${clr}.200`}
                      align="center" justify="center"
                    >
                      <Text fontWeight="800" fontSize="sm" color={`${clr}.600`}>{i + 1}</Text>
                    </Flex>
                    {i < playbook.workflowSteps.length - 1 && (
                      <Box h="40px" borderLeft="2px dashed" borderColor="gray.200" />
                    )}
                  </VStack>

                  <Box pt="6px" pb={i < playbook.workflowSteps.length - 1 ? 2 : 0}>
                    <HStack spacing={2} mb={1}>
                      {SIcon && <Box as={SIcon} color={`${clr}.500`} boxSize="14px" />}
                      <Badge colorScheme={clr} fontSize="2xs" borderRadius="full">{step.category}</Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" lineHeight="short">{t(step.labelKey)}</Text>
                  </Box>
                </HStack>
              </MotionBox>
            );
          })}
        </MotionBox>
      </SectionWrapper>

      {/* ── 4. Metrics Before/After (DARK) ───────────────── */}
      {Array.isArray(before) && before.length > 0 && (
        <SectionWrapper bg="hero.bg">
          <Heading as="h2" size="md" fontWeight="700" textAlign="center" mb={8} color="white">
            {t('detail.results')}
          </Heading>
          <Flex
            maxW="750px" mx="auto"
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'stretch', md: 'center' }}
            gap={6}
          >
            {/* Before */}
            <Box
              flex={1} p={6} borderRadius="xl"
              bg="rgba(254, 178, 178, 0.06)"
              border="1px solid" borderColor="red.800"
            >
              <Text
                fontSize="xs" fontWeight="700" color="red.300" mb={4}
                textTransform="uppercase" letterSpacing="wide"
              >
                {t('detail.before')}
              </Text>
              <VStack align="flex-start" spacing={3}>
                {before.map((item) => (
                  <Flex key={item.metric} justify="space-between" w="full" align="baseline">
                    <Text fontSize="sm" color="whiteAlpha.600">{item.metric}</Text>
                    <Text fontWeight="800" fontSize="2xl" color="red.300">{item.value}</Text>
                  </Flex>
                ))}
              </VStack>
            </Box>

            {/* Arrow indicator (desktop) */}
            <Flex display={{ base: 'none', md: 'flex' }} align="center" justify="center" flexShrink={0}>
              <Flex w="36px" h="36px" borderRadius="full" bg="whiteAlpha.100" align="center" justify="center">
                <Box as={FiArrowRight} color="whiteAlpha.600" boxSize="18px" />
              </Flex>
            </Flex>

            {/* After */}
            <Box
              flex={1} p={6} borderRadius="xl"
              bg="rgba(154, 230, 180, 0.06)"
              border="1px solid" borderColor="green.800"
              position="relative" overflow="hidden"
            >
              <Box
                position="absolute" top="-20px" right="-20px" w="100px" h="100px"
                bgGradient="radial(circle, rgba(72, 187, 120, 0.1) 0%, transparent 70%)"
                pointerEvents="none"
              />
              <Text
                fontSize="xs" fontWeight="700" color="green.300" mb={4}
                textTransform="uppercase" letterSpacing="wide" position="relative"
              >
                {t('detail.after')}
              </Text>
              <VStack align="flex-start" spacing={3} position="relative">
                {after.map((item) => (
                  <Flex key={item.metric} justify="space-between" w="full" align="baseline">
                    <Text fontSize="sm" color="whiteAlpha.600">{item.metric}</Text>
                    <Text fontWeight="800" fontSize="2xl" color="green.300">{item.value}</Text>
                  </Flex>
                ))}
              </VStack>
            </Box>
          </Flex>
        </SectionWrapper>
      )}

      {/* ── 5. Related Playbooks (LIGHT) ─────────────────── */}
      {related.length > 0 && (
        <SectionWrapper bg="gray.50">
          <Heading as="h2" size="md" fontWeight="700" textAlign="center" mb={8}>
            {t('detail.related')}
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
            {related.map((tpl, i) => (
              <PlaybookCard key={tpl.id} playbook={tpl} index={i} />
            ))}
          </SimpleGrid>
        </SectionWrapper>
      )}

      <PageCTA
        heading={t('bottomCTA.heading')}
        subtitle={t('bottomCTA.subtitle')}
        primaryCTA={{ label: tc('cta.letsChat') }}
        secondaryCTA={{ label: tc('cta.seeDemo'), to: lp('/demo') }}
      />
    </>
  );
}
