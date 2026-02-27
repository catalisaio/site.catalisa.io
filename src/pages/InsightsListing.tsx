import { useState, useMemo } from 'react';
import { Box, Container, SimpleGrid, HStack, Button, Badge, Heading, Text, VStack } from '@chakra-ui/react';
import { FiBookOpen } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { SEOHead } from '../seo/SEOHead';
import { JsonLd } from '../seo/JsonLd';
import { Breadcrumbs } from '../seo/Breadcrumbs';
import { getInsightsCollectionSchema } from '../seo/schemas/article';
import { MotionBox, fadeInUp } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { PageCTA } from '../components/shared/PageCTA';
import { ArticleCard } from '../components/insights/ArticleCard';
import { articles, categoryColors, categoryLabelKeys } from '../data/articles';
import type { ArticleCategory } from '../data/articles';

const categories: (ArticleCategory | 'all')[] = [
  'all', 'varejo', 'food-tech', 'atendimento', 'conversational-commerce', 'estrategia',
];

export function InsightsListing() {
  const { t } = useTranslation('insights');
  const { t: tCommon } = useTranslation('common');
  const lp = useLocalizedPath();
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const collectionSchema = useMemo(
    () =>
      getInsightsCollectionSchema(
        t('listing.heading') + ' ' + t('listing.headingGradient'),
        t('listing.subtitle'),
        articles.map((a) => `/insights/${a.slug}`),
      ),
    [t],
  );

  return (
    <>
      <SEOHead pageKey="insights" />
      <JsonLd data={collectionSchema} />
      <Breadcrumbs currentLabel="Insights" currentPtPath="/insights" />

      {/* Hero */}
      <Box
        bgGradient="linear(to-br, gray.900, gray.800)"
        color="white"
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-20%"
          right="-10%"
          w="600px"
          h="600px"
          bg="brand.500"
          opacity={0.05}
          borderRadius="full"
          filter="blur(120px)"
        />
        <Container maxW="1280px" position="relative">
          <MotionBox {...fadeInUp} textAlign="center" maxW="800px" mx="auto">
            <Badge colorScheme="brand" fontSize="xs" mb={4} px={3} py={1} borderRadius="full">
              <HStack spacing={1.5}>
                <FiBookOpen size={12} />
                <span>{t('listing.badge')}</span>
              </HStack>
            </Badge>
            <Heading as="h1" size={{ base: 'xl', md: '2xl' }} fontWeight="800" mb={4}>
              {t('listing.heading')}{' '}
              <GradientText>{t('listing.headingGradient')}</GradientText>
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="whiteAlpha.700" maxW="600px" mx="auto">
              {t('listing.subtitle')}
            </Text>
          </MotionBox>
        </Container>
      </Box>

      {/* Filters */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.100" position="sticky" top="64px" zIndex={10}>
        <Container maxW="1280px" py={3}>
          <HStack spacing={2} overflowX="auto" pb={1} sx={{ '&::-webkit-scrollbar': { display: 'none' } }}>
            {categories.map((cat) => {
              const isActive = cat === activeCategory;
              const colorScheme = cat === 'all' ? 'gray' : categoryColors[cat];
              return (
                <Button
                  key={cat}
                  size="sm"
                  variant={isActive ? 'solid' : 'outline'}
                  colorScheme={isActive ? colorScheme : 'gray'}
                  borderRadius="full"
                  fontWeight={isActive ? '600' : '400'}
                  onClick={() => setActiveCategory(cat)}
                  flexShrink={0}
                >
                  {cat === 'all'
                    ? t('listing.filterAll')
                    : t(categoryLabelKeys[cat].replace('insights.', ''))}
                </Button>
              );
            })}
          </HStack>
        </Container>
      </Box>

      {/* Featured */}
      {featured && (
        <Box bg="white" py={{ base: 8, md: 12 }}>
          <Container maxW="1280px">
            <MotionBox {...fadeInUp}>
              <VStack spacing={1} mb={6} align="flex-start">
                <Badge colorScheme="brand" fontSize="xs" borderRadius="full" px={2}>
                  {t('listing.featured')}
                </Badge>
              </VStack>
            </MotionBox>
            <ArticleCard article={featured} featured />
          </Container>
        </Box>
      )}

      {/* Grid */}
      <Box bg="gray.50" py={{ base: 8, md: 14 }}>
        <Container maxW="1280px">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {rest.map((article, i) => (
              <ArticleCard key={article.slug} article={article} index={i} />
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA */}
      <PageCTA
        heading={t('listing.pageCTA.heading')}
        subtitle={t('listing.pageCTA.subtitle')}
        primaryCTA={{ label: tCommon('cta.letsChat') }}
        secondaryCTA={{ label: tCommon('cta.seeDemo'), to: lp('/demo') }}
      />
    </>
  );
}
