import { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../seo/SEOHead';
import { JsonLd } from '../seo/JsonLd';
import { Breadcrumbs } from '../seo/Breadcrumbs';
import { getBreadcrumbSchema } from '../seo/schemas/breadcrumb';
import { getBlogPostingSchema } from '../seo/schemas/article';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { PageCTA } from '../components/shared/PageCTA';
import { ArticleHero } from '../components/insights/ArticleHero';
import { ArticleMetrics } from '../components/insights/ArticleMetrics';
import { ArticleBody } from '../components/insights/ArticleBody';
import { CatalisaConnection } from '../components/insights/CatalisaConnection';
import { ArticleReferences } from '../components/insights/ArticleReferences';
import { RelatedArticles } from '../components/insights/RelatedArticles';
import { getArticleBySlug } from '../data/articles';

export function InsightArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('insights');
  const { t: tSeo } = useTranslation('seo');
  const lp = useLocalizedPath();

  const article = slug ? getArticleBySlug(slug) : undefined;

  const schemas = useMemo(() => {
    if (!article) return [];

    const title = t(article.metaTitleKey.replace('insights.', ''));
    const description = t(article.metaDescriptionKey.replace('insights.', ''));

    const blogPosting = getBlogPostingSchema(article, title, description, article.keywords);

    const breadcrumbs = getBreadcrumbSchema([
      { name: tSeo('breadcrumbs.home'), path: lp('/') },
      { name: t('article.breadcrumbInsights'), path: lp('/insights') },
      { name: t(article.titleKey.replace('insights.', '')), path: lp(`/insights/${article.slug}`) },
    ]);

    return [blogPosting, breadcrumbs];
  }, [article, t, tSeo, lp]);

  if (!article) {
    return <Navigate to={lp('/insights')} replace />;
  }

  const metaTitle = t(article.metaTitleKey.replace('insights.', ''));
  const metaDescription = t(article.metaDescriptionKey.replace('insights.', ''));

  return (
    <>
      <SEOHead
        pageKey="insights"
        title={metaTitle}
        description={metaDescription}
      />
      <JsonLd data={schemas} />

      {/* Breadcrumbs */}
      <Box pt={2}>
        <Container maxW="780px">
          <Breadcrumbs
            currentLabel={t(article.titleKey.replace('insights.', ''))}
            currentPtPath={`/insights/${article.slug}`}
          />
        </Container>
      </Box>

      <ArticleHero article={article} />
      <ArticleMetrics article={article} />
      <ArticleBody article={article} />
      <CatalisaConnection article={article} />
      <ArticleReferences article={article} />

      <PageCTA
        heading={t('article.ctaHeading')}
        subtitle={t('article.ctaSubtitle')}
        primaryCTA={{ label: t('article.ctaPrimary') }}
        secondaryCTA={{ label: t('article.ctaSecondary'), to: lp('/demo') }}
      />

      <RelatedArticles article={article} />
    </>
  );
}
