import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ptToEn } from './useLocalizedPath';

// Reverse map: en-US path -> pt-BR path
const enToPt: Record<string, string> = Object.fromEntries(
  Object.entries(ptToEn).map(([pt, en]) => [en, pt]),
);

/**
 * Returns the equivalent path in the other language.
 * If current is pt-BR, returns en-US path; if en-US, returns pt-BR path.
 */
export function useAlternatePath(): { path: string; lang: string; label: string } {
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;

  if (i18n.language === 'en-US') {
    // Currently en-US, return pt-BR path
    const ptPath = enToPt[currentPath] || currentPath.replace(/^\/en\/?/, '/') || '/';
    return { path: ptPath, lang: 'pt-BR', label: 'PT' };
  }

  // Currently pt-BR, return en-US path
  const enPath = ptToEn[currentPath] || `/en${currentPath}`;
  return { path: enPath, lang: 'en-US', label: 'EN' };
}

/**
 * Returns both language URLs for hreflang tags.
 */
export function useHreflangPaths(): { ptBR: string; enUS: string } {
  const location = useLocation();
  const { i18n } = useTranslation();
  const currentPath = location.pathname;

  if (i18n.language === 'en-US') {
    const ptPath = enToPt[currentPath] || currentPath.replace(/^\/en\/?/, '/') || '/';
    return { ptBR: ptPath, enUS: currentPath };
  }

  const enPath = ptToEn[currentPath] || `/en${currentPath}`;
  return { ptBR: currentPath, enUS: enPath };
}
