import { describe, expect, it } from 'vitest';
import {
  channelArticles,
  getChannelArticleBySlug,
  isPublishedChannelUrl,
  publishedChannels,
} from './channelArticles';
import { getChannelArticleSchema } from '../seo/schemas/channelArticle';

const REAL_URLS = [
  'https://www.linkedin.com/feed/update/urn:li:activity:7524442037891543041/',
  'https://www.linkedin.com/feed/update/urn:li:share:7524441529097281537/?actorCompanyId=88375615',
  'https://x.com/catalisaio/status/2118678368094744899',
];

describe('published channel URLs', () => {
  it.each(REAL_URLS)('accepts %s', (url) => {
    expect(isPublishedChannelUrl(url)).toBe(true);
  });

  it.each([
    'http://x.com/catalisaio/status/1',
    'https://example.com/post',
    'https://example.org/post',
    'https://localhost/post',
    'https://social.example/placeholder',
    'notaurl',
    '',
    'javascript:alert(1)',
  ])('rejects %s', (url) => {
    expect(isPublishedChannelUrl(url)).toBe(false);
  });
});

describe('episode 1 article', () => {
  const article = getChannelArticleBySlug('construir-por-composicao');

  it('exists as a single thesis, not a copy of each post', () => {
    expect(channelArticles).toHaveLength(1);
    expect(article?.episode).toBe(1);
    expect(article?.title.pt).toBe('Construir por composição');
    expect(article?.series.pt).toBe('Esteira visível');
  });

  it('lists only the three published https URLs', () => {
    expect(article).toBeDefined();
    const urls = publishedChannels(article!).map((channel) => channel.url);
    expect(urls).toEqual(REAL_URLS);
  });

  it('points at the live perspective in each language', () => {
    expect(article?.relatedPerspective?.url.pt).toBe(
      'https://catalisa.io/perspectivas/construir-por-composicao',
    );
    expect(article?.relatedPerspective?.url.en).toBe(
      'https://catalisa.io/en/perspectives/building-by-composition',
    );
  });

  it('puts channel URLs on BlogPosting sameAs and keeps the catalisa canonical', () => {
    const schema = getChannelArticleSchema(article!, 'pt');
    expect(schema.sameAs).toEqual(REAL_URLS);
    expect(schema.mainEntityOfPage).toEqual({
      '@type': 'WebPage',
      '@id': 'https://catalisa.io/artigos/construir-por-composicao',
    });
    expect(schema.url).toBe('https://catalisa.io/artigos/construir-por-composicao');
    expect(schema['@type']).toBe('BlogPosting');
    expect(schema.citation?.[0]?.url).toBe(
      'https://catalisa.io/perspectivas/construir-por-composicao',
    );
  });

  it('drops a placeholder if one is ever added beside real posts', () => {
    const withPlaceholder = {
      ...article!,
      channels: [
        ...article!.channels,
        {
          platform: 'devto',
          label: 'Dev.to',
          voice: 'catalisa' as const,
          url: 'https://dev.to/placeholder/not-published',
          postedAt: '2026-11-06',
        },
      ],
    };
    expect(publishedChannels(withPlaceholder).map((channel) => channel.url)).toEqual(REAL_URLS);
    expect(getChannelArticleSchema(withPlaceholder, 'en').sameAs).toEqual(REAL_URLS);
  });
});
