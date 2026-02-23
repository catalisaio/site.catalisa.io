# SEO Architecture - Catalisa.io

## Overview

The Catalisa site is a React 19 SPA with pre-rendering via `vite-plugin-prerender`. All SEO tags are managed via DOM manipulation in `useEffect` hooks, captured at build time into static HTML files.

## Components

### `SEOHead` (`src/seo/SEOHead.tsx`)
Manages all meta tags in `<head>`: title, description, canonical, Open Graph, Twitter Card, and hreflang links. Automatically rendered by `LanguageLayout` based on the current route.

### `JsonLd` (`src/seo/JsonLd.tsx`)
Injects `<script type="application/ld+json">` structured data. Rendered by `LanguageLayout` for Organization/WebSite/SoftwareApplication schemas per route config.

### `Breadcrumbs` (`src/seo/Breadcrumbs.tsx`)
Visual breadcrumb navigation + BreadcrumbList JSON-LD schema. Add to individual pages as needed.

### Routes Registry (`src/seo/routes.ts`)
Single source of truth for all routes with SEO metadata (priority, changefreq, schemas, pageKey, ogImage). Used by SEOHead, LanguageLayout, and the sitemap generator.

## Schemas (`src/seo/schemas/`)

| File | Schema | Used on |
|------|--------|---------|
| `organization.ts` | Organization | All pages |
| `website.ts` | WebSite | Home |
| `software.ts` | SoftwareApplication | Home + product pages |
| `breadcrumb.ts` | BreadcrumbList | All except Home |
| `video.ts` | VideoObject | Demo page |

## i18n SEO Content

Translation files: `src/i18n/locales/{pt-BR,en-US}/seo.json`

Each page key has: `title` (50-60 chars), `description` (130-155 chars), `keywords`

## Adding SEO to a New Page

1. Add route to `src/seo/routes.ts` with all metadata fields
2. Add route to `src/i18n/useLocalizedPath.ts` (ptToEn map)
3. Add SEO content to both `seo.json` files (pt-BR and en-US)
4. Add route to `scripts/generate-sitemap.ts`
5. Add route to `vite.config.ts` allRoutes array
6. Optionally add `<Breadcrumbs>` to the page component
7. Optionally add page-specific JSON-LD (e.g., VideoObject for video pages)

## Analytics (GTM + Data Layer)

All analytics go through `window.dataLayer.push()` in `src/hooks/useAnalytics.ts`.
GTM container `GT-5TW4R7FV` handles routing events to GA4 (`G-JYJWH17ZVX`).

Key Events (Conversions):
- `cta_click` with `cta_type: 'whatsapp'` - Lead initiates WhatsApp contact
- `cta_click` with `cta_type: 'demo'` - Demo interest
- `deep_engagement` (5+ pages) - Highly engaged user
- `video_complete` - Watched full demo

## Cookie Consent (LGPD)

`CookieConsent` component in `src/components/shared/CookieConsent.tsx`.
Uses Google Consent Mode v2. Analytics storage denied by default until user accepts.

## Validation Checklist

- [ ] Lighthouse SEO audit - Target score 100
- [ ] Google Rich Results Test - Validate JSON-LD per URL
- [ ] Facebook Sharing Debugger - Verify OG tags
- [ ] LinkedIn Post Inspector - Verify B2B preview
- [ ] Google Search Console - Submit sitemap, verify indexing
- [ ] GA4 DebugView - Verify Data Layer events
- [ ] GTM Preview Mode - Validate tags firing
- [ ] Core Web Vitals - PageSpeed Insights per page
- [ ] View-source pre-rendered pages - Confirm full HTML
