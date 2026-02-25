import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Heading, Text, VStack, SimpleGrid, Flex, Icon,
} from '@chakra-ui/react';
import { FiDollarSign, FiHome, FiShield, FiShoppingCart, FiZap } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { SectionHeader } from '../components/shared/SectionHeader';
import { PageCTA } from '../components/shared/PageCTA';
import { PlaybookCard } from '../components/playbooks/PlaybookCard';
import { PlaybookFilters } from '../components/playbooks/PlaybookFilters';
import { HeroCarousel } from '../components/casos-de-uso/HeroCarousel';
import { ScenarioROICalculator } from '../components/casos-de-uso/ScenarioROICalculator';
import { MotionBox } from '../components/motion';
import { playbooks } from '../data/playbooks';
import type { PlaybookCategory, PlaybookIndustry, PlaybookType } from '../data/playbooks';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { JsonLd } from '../seo/JsonLd';
import { BASE_URL } from '../seo/routes';

const industryIcons: Record<string, IconType> = {
  '/fintech': FiDollarSign,
  '/bancario': FiHome,
  '/seguros': FiShield,
  '/varejo': FiShoppingCart,
  '/startups': FiZap,
};

export function CasosDeUso() {
  const { t } = useTranslation('casos-de-uso');
  const { t: tc } = useTranslation('common');
  const { t: tp } = useTranslation('playbooks');
  const { t: tSeo } = useTranslation('seo');
  const lp = useLocalizedPath();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PlaybookCategory | 'all'>('all');
  const [industry, setIndustry] = useState<PlaybookIndustry | 'all'>('all');
  const [type, setType] = useState<PlaybookType | 'all'>('all');

  const filtered = useMemo(() => {
    return playbooks.filter((tpl) => {
      if (type !== 'all' && tpl.type !== type) return false;
      if (category !== 'all' && tpl.category !== category) return false;
      if (industry !== 'all' && tpl.industry !== industry) return false;
      if (search) {
        const q = search.toLowerCase();
        const name = tp(tpl.nameKey).toLowerCase();
        const desc = tp(tpl.descriptionKey).toLowerCase();
        if (!name.includes(q) && !desc.includes(q)) return false;
      }
      return true;
    });
  }, [type, category, industry, search, tp]);

  const industryCards = t('industryCards', { returnObjects: true }) as Array<{
    label: string;
    desc: string;
    path: string;
  }>;

  const collectionSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('catalog.heading'),
    description: tSeo('casosDeUso.description'),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: playbooks.length,
      itemListElement: playbooks.map((pb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: tp(pb.nameKey),
        url: `${BASE_URL}/playbooks/${pb.id}`,
      })),
    },
  }), [t, tSeo, tp]);

  return (
    <>
      <JsonLd data={collectionSchema} />

      {/* 1. Hero Carousel — full viewport */}
      <HeroCarousel />

      {/* 2. Catalog with filters */}
      <SectionWrapper bg="gray.50" id="all-playbooks">
        <SectionHeader
          heading={t('catalog.heading')}
          subtitle={t('catalog.subtitle')}
        />
        <PlaybookFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          industry={industry}
          onIndustryChange={setIndustry}
          type={type}
          onTypeChange={setType}
        />

        <Text fontSize="sm" color="gray.500" mb={4} textAlign="center">
          {tp('showing', { count: filtered.length, total: playbooks.length })}
        </Text>

        {filtered.length > 0 ? (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
            <AnimatePresence mode="popLayout">
              {filtered.map((tpl, i) => (
                <PlaybookCard key={tpl.id} playbook={tpl} index={i} />
              ))}
            </AnimatePresence>
          </SimpleGrid>
        ) : (
          <VStack py={16} spacing={3}>
            <Text fontSize="lg" fontWeight="600" color="gray.600">
              {tp('empty.heading')}
            </Text>
            <Text color="gray.500" fontSize="sm">
              {tp('empty.subtitle')}
            </Text>
          </VStack>
        )}
      </SectionWrapper>

      {/* 3. Industry Cards */}
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

      {/* 4. ROI Calculator */}
      <SectionWrapper bg="gray.50">
        <Flex direction={{ base: 'column', lg: 'row' }} gap={10} align="center">
          <VStack align="flex-start" spacing={4} flex={1}>
            <Heading as="h2" size="xl" fontWeight="800">
              {t('roi.heading')}
            </Heading>
            <Text color="gray.500" lineHeight="1.7">
              {t('roi.subtitle')}
            </Text>
          </VStack>
          <Box flex={1} maxW="500px">
            <ScenarioROICalculator t={t} />
          </Box>
        </Flex>
      </SectionWrapper>

      {/* 5. Bottom CTA */}
      <PageCTA
        heading={t('cta.heading')}
        subtitle={t('cta.subtitle')}
        primaryCTA={{ label: t('cta.button') }}
        secondaryCTA={{ label: tc('cta.seeDemo'), to: lp('/demo') }}
      />
    </>
  );
}
