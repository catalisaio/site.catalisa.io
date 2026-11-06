import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { criticalNamespaces } from '../../i18n/critical-namespaces';
import { SEOHead } from '../../seo/SEOHead';
import { JsonLd } from '../../seo/JsonLd';
import { normalizePath, resolveRoute } from '../../seo/routes';
import { getOrganizationSchema } from '../../seo/schemas/organization';
import { getWebSiteSchema } from '../../seo/schemas/website';
import { getSoftwareApplicationSchema } from '../../seo/schemas/software';
import { getSiteNavigationSchema } from '../../seo/schemas/navigation';

interface LanguageLayoutProps {
  lang: 'pt-BR' | 'en-US';
}

export function LanguageLayout({ lang }: LanguageLayoutProps) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [ready, setReady] = useState(() => i18n.language === lang && criticalNamespaces.every(ns => i18n.hasResourceBundle(lang, ns)));

  useEffect(() => {
    let current = true;
    const complete = () => criticalNamespaces.every(ns => i18n.hasResourceBundle(lang, ns));
    if (i18n.language === lang && complete()) { setReady(true); return; }
    setReady(false);
    const load = async () => {
      if (i18n.language !== lang) await i18n.changeLanguage(lang);
      // Explicit loading avoids treating the Portuguese fallback as an English bundle.
      await i18n.loadNamespaces([...criticalNamespaces]);
      if (current) setReady(true);
    };
    void load();
    return () => { current = false; };
  }, [lang, i18n]);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const route = resolveRoute(location.pathname);
  const pageKey = route?.pageKey ?? 'home';
  const pathname = normalizePath(location.pathname);
  const noIndex = route?.noIndex || /^\/(?:en\/)?(?:treinamento|training|apresentacao|presentation)(?:\/|$)/.test(pathname);
  // These pages own their metadata; a second owner can overwrite an article with Home tags.
  const ownsHead = /^\/(?:en\/)?(?:insights(?:\/[^/]+)?|playbooks\/[^/]+)$/.test(pathname);
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
    if (schemas.includes('SiteNavigationElement')) {
      result.push(getSiteNavigationSchema());
    }
    return result;
  }, [schemas]);

  if (!ready) return null;

  return (
    <>
      {!ownsHead && <SEOHead pageKey={pageKey} noIndex={noIndex} />}
      {jsonLdData.length > 0 && <JsonLd data={jsonLdData} />}
      <Outlet />
    </>
  );
}
