// =============================================
//  FUNNEL DEFINITIONS — single source of truth
//  for hero registry, funnel stages, and
//  page type classification.
// =============================================

// ---- Hero Registry ----

export type PageType =
  | 'home'
  | 'feature'
  | 'industry'
  | 'content'
  | 'content_article'
  | 'contact'
  | 'demo'
  | 'use_cases'
  | 'presentation'
  | 'legal';

export type FunnelRole = 'entry' | 'discovery' | 'consideration' | 'conversion';

export interface HeroDefinition {
  heroId: string;
  pageType: PageType;
  funnelRole: FunnelRole;
}

export const heroRegistry: Record<string, HeroDefinition> = {
  hero_home:                  { heroId: 'hero_home',                  pageType: 'home',     funnelRole: 'entry' },
  hero_studio:                { heroId: 'hero_studio',                pageType: 'feature',  funnelRole: 'entry' },
  hero_ai_agents:             { heroId: 'hero_ai_agents',             pageType: 'feature',  funnelRole: 'entry' },
  hero_apps:                  { heroId: 'hero_apps',                  pageType: 'feature',  funnelRole: 'entry' },
  hero_building_blocks:       { heroId: 'hero_building_blocks',       pageType: 'feature',  funnelRole: 'entry' },
  hero_workflows:             { heroId: 'hero_workflows',             pageType: 'feature',  funnelRole: 'entry' },
  hero_how_it_works:          { heroId: 'hero_how_it_works',          pageType: 'feature',  funnelRole: 'discovery' },
  hero_whatsapp_integration:  { heroId: 'hero_whatsapp_integration',  pageType: 'feature',  funnelRole: 'entry' },
  hero_ai_agents_whatsapp:    { heroId: 'hero_ai_agents_whatsapp',    pageType: 'feature',  funnelRole: 'entry' },
  hero_fintech:               { heroId: 'hero_fintech',               pageType: 'industry', funnelRole: 'entry' },
  hero_banking:               { heroId: 'hero_banking',               pageType: 'industry', funnelRole: 'entry' },
  hero_insurance:             { heroId: 'hero_insurance',             pageType: 'industry', funnelRole: 'entry' },
  hero_retail:                { heroId: 'hero_retail',                pageType: 'industry', funnelRole: 'entry' },
  hero_startups:              { heroId: 'hero_startups',              pageType: 'industry', funnelRole: 'entry' },
  hero_contact:               { heroId: 'hero_contact',               pageType: 'contact',  funnelRole: 'conversion' },
  hero_pricing:               { heroId: 'hero_pricing',               pageType: 'feature',  funnelRole: 'consideration' },
  hero_security:              { heroId: 'hero_security',              pageType: 'feature',  funnelRole: 'consideration' },
  hero_privacy:               { heroId: 'hero_privacy',               pageType: 'legal',    funnelRole: 'consideration' },
};

// ---- Funnel Definitions ----

export interface FunnelStage {
  id: string;
  label: string;
  /** Pathname patterns that match this stage (substring match) */
  matchPatterns: string[];
}

export interface FunnelDefinition {
  id: string;
  label: string;
  stages: FunnelStage[];
}

export const funnelDefinitions: FunnelDefinition[] = [
  {
    id: 'direct_whatsapp',
    label: 'Direct WhatsApp',
    stages: [
      { id: 'landing',          label: 'Landing',       matchPatterns: ['/'] },
      { id: 'hero_cta_click',   label: 'Hero CTA',      matchPatterns: [] }, // event-driven, not path-driven
      { id: 'whatsapp_open',    label: 'WhatsApp Open',  matchPatterns: [] }, // event-driven
    ],
  },
  {
    id: 'feature_discovery',
    label: 'Feature Discovery',
    stages: [
      { id: 'landing',          label: 'Landing',        matchPatterns: ['/'] },
      { id: 'feature_explore',  label: 'Feature Explore', matchPatterns: ['/studio', '/ai-agents', '/apps', '/building-blocks', '/workflows', '/en/studio', '/en/ai-agents', '/en/apps', '/en/building-blocks', '/en/workflows'] },
      { id: 'demo_view',        label: 'Demo View',      matchPatterns: ['/demo', '/en/demo', '/como-funciona', '/en/how-it-works'] },
      { id: 'contact',          label: 'Contact',        matchPatterns: ['/contato', '/en/contact'] },
      { id: 'whatsapp_open',    label: 'WhatsApp Open',  matchPatterns: [] },
    ],
  },
  {
    id: 'industry_path',
    label: 'Industry Path',
    stages: [
      { id: 'landing',           label: 'Landing',          matchPatterns: ['/'] },
      { id: 'industry_explore',  label: 'Industry Explore', matchPatterns: ['/fintech', '/bancario', '/seguros', '/varejo', '/startups', '/en/fintech', '/en/banking', '/en/insurance', '/en/retail', '/en/startups'] },
      { id: 'use_cases',         label: 'Use Cases',        matchPatterns: ['/casos-de-uso', '/en/use-cases'] },
      { id: 'contact',           label: 'Contact',          matchPatterns: ['/contato', '/en/contact'] },
      { id: 'whatsapp_open',     label: 'WhatsApp Open',    matchPatterns: [] },
    ],
  },
  {
    id: 'content_path',
    label: 'Content Path',
    stages: [
      { id: 'content_landing',   label: 'Content Landing',  matchPatterns: ['/insights', '/en/insights'] },
      { id: 'article_read',      label: 'Article Read',     matchPatterns: ['/insights/', '/en/insights/'] },
      { id: 'contact',           label: 'Contact',          matchPatterns: ['/contato', '/en/contact'] },
      { id: 'whatsapp_open',     label: 'WhatsApp Open',    matchPatterns: [] },
    ],
  },
  {
    id: 'presentation',
    label: 'Presentation',
    stages: [
      { id: 'invite_landing',    label: 'Invite Landing',   matchPatterns: ['/apresentacao', '/en/presentation'] },
      { id: 'deck_selection',    label: 'Deck Selection',   matchPatterns: ['/apresentacao/', '/en/presentation/'] },
      { id: 'slide_view',        label: 'Slide View',       matchPatterns: [] }, // event-driven
      { id: 'follow_up',         label: 'Follow Up',        matchPatterns: ['/contato', '/en/contact'] },
    ],
  },
];

// ---- Page Type Classifier ----

export function classifyPageType(pathname: string): PageType {
  const p = pathname.replace(/\/$/, '') || '/';

  if (p === '/' || p === '/en') return 'home';

  // Presentations
  if (p.includes('/apresentacao') || p.includes('/presentation')) return 'presentation';

  // Contact
  if (p.includes('/contato') || p.includes('/contact')) return 'contact';

  // Demo
  if (p.includes('/demo')) return 'demo';

  // Use cases
  if (p.includes('/casos-de-uso') || p.includes('/use-cases')) return 'use_cases';

  // Industry verticals
  if (
    p.includes('/fintech') || p.includes('/bancario') || p.includes('/banking') ||
    p.includes('/seguros') || p.includes('/insurance') ||
    p.includes('/varejo') || p.includes('/retail') ||
    p.includes('/startups')
  ) return 'industry';

  // Content articles (must check before generic content)
  if (/\/insights\/.+/.test(p)) return 'content_article';

  // Content listing
  if (p.includes('/insights')) return 'content';

  // Legal
  if (
    p.includes('/politica-privacidade') || p.includes('/privacy-policy') ||
    p.includes('/termos') || p.includes('/terms')
  ) return 'legal';

  // Everything else is a feature page
  return 'feature';
}

// ---- Funnel Stage Resolver ----

export interface ActiveFunnel {
  funnelId: string;
  funnelLabel: string;
  currentStage: string;
  stageIndex: number;
  totalStages: number;
}

/**
 * Given a navigation history (ordered list of pathnames),
 * resolves which funnels the user is in and their current stage.
 */
export function resolveFunnelStages(history: string[]): ActiveFunnel[] {
  if (history.length === 0) return [];

  const activeFunnels: ActiveFunnel[] = [];

  for (const funnel of funnelDefinitions) {
    // A funnel is only active if the user entered through its first
    // path-matchable stage. Walk stages in order; once we find the first
    // stage that has matchPatterns, verify the user visited it.
    let firstPathStageIdx = -1;
    for (let i = 0; i < funnel.stages.length; i++) {
      if (funnel.stages[i].matchPatterns.length > 0) {
        firstPathStageIdx = i;
        break;
      }
    }
    if (firstPathStageIdx === -1) continue; // all event-driven, skip

    // Check if the user ever matched the entry stage
    const entryStage = funnel.stages[firstPathStageIdx];
    const enteredFunnel = history.some((pathname) =>
      entryStage.matchPatterns.some((pattern) => {
        if (pattern === '/') return pathname === '/' || pathname === '/en';
        return pathname.startsWith(pattern);
      }),
    );
    if (!enteredFunnel) continue;

    // Now find the highest stage reached
    let highestStageIndex = firstPathStageIdx;

    for (const pathname of history) {
      for (let stageIdx = firstPathStageIdx; stageIdx < funnel.stages.length; stageIdx++) {
        const stage = funnel.stages[stageIdx];
        if (stage.matchPatterns.length === 0) continue; // event-driven stages

        const matches = stage.matchPatterns.some((pattern) => {
          if (pattern === '/') return pathname === '/' || pathname === '/en';
          return pathname.startsWith(pattern);
        });

        if (matches && stageIdx > highestStageIndex) {
          highestStageIndex = stageIdx;
        }
      }
    }

    activeFunnels.push({
      funnelId: funnel.id,
      funnelLabel: funnel.label,
      currentStage: funnel.stages[highestStageIndex].id,
      stageIndex: highestStageIndex,
      totalStages: funnel.stages.length,
    });
  }

  return activeFunnels;
}
