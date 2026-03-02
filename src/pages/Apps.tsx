import {
  Box, SimpleGrid, HStack, Icon, Flex, Badge, VStack, Text, Heading,
} from '@chakra-ui/react';
import {
  FiEdit3, FiCpu, FiSettings, FiServer,
  FiShield, FiGitBranch, FiFileText, FiDollarSign, FiLock, FiGlobe,
  FiUsers, FiDatabase, FiBarChart2, FiLayers, FiKey, FiCode, FiCheckCircle,
  FiGrid, FiArrowRight, FiMessageCircle,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import type { IconType } from 'react-icons';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { PageHero } from '../components/shared/PageHero';
import { SectionHeader } from '../components/shared/SectionHeader';
import { PageCTA } from '../components/shared/PageCTA';
import { FeatureComparisonTable } from '../components/shared/FeatureComparisonTable';
import { MotionBox } from '../components/motion';
import { FinalCTA } from '../components/sections/FinalCTA';
import { useLocalizedPath } from '../i18n/useLocalizedPath';

export function Apps() {
  const { t } = useTranslation('apps');
  const { t: tc } = useTranslation('common');
  const lp = useLocalizedPath();

  const comparisonTable = t('comparison.table', { returnObjects: true }) as {
    columns: { label: string; highlighted?: boolean }[];
    rows: { feature: string; values: string[] }[];
  };

  const howAppsWork = [
    { icon: FiEdit3, color: 'orange.500' },
    { icon: FiCpu, color: 'blue.500' },
    { icon: FiSettings, color: 'purple.500' },
    { icon: FiServer, color: 'green.500' },
  ];

  const appCapabilities = [
    { icon: FiLayers }, { icon: FiShield }, { icon: FiFileText }, { icon: FiCode },
    { icon: FiKey }, { icon: FiGlobe }, { icon: FiLock }, { icon: FiServer },
  ];

  const buildingBlockIcons = [
    FiShield, FiGitBranch, FiFileText, FiDollarSign, FiLock, FiGlobe,
    FiCpu, FiUsers, FiDatabase, FiBarChart2, FiLayers, FiKey,
    FiServer, FiCode, FiCheckCircle, FiGrid, FiShield, FiGitBranch, FiFileText,
  ];

  const realWorldSteps = [
    { color: 'green.500', icon: FiUsers },
    { color: 'blue.500', icon: FiShield },
    { color: 'orange.500', icon: FiBarChart2 },
    { color: 'purple.500', icon: FiCheckCircle },
    { color: 'pink.500', icon: FiFileText },
    { color: 'green.500', icon: FiDollarSign },
  ];

  const synergyExamples = t('synergy.examples', { returnObjects: true }) as {
    title: string;
    agent: string;
    app: string;
    agentIcon: string;
    appIcon: string;
  }[];

  const synergyAgentIcons: Record<string, IconType> = {
    FiMessageCircle, FiUsers, FiCpu,
  };
  const synergyAppIcons: Record<string, IconType> = {
    FiBarChart2, FiShield, FiServer,
  };

  return (
    <>
      {/* Hero */}
      <PageHero
        heroId="hero_apps"
        badge={t('hero.badge')}
        heading={t('hero.heading')}
        headingGradient={t('hero.headingGradient')}
        subtitle={t('hero.subtitle')}
        accentColor="orange"
        primaryCTA={{ label: tc('cta.letsChat') }}
        secondaryCTA={{ label: 'Conhecer Apps', href: '#comparison' }}
        stats={[
          { value: t('hero.stats.blocks.value'), label: t('hero.stats.blocks.label') },
          { value: t('hero.stats.deploy.value'), label: t('hero.stats.deploy.label') },
          { value: t('hero.stats.code.value'), label: t('hero.stats.code.label') },
        ]}
      />

      {/* Comparison Table */}
      <SectionWrapper id="comparison">
        <SectionHeader
          heading={t('comparison.heading')}
          headingGradient={t('comparison.headingGradient')}
          subtitle={t('comparison.subtitle')}
        />

        <Box maxW="900px" mx="auto">
          <FeatureComparisonTable
            columns={comparisonTable.columns}
            rows={comparisonTable.rows.map((r) => ({
              feature: r.feature,
              values: r.values,
            }))}
            accentColor="orange"
          />
        </Box>

        <Box bg="orange.50" p={6} borderRadius="xl" mt={8} textAlign="center">
          <Text color="gray.700" fontSize="md" fontWeight="500">
            <Text as="span" fontWeight="700" color="orange.600">{t('comparison.callout')}</Text>{' '}
            {t('comparison.calloutDesc')}
          </Text>
        </Box>
      </SectionWrapper>

      {/* How Apps Work */}
      <SectionWrapper bg="gray.50">
        <SectionHeader heading={t('howAppsWork.heading')} />

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {howAppsWork.map((item, i) => (
            <MotionBox
              key={i}
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
                h="full"
                _hover={{ borderColor: 'orange.200', transform: 'translateY(-4px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                <VStack align="flex-start" spacing={3}>
                  <Box p={3} borderRadius="lg" bg="orange.50">
                    <Icon as={item.icon} boxSize={6} color={item.color} />
                  </Box>
                  <Heading as="h3" size="sm" fontWeight="700">{t(`howAppsWork.items.${i}.title`)}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.7">{t(`howAppsWork.items.${i}.description`)}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* App Templates */}
      <SectionWrapper>
        <SectionHeader
          heading={t('appTemplates.heading')}
          subtitle={t('appTemplates.subtitle')}
        />

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
          {(t('appTemplates.items', { returnObjects: true }) as {
            name: string;
            category: string;
            description: string;
            blocks: string[];
          }[]).map((template, i) => (
            <MotionBox
              key={template.name}
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
                _hover={{ borderColor: 'orange.200', boxShadow: 'md', transform: 'translateY(-4px)' }}
                transition="all 0.2s"
                h="full"
              >
                <VStack align="flex-start" spacing={3}>
                  <HStack justify="space-between" w="full">
                    <Heading as="h3" size="sm" fontWeight="700">{template.name}</Heading>
                    <Badge colorScheme="orange" fontSize="2xs">{template.category}</Badge>
                  </HStack>
                  <Text color="gray.500" fontSize="sm">{template.description}</Text>
                  <HStack spacing={1} flexWrap="wrap">
                    {template.blocks.map((block) => (
                      <Badge key={block} variant="outline" fontSize="2xs" colorScheme="gray">
                        {block}
                      </Badge>
                    ))}
                  </HStack>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Building Blocks Showcase */}
      <SectionWrapper bg="gray.50">
        <SectionHeader
          badge={t('buildingBlocks.badge')}
          heading={t('buildingBlocks.heading')}
          subtitle={t('buildingBlocks.subtitle')}
        />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {(t('buildingBlocks.items', { returnObjects: true }) as {
            name: string;
            description: string;
            category: string;
          }[]).map((block, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Box
                bg="white"
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ borderColor: 'orange.200', transform: 'translateY(-4px)', boxShadow: 'md' }}
                transition="all 0.2s"
                h="full"
              >
                <VStack align="flex-start" spacing={2}>
                  <HStack justify="space-between" w="full">
                    <HStack spacing={2}>
                      <Icon
                        as={buildingBlockIcons[i % buildingBlockIcons.length]}
                        boxSize={5}
                        color="orange.500"
                      />
                      <Text fontWeight="600" fontSize="sm">{block.name}</Text>
                    </HStack>
                    <Badge colorScheme="orange" fontSize="2xs" variant="subtle">{block.category}</Badge>
                  </HStack>
                  <Text color="gray.400" fontSize="xs">{block.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Real-World Example */}
      <SectionWrapper>
        <SectionHeader heading={t('realWorldExample.heading')} />

        <Flex justify="center" overflow="auto" pb={4}>
          <HStack spacing={3} px={4}>
            {realWorldSteps.map((step, i) => (
              <MotionBox
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
              >
                <HStack spacing={3}>
                  <VStack
                    bg="white"
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.200"
                    minW="130px"
                    spacing={2}
                  >
                    <Icon as={step.icon} boxSize={5} color={step.color} />
                    <Text fontSize="xs" fontWeight="600" textAlign="center">{t(`realWorldExample.steps.${i}`)}</Text>
                  </VStack>
                  {i < 5 && <Icon as={FiArrowRight} color="gray.300" />}
                </HStack>
              </MotionBox>
            ))}
          </HStack>
        </Flex>
      </SectionWrapper>

      {/* Apps + Agents Synergy */}
      <SectionWrapper>
        <SectionHeader
          badge={t('synergy.badge')}
          heading={t('synergy.heading')}
          headingGradient={t('synergy.headingGradient')}
          subtitle={t('synergy.subtitle')}
        />

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
          {synergyExamples.map((example, i) => {
            const AgentIcon = synergyAgentIcons[example.agentIcon] || FiMessageCircle;
            const AppIcon = synergyAppIcons[example.appIcon] || FiServer;
            return (
              <MotionBox
                key={i}
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
                  _hover={{ borderColor: 'orange.200', boxShadow: 'md', transform: 'translateY(-4px)' }}
                  transition="all 0.2s"
                  h="full"
                >
                  <VStack align="flex-start" spacing={4}>
                    <Heading as="h3" size="sm" fontWeight="700">{example.title}</Heading>
                    <HStack spacing={3} align="flex-start" w="full">
                      <VStack
                        bg="purple.50"
                        p={3}
                        borderRadius="lg"
                        flex={1}
                        spacing={2}
                        align="center"
                      >
                        <Icon as={AgentIcon} boxSize={5} color="purple.500" />
                        <Text fontSize="xs" color="gray.600" textAlign="center">{example.agent}</Text>
                      </VStack>
                      <Icon as={FiArrowRight} color="gray.300" mt={4} flexShrink={0} />
                      <VStack
                        bg="orange.50"
                        p={3}
                        borderRadius="lg"
                        flex={1}
                        spacing={2}
                        align="center"
                      >
                        <Icon as={AppIcon} boxSize={5} color="orange.500" />
                        <Text fontSize="xs" color="gray.600" textAlign="center">{example.app}</Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </Box>
              </MotionBox>
            );
          })}
        </SimpleGrid>

        <Box
          borderRadius="xl"
          border="1px solid"
          borderColor="orange.200"
          bg="orange.50"
          p={6}
          textAlign="center"
        >
          <Text color="gray.700" fontSize="md" fontWeight="500">
            {t('synergy.callout')}
          </Text>
        </Box>
      </SectionWrapper>

      {/* App Capabilities */}
      <SectionWrapper bg="gray.50">
        <SectionHeader
          heading={t('capabilities.heading')}
          subtitle={t('capabilities.subtitle')}
        />

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={5}>
          {appCapabilities.map((cap, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Box
                bg="white"
                p={5}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ borderColor: 'orange.200', transform: 'translateY(-4px)', boxShadow: 'md' }}
                transition="all 0.2s"
                textAlign="center"
              >
                <VStack spacing={3}>
                  <Icon as={cap.icon} boxSize={6} color="orange.500" />
                  <Text fontWeight="600" fontSize="sm">{t(`capabilities.items.${i}.label`)}</Text>
                  <Text color="gray.400" fontSize="xs">{t(`capabilities.items.${i}.description`)}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* PageCTA */}
      <PageCTA
        heading={t('pageCTA.heading')}
        subtitle={t('pageCTA.subtitle')}
        primaryCTA={{ label: tc('cta.letsChat') }}
        secondaryCTA={{ label: tc('cta.seeDemo'), to: lp('/demo') }}
      />

      <FinalCTA />
    </>
  );
}
