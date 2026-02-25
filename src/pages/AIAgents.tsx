import {
  Box, SimpleGrid, HStack, Icon, Flex, Badge, VStack, Text, Heading,
} from '@chakra-ui/react';
import {
  FiCpu, FiMessageCircle, FiTool, FiDatabase, FiUsers, FiArrowRight,
  FiMic, FiSmile, FiEdit3, FiGlobe, FiImage, FiFileText,
  FiSearch, FiCalendar, FiGitBranch, FiSettings, FiSend, FiUserPlus,
  FiClipboard, FiBarChart2,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { PageHero } from '../components/shared/PageHero';
import { SectionHeader } from '../components/shared/SectionHeader';
import { PageCTA } from '../components/shared/PageCTA';
import { FeatureComparisonTable } from '../components/shared/FeatureComparisonTable';
import { MotionBox } from '../components/motion';
import { agentTemplates } from '../data/useCases';
import { FinalCTA } from '../components/sections/FinalCTA';
import { useLocalizedPath } from '../i18n/useLocalizedPath';

export function AIAgents() {
  const { t } = useTranslation('ai-agents');
  const { t: tc } = useTranslation('common');
  const lp = useLocalizedPath();

  const comparisonTable = t('comparison.table', { returnObjects: true }) as {
    columns: { label: string; highlighted?: boolean }[];
    rows: { feature: string; values: string[] }[];
  };

  const howAgentsWork = [
    { icon: FiEdit3, color: 'brand.500' },
    { icon: FiTool, color: 'orange.500' },
    { icon: FiMessageCircle, color: 'whatsapp.500' },
    { icon: FiCpu, color: 'blue.500' },
  ];

  const aiCapabilities = [
    { icon: FiSmile }, { icon: FiFileText }, { icon: FiDatabase }, { icon: FiEdit3 },
    { icon: FiGlobe }, { icon: FiTool }, { icon: FiImage }, { icon: FiMic },
  ];

  const toolIcons = [
    FiSearch, FiUserPlus, FiMessageCircle, FiCalendar, FiGitBranch, FiCpu,
    FiSettings, FiSend, FiClipboard, FiBarChart2, FiDatabase, FiGlobe,
  ];
  const toolColors = [
    'orange.500', 'orange.500', 'green.500', 'blue.500', 'blue.500', 'purple.500',
    'gray.500', 'cyan.500', 'pink.500', 'teal.500', 'teal.500', 'cyan.500',
  ];

  return (
    <>
      {/* Hero */}
      <PageHero
        badge={t('hero.badge')}
        heading={t('hero.heading')}
        headingGradient={t('hero.headingGradient')}
        subtitle={t('hero.subtitle')}
        primaryCTA={{ label: tc('cta.letsChat') }}
        secondaryCTA={{ label: tc('cta.knowAIAgents'), href: '#comparison' }}
        stats={[
          { value: t('hero.stats.specialties.value'), label: t('hero.stats.specialties.label') },
          { value: t('hero.stats.uptime.value'), label: t('hero.stats.uptime.label') },
          { value: t('hero.stats.response.value'), label: t('hero.stats.response.label') },
        ]}
      />

      {/* Comparison Table: Chatbot vs Agent vs Team */}
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
          />
        </Box>

        <Box bg="brand.50" p={6} borderRadius="xl" mt={8} textAlign="center">
          <Text color="gray.700" fontSize="md" fontWeight="500">
            <Text as="span" fontWeight="700" color="brand.600">{t('comparison.agentCallout')}</Text>{' '}
            {t('comparison.agentCalloutDesc')}
          </Text>
        </Box>
      </SectionWrapper>

      {/* How Agents Work */}
      <SectionWrapper bg="gray.50">
        <SectionHeader heading={t('howAgentsWork.heading')} />

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {howAgentsWork.map((item, i) => (
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
                _hover={{ borderColor: 'brand.200', transform: 'translateY(-4px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                <VStack align="flex-start" spacing={3}>
                  <Box p={3} borderRadius="lg" bg="brand.50">
                    <Icon as={item.icon} boxSize={6} color={item.color} />
                  </Box>
                  <Heading as="h3" size="sm" fontWeight="700">{t(`howAgentsWork.items.${i}.title`)}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.7">{t(`howAgentsWork.items.${i}.description`)}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Agent Marketplace */}
      <SectionWrapper>
        <SectionHeader
          heading={t('marketplace.heading')}
          subtitle={t('marketplace.subtitle')}
        />

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
          {agentTemplates.map((template, i) => (
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
                _hover={{ borderColor: 'brand.200', boxShadow: 'md', transform: 'translateY(-4px)' }}
                transition="all 0.2s"
                h="full"
              >
                <VStack align="flex-start" spacing={3}>
                  <HStack justify="space-between" w="full">
                    <Heading as="h3" size="sm" fontWeight="700">{template.name}</Heading>
                    <Badge colorScheme="brand" fontSize="2xs">{template.category}</Badge>
                  </HStack>
                  <Text color="gray.500" fontSize="sm">{template.description}</Text>
                  <HStack spacing={1} flexWrap="wrap">
                    {template.tools.map((tool) => (
                      <Badge key={tool} variant="outline" fontSize="2xs" colorScheme="gray">
                        {tool}
                      </Badge>
                    ))}
                  </HStack>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* AI Processing Powers */}
      <SectionWrapper bg="gray.50">
        <SectionHeader
          heading={t('aiCapabilities.heading')}
          subtitle={t('aiCapabilities.subtitle')}
        />

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={5}>
          {aiCapabilities.map((cap, i) => (
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
                _hover={{ borderColor: 'brand.200', transform: 'translateY(-4px)', boxShadow: 'md' }}
                transition="all 0.2s"
                textAlign="center"
              >
                <VStack spacing={3}>
                  <Icon as={cap.icon} boxSize={6} color="brand.500" />
                  <Text fontWeight="600" fontSize="sm">{t(`aiCapabilities.items.${i}.label`)}</Text>
                  <Text color="gray.400" fontSize="xs">{t(`aiCapabilities.items.${i}.description`)}</Text>
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
            {[
              { color: 'green.500', icon: FiMessageCircle },
              { color: 'purple.500', icon: FiMic },
              { color: 'orange.500', icon: FiSmile },
              { color: 'brand.500', icon: FiCpu },
              { color: 'blue.500', icon: FiUsers },
              { color: 'whatsapp.500', icon: FiMessageCircle },
            ].map((step, i) => (
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

      {/* Available Tools Grid */}
      <SectionWrapper bg="gray.50">
        <SectionHeader
          badge={t('toolsGrid.badge')}
          heading={t('toolsGrid.heading')}
          subtitle={t('toolsGrid.subtitle')}
        />

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
          {toolIcons.map((icon, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Box
                bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="gray.100"
                _hover={{ borderColor: toolColors[i], transform: 'translateY(-4px)', boxShadow: 'md' }}
                transition="all 0.2s" h="full"
              >
                <VStack align="flex-start" spacing={2}>
                  <Icon as={icon} boxSize={5} color={toolColors[i]} />
                  <Text fontWeight="600" fontSize="sm">{t(`toolsGrid.items.${i}.title`)}</Text>
                  <Text color="gray.400" fontSize="xs">{t(`toolsGrid.items.${i}.description`)}</Text>
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
