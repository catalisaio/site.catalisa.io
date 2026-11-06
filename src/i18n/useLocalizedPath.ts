import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { ptToEn } from './route-paths';

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
