import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  HStack,
  Button,
  Badge,
  Heading,
  Text,
  VStack,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiTrendingUp, FiZap, FiTarget, FiClock, FiArrowDown } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { SEOHead } from '../seo/SEOHead';
import { JsonLd } from '../seo/JsonLd';
import { getInsightsCollectionSchema } from '../seo/schemas/article';
import { getBreadcrumbSchema } from '../seo/schemas/breadcrumb';
import { MotionBox, fadeInUp } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { PageCTA } from '../components/shared/PageCTA';
import { ArticleCard } from '../components/insights/ArticleCard';
import { articles, categoryColors, categoryLabelKeys } from '../data/articles';
import type { ArticleCategory } from '../data/articles';

const categories: (ArticleCategory | 'all')[] = [
  'all', 'varejo', 'food-tech', 'atendimento', 'conversational-commerce', 'estrategia',
];

const STAT_ICONS = [FiTrendingUp, FiZap, FiTarget, FiClock];

export function InsightsListing() {
  const { t } = useTranslation('insights');
  const { t: tSeo } = useTranslation('seo');
  const { t: tCommon } = useTranslation('common');
  const lp = useLocalizedPath();
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const schemas = useMemo(
    () => [
      getInsightsCollectionSchema(
        t('listing.heading') + ' ' + t('listing.headingGradient'),
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

  const heroStats = [
    { key: 'roi', icon: STAT_ICONS[0] },
    { key: 'conversion', icon: STAT_ICONS[1] },
    { key: 'selfService', icon: STAT_ICONS[2] },
    { key: 'responseTime', icon: STAT_ICONS[3] },
  ];

  return (
    <>
      <SEOHead pageKey="insights" />
      <JsonLd data={schemas} />

      {/* Hero — Light theme, commercial, impactful */}
      <Box
        position="relative"
        overflow="hidden"
        bg="white"
        pt={{ base: 20, md: 28 }}
        pb={{ base: 16, md: 24 }}
      >
        {/* Decorative background elements */}
        <Box
          position="absolute"
          top="-30%"
          right="-15%"
          w="800px"
          h="800px"
          bgGradient="radial(circle, rgba(115, 75, 156, 0.08) 0%, transparent 70%)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-20%"
          left="-10%"
          w="600px"
          h="600px"
          bgGradient="radial(circle, rgba(253, 194, 52, 0.06) 0%, transparent 70%)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          top="20%"
          left="50%"
          w="400px"
          h="400px"
          bgGradient="radial(circle, rgba(37, 211, 102, 0.04) 0%, transparent 70%)"
          pointerEvents="none"
        />

        <Container maxW="1280px" position="relative" zIndex={1}>
          {/* Badge */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            textAlign="center"
          >
            <Badge
              bg="brand.50"
              color="brand.600"
              fontSize="xs"
              px={4}
              py={1.5}
              borderRadius="full"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              {t('listing.badge')}
            </Badge>
          </MotionBox>

          {/* Heading */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            textAlign="center"
            mt={5}
          >
            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight="800"
              lineHeight="1.1"
              color="gray.900"
            >
              {t('listing.heading')}{' '}
              <br />
              <GradientText fontSize="inherit" fontWeight="inherit">
                {t('listing.headingGradient')}
              </GradientText>
            </Heading>
          </MotionBox>

          {/* Subtitle */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            textAlign="center"
            mt={5}
          >
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="gray.500"
              maxW="680px"
              mx="auto"
              lineHeight="1.7"
            >
              {t('listing.subtitle')}
            </Text>
          </MotionBox>

          {/* Stats grid */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            mt={{ base: 10, md: 14 }}
          >
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 4, md: 6 }}>
              {heroStats.map((stat, i) => (
                <MotionBox
                  key={stat.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                >
                  <VStack
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.100"
                    borderRadius="2xl"
                    p={{ base: 5, md: 6 }}
                    spacing={2}
                    textAlign="center"
                    _hover={{
                      borderColor: 'brand.200',
                      bg: 'brand.50',
                      transform: 'translateY(-4px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.3s ease"
                    cursor="default"
                  >
                    <Flex
                      w={10}
                      h={10}
                      borderRadius="xl"
                      bg="brand.100"
                      align="center"
                      justify="center"
                    >
                      <Icon as={stat.icon} color="brand.600" boxSize={5} />
                    </Flex>
                    <Text
                      fontSize={{ base: '2xl', md: '3xl' }}
                      fontWeight="800"
                      bgGradient="linear(to-r, brand.600, brand.400)"
                      bgClip="text"
                      lineHeight="1"
                    >
                      {t(`listing.heroStats.${stat.key}.value`)}
                    </Text>
                    <Text fontSize="xs" color="gray.500" fontWeight="500" lineHeight="1.3">
                      {t(`listing.heroStats.${stat.key}.label`)}
                    </Text>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>

          {/* Scroll hint */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            textAlign="center"
            mt={{ base: 8, md: 12 }}
          >
            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.400" fontWeight="500">
                {t('listing.heroCta')}
              </Text>
              <MotionBox
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon as={FiArrowDown} color="brand.400" boxSize={5} />
              </MotionBox>
            </VStack>
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
