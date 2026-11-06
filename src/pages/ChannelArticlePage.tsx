import { useMemo } from 'react';
import { Box, Container, Heading, Link, ListItem, OrderedList, Text, UnorderedList } from '@chakra-ui/react';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../seo/SEOHead';
import { JsonLd } from '../seo/JsonLd';
import { getBreadcrumbSchema } from '../seo/schemas/breadcrumb';
import { getChannelArticleSchema } from '../seo/schemas/channelArticle';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { ChannelCitations } from '../components/articles/ChannelCitations';
import {
  articleLocale,
  articleReadingMinutes,
  getChannelArticleBySlug,
  isPublishedChannelUrl,
} from '../data/channelArticles';

export function ChannelArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation('articles');
  const { t: tSeo } = useTranslation('seo');
  const lp = useLocalizedPath();
  const locale = articleLocale(i18n.language);
  const article = getChannelArticleBySlug(slug);

  const schemas = useMemo(() => {
    if (!article) return [];
    return [
      getChannelArticleSchema(article, locale),
      getBreadcrumbSchema([
        { name: tSeo('breadcrumbs.home'), path: lp('/') },
        { name: t('index.title'), path: lp('/artigos') },
        { name: article.title[locale], path: lp(`/artigos/${article.slug}`) },
      ]),
    ];
  }, [article, locale, t, tSeo, lp]);

  if (!article) {
    return <Navigate to={lp('/artigos')} replace />;
  }

  const perspective = article.relatedPerspective;
  const perspectiveUrl = perspective && isPublishedChannelUrl(perspective.url[locale])
    ? perspective.url[locale]
    : undefined;
  const published = new Date(`${article.date}T12:00:00-03:00`).toLocaleDateString(
    locale === 'en' ? 'en-US' : 'pt-BR',
    { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' },
  );

  return (
    <>
      <SEOHead
        pageKey="artigos"
        title={article.metaTitle[locale]}
        description={article.metaDescription[locale]}
        keywords={article.keywords[locale].join(', ')}
        article={{
          publishedTime: `${article.date}T00:00:00-03:00`,
          modifiedTime: `${article.date}T00:00:00-03:00`,
          author: 'Catalisa',
          section: article.series[locale],
          tags: article.keywords[locale],
        }}
      />
      <JsonLd data={schemas} />

      <Box as="article" bg="white" pb={{ base: 12, md: 20 }}>
        <Container maxW="760px" pt={{ base: 10, md: 16 }}>
          <Text fontSize="sm" color="gray.500" mb={6}>
            <Link as={RouterLink} to={lp('/artigos')} color="brand.700" fontWeight="600">
              {t('index.title')}
            </Link>
          </Text>
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.16em"
            textTransform="uppercase"
            color="brand.600"
            mb={3}
          >
            {article.series[locale]} · {t('article.episode', { n: article.episode })}
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: '3xl', md: '5xl' }}
            fontWeight="800"
            color="gray.900"
            letterSpacing="-0.03em"
            lineHeight="1.05"
          >
            {article.title[locale]}
          </Heading>
          <Text mt={5} fontSize={{ base: 'lg', md: 'xl' }} color="gray.600" lineHeight="1.6">
            {article.excerpt[locale]}
          </Text>
          <Text mt={4} fontSize="sm" color="gray.500">
            {published}
            {' · '}
            {t('article.readingTime', { min: articleReadingMinutes(article, locale) })}
          </Text>

          <Box mt={{ base: 8, md: 12 }}>
            {article.body[locale].map((block, index) => {
              if (block.type === 'heading') {
                return (
                  <Heading
                    key={index}
                    as="h2"
                    fontSize={{ base: 'xl', md: '2xl' }}
                    fontWeight="700"
                    color="gray.900"
                    letterSpacing="-0.02em"
                    mt={10}
                    mb={3}
                  >
                    {block.text}
                  </Heading>
                );
              }
              if (block.type === 'list') {
                const List = block.items.length > 1 ? OrderedList : UnorderedList;
                return (
                  <List key={index} spacing={3} pl={1} my={5} color="gray.700">
                    {block.items.map((item) => (
                      <ListItem key={item} fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.75">
                        {item}
                      </ListItem>
                    ))}
                  </List>
                );
              }
              if (block.type === 'note') {
                return (
                  <Text key={index} fontSize="sm" color="gray.500" fontStyle="italic" mt={2}>
                    {block.text}
                  </Text>
                );
              }
              return (
                <Text key={index} fontSize={{ base: 'md', md: 'lg' }} color="gray.700" lineHeight="1.8" mt={4}>
                  {block.text}
                </Text>
              );
            })}
          </Box>

          {perspective && perspectiveUrl && (
            <Box
              mt={12}
              pt={8}
              borderTop="1px solid"
              borderColor="gray.200"
            >
              <Text
                fontSize="xs"
                fontWeight="700"
                letterSpacing="0.14em"
                textTransform="uppercase"
                color="gray.500"
                mb={2}
              >
                {t('article.relatedTitle')}
              </Text>
              <Heading as="h2" fontSize="xl" fontWeight="700" color="gray.900" mb={2}>
                {perspective.title[locale]}
              </Heading>
              <Text color="gray.600" lineHeight="1.7" mb={3}>
                {t('article.relatedLead')}
              </Text>
              <Link href={perspectiveUrl} isExternal rel="noopener noreferrer" color="brand.700" fontWeight="700">
                {t('article.relatedCta')}
              </Link>
            </Box>
          )}

          <Box mt={10}>
            <ChannelCitations channels={article.channels} />
          </Box>
        </Container>
      </Box>
    </>
  );
}
