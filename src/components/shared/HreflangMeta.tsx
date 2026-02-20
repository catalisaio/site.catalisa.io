import { useEffect } from 'react';
import { useHreflangPaths } from '../../i18n/useAlternatePath';

const BASE_URL = 'https://catalisa.io';

export function HreflangMeta() {
  const { ptBR, enUS } = useHreflangPaths();

  useEffect(() => {
    // Remove previous hreflang links
    document.querySelectorAll('link[data-hreflang]').forEach((el) => el.remove());

    const ptLink = document.createElement('link');
    ptLink.rel = 'alternate';
    ptLink.hreflang = 'pt-BR';
    ptLink.href = `${BASE_URL}${ptBR}`;
    ptLink.setAttribute('data-hreflang', 'true');

    const enLink = document.createElement('link');
    enLink.rel = 'alternate';
    enLink.hreflang = 'en-US';
    enLink.href = `${BASE_URL}${enUS}`;
    enLink.setAttribute('data-hreflang', 'true');

    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = `${BASE_URL}${ptBR}`;
    defaultLink.setAttribute('data-hreflang', 'true');

    document.head.append(ptLink, enLink, defaultLink);

    return () => {
      document.querySelectorAll('link[data-hreflang]').forEach((el) => el.remove());
    };
  }, [ptBR, enUS]);

  return null;
}
