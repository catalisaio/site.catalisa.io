# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing site + presentation platform for **Catalisa**, a WhatsApp AI automation platform. Bilingual (pt-BR default, en-US at `/en/*`). React SPA with Puppeteer-based pre-rendering to static HTML.

## Commands

```bash
npm run dev          # Dev server (Vite, port 5175)
npm run build        # TS compile + Vite build + postbuild (OG images, sitemap, brand zip, pre-render)
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest watch mode
npm run preview      # Preview production build
```

Integration tests for the invite system: `bash scripts/test-integration.sh`

## Tech Stack

- **React 19** + React Router 7 (SPA with pre-rendering)
- **Vite 7** (build) + **TypeScript 5.9**
- **Chakra UI 2** + Emotion (styling) — theme at `src/theme/index.ts` (brand purple `#734B9C`)
- **Framer Motion** (animations)
- **i18next** (i18n) — pt-BR bundled, en-US lazy-loaded
- **Supabase** (auth, real-time DB for invite system)
- **Vitest** + React Testing Library (testing)
- **Puppeteer** (pre-rendering 80+ routes at build time)

## Architecture

### Routing & i18n

- `src/App.tsx` — all routes, lazy-loaded pages with Suspense
- Portuguese routes at root (`/insights`, `/studio`, etc.)
- English routes under `/en/` prefix (`/en/insights`, `/en/studio`, etc.)
- `src/i18n/locales/{pt-BR,en-US}/` — 23 JSON translation namespaces each
- `src/seo/routes.ts` — single source of truth for all route definitions + SEO metadata

### Pages & Components

- `src/pages/` — 32 page components
- `src/components/sections/` — 38 reusable content sections (composed into pages)
- `src/components/layout/` — PageLayout, LanguageLayout, Header, Footer
- `src/components/shared/` — reusable UI (CookieConsent, VideoPlayer, PageHero, etc.)
- `src/components/presentation/` — slide decks, gate, navigation, tracking
- `src/components/insights/` — articles + magazine layout variant

### Data Layer

Large static data files drive much of the content:
- `src/data/articles.ts` — Insights articles with metrics
- `src/data/playbooks.ts` — playbook definitions
- `src/data/actions.ts` — workflow building blocks
- `src/data/useCases.ts` — use case definitions

### Pre-rendering & Hydration

- `scripts/prerender.ts` — Puppeteer captures rendered HTML for all routes
- `src/main.tsx` — detects pre-rendered HTML and hydrates instead of full render
- Pages dispatch `app-rendered` event when ready for capture

### SEO

- `src/seo/` — SEOHead, JsonLd, Breadcrumbs, structured data schemas
- `src/seo/README-SEO.md` — comprehensive SEO architecture documentation
- Sitemap and OG images generated at build time (`scripts/`)

### Analytics

- GTM + GA4 + Microsoft Clarity
- `src/hooks/useAnalytics.ts` — data layer events (`cta_click`, `deep_engagement`, etc.)
- LGPD cookie consent with Google Consent Mode v2
- Clarity has conditional routing (presentations vs main site)

### Code Splitting Strategy (vite.config.ts)

Chunks: vendor (React), chakra (Chakra+Emotion), motion (Framer Motion), i18n, icons, presentation, insights, playbooks — keeps initial bundle small.

## Key Patterns

- All pages are lazy-loaded via `React.lazy()` + dynamic imports
- Presentation system is invite-gated via Supabase (`src/lib/invites.ts`)
- The `src/components/layout/LanguageLayout.tsx` wrapper handles locale detection
- Environment variables in `.env`: Supabase URL/keys, GTM ID (never commit secrets)
- `src/config.ts` handles docs URL with staging detection
