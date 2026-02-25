import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Heading, Text, VStack, SimpleGrid,
  Flex, Input, FormControl, FormLabel, Stat, StatLabel, StatNumber,
  StatHelpText, StatArrow, Tabs, TabList, Tab, Icon, Button,
} from '@chakra-ui/react';
import { FiArrowRight, FiDollarSign, FiHome, FiShield, FiShoppingCart, FiZap } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { PageHero } from '../components/shared/PageHero';
import { SectionHeader } from '../components/shared/SectionHeader';
import { PageCTA } from '../components/shared/PageCTA';
import { PlaybookCard } from '../components/playbooks/PlaybookCard';
import { MotionBox } from '../components/motion';
import { playbooks } from '../data/playbooks';
import { useLocalizedPath } from '../i18n/useLocalizedPath';

const industryIcons: Record<string, IconType> = {
  '/fintech': FiDollarSign,
  '/bancario': FiHome,
  '/seguros': FiShield,
  '/varejo': FiShoppingCart,
  '/startups': FiZap,
};

function ScenarioROICalculator({ t }: { t: (key: string) => string }) {
  const [scenario, setScenario] = useState<'sdr' | 'support' | 'realestate'>('sdr');
  const [volume, setVolume] = useState(100);

  const scenarioKeys = ['sdr', 'support', 'realestate'] as const;

  const configs = {
    sdr: { costPerManual: 45, costPerAI: 2 },
    support: { costPerManual: 25, costPerAI: 1 },
    realestate: { costPerManual: 60, costPerAI: 3 },
  };

  const config = configs[scenario];
  const manualCost = volume * 30 * config.costPerManual;
  const aiCost = volume * 30 * config.costPerAI + 800;
  const savings = manualCost - aiCost;

  return (
    <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="lg">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="700" fontSize="md">{t('scenarioRoi.calculatorTitle')}</Text>

        <Tabs variant="unstyled" onChange={(i) => setScenario(scenarioKeys[i])}>
          <TabList gap={2}>
            {scenarioKeys.map((key) => (
              <Tab
                key={key}
                bg={key === scenario ? 'brand.500' : 'gray.100'}
                color={key === scenario ? 'white' : 'gray.600'}
                borderRadius="full" px={3} py={1.5} fontSize="xs" fontWeight="500"
              >
                {t(`scenarioRoi.scenarios.${key}`)}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        <FormControl>
          <FormLabel fontSize="sm">{t('scenarioRoi.interactionsLabel')}</FormLabel>
          <Input type="number" value={volume} onChange={(e) => setVolume(Number(e.target.value) || 0)} focusBorderColor="brand.500" size="sm" />
        </FormControl>

        <SimpleGrid columns={3} spacing={3}>
          <Stat>
            <StatLabel fontSize="2xs">{t('scenarioRoi.manualLabel')}</StatLabel>
            <StatNumber fontSize="md" color="red.500">R$ {Math.round(manualCost).toLocaleString('pt-BR')}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="2xs">{t('scenarioRoi.withAILabel')}</StatLabel>
            <StatNumber fontSize="md" color="green.500">R$ {Math.round(aiCost).toLocaleString('pt-BR')}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="2xs">{t('scenarioRoi.savingsLabel')}</StatLabel>
            <StatNumber fontSize="md" color="brand.500">R$ {Math.round(Math.max(0, savings)).toLocaleString('pt-BR')}</StatNumber>
            <StatHelpText fontSize="2xs">
              <StatArrow type="increase" />
              {manualCost > 0 ? Math.round((savings / manualCost) * 100) : 0}%
            </StatHelpText>
          </Stat>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export function UseCases() {
  const { t } = useTranslation('use-cases');
  const { t: tc } = useTranslation('common');
  const lp = useLocalizedPath();

  const featured = useMemo(() => playbooks.filter((tpl) => tpl.featured).slice(0, 6), []);

  const byFunction = useMemo(() => {
    const categories = ['vendas', 'suporte', 'financeiro', 'onboarding'] as const;
    return categories.map((cat) => ({
      key: cat,
      label: t(`byFunction.${cat}`),
      templates: playbooks.filter((tpl) => tpl.category === cat).slice(0, 4),
    }));
  }, [t]);

  const industryCards = t('industryCards', { returnObjects: true }) as Array<{
    label: string;
    desc: string;
    path: string;
  }>;

  return (
    <>
      {/* Hero */}
      <PageHero
        badge={t('hero.badge')}
        heading={t('hero.heading')}
        headingGradient={t('hero.headingGradient')}
        subtitle={t('hero.subtitle')}
        primaryCTA={{ label: tc('cta.startFree'), href: lp('/playbooks') }}
        secondaryCTA={{ label: tc('cta.seeDemo'), href: lp('/demo') }}
        stats={[
          { label: t('stats.templates'), value: '30+' },
          { label: t('stats.industries'), value: '10' },
          { label: t('stats.blocks'), value: '60+' },
        ]}
        gradient="linear(to-r, cyan.300, brand.400)"
      />

      {/* Featured Templates */}
      <SectionWrapper>
        <SectionHeader
          heading={t('featured.heading')}
          subtitle={t('featured.subtitle')}
        />
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
          {featured.map((tpl, i) => (
            <PlaybookCard key={tpl.id} playbook={tpl} index={i} />
          ))}
        </SimpleGrid>

        <Flex justify="center" mt={8}>
          <Button
            as={Link}
            to={lp('/playbooks')}
            rightIcon={<FiArrowRight />}
            variant="outline"
            colorScheme="brand"
            size="lg"
          >
            {t('byFunction.viewAll')} playbooks
          </Button>
        </Flex>
      </SectionWrapper>

      {/* By Function */}
      {byFunction.map((section, sectionIdx) => (
        <SectionWrapper key={section.key} bg={sectionIdx % 2 === 0 ? 'gray.50' : undefined}>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading as="h2" size="md" fontWeight="700">
              {section.label}
            </Heading>
            <Button
              as={Link}
              to={`${lp('/playbooks')}?category=${section.key}`}
              variant="ghost"
              colorScheme="brand"
              size="sm"
              rightIcon={<FiArrowRight />}
            >
              {t('byFunction.viewAll')}
            </Button>
          </Flex>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
            {section.templates.map((tpl, i) => (
              <PlaybookCard key={tpl.id} playbook={tpl} index={i} />
            ))}
          </SimpleGrid>
        </SectionWrapper>
      ))}

      {/* By Industry */}
      <SectionWrapper>
        <SectionHeader
          heading={t('byIndustry.heading')}
          subtitle={t('byIndustry.subtitle')}
        />
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
          {industryCards.map((card, i) => {
            const IconComponent = industryIcons[card.path] || FiZap;
            return (
              <MotionBox
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <Flex
                  as={Link}
                  to={lp(card.path)}
                  bg="white"
                  p={6}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  _hover={{ borderColor: 'brand.200', boxShadow: 'md', transform: 'translateY(-4px)' }}
                  transition="all 0.2s"
                  gap={4}
                  align="flex-start"
                  role="group"
                >
                  <Icon
                    as={IconComponent}
                    boxSize={6}
                    color="brand.500"
                    _groupHover={{ color: 'brand.600' }}
                    mt="2px"
                  />
                  <Box>
                    <Text fontWeight="700" fontSize="md" _groupHover={{ color: 'brand.600' }}>
                      {card.label}
                    </Text>
                    <Text color="gray.500" fontSize="sm" mt={1}>
                      {card.desc}
                    </Text>
                  </Box>
                </Flex>
              </MotionBox>
            );
          })}
        </SimpleGrid>
      </SectionWrapper>

      {/* ROI Calculator */}
      <SectionWrapper bg="gray.50">
        <Flex direction={{ base: 'column', lg: 'row' }} gap={10} align="center">
          <VStack align="flex-start" spacing={4} flex={1}>
            <Heading as="h2" size="xl" fontWeight="800">
              {t('scenarioRoi.heading')}
            </Heading>
            <Text color="gray.500" lineHeight="1.7">
              {t('scenarioRoi.subtitle')}
            </Text>
          </VStack>
          <Box flex={1} maxW="500px">
            <ScenarioROICalculator t={t} />
          </Box>
        </Flex>
      </SectionWrapper>

      {/* CTA */}
      <PageCTA
        heading={t('cta.heading')}
        subtitle={t('cta.subtitle')}
        primaryCTA={{ label: t('cta.button') }}
        secondaryCTA={{ label: tc('cta.seeDemo'), to: lp('/demo') }}
      />
    </>
  );
}
