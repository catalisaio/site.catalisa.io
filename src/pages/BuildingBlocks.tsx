import {
  Box, Heading, Text, VStack, SimpleGrid, HStack, Icon, Badge,
} from '@chakra-ui/react';
import {
  FiCpu, FiMessageCircle, FiUsers, FiDollarSign, FiShield, FiGlobe, FiGitBranch,
  FiDatabase, FiFileText, FiCalendar, FiArrowRight, FiCheck,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useTranslatedCapabilities } from '../i18n/useTranslatedData';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { PageHero } from '../components/shared/PageHero';
import { SectionHeader } from '../components/shared/SectionHeader';
import { PageCTA } from '../components/shared/PageCTA';
import { MotionBox } from '../components/motion';
import { AnimatedCounter } from '../components/shared/AnimatedCounter';
import { categoryBadges } from '../data/capabilityClusters';
import { FinalCTA } from '../components/sections/FinalCTA';
import { useLocalizedPath } from '../i18n/useLocalizedPath';

const iconMap: Record<string, React.ElementType> = {
  FiCpu, FiMessageCircle, FiUsers, FiDollarSign, FiShield, FiGlobe, FiGitBranch,
  FiDatabase, FiFileText, FiCalendar,
};

export function BuildingBlocks() {
  const { t } = useTranslation('building-blocks');
  const { t: tc } = useTranslation('common');
  const lp = useLocalizedPath();
  const { capabilityClusters, businessRecipes } = useTranslatedCapabilities();

  return (
    <>
      {/* Hero */}
      <PageHero
        heroId="hero_building_blocks"
        badge={t('hero.badge')}
        heading={t('hero.heading')}
        headingGradient={t('hero.headingGradient')}
        subtitle={t('hero.subtitle')}
        accentColor="orange"
        gradient="linear(to-r, catalisa.accent, catalisa.secondary)"
        primaryCTA={{ label: tc('cta.letsChat') }}
        secondaryCTA={{ label: tc('cta.seeInAction'), href: '#clusters' }}
        stats={[
          { value: '60+', label: t('summary.capabilities'), numericValue: 60, suffix: '+' },
          { value: '10', label: t('summary.domains'), numericValue: 10 },
          { value: '8', label: t('summary.triggers'), numericValue: 8 },
        ]}
      />

      {/* Cluster Grid */}
      <SectionWrapper id="clusters">
        <SectionHeader
          heading={t('clusters.heading')}
          subtitle={t('clusters.subtitle')}
        />

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 2 }} spacing={6}>
          {capabilityClusters.map((cluster, i) => {
            const ClusterIcon = iconMap[cluster.icon] || FiCpu;
            return (
              <MotionBox
                key={cluster.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.08, 0.6), duration: 0.4 }}
              >
                <Box
                  bg="white"
                  p={6}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  _hover={{ borderColor: `${cluster.color}.300`, boxShadow: 'md', transform: 'translateY(-4px)' }}
                  transition="all 0.2s"
                  h="full"
                >
                  <HStack align="flex-start" spacing={5}>
                    <Box p={3} borderRadius="xl" bg={`${cluster.color}.50`} flexShrink={0}>
                      <Icon as={ClusterIcon} boxSize={6} color={`${cluster.color}.500`} />
                    </Box>
                    <VStack align="flex-start" spacing={3} flex={1}>
                      <Heading as="h3" size="sm" fontWeight="700">{cluster.name}</Heading>
                      <Text color="gray.500" fontSize="sm" lineHeight="1.6">{cluster.description}</Text>
                      <VStack align="flex-start" spacing={1} w="full">
                        {cluster.outcomes.slice(0, 5).map((outcome) => (
                          <HStack key={outcome} spacing={2}>
                            <Icon as={FiCheck} boxSize={3} color={`${cluster.color}.400`} flexShrink={0} />
                            <Text fontSize="xs" color="gray.600">{outcome}</Text>
                          </HStack>
                        ))}
                        {cluster.outcomes.length > 5 && (
                          <Text fontSize="xs" color="gray.400" fontStyle="italic" pl={5}>
                            {t('clusters.andMore')}
                          </Text>
                        )}
                      </VStack>
                    </VStack>
                  </HStack>
                </Box>
              </MotionBox>
            );
          })}
        </SimpleGrid>

        <Box bg="gray.50" p={5} borderRadius="xl" mt={8} textAlign="center" border="1px solid" borderColor="gray.100">
          <Text color="gray.600" fontSize="sm">
            <Text as="span" fontWeight="700" color="gray.700">{t('platform.label')}</Text>{' '}
            {t('platform.description')}
          </Text>
        </Box>
      </SectionWrapper>

      {/* Business Recipes */}
      <SectionWrapper bg="gray.50">
        <SectionHeader
          badge={t('recipes.badge')}
          heading={t('recipes.heading')}
          subtitle={t('recipes.subtitle')}
        />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {businessRecipes.map((recipe, i) => (
            <MotionBox
              key={recipe.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Box
                bg="white"
                p={6}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                h="full"
                _hover={{ borderColor: 'brand.200', boxShadow: 'md', transform: 'translateY(-4px)' }}
                transition="all 0.2s"
              >
                <VStack align="flex-start" spacing={4}>
                  <Heading as="h3" size="sm" fontWeight="700">{recipe.title}</Heading>
                  <Text color="gray.500" fontSize="sm">{recipe.description}</Text>
                  <HStack spacing={2} flexWrap="wrap" pt={1}>
                    {recipe.steps.map((step, si) => (
                      <HStack key={si} spacing={1}>
                        <Badge
                          colorScheme={categoryBadges[step.category]?.color || 'gray'}
                          fontSize="2xs"
                          px={2}
                          py={0.5}
                        >
                          {step.category}
                        </Badge>
                        {si < recipe.steps.length - 1 && (
                          <Icon as={FiArrowRight} color="gray.300" boxSize={3} />
                        )}
                      </HStack>
                    ))}
                  </HStack>
                  <Text fontSize="xs" color="gray.400">
                    {recipe.steps.map(s => s.label).join(' \u2192 ')}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Summary Stats */}
      <SectionWrapper>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} textAlign="center">
          <VStack>
            <AnimatedCounter target={60} suffix="+" fontSize="3xl" fontWeight="800" color="brand.500" />
            <Text color="gray.500" fontSize="sm">{t('summary.capabilities')}</Text>
          </VStack>
          <VStack>
            <AnimatedCounter target={10} fontSize="3xl" fontWeight="800" color="purple.500" />
            <Text color="gray.500" fontSize="sm">{t('summary.domains')}</Text>
          </VStack>
          <VStack>
            <AnimatedCounter target={8} fontSize="3xl" fontWeight="800" color="green.500" />
            <Text color="gray.500" fontSize="sm">{t('summary.triggers')}</Text>
          </VStack>
          <VStack>
            <Text fontSize="3xl" fontWeight="800" color="orange.500">DAG</Text>
            <Text color="gray.500" fontSize="sm">{t('summary.parallelExecution')}</Text>
          </VStack>
        </SimpleGrid>
      </SectionWrapper>

      {/* PageCTA */}
      <PageCTA
        heading={t('clusters.heading')}
        subtitle={t('hero.subtitle')}
        primaryCTA={{ label: tc('cta.letsChat') }}
        secondaryCTA={{ label: tc('cta.seeDemo'), to: lp('/demo') }}
      />

      <FinalCTA />
    </>
  );
}
