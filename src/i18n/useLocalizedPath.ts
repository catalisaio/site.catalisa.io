import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Route map: pt-BR path -> en-US path
 * pt-BR paths are the canonical URLs (no prefix).
 * en-US paths are prefixed with /en/.
 */
const ptToEn: Record<string, string> = {
  '/': '/en',
  '/studio': '/en/studio',
  '/ai-agents': '/en/ai-agents',
  '/building-blocks': '/en/building-blocks',
  '/workflows': '/en/workflows',
  '/fintech': '/en/fintech',
  '/bancario': '/en/banking',
  '/seguros': '/en/insurance',
  '/varejo': '/en/retail',
  '/startups': '/en/startups',
  '/use-cases': '/en/use-cases',
  '/contato': '/en/contact',
  '/demo': '/en/demo',
  '/politica-privacidade': '/en/privacy-policy',
};

/**
 * Returns a function that maps a pt-BR path to the correct path for the current language.
 * Usage: const lp = useLocalizedPath(); <Link to={lp('/contato')}>
 */
export function useLocalizedPath() {
  const { i18n } = useTranslation();

  return useCallback(
    (ptBRPath: string): string => {
      if (i18n.language === 'en-US') {
        return ptToEn[ptBRPath] || `/en${ptBRPath}`;
      }
      return ptBRPath;
    },
    [i18n.language],
  );
}

export { ptToEn };
