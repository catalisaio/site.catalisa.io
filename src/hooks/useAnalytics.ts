import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getTrackingContext } from '../lib/presentationTracking';
import { classifyPageType, resolveFunnelStages } from '../lib/funnelDefinitions';

// ---- Data Layer type helper ----
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (method: string, ...args: unknown[]) => void;
  }
}

/**
 * Push an event to the GTM Data Layer.
 * Automatically enriches with invite context when a tracking session is active.
 */
function pushEvent(event: string, params: Record<string, unknown> = {}) {
  const ctx = getTrackingContext();
  const enriched = ctx.sessionId
    ? {
        invite_code: ctx.inviteCode,
        recipient_name: ctx.recipientName,
        recipient_company: ctx.recipientCompany,
        deck: ctx.deck,
        ...params,
      }
    : params;
  window.dataLayer?.push({ event, ...enriched });
}

// =============================================
//  SITE ENGAGEMENT TRACKING
// =============================================

// ---- 1. Page views on route change ----
export function usePageViewTracking() {
  const location = useLocation();

  useEffect(() => {
    pushEvent('page_view', {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);
}

// ---- 2. Scroll depth tracking ----
export function useScrollDepthTracking() {
  const location = useLocation();
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    firedRef.current = new Set();
  }, [location.pathname]);

  useEffect(() => {
    const thresholds = [25, 50, 75, 100];

    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);

      for (const t of thresholds) {
        if (percent >= t && !firedRef.current.has(t)) {
          firedRef.current.add(t);
          pushEvent('scroll_depth', {
            percent: t,
            page_path: location.pathname,
          });
        }
      }
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [location.pathname]);
}

// ---- 3. CTA click tracking ----
export function useCtaClickTracking(onWhatsAppClick?: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('a, button');
      if (!el) return;

      const href = el.getAttribute('href') || '';
      const text = (el.textContent || '').trim().slice(0, 50);

      // Detect if click is inside a hero
      const heroEl = (el as HTMLElement).closest('[data-hero-id]');
      const heroId = heroEl?.getAttribute('data-hero-id') || undefined;

      // WhatsApp CTA (Key Event / Conversion)
      if (href.includes('wa.me')) {
        pushEvent('cta_click', {
          cta_type: 'whatsapp',
          cta_text: text,
          page_path: window.location.pathname,
          hero_id: heroId,
        });
        if (heroId) {
          pushEvent('hero_cta_click', {
            hero_id: heroId,
            cta_type: 'whatsapp',
            cta_text: text,
          });
        }
        onWhatsAppClick?.();
        return;
      }

      // External links
      if (href.startsWith('http') && !href.includes(window.location.hostname)) {
        pushEvent('outbound_click', {
          url: href,
          link_text: text,
          page_path: window.location.pathname,
        });
        return;
      }

      // Internal navigation CTAs (buttons with specific keywords)
      const isNavCta = el.tagName === 'BUTTON' || el.getAttribute('role') === 'button';
      if (isNavCta && text) {
        pushEvent('cta_click', {
          cta_type: 'internal',
          cta_text: text,
          page_path: window.location.pathname,
          hero_id: heroId,
        });
        if (heroId) {
          pushEvent('hero_cta_click', {
            hero_id: heroId,
            cta_type: 'internal',
            cta_text: text,
          });
        }
      }
    };

    document.addEventListener('click', handler, { passive: true });
    return () => document.removeEventListener('click', handler);
  }, [onWhatsAppClick]);
}

// ---- 4. Section visibility + dwell time ----
export function useSectionEngagementTracking() {
  const location = useLocation();
  const timersRef = useRef<Map<string, number>>(new Map());
  const visibleRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Flush any active section timers on route change
    for (const [id, start] of timersRef.current) {
      const seconds = Math.round((Date.now() - start) / 1000);
      if (seconds > 2) {
        pushEvent('section_engagement', {
          section_id: id,
          seconds,
          page_path: location.pathname,
        });
      }
    }
    timersRef.current = new Map();
    visibleRef.current = new Set();
  }, [location.pathname]);

  useEffect(() => {
    const sections = document.querySelectorAll('[id]');
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            // Section entered viewport
            if (!visibleRef.current.has(id)) {
              visibleRef.current.add(id);
              pushEvent('section_view', {
                section_id: id,
                page_path: location.pathname,
              });
            }
            if (!timersRef.current.has(id)) {
              timersRef.current.set(id, Date.now());
            }
          } else {
            // Section left viewport — fire engagement
            const start = timersRef.current.get(id);
            if (start) {
              const seconds = Math.round((Date.now() - start) / 1000);
              if (seconds > 2) {
                pushEvent('section_engagement', {
                  section_id: id,
                  seconds,
                  page_path: location.pathname,
                });
              }
              timersRef.current.delete(id);
            }
          }
        }
      },
      { threshold: 0.3 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [location.pathname]);
}

// ---- 5. Time on page ----
export function useTimeOnPageTracking() {
  const location = useLocation();
  const startRef = useRef(Date.now());

  useEffect(() => {
    const prevStart = startRef.current;
    startRef.current = Date.now();

    return () => {
      const seconds = Math.round((Date.now() - prevStart) / 1000);
      if (seconds > 2) {
        pushEvent('time_on_page', {
          seconds,
          page_path: location.pathname,
        });
      }
    };
  }, [location.pathname]);
}

// ---- 6. Active attention (tab visible vs hidden) ----
export function useAttentionTracking() {
  const location = useLocation();
  const hiddenAtRef = useRef<number | null>(null);

  useEffect(() => {
    const handler = () => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now();
      } else if (hiddenAtRef.current) {
        const awaySeconds = Math.round((Date.now() - hiddenAtRef.current) / 1000);
        hiddenAtRef.current = null;
        if (awaySeconds > 3) {
          pushEvent('tab_return', {
            away_seconds: awaySeconds,
            page_path: location.pathname,
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [location.pathname]);
}

// ---- 7. Video engagement ----
export function useVideoTracking() {
  const location = useLocation();

  useEffect(() => {
    const tracked = new WeakSet<HTMLVideoElement>();

    const setup = () => {
      const videos = document.querySelectorAll('video');
      videos.forEach((video) => {
        if (tracked.has(video)) return;
        tracked.add(video);

        const src = video.currentSrc || video.querySelector('source')?.src || 'unknown';
        const label = src.split('/').pop() || src;

        video.addEventListener('play', () => {
          pushEvent('video_play', {
            video_src: label,
            page_path: location.pathname,
          });
        });

        video.addEventListener('pause', () => {
          const pct = video.duration ? Math.round((video.currentTime / video.duration) * 100) : 0;
          pushEvent('video_pause', {
            video_src: label,
            percent_watched: pct,
            current_time: Math.round(video.currentTime),
            page_path: location.pathname,
          });
        });

        video.addEventListener('ended', () => {
          pushEvent('video_complete', {
            video_src: label,
            duration: Math.round(video.duration),
            page_path: location.pathname,
          });
        });

        // Milestone tracking (25/50/75%)
        const milestones = new Set<number>();
        video.addEventListener('timeupdate', () => {
          if (!video.duration) return;
          const pct = Math.round((video.currentTime / video.duration) * 100);
          for (const m of [25, 50, 75]) {
            if (pct >= m && !milestones.has(m)) {
              milestones.add(m);
              pushEvent('video_progress', {
                video_src: label,
                milestone: m,
                page_path: location.pathname,
              });
            }
          }
        });
      });
    };

    // Run on mount and observe DOM for lazy-loaded videos
    setup();
    const observer = new MutationObserver(setup);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [location.pathname]);
}

// ---- 8. Language & device context (User Properties via Data Layer) ----
export function useSessionContext() {
  useEffect(() => {
    const lang = document.documentElement.lang || navigator.language;
    const isMobile = window.innerWidth <= 768;
    const entryPath = window.location.pathname;
    const entryPageType = classifyPageType(entryPath);
    const firstHero = document.querySelector('[data-hero-id]');
    const entryHeroId = firstHero?.getAttribute('data-hero-id') || undefined;

    // Push user properties to Data Layer for GTM to set as GA4 User Properties
    pushEvent('user_properties_set', {
      user_properties: {
        language: lang,
        device_type: isMobile ? 'mobile' : 'desktop',
        entry_page: entryPath,
        entry_page_type: entryPageType,
        entry_hero_id: entryHeroId,
        referrer_source: document.referrer || 'direct',
      },
    });
  }, []);
}

// ---- 9. Navigation path tracking (funnel) ----
export function useNavigationPathTracking() {
  const location = useLocation();
  const historyRef = useRef<string[]>([]);

  useEffect(() => {
    historyRef.current.push(location.pathname);

    // Fire at meaningful depth (3+ pages = engaged user)
    if (historyRef.current.length === 3) {
      pushEvent('engaged_session', {
        pages_viewed: 3,
        path: historyRef.current.join(' > '),
      });
    }

    if (historyRef.current.length === 5) {
      pushEvent('deep_engagement', {
        pages_viewed: 5,
        path: historyRef.current.join(' > '),
      });
    }
  }, [location.pathname]);
}

// =============================================
//  PRESENTATION SLIDE TRACKING
// =============================================

// ---- 10. Slide view & engagement ----
export function useSlideTracking() {
  const trackSlide = useCallback((slideIndex: number, totalSlides: number, slideName?: string) => {
    pushEvent('slide_view', {
      slide_index: slideIndex,
      slide_name: slideName || `slide_${slideIndex}`,
      total_slides: totalSlides,
      progress: Math.round((slideIndex / (totalSlides - 1)) * 100),
    });
  }, []);

  const trackSlideEngagement = useCallback((slideIndex: number, seconds: number) => {
    if (seconds > 2) {
      pushEvent('slide_engagement', {
        slide_index: slideIndex,
        seconds,
      });
    }
  }, []);

  return { trackSlide, trackSlideEngagement };
}

// =============================================
//  HERO OBSERVABILITY
// =============================================

// ---- 11. Hero view & engagement tracking ----
export function useHeroTracking() {
  const location = useLocation();
  const timersRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    // Flush timers on route change
    for (const [heroId, start] of timersRef.current) {
      const seconds = Math.round((Date.now() - start) / 1000);
      if (seconds > 1) {
        pushEvent('hero_engagement', {
          hero_id: heroId,
          seconds,
          scroll_past: true,
          page_path: location.pathname,
        });
      }
    }
    timersRef.current = new Map();
  }, [location.pathname]);

  useEffect(() => {
    const heroes = document.querySelectorAll('[data-hero-id]');
    if (heroes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const heroId = (entry.target as HTMLElement).dataset.heroId;
          if (!heroId) continue;

          if (entry.isIntersecting) {
            if (!timersRef.current.has(heroId)) {
              timersRef.current.set(heroId, Date.now());
              pushEvent('hero_view', {
                hero_id: heroId,
                page_path: location.pathname,
              });
            }
          } else {
            const start = timersRef.current.get(heroId);
            if (start) {
              const seconds = Math.round((Date.now() - start) / 1000);
              if (seconds > 1) {
                pushEvent('hero_engagement', {
                  hero_id: heroId,
                  seconds,
                  scroll_past: true,
                  page_path: location.pathname,
                });
              }
              timersRef.current.delete(heroId);
            }
          }
        }
      },
      { threshold: 0.3 },
    );

    heroes.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [location.pathname]);
}

// =============================================
//  FUNNEL TRACKING
// =============================================

// ---- 12. Funnel stage tracking ----
export function useFunnelTracking() {
  const location = useLocation();
  const historyRef = useRef<string[]>([]);
  const firedStagesRef = useRef<Set<string>>(new Set());
  const sessionStartRef = useRef(Date.now());
  const entryPageRef = useRef(window.location.pathname);

  const trackFunnelConversion = useCallback((funnelId: string) => {
    const key = `${funnelId}:conversion`;
    if (firedStagesRef.current.has(key)) return;
    firedStagesRef.current.add(key);

    pushEvent('funnel_conversion', {
      funnel_id: funnelId,
      entry_page: entryPageRef.current,
      total_pages: historyRef.current.length,
      time_to_convert_seconds: Math.round((Date.now() - sessionStartRef.current) / 1000),
    });
  }, []);

  useEffect(() => {
    historyRef.current.push(location.pathname);

    const activeFunnels = resolveFunnelStages(historyRef.current);

    for (const funnel of activeFunnels) {
      const stageKey = `${funnel.funnelId}:${funnel.currentStage}`;
      if (firedStagesRef.current.has(stageKey)) continue;
      firedStagesRef.current.add(stageKey);

      pushEvent('funnel_stage', {
        funnel_id: funnel.funnelId,
        stage: funnel.currentStage,
        stage_index: funnel.stageIndex,
        total_stages: funnel.totalStages,
        entry_page: entryPageRef.current,
        pages_in_session: historyRef.current.length,
      });
    }
  }, [location.pathname]);

  return { trackFunnelConversion };
}

// =============================================
//  CLARITY CUSTOM TAGS
// =============================================

// ---- 13. Clarity tagging ----
export function useClarityTagging() {
  const location = useLocation();
  const sessionDepthRef = useRef(0);
  const entryPageRef = useRef(window.location.pathname);

  useEffect(() => {
    sessionDepthRef.current += 1;

    if (!window.clarity) return;

    const pageType = classifyPageType(location.pathname);
    const isMobile = window.innerWidth <= 768;
    const lang = document.documentElement.lang || navigator.language;
    const hero = document.querySelector('[data-hero-id]');
    const heroId = hero?.getAttribute('data-hero-id') || '';
    const depth = sessionDepthRef.current;

    window.clarity('set', 'page_type', pageType);
    window.clarity('set', 'device_type', isMobile ? 'mobile' : 'desktop');
    window.clarity('set', 'session_depth', String(depth));
    window.clarity('set', 'language', lang);
    window.clarity('set', 'entry_page', entryPageRef.current);
    window.clarity('set', 'entry_page_type', classifyPageType(entryPageRef.current));

    if (heroId) {
      window.clarity('set', 'hero_id', heroId);
    }

    // User intent based on depth
    let intent = 'browsing';
    if (depth >= 5) intent = 'high_intent';
    else if (depth >= 3) intent = 'engaged';
    window.clarity('set', 'user_intent', intent);

    // Active funnels (set after a small delay to allow history to update)
    const history = [entryPageRef.current];
    if (location.pathname !== entryPageRef.current) {
      history.push(location.pathname);
    }
    const activeFunnels = resolveFunnelStages(history);
    if (activeFunnels.length > 0) {
      window.clarity('set', 'active_funnels', activeFunnels.map((f) => f.funnelId).join(','));
      window.clarity('set', 'funnel_stage', activeFunnels.map((f) => `${f.funnelId}:${f.currentStage}`).join(','));
    }
  }, [location.pathname]);
}

// =============================================
//  COMBINED HOOK
// =============================================

export function useAnalytics() {
  usePageViewTracking();
  useScrollDepthTracking();
  useSectionEngagementTracking();
  useTimeOnPageTracking();
  useAttentionTracking();
  useVideoTracking();
  useSessionContext();
  useNavigationPathTracking();
  useHeroTracking();
  useClarityTagging();

  // Funnel tracking with WhatsApp conversion wiring
  const { trackFunnelConversion } = useFunnelTracking();
  const handleWhatsAppClick = useCallback(() => {
    trackFunnelConversion('direct_whatsapp');
    trackFunnelConversion('feature_discovery');
    trackFunnelConversion('industry_path');
    trackFunnelConversion('content_path');
  }, [trackFunnelConversion]);

  useCtaClickTracking(handleWhatsAppClick);
}
