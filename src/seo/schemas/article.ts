import { BASE_URL } from '../routes';
import type { Article } from '../../data/articles';

export function getBlogPostingSchema(article: Article, title: string, description: string, keywords: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
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
    datePublished: `${article.publishedDate}T00:00:00-03:00`,
    dateModified: `${article.updatedDate ?? article.publishedDate}T00:00:00-03:00`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/insights/${article.slug}`,
    },
    image: `${BASE_URL}/og/insights/${article.slug}.png`,
    articleSection: article.category,
    keywords: keywords,
    wordCount: article.readingTime * 200,
    citation: article.sources.map((s) => ({
      '@type': 'CreativeWork',
      name: s.title,
      url: s.url,
    })),
    about: [
      { '@type': 'Thing', name: 'Inteligência Artificial' },
      { '@type': 'Thing', name: 'Conversational AI' },
    ],
  };
}

export function getInsightsCollectionSchema(
  title: string,
  description: string,
  articleUrls: string[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: description,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articleUrls.length,
      itemListElement: articleUrls.map((url, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE_URL}${url}`,
      })),
    },
  };
}
