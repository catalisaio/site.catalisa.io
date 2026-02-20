import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loadEnUSNamespaces } from '../../i18n';
import { HreflangMeta } from '../shared/HreflangMeta';

interface LanguageLayoutProps {
  lang: 'pt-BR' | 'en-US';
}

export function LanguageLayout({ lang }: LanguageLayoutProps) {
  const { i18n } = useTranslation();
  const loaded = useRef(false);

  useEffect(() => {
    if (lang === 'en-US' && !loaded.current) {
      loaded.current = true;
      loadEnUSNamespaces().then(() => {
        i18n.changeLanguage('en-US');
      });
    } else {
      i18n.changeLanguage(lang);
    }
    document.documentElement.lang = lang === 'en-US' ? 'en' : 'pt-BR';
  }, [lang, i18n]);

  return (
    <>
      <HreflangMeta />
      <Outlet />
    </>
  );
}
