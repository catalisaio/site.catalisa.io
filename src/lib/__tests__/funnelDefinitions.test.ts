import { describe, it, expect } from 'vitest';
import {
  classifyPageType,
  resolveFunnelStages,
  heroRegistry,
  funnelDefinitions,
} from '../funnelDefinitions';

// =============================================
//  classifyPageType
// =============================================

describe('classifyPageType', () => {
  describe('home', () => {
    it('classifies / as home', () => {
      expect(classifyPageType('/')).toBe('home');
    });

    it('classifies /en as home', () => {
      expect(classifyPageType('/en')).toBe('home');
    });

    it('classifies /en/ (trailing slash) as home', () => {
      expect(classifyPageType('/en/')).toBe('home');
    });
  });

  describe('feature pages', () => {
    it.each([
      '/studio', '/en/studio',
      '/ai-agents', '/en/ai-agents',
      '/apps', '/en/apps',
      '/building-blocks', '/en/building-blocks',
      '/workflows', '/en/workflows',
      '/como-funciona', '/en/how-it-works',
      '/integracoes/whatsapp', '/en/integrations/whatsapp',
      '/seguranca', '/en/security',
      '/agentes-ia-whatsapp', '/en/ai-agents-whatsapp',
    ])('classifies %s as feature', (path) => {
      expect(classifyPageType(path)).toBe('feature');
    });
  });

  describe('industry pages', () => {
    it.each([
      '/fintech', '/en/fintech',
      '/bancario', '/en/banking',
      '/seguros', '/en/insurance',
      '/varejo', '/en/retail',
      '/startups', '/en/startups',
    ])('classifies %s as industry', (path) => {
      expect(classifyPageType(path)).toBe('industry');
    });
  });

  describe('contact', () => {
    it.each(['/contato', '/en/contact'])('classifies %s as contact', (path) => {
      expect(classifyPageType(path)).toBe('contact');
    });
  });

  describe('demo', () => {
    it.each(['/demo', '/en/demo'])('classifies %s as demo', (path) => {
      expect(classifyPageType(path)).toBe('demo');
    });
  });

  describe('use_cases', () => {
    it.each(['/casos-de-uso', '/en/use-cases'])('classifies %s as use_cases', (path) => {
      expect(classifyPageType(path)).toBe('use_cases');
    });
  });

  describe('content', () => {
    it.each(['/insights', '/en/insights', '/insights/all', '/en/insights/all'])('classifies %s as content or content_article', (path) => {
      const result = classifyPageType(path);
      expect(['content', 'content_article']).toContain(result);
    });

    it('classifies /insights listing as content', () => {
      expect(classifyPageType('/insights')).toBe('content');
    });

    it('classifies /insights/some-article as content_article', () => {
      expect(classifyPageType('/insights/some-article-slug')).toBe('content_article');
    });

    it('classifies /en/insights/some-article as content_article', () => {
      expect(classifyPageType('/en/insights/some-article-slug')).toBe('content_article');
    });
  });

  describe('presentation', () => {
    it.each([
      '/apresentacao', '/apresentacao/comercial', '/apresentacao/investidor',
      '/en/presentation', '/en/presentation/commercial',
    ])('classifies %s as presentation', (path) => {
      expect(classifyPageType(path)).toBe('presentation');
    });
  });

  describe('legal', () => {
    it.each([
      '/politica-privacidade', '/en/privacy-policy',
      '/termos', '/en/terms',
    ])('classifies %s as legal', (path) => {
      expect(classifyPageType(path)).toBe('legal');
    });
  });
});

// =============================================
//  resolveFunnelStages
// =============================================

describe('resolveFunnelStages', () => {
  it('returns empty array for empty history', () => {
    expect(resolveFunnelStages([])).toEqual([]);
  });

  it('detects landing stage for home visit', () => {
    const result = resolveFunnelStages(['/']);
    // Home matches landing stage of direct_whatsapp, feature_discovery, industry_path
    const funnelIds = result.map((f) => f.funnelId);
    expect(funnelIds).toContain('direct_whatsapp');
    expect(funnelIds).toContain('feature_discovery');
    expect(funnelIds).toContain('industry_path');

    // All should be at landing stage (index 0)
    for (const funnel of result) {
      if (['direct_whatsapp', 'feature_discovery', 'industry_path'].includes(funnel.funnelId)) {
        expect(funnel.currentStage).toBe('landing');
        expect(funnel.stageIndex).toBe(0);
      }
    }
  });

  it('advances feature_discovery funnel when visiting a feature page', () => {
    const result = resolveFunnelStages(['/', '/studio']);
    const feature = result.find((f) => f.funnelId === 'feature_discovery');
    expect(feature).toBeDefined();
    expect(feature!.currentStage).toBe('feature_explore');
    expect(feature!.stageIndex).toBe(1);
  });

  it('advances feature_discovery to demo stage', () => {
    const result = resolveFunnelStages(['/', '/studio', '/demo']);
    const feature = result.find((f) => f.funnelId === 'feature_discovery');
    expect(feature).toBeDefined();
    expect(feature!.currentStage).toBe('demo_view');
    expect(feature!.stageIndex).toBe(2);
  });

  it('advances feature_discovery to contact stage', () => {
    const result = resolveFunnelStages(['/', '/studio', '/demo', '/contato']);
    const feature = result.find((f) => f.funnelId === 'feature_discovery');
    expect(feature).toBeDefined();
    expect(feature!.currentStage).toBe('contact');
    expect(feature!.stageIndex).toBe(3);
  });

  it('advances industry_path funnel for industry visit', () => {
    const result = resolveFunnelStages(['/', '/fintech']);
    const industry = result.find((f) => f.funnelId === 'industry_path');
    expect(industry).toBeDefined();
    expect(industry!.currentStage).toBe('industry_explore');
    expect(industry!.stageIndex).toBe(1);
  });

  it('advances industry_path through use_cases to contact', () => {
    const result = resolveFunnelStages(['/', '/bancario', '/casos-de-uso', '/contato']);
    const industry = result.find((f) => f.funnelId === 'industry_path');
    expect(industry).toBeDefined();
    expect(industry!.currentStage).toBe('contact');
    expect(industry!.stageIndex).toBe(3);
  });

  it('detects content_path funnel from insights listing', () => {
    const result = resolveFunnelStages(['/insights']);
    const content = result.find((f) => f.funnelId === 'content_path');
    expect(content).toBeDefined();
    expect(content!.currentStage).toBe('content_landing');
    expect(content!.stageIndex).toBe(0);
  });

  it('advances content_path to article_read', () => {
    const result = resolveFunnelStages(['/insights', '/insights/some-article']);
    const content = result.find((f) => f.funnelId === 'content_path');
    expect(content).toBeDefined();
    expect(content!.currentStage).toBe('article_read');
    expect(content!.stageIndex).toBe(1);
  });

  it('advances content_path to contact', () => {
    const result = resolveFunnelStages(['/insights', '/insights/some-article', '/contato']);
    const content = result.find((f) => f.funnelId === 'content_path');
    expect(content).toBeDefined();
    expect(content!.currentStage).toBe('contact');
    expect(content!.stageIndex).toBe(2);
  });

  it('detects presentation funnel', () => {
    const result = resolveFunnelStages(['/apresentacao']);
    const pres = result.find((f) => f.funnelId === 'presentation');
    expect(pres).toBeDefined();
    expect(pres!.currentStage).toBe('invite_landing');
    expect(pres!.stageIndex).toBe(0);
  });

  it('advances presentation to deck_selection', () => {
    const result = resolveFunnelStages(['/apresentacao', '/apresentacao/comercial']);
    const pres = result.find((f) => f.funnelId === 'presentation');
    expect(pres).toBeDefined();
    expect(pres!.currentStage).toBe('deck_selection');
    expect(pres!.stageIndex).toBe(1);
  });

  it('works with en-US paths', () => {
    const result = resolveFunnelStages(['/en', '/en/studio', '/en/demo', '/en/contact']);
    const feature = result.find((f) => f.funnelId === 'feature_discovery');
    expect(feature).toBeDefined();
    expect(feature!.currentStage).toBe('contact');
    expect(feature!.stageIndex).toBe(3);
  });

  it('tracks highest stage even if user backtracks', () => {
    // User goes: home → studio → home → demo
    // Should still be at demo_view (stage 2), not landing (stage 0)
    const result = resolveFunnelStages(['/', '/studio', '/', '/demo']);
    const feature = result.find((f) => f.funnelId === 'feature_discovery');
    expect(feature).toBeDefined();
    expect(feature!.currentStage).toBe('demo_view');
    expect(feature!.stageIndex).toBe(2);
  });

  it('can activate multiple funnels simultaneously', () => {
    // User visits home, then an industry page, then a feature page
    const result = resolveFunnelStages(['/', '/fintech', '/studio']);
    const funnelIds = result.map((f) => f.funnelId);
    expect(funnelIds).toContain('feature_discovery');
    expect(funnelIds).toContain('industry_path');
    expect(funnelIds).toContain('direct_whatsapp');
  });

  it('does not activate content_path if user never visits insights', () => {
    const result = resolveFunnelStages(['/', '/studio', '/contato']);
    const content = result.find((f) => f.funnelId === 'content_path');
    expect(content).toBeUndefined();
  });

  it('does not activate presentation if user never visits apresentacao', () => {
    const result = resolveFunnelStages(['/', '/fintech', '/contato']);
    const pres = result.find((f) => f.funnelId === 'presentation');
    expect(pres).toBeUndefined();
  });

  it('includes totalStages in result', () => {
    const result = resolveFunnelStages(['/']);
    for (const funnel of result) {
      const def = funnelDefinitions.find((d) => d.id === funnel.funnelId);
      expect(funnel.totalStages).toBe(def!.stages.length);
    }
  });
});

// =============================================
//  heroRegistry integrity
// =============================================

describe('heroRegistry', () => {
  it('has unique heroIds matching the keys', () => {
    for (const [key, def] of Object.entries(heroRegistry)) {
      expect(def.heroId).toBe(key);
    }
  });

  it('all heroes have valid pageType', () => {
    const validTypes = ['home', 'feature', 'industry', 'content', 'content_article', 'contact', 'demo', 'use_cases', 'presentation', 'legal'];
    for (const def of Object.values(heroRegistry)) {
      expect(validTypes).toContain(def.pageType);
    }
  });

  it('all heroes have valid funnelRole', () => {
    const validRoles = ['entry', 'discovery', 'consideration', 'conversion'];
    for (const def of Object.values(heroRegistry)) {
      expect(validRoles).toContain(def.funnelRole);
    }
  });

  it('has exactly 18 heroes registered', () => {
    expect(Object.keys(heroRegistry)).toHaveLength(18);
  });

  it('hero_contact is the only conversion role', () => {
    const conversions = Object.values(heroRegistry).filter((h) => h.funnelRole === 'conversion');
    expect(conversions).toHaveLength(1);
    expect(conversions[0].heroId).toBe('hero_contact');
  });
});

// =============================================
//  funnelDefinitions integrity
// =============================================

describe('funnelDefinitions', () => {
  it('has 5 funnel definitions', () => {
    expect(funnelDefinitions).toHaveLength(5);
  });

  it('all funnels have unique ids', () => {
    const ids = funnelDefinitions.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all funnels have at least 3 stages', () => {
    for (const funnel of funnelDefinitions) {
      expect(funnel.stages.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('all stage ids within a funnel are unique', () => {
    for (const funnel of funnelDefinitions) {
      const stageIds = funnel.stages.map((s) => s.id);
      expect(new Set(stageIds).size).toBe(stageIds.length);
    }
  });
});
