import{useSiteLocation as useLocation}from"./i18n/navigation";
import {t as __siteT} from "./i18n/runtime";
import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { SiteFooter, SiteHeader } from './components';
import { PreviewMeta } from './PreviewMeta';

export function RedesignFrame({ title, paused = false, children }: { title: string; paused?: boolean; children: ReactNode }) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      let target: string;
      try { target = decodeURIComponent(hash.slice(1)); } catch { return; }
      document.getElementById(target)?.scrollIntoView({ behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);
  return <div className={`c-site${paused ? ' c-scene-paused' : ''}`}><PreviewMeta title={title} /><SiteHeader /><main id="c-main" tabIndex={-1} data-clarity-mask={['/contato','/lab'].includes(pathname.replace(/\/+$/,''))?'true':undefined}>{children}</main><SiteFooter /></div>;
}

export function MotionControl({ paused, toggle }: { paused: boolean; toggle: () => void }) {
  return <div className="c-wrap c-foundation-motion"><button aria-pressed={paused} onClick={toggle}>{paused ? __siteT("Retomar movimento") : __siteT("Pausar movimento")}</button></div>;
}
