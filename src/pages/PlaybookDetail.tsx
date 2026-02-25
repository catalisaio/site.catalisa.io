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
      {/* ── 1. Hero (LIGHT) ───────────────────────────────── */}
      <Box
        bg="white" pb={20} color="gray.900"
        position="relative" overflow="hidden"
        mt="-64px" pt="calc(64px + 7rem)"
      >
        <Box
          position="absolute" top="-10%" left="15%" w="70%" h="90%"
          bgGradient={`radial(circle, var(--chakra-colors-${catMeta.color}-100) 0%, transparent 70%)`}
          opacity={0.7} pointerEvents="none"
        />
        <Container maxW="1280px" position="relative" zIndex={1}>
          <Button
            as={Link} to={lp('/playbooks')} variant="ghost"
            color="gray.500" _hover={{ color: 'gray.800' }}
            leftIcon={<FiArrowLeft />} mb={6} size="sm"
          >
            {t('detail.backToTemplates')}
          </Button>

          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <HStack spacing={5} mb={6}>
              <Flex
                w="72px" h="72px" borderRadius="full"
                bg={`${catMeta.color}.50`}
                border="1px solid" borderColor={`${catMeta.color}.200`}
                boxShadow={`0 0 40px var(--chakra-colors-${catMeta.color}-200)`}
                align="center" justify="center" flexShrink={0}
              >
                <Box as={Icon} color={`${catMeta.color}.500`} boxSize="34px" />
              </Flex>
              <VStack align="flex-start" spacing={1}>
                <Heading
                  as="h1" fontSize={{ base: '2xl', md: '3xl' }}
                  fontWeight="800" lineHeight="1.15" color="gray.900"
                >
                  {t(playbook.nameKey)}
                </Heading>
                <HStack spacing={2}>
                  <Badge colorScheme={catMeta.color} px={3} py={1} fontSize="sm">
                    {t(catMeta.labelKey)}
                  </Badge>
                  <Badge variant="outline" color="gray.500" borderColor="gray.300" px={3} py={1} fontSize="sm">
                    {t(`industries.${playbook.industry}`)}
                  </Badge>
                </HStack>
              </VStack>
            </HStack>
            <Text color="gray.600" fontSize={{ base: 'lg', md: 'xl' }} maxW="700px" lineHeight="1.8">
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
              size="lg" variant="outline" borderColor="gray.300" color="gray.700"
              _hover={{ bg: 'gray.50' }}
            >
              {t('detail.ctaSecondary')}
            </Button>
          </HStack>

          {/* Trust indicators */}
          <HStack spacing={5} mt={6} flexWrap="wrap">
            <HStack spacing={2}>
              <Box w="8px" h="8px" borderRadius="full" bg={`${catMeta.color}.400`} />
              <Text fontSize="sm" color="gray.400">{t(catMeta.labelKey)}</Text>
            </HStack>
            <HStack spacing={2}>
              <Box w="8px" h="8px" borderRadius="full" bg={`${catMeta.color}.400`} />
              <Text fontSize="sm" color="gray.400">{t(`industries.${playbook.industry}`)}</Text>
            </HStack>
            <HStack spacing={2}>
              <Box w="8px" h="8px" borderRadius="full" bg={`${catMeta.color}.400`} />
              <Text fontSize="sm" color="gray.400">
                {playbook.blocks.length} blocks
              </Text>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* ── 2. Agent Diagram (LIGHT) ─────────────────────── */}
      <SectionWrapper>
        <Heading as="h2" size="md" fontWeight="700" mb={10} textAlign="center">
          {t('detail.blocksUsed')}
        </Heading>

        {/* Desktop: radial diagram */}
        <Box
          display={{ base: 'none', md: 'block' }}
          position="relative"
          w={`${DG.w}px`} h={`${DG.h}px`}
          mx="auto"
        >
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
                stroke="#CBD5E0" strokeWidth="1.5" strokeDasharray="6 4"
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
                spacing={2} p={5} borderRadius="2xl" bg="white"
                border="2px solid" borderColor={`${catMeta.color}.200`}
                boxShadow={`0 0 50px var(--chakra-colors-${catMeta.color}-100), 0 4px 20px rgba(0,0,0,0.06)`}
                w="140px" textAlign="center"
              >
                <Flex w="44px" h="44px" borderRadius="xl" bg={`${catMeta.color}.50`} align="center" justify="center">
                  <Box as={Icon} color={`${catMeta.color}.500`} boxSize="22px" />
                </Flex>
                <Text fontSize="xs" fontWeight="700" color="gray.800" lineHeight="short" noOfLines={2}>
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
                    spacing={1.5} p={3} borderRadius="xl" bg="white"
                    border="1px solid" borderColor="gray.100" shadow="sm"
                    w="110px" textAlign="center"
                    _hover={{ shadow: 'md', borderColor: `${meta.color}.200` }}
                    transition="all 0.2s"
                  >
                    <Flex w="32px" h="32px" borderRadius="lg" bg={`${meta.color}.50`} align="center" justify="center">
                      <Box as={BlkIcon} color={`${meta.color}.500`} boxSize="16px" />
                    </Flex>
                    <Text fontSize="2xs" fontWeight="600" color="gray.700">{block}</Text>
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
              spacing={2} p={4} borderRadius="2xl" bg="white"
              border="2px solid" borderColor={`${catMeta.color}.200`}
              boxShadow={`0 0 30px var(--chakra-colors-${catMeta.color}-100)`}
              textAlign="center" w="full" maxW="200px"
            >
              <Flex w="40px" h="40px" borderRadius="xl" bg={`${catMeta.color}.50`} align="center" justify="center">
                <Box as={Icon} color={`${catMeta.color}.500`} boxSize="20px" />
              </Flex>
              <Text fontSize="sm" fontWeight="700" color="gray.800">{t(playbook.nameKey)}</Text>
              <Badge colorScheme={catMeta.color} fontSize="2xs">{t(catMeta.labelKey)}</Badge>
            </VStack>
          </Flex>
          <SimpleGrid columns={2} spacing={3} maxW="300px" mx="auto">
            {playbook.blocks.map((block) => {
              const meta = blockMeta[block] || { icon: FiGlobe, color: 'gray' };
              const BlkIcon = meta.icon;
              return (
                <VStack
                  key={block} spacing={1} p={3} borderRadius="xl" bg="white"
                  border="1px solid" borderColor="gray.100" shadow="sm" textAlign="center"
                >
                  <Flex w="28px" h="28px" borderRadius="md" bg={`${meta.color}.50`} align="center" justify="center">
                    <Box as={BlkIcon} color={`${meta.color}.500`} boxSize="14px" />
                  </Flex>
                  <Text fontSize="2xs" fontWeight="600" color="gray.700">{block}</Text>
                </VStack>
              );
            })}
          </SimpleGrid>
        </Box>
      </SectionWrapper>

      {/* ── 3. Vertical Workflow (DARK) ──────────────────── */}
      <Box position="relative" overflow="hidden">
        <Box
          position="absolute" top="10%" left="50%" w="80%" h="90%"
          transform="translateX(-50%)"
          bgGradient="radial(circle, rgba(115, 75, 156, 0.12) 0%, transparent 70%)"
          pointerEvents="none"
        />
      <SectionWrapper bg="hero.bg">
        <Heading as="h2" size="lg" fontWeight="800" mb={12} textAlign="center" color="white" position="relative">
          {t('detail.workflow')}
        </Heading>

        <MotionBox {...staggerContainer} maxW="600px" mx="auto" position="relative">
          {playbook.workflowSteps.map((step, i) => {
            const clr = categoryBadges[step.category]?.color || 'gray';
            const SIcon = stepIconMap[step.category];
            return (
              <MotionBox key={i} {...staggerItem}>
                <HStack spacing={5} align="flex-start">
                  {/* Step number + connector */}
                  <VStack spacing={0} align="center" flexShrink={0} w="48px">
                    <Flex
                      w="48px" h="48px" borderRadius="full"
                      bg="whiteAlpha.100" border="2px solid" borderColor="whiteAlpha.200"
                      align="center" justify="center"
                    >
                      {SIcon
                        ? <Box as={SIcon} color={`${clr}.400`} boxSize="20px" />
                        : <Text fontWeight="800" fontSize="md" color="white">{i + 1}</Text>
                      }
                    </Flex>
                    {i < playbook.workflowSteps.length - 1 && (
                      <Box h="24px" borderLeft="2px dashed" borderColor="whiteAlpha.150" />
                    )}
                  </VStack>

                  {/* Step content card */}
                  <Box
                    flex={1} pt="4px" pb={i < playbook.workflowSteps.length - 1 ? 4 : 0}
                  >
                    <HStack spacing={2} mb={2}>
                      <Badge
                        bg="whiteAlpha.100" color={`${clr}.300`} border="1px solid"
                        borderColor="whiteAlpha.200" fontSize="xs" borderRadius="full"
                        px={3} py={0.5}
                      >
                        {step.category}
                      </Badge>
                      <Text fontSize="xs" color="whiteAlpha.400" fontWeight="600">
                        {t('detail.stepLabel', { defaultValue: 'Passo' })} {i + 1}
                      </Text>
                    </HStack>
                    <Text fontSize="md" color="whiteAlpha.800" lineHeight="1.6" fontWeight="500">
                      {t(step.labelKey)}
                    </Text>
                  </Box>
                </HStack>
              </MotionBox>
            );
          })}
        </MotionBox>
      </SectionWrapper>
      </Box>

      {/* ── 4. Metrics Before/After (LIGHT) ──────────────── */}
      {Array.isArray(before) && before.length > 0 && (
        <SectionWrapper>
          <Heading as="h2" size="md" fontWeight="700" textAlign="center" mb={8}>
            {t('detail.results')}
          </Heading>
          <Flex
            maxW="750px" mx="auto"
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'stretch', md: 'center' }}
            gap={6}
          >
            {/* Before */}
            <Box flex={1} bg="red.50" p={6} borderRadius="xl" border="1px solid" borderColor="red.100">
              <Text
                fontSize="xs" fontWeight="700" color="red.500" mb={4}
                textTransform="uppercase" letterSpacing="wide"
              >
                {t('detail.before')}
              </Text>
              <VStack align="flex-start" spacing={3}>
                {before.map((item) => (
                  <Flex key={item.metric} justify="space-between" w="full" align="baseline">
                    <Text fontSize="sm" color="gray.600">{item.metric}</Text>
                    <Text fontWeight="800" fontSize="2xl" color="red.600">{item.value}</Text>
                  </Flex>
                ))}
              </VStack>
            </Box>

            {/* Arrow indicator (desktop) */}
            <Flex display={{ base: 'none', md: 'flex' }} align="center" justify="center" flexShrink={0}>
              <Flex w="36px" h="36px" borderRadius="full" bg="gray.100" align="center" justify="center">
                <Box as={FiArrowRight} color="gray.500" boxSize="18px" />
              </Flex>
            </Flex>

            {/* After */}
            <Box
              flex={1} bg="green.50" p={6} borderRadius="xl"
              border="1px solid" borderColor="green.100"
              position="relative" overflow="hidden"
            >
              <Box
                position="absolute" top="-20px" right="-20px" w="100px" h="100px"
                bgGradient="radial(circle, rgba(72, 187, 120, 0.15) 0%, transparent 70%)"
                pointerEvents="none"
              />
              <Text
                fontSize="xs" fontWeight="700" color="green.500" mb={4}
                textTransform="uppercase" letterSpacing="wide" position="relative"
              >
                {t('detail.after')}
              </Text>
              <VStack align="flex-start" spacing={3} position="relative">
                {after.map((item) => (
                  <Flex key={item.metric} justify="space-between" w="full" align="baseline">
                    <Text fontSize="sm" color="gray.600">{item.metric}</Text>
                    <Text fontWeight="800" fontSize="2xl" color="green.600">{item.value}</Text>
                  </Flex>
                ))}
              </VStack>
            </Box>
          </Flex>
        </SectionWrapper>
      )}

      {/* ── 5. Related Playbooks (LIGHT gray) ────────────── */}
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
