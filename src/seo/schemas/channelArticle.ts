import { BASE_URL } from '../routes';
import {
  articlePath,
  articleWordCount,
  publishedChannels,
  type ArticleLocale,
  type ChannelArticle,
} from '../../data/channelArticles';

export function getChannelArticleSchema(article: ChannelArticle, locale: ArticleLocale) {
  const channels = publishedChannels(article);
  const path = articlePath(article.slug, locale);
  const canonical = `${BASE_URL}${path}`;
  const perspective = article.relatedPerspective;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title[locale],
    description: article.metaDescription[locale],
    inLanguage: locale === 'en' ? 'en-US' : 'pt-BR',
    author: {
      '@type': 'Organization',
      name: 'Catalisa',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Catalisa',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/brand/logos/color/logo-color-200h.png`,
      },
    },
    datePublished: `${article.date}T00:00:00-03:00`,
    dateModified: `${article.date}T00:00:00-03:00`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    url: canonical,
    image: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/og/default.png`,
      width: 1200,
      height: 630,
    },
    articleSection: article.series[locale],
    keywords: article.keywords[locale],
    wordCount: articleWordCount(article, locale),
    sameAs: channels.map((channel) => channel.url),
    ...(perspective
      ? {
          citation: [
            {
              '@type': 'Article',
              name: perspective.title[locale],
              url: perspective.url[locale],
            },
          ],
        }
      : {}),
  };
}
