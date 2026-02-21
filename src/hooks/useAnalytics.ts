import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// ---- gtag type helper ----
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  window.gtag?.(...args);
}

// =============================================
//  SITE ENGAGEMENT TRACKING
// =============================================

// ---- 1. Page views on route change ----
export function usePageViewTracking() {
  const location = useLocation();

  useEffect(() => {
    gtag('event', 'page_view', {
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
          gtag('event', 'scroll_depth', {
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
export function useCtaClickTracking() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('a, button');
      if (!el) return;

      const href = el.getAttribute('href') || '';
      const text = (el.textContent || '').trim().slice(0, 50);

      // WhatsApp CTA
      if (href.includes('wa.me')) {
        gtag('event', 'cta_click', {
          cta_type: 'whatsapp',
          cta_text: text,
          page_path: window.location.pathname,
        });
        return;
      }

      // External links
      if (href.startsWith('http') && !href.includes(window.location.hostname)) {
        gtag('event', 'outbound_click', {
          url: href,
          link_text: text,
          page_path: window.location.pathname,
        });
        return;
      }

      // Internal navigation CTAs (buttons with specific keywords)
      const isNavCta = el.tagName === 'BUTTON' || el.getAttribute('role') === 'button';
      if (isNavCta && text) {
        gtag('event', 'cta_click', {
          cta_type: 'internal',
          cta_text: text,
          page_path: window.location.pathname,
        });
      }
    };

    document.addEventListener('click', handler, { passive: true });
    return () => document.removeEventListener('click', handler);
  }, []);
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
        gtag('event', 'section_engagement', {
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
              gtag('event', 'section_view', {
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
                gtag('event', 'section_engagement', {
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
        gtag('event', 'time_on_page', {
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
          gtag('event', 'tab_return', {
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
          gtag('event', 'video_play', {
            video_src: label,
            page_path: location.pathname,
          });
        });

        video.addEventListener('pause', () => {
          const pct = video.duration ? Math.round((video.currentTime / video.duration) * 100) : 0;
          gtag('event', 'video_pause', {
            video_src: label,
            percent_watched: pct,
            current_time: Math.round(video.currentTime),
            page_path: location.pathname,
          });
        });

        video.addEventListener('ended', () => {
          gtag('event', 'video_complete', {
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
              gtag('event', 'video_progress', {
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

// ---- 8. Language & device context ----
export function useSessionContext() {
  useEffect(() => {
    const lang = document.documentElement.lang || navigator.language;
    const isMobile = window.innerWidth <= 768;
    const isTouch = 'ontouchstart' in window;

    gtag('event', 'session_context', {
      language: lang,
      device_type: isMobile ? 'mobile' : 'desktop',
      touch_device: isTouch,
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      referrer: document.referrer || 'direct',
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
      gtag('event', 'engaged_session', {
        pages_viewed: 3,
        path: historyRef.current.join(' → '),
      });
    }

    if (historyRef.current.length === 5) {
      gtag('event', 'deep_engagement', {
        pages_viewed: 5,
        path: historyRef.current.join(' → '),
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
    gtag('event', 'slide_view', {
      slide_index: slideIndex,
      slide_name: slideName || `slide_${slideIndex}`,
      total_slides: totalSlides,
      progress: Math.round((slideIndex / (totalSlides - 1)) * 100),
    });
  }, []);

  const trackSlideEngagement = useCallback((slideIndex: number, seconds: number) => {
    if (seconds > 2) {
      gtag('event', 'slide_engagement', {
        slide_index: slideIndex,
        seconds,
      });
    }
  }, []);

  return { trackSlide, trackSlideEngagement };
}

// =============================================
//  COMBINED HOOK
// =============================================

export function useAnalytics() {
  usePageViewTracking();
  useScrollDepthTracking();
  useCtaClickTracking();
  useSectionEngagementTracking();
  useTimeOnPageTracking();
  useAttentionTracking();
  useVideoTracking();
  useSessionContext();
  useNavigationPathTracking();
}
