import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHreflangPaths } from '../i18n/useAlternatePath';
import { BASE_URL } from './routes';

interface SEOHeadProps {
  pageKey: string;
  title?: string;
  description?: string;
  ogImage?: string;
  noIndex?: boolean;
}

function setMeta(nameOrProperty: string, content: string) {
  const isOg = nameOrProperty.startsWith('og:') || nameOrProperty.startsWith('twitter:');
  const attr = isOg ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${nameOrProperty}"][data-seo="true"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, nameOrProperty);
    el.setAttribute('data-seo', 'true');
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string, attrs?: Record<string, string>) {
  const extraSelector = attrs
    ? Object.entries(attrs).map(([k, v]) => `[${k}="${v}"]`).join('')
    : '';
  let el = document.querySelector(`link[rel="${rel}"]${extraSelector}[data-seo="true"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (attrs) Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    el.setAttribute('data-seo', 'true');
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Manages all SEO-related tags in <head>: title, meta, canonical, OG, Twitter, hreflang.
 * Uses data-seo="true" attribute for cleanup on unmount.
 */
export function SEOHead({ pageKey, title, description, ogImage, noIndex }: SEOHeadProps) {
  const { t } = useTranslation('seo');
  const { i18n } = useTranslation();
  const { ptBR, enUS } = useHreflangPaths();

  useEffect(() => {
    const lang = i18n.language;
    const currentPath = lang === 'en-US' ? enUS : ptBR;
    const canonicalUrl = `${BASE_URL}${currentPath}`;

    const resolvedTitle = title || t(`${pageKey}.title`);
    const resolvedDescription = description || t(`${pageKey}.description`);
    const resolvedKeywords = t(`${pageKey}.keywords`, { defaultValue: '' });
    const resolvedOgImage = `${BASE_URL}${ogImage || '/og/default.png'}`;

    // Title
    document.title = resolvedTitle;

    // Standard meta
    setMeta('description', resolvedDescription);
    if (resolvedKeywords) {
      setMeta('keywords', resolvedKeywords);
    }

    // Robots
    if (noIndex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      setMeta('robots', 'index, follow');
    }

    // Canonical
    setLink('canonical', canonicalUrl);

    // Open Graph
    setMeta('og:title', resolvedTitle);
    setMeta('og:description', resolvedDescription);
    setMeta('og:image', resolvedOgImage);
    setMeta('og:url', canonicalUrl);
    setMeta('og:type', 'website');
    setMeta('og:locale', lang === 'en-US' ? 'en_US' : 'pt_BR');
    setMeta('og:locale:alternate', lang === 'en-US' ? 'pt_BR' : 'en_US');
    setMeta('og:site_name', 'Catalisa');

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', resolvedTitle);
    setMeta('twitter:description', resolvedDescription);
    setMeta('twitter:image', resolvedOgImage);

    // Hreflang links (absorbing HreflangMeta logic)
    // First remove any old hreflang links (from HreflangMeta or previous render)
    document.querySelectorAll('link[data-hreflang]').forEach((el) => el.remove());

    setLink('alternate', `${BASE_URL}${ptBR}`, { hreflang: 'pt-BR' });
    setLink('alternate', `${BASE_URL}${enUS}`, { hreflang: 'en-US' });
    setLink('alternate', `${BASE_URL}${ptBR}`, { hreflang: 'x-default' });

    return () => {
      document.querySelectorAll('[data-seo="true"]').forEach((el) => el.remove());
    };
  }, [pageKey, title, description, ogImage, noIndex, t, i18n.language, ptBR, enUS]);

  return null;
}
