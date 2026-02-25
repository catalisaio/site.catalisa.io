import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box, Heading, Text, VStack, HStack, SimpleGrid, Badge, Button,
  Flex, Container,
} from '@chakra-ui/react';
import { FiArrowLeft, FiMessageCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { PageCTA } from '../components/shared/PageCTA';
import { PlaybookCard } from '../components/playbooks/PlaybookCard';
import { MotionBox } from '../components/motion';
import { playbooks, categoryMeta } from '../data/playbooks';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { categoryBadges } from '../data/capabilityClusters';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20ativar%20um%20playbook%20da%20Catalisa.';

export function PlaybookDetail() {
  const { playbookId } = useParams<{ playbookId: string }>();
  const { t } = useTranslation('playbooks');
  const { t: tc } = useTranslation('common');
  const lp = useLocalizedPath();

  const playbook = useMemo(() => playbooks.find((tpl) => tpl.id === playbookId), [playbookId]);

  const related = useMemo(() => {
    if (!playbook) return [];
    return playbooks
      .filter((tpl) => tpl.id !== playbook.id && tpl.category === playbook.category)
      .slice(0, 3);
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

  const before = playbook.metrics ? t(playbook.metrics.beforeKey, { returnObjects: true }) as { metric: string; value: string }[] : [];
  const after = playbook.metrics ? t(playbook.metrics.afterKey, { returnObjects: true }) as { metric: string; value: string }[] : [];

  return (
    <>
      {/* Hero */}
      <Box bg="hero.bg" pt={28} pb={16} color="white">
        <Container maxW="1280px">
          <Button
            as={Link}
            to={lp('/playbooks')}
            variant="ghost"
            color="whiteAlpha.700"
            _hover={{ color: 'white' }}
            leftIcon={<FiArrowLeft />}
            mb={6}
            size="sm"
          >
            {t('detail.backToTemplates')}
          </Button>

          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <HStack spacing={3} mb={4}>
              <Text fontSize="4xl">{playbook.emoji}</Text>
              <VStack align="flex-start" spacing={1}>
                <Heading as="h1" size="xl" fontWeight="800">
                  {t(playbook.nameKey)}
                </Heading>
                <HStack spacing={2}>
                  <Badge colorScheme={catMeta.color}>{t(catMeta.labelKey)}</Badge>
                  <Badge variant="outline" color="whiteAlpha.700" borderColor="whiteAlpha.300">
                    {t(`industries.${playbook.industry}`)}
                  </Badge>
                </HStack>
              </VStack>
            </HStack>
            <Text color="whiteAlpha.800" fontSize="lg" maxW="700px" lineHeight="tall">
              {t(playbook.descriptionKey)}
            </Text>
          </MotionBox>

          <HStack spacing={4} mt={8}>
            <Button
              as="a"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              bg="brand.500"
              color="white"
              _hover={{ bg: 'brand.600', transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(115, 75, 156, 0.4)' }}
              leftIcon={<FiMessageCircle />}
              transition="all 0.2s"
            >
              {t('detail.cta')}
            </Button>
            <Button
              as="a"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant="outline"
              borderColor="whiteAlpha.400"
              color="white"
              _hover={{ bg: 'whiteAlpha.100' }}
            >
              {t('detail.ctaSecondary')}
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Building Blocks Used */}
      <SectionWrapper>
        <Flex direction={{ base: 'column', lg: 'row' }} gap={10}>
          <VStack align="flex-start" spacing={4} flex={1}>
            <Heading as="h2" size="md" fontWeight="700">
              {t('detail.blocksUsed')}
            </Heading>
            <HStack spacing={2} flexWrap="wrap">
              {playbook.blocks.map((block) => (
                <Badge
                  key={block}
                  px={3}
                  py={1.5}
                  borderRadius="lg"
                  bg="brand.50"
                  color="brand.600"
                  fontSize="sm"
                  fontWeight="500"
                >
                  {block}
                </Badge>
              ))}
            </HStack>
          </VStack>

          {/* Workflow Steps */}
          <Box flex={1}>
            <Heading as="h2" size="md" fontWeight="700" mb={4}>
              {t('detail.workflow')}
            </Heading>
            <Box bg="gray.50" p={5} borderRadius="xl" border="1px solid" borderColor="gray.200">
              <VStack align="stretch" spacing={2}>
                {playbook.workflowSteps.map((step, i) => (
                  <HStack key={i} spacing={3} p={2}>
                    <Box
                      w={6}
                      h={6}
                      borderRadius="full"
                      bg="brand.50"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <Text fontSize="xs" fontWeight="700" color="brand.500">{i + 1}</Text>
                    </Box>
                    <VStack align="flex-start" spacing={0}>
                      <Badge
                        colorScheme={categoryBadges[step.category]?.color || 'gray'}
                        fontSize="2xs"
                      >
                        {step.category}
                      </Badge>
                      <Text fontSize="sm" fontWeight="500">{t(step.labelKey)}</Text>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </Box>
        </Flex>
      </SectionWrapper>

      {/* Metrics Before/After */}
      {Array.isArray(before) && before.length > 0 && (
        <SectionWrapper bg="gray.50">
          <Heading as="h2" size="md" fontWeight="700" textAlign="center" mb={8}>
            {t('detail.results')}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} maxW="700px" mx="auto">
            <Box bg="red.50" p={6} borderRadius="xl">
              <Text fontSize="xs" fontWeight="700" color="red.500" mb={3} textTransform="uppercase">
                {t('detail.before')}
              </Text>
              <VStack align="flex-start" spacing={2}>
                {before.map((item) => (
                  <Text key={item.metric} fontSize="sm" color="gray.600">
                    {item.metric}: <Text as="span" fontWeight="600" color="red.600">{item.value}</Text>
                  </Text>
                ))}
              </VStack>
            </Box>
            <Box bg="green.50" p={6} borderRadius="xl">
              <Text fontSize="xs" fontWeight="700" color="green.500" mb={3} textTransform="uppercase">
                {t('detail.after')}
              </Text>
              <VStack align="flex-start" spacing={2}>
                {after.map((item) => (
                  <Text key={item.metric} fontSize="sm" color="gray.600">
                    {item.metric}: <Text as="span" fontWeight="600" color="green.600">{item.value}</Text>
                  </Text>
                ))}
              </VStack>
            </Box>
          </SimpleGrid>
        </SectionWrapper>
      )}

      {/* Related Playbooks */}
      {related.length > 0 && (
        <SectionWrapper>
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
