import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HreflangMeta } from '../shared/HreflangMeta';

interface LanguageLayoutProps {
  lang: 'pt-BR' | 'en-US';
}

export function LanguageLayout({ lang }: LanguageLayoutProps) {
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang === 'en-US' ? 'en' : 'pt-BR';
  }, [lang, i18n]);

  return (
    <>
      <HreflangMeta />
      <Outlet />
    </>
  );
}
