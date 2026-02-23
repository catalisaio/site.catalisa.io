import { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../../seo/SEOHead';
import { JsonLd } from '../../seo/JsonLd';
import { resolveRoute } from '../../seo/routes';
import { getOrganizationSchema } from '../../seo/schemas/organization';
import { getWebSiteSchema } from '../../seo/schemas/website';
import { getSoftwareApplicationSchema } from '../../seo/schemas/software';

interface LanguageLayoutProps {
  lang: 'pt-BR' | 'en-US';
}

export function LanguageLayout({ lang }: LanguageLayoutProps) {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang === 'en-US' ? 'en' : 'pt-BR';
  }, [lang, i18n]);

  const route = resolveRoute(location.pathname);
  const pageKey = route?.pageKey ?? 'home';
  const noIndex = route?.noIndex;
  const schemas = route?.schemas ?? [];

  const jsonLdData = useMemo(() => {
    const result: Record<string, unknown>[] = [];
    if (schemas.includes('Organization')) {
      result.push(getOrganizationSchema());
    }
    if (schemas.includes('WebSite')) {
      result.push(getWebSiteSchema());
    }
    if (schemas.includes('SoftwareApplication')) {
      result.push(getSoftwareApplicationSchema());
    }
    return result;
  }, [schemas]);

  return (
    <>
      <SEOHead pageKey={pageKey} noIndex={noIndex} />
      {jsonLdData.length > 0 && <JsonLd data={jsonLdData} />}
      <Outlet />
    </>
  );
}
