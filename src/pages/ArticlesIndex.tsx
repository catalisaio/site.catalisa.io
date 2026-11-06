import { useMemo } from 'react';
import { Badge, Box, Container, Flex, Heading, HStack, LinkBox, LinkOverlay, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../seo/SEOHead';
import { JsonLd } from '../seo/JsonLd';
import { getInsightsCollectionSchema } from '../seo/schemas/article';
import { getBreadcrumbSchema } from '../seo/schemas/breadcrumb';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import {
  articleLocale,
  articlePath,
  articleReadingMinutes,
  channelArticles,
  publishedChannels,
} from '../data/channelArticles';
import seoPt from '../i18n/locales/pt-BR/seo.json';
import seoEn from '../i18n/locales/en-US/seo.json';

export function ArticlesIndex() {
  const { t, i18n } = useTranslation('articles');
  const { t: tSeo } = useTranslation('seo');
  const lp = useLocalizedPath();
  const locale = articleLocale(i18n.language);
  const indexSeo = locale === 'en' ? seoEn.artigos : seoPt.artigos;

  const sorted = useMemo(
    () => [...channelArticles].sort((a, b) => b.date.localeCompare(a.date)),
    [],
  );

  const schemas = useMemo(
    () => [
      getInsightsCollectionSchema(
        tSeo('artigos.title'),
        tSeo('artigos.description'),
        sorted.map((article) => articlePath(article.slug, 'pt')),
      ),
      getBreadcrumbSchema([
        { name: tSeo('breadcrumbs.home'), path: lp('/') },
        { name: t('index.title'), path: lp('/artigos') },
      ]),
    ],
    [sorted, t, tSeo, lp],
  );

  return (
    <>
      <SEOHead
        pageKey="artigos"
        title={indexSeo.title}
        description={indexSeo.description}
        keywords={indexSeo.keywords}
      />
      <JsonLd data={schemas} />

      <Box bg="white" borderBottom="1px solid" borderColor="gray.100">
        <Container maxW="900px" py={{ base: 10, md: 14 }}>
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.18em"
            textTransform="uppercase"
            color="brand.600"
            mb={3}
          >
            {t('index.kicker')}
          </Text>
          <Heading as="h1" fontSize={{ base: '3xl', md: '5xl' }} fontWeight="800" color="gray.900" letterSpacing="-0.03em" lineHeight="1">
            {t('index.title')}
          </Heading>
          <Text mt={4} fontSize={{ base: 'md', md: 'lg' }} color="gray.600" maxW="640px" lineHeight="1.7">
            {t('index.subtitle')}
          </Text>
        </Container>
      </Box>

      <Box bg="gray.50">
        <Container maxW="900px" py={{ base: 8, md: 12 }}>
          {sorted.length === 0 ? (
            <Text color="gray.600">{t('index.empty')}</Text>
          ) : (
            <VStack spacing={4} align="stretch">
              {sorted.map((article) => {
                const channels = publishedChannels(article);
                return (
                  <LinkBox
                    key={article.slug}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="xl"
                    p={{ base: 5, md: 6 }}
                    _hover={{ borderColor: 'brand.200', boxShadow: 'sm' }}
                    transition="border-color 0.15s, box-shadow 0.15s"
                  >
                    <Flex justify="space-between" gap={4} direction={{ base: 'column', sm: 'row' }} mb={3}>
                      <HStack spacing={2} flexWrap="wrap">
                        <Badge colorScheme="purple" borderRadius="full" px={2.5} textTransform="none" fontWeight="600">
                          {article.series[locale]}
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                          {t('article.episode', { n: article.episode })}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500" flexShrink={0}>
                        {new Date(`${article.date}T12:00:00-03:00`).toLocaleDateString(
                          locale === 'en' ? 'en-US' : 'pt-BR',
                          { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' },
                        )}
                        {' · '}
                        {t('article.readingTime', { min: articleReadingMinutes(article, locale) })}
                      </Text>
                    </Flex>
                    <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color="gray.900" letterSpacing="-0.02em" lineHeight="1.2">
                      <LinkOverlay as={Link} to={lp(`/artigos/${article.slug}`)}>
                        {article.title[locale]}
                      </LinkOverlay>
                    </Heading>
                    <Text mt={3} color="gray.700" lineHeight="1.7">
                      {article.thesis[locale]}
                    </Text>
                    {channels.length > 0 && (
                      <HStack mt={4} spacing={2} flexWrap="wrap">
                        <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color="gray.500">
                          {t('index.channels')}
                        </Text>
                        {channels.map((channel) => (
                          <Badge
                            key={`${channel.voice}-${channel.url}`}
                            variant="outline"
                            colorScheme="gray"
                            borderRadius="full"
                            textTransform="none"
                            fontWeight="500"
                          >
                            {channel.label}
                            {' · '}
                            {channel.voice === 'klederson' ? t('article.voiceKlederson') : t('article.voiceCatalisa')}
                          </Badge>
                        ))}
                      </HStack>
                    )}
                  </LinkBox>
                );
              })}
            </VStack>
          )}
        </Container>
      </Box>
    </>
  );
}
