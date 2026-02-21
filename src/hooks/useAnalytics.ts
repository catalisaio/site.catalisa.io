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

// ---- 4. Section visibility (engagement) ----
export function useSectionVisibilityTracking() {
  const trackedRef = useRef<Set<string>>(new Set());
  const location = useLocation();

  useEffect(() => {
    trackedRef.current = new Set();
  }, [location.pathname]);

  useEffect(() => {
    const sections = document.querySelectorAll('[id]');
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting && !trackedRef.current.has(id)) {
            trackedRef.current.add(id);
            gtag('event', 'section_view', {
              section_id: id,
              page_path: location.pathname,
            });
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
    const prevPath = startRef.current;
    startRef.current = Date.now();

    return () => {
      const seconds = Math.round((Date.now() - prevPath) / 1000);
      if (seconds > 2) {
        gtag('event', 'time_on_page', {
          seconds,
          page_path: location.pathname,
        });
      }
    };
  }, [location.pathname]);
}

// ---- 6. Presentation slide tracking ----
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

// ---- Combined hook for app-level ----
export function useAnalytics() {
  usePageViewTracking();
  useScrollDepthTracking();
  useCtaClickTracking();
  useSectionVisibilityTracking();
  useTimeOnPageTracking();
}
