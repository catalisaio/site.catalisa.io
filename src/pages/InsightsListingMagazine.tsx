import { useMemo } from 'react';
import {
  Box,
  Container,
  HStack,
  Heading,
  Text,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { SEOHead } from '../seo/SEOHead';
import { JsonLd } from '../seo/JsonLd';
import { getInsightsCollectionSchema } from '../seo/schemas/article';
import { getBreadcrumbSchema } from '../seo/schemas/breadcrumb';
import { PageCTA } from '../components/shared/PageCTA';
import { articles, categoryColors, categoryLabelKeys } from '../data/articles';
import type { ArticleCategory } from '../data/articles';
import { MagazineHeroFeature } from '../components/insights/magazine/MagazineHeroFeature';
import { MagazineEditorsPicksRow } from '../components/insights/magazine/MagazineEditorsPicksRow';
import { MagazineCategorySection } from '../components/insights/magazine/MagazineCategorySection';
import { MagazineLatestGrid } from '../components/insights/magazine/MagazineLatestGrid';

const allCategories: ArticleCategory[] = [
  'varejo',
  'food-tech',
  'atendimento',
  'conversational-commerce',
  'estrategia',
  'financeiro',
];

export function InsightsListingMagazine() {
  const { t } = useTranslation('insights');
  const { t: tSeo } = useTranslation('seo');
  const { t: tCommon } = useTranslation('common');
  const lp = useLocalizedPath();

  // Sort articles by date (most recent first)
  const sorted = useMemo(
    () =>
      [...articles].sort(
        (a, b) =>
          new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
      ),
    [],
  );

  // Article distribution
  const { hero, heroSidebar, editorsPicks, categoryGroups, latest } = useMemo(() => {
    const hero = sorted[0];
    const heroSidebar = sorted.slice(1, 3);

    // Editor's picks: next 3 cases with metrics
    const usedSlugs = new Set([hero.slug, ...heroSidebar.map((a) => a.slug)]);
    const casesWithMetrics = sorted.filter(
      (a) => !usedSlugs.has(a.slug) && a.tier === 'case' && a.metrics.length > 0,
    );
    const editorsPicks = casesWithMetrics.slice(0, 3);
    editorsPicks.forEach((a) => usedSlugs.add(a.slug));

    // Group remaining by category (only categories with 2+ articles)
    const remaining = sorted.filter((a) => !usedSlugs.has(a.slug));
    const grouped: Record<string, typeof remaining> = {};
    for (const a of remaining) {
      if (!grouped[a.category]) grouped[a.category] = [];
      grouped[a.category].push(a);
    }

    const categoryGroups: { category: ArticleCategory; articles: typeof remaining }[] = [];
    const usedInCategories = new Set<string>();
    for (const cat of allCategories) {
      if (grouped[cat] && grouped[cat].length >= 2) {
        categoryGroups.push({ category: cat, articles: grouped[cat] });
        grouped[cat].forEach((a) => usedInCategories.add(a.slug));
      }
    }

    // Latest: everything that's left
    const latest = remaining.filter((a) => !usedInCategories.has(a.slug));

    return { hero, heroSidebar, editorsPicks, categoryGroups, latest };
  }, [sorted]);

  const schemas = useMemo(
    () => [
      getInsightsCollectionSchema(
        t('magazine.title'),
        t('listing.subtitle'),
        articles.map((a) => `/insights/${a.slug}`),
      ),
      getBreadcrumbSchema([
        { name: tSeo('breadcrumbs.home'), path: lp('/') },
        { name: 'Insights', path: lp('/insights') },
      ]),
    ],
    [t, tSeo, lp],
  );

  return (
    <>
      <SEOHead pageKey="insights" />
      <JsonLd data={schemas} />

      {/* 1. Header Editorial Slim */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.100">
        <Container maxW="1280px" py={4}>
          <Flex
            justify="space-between"
            align="center"
            direction={{ base: 'column', md: 'row' }}
            gap={4}
          >
            {/* Logo area */}
            <HStack spacing={3}>
              <Heading as="h1" fontSize="2xl" fontWeight="800" color="gray.900">
                Insights
              </Heading>
              <Badge
                bg="brand.500"
                color="white"
                fontSize="xs"
                px={2.5}
                py={0.5}
                borderRadius="full"
                fontWeight="600"
              >
                Magazine
              </Badge>
            </HStack>

          </Flex>
        </Container>
      </Box>

      {/* Sticky category nav */}
      <Box
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.100"
        position="sticky"
        top="64px"
        zIndex={10}
      >
        <Container maxW="1280px" py={2}>
          <HStack
            spacing={2}
            overflowX="auto"
            pb={1}
            sx={{ '&::-webkit-scrollbar': { display: 'none' } }}
          >
            {allCategories.map((cat) => {
              const color = categoryColors[cat];
              return (
                <HStack
                  key={cat}
                  spacing={2}
                  px={3}
                  py={1.5}
                  borderRadius="full"
                  bg="gray.50"
                  flexShrink={0}
                  fontSize="sm"
                  fontWeight="500"
                  color="gray.600"
                >
                  <Box w={2} h={2} borderRadius="full" bg={`${color}.400`} />
                  <Text>{t(categoryLabelKeys[cat].replace('insights.', ''))}</Text>
                </HStack>
              );
            })}
          </HStack>
        </Container>
      </Box>

      {/* 2. Hero Feature */}
      <Box bg="white">
        <Container maxW="1280px">
          <MagazineHeroFeature hero={hero} sidebar={heroSidebar} />
        </Container>
      </Box>

      {/* 3. Editor's Picks */}
      {editorsPicks.length >= 3 && (
        <MagazineEditorsPicksRow articles={editorsPicks} />
      )}

      {/* 4. Category Sections */}
      {categoryGroups.map(({ category, articles: catArticles }) => (
        <MagazineCategorySection
          key={category}
          category={category}
          articles={catArticles}
        />
      ))}

      {/* 5. Latest Grid */}
      {latest.length > 0 && <MagazineLatestGrid articles={latest} />}

      {/* 6. PageCTA */}
      <PageCTA
        heading={t('listing.pageCTA.heading')}
        subtitle={t('listing.pageCTA.subtitle')}
        primaryCTA={{ label: tCommon('cta.letsChat') }}
        secondaryCTA={{ label: tCommon('cta.seeDemo'), to: lp('/demo') }}
      />
    </>
  );
}
