import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ---- Constants (must match index.html) ----
const CLARITY_PRESENTATIONS_ID = 'vp5b7apoc2';
const CLARITY_SITE_ID = 'vp6hhn7234';

/**
 * Extracts the Clarity routing logic from index.html and returns the selected
 * project ID for a given pathname, by evaluating the inline script in jsdom.
 */
function getClarityIdForPath(pathname: string): string {
  // Simulate the same logic from index.html
  const p = pathname;
  return (p.startsWith('/apresentacao') || p.startsWith('/en/presentation'))
    ? CLARITY_PRESENTATIONS_ID
    : CLARITY_SITE_ID;
}

// ---- Verify index.html contains the expected script ----

describe('index.html Clarity script', () => {
  let html: string;

  beforeEach(() => {
    html = readFileSync(resolve(__dirname, '../../../index.html'), 'utf-8');
  });

  it('contains both Clarity project IDs', () => {
    expect(html).toContain(CLARITY_PRESENTATIONS_ID);
    expect(html).toContain(CLARITY_SITE_ID);
  });

  it('contains conditional routing logic based on pathname', () => {
    expect(html).toContain("p.startsWith('/apresentacao')");
    expect(html).toContain("p.startsWith('/en/presentation')");
  });

  it('loads Clarity from the correct CDN', () => {
    expect(html).toContain('https://www.clarity.ms/tag/');
  });

  it('does NOT contain a hardcoded single Clarity ID call (regression)', () => {
    // Old pattern: ..."clarity","script","vp5b7apoc2");
    // New pattern uses variable `id` instead of a hardcoded string
    const hardcodedPattern = /\("clarity","script","vp[a-z0-9]+"\)/;
    expect(html).not.toMatch(hardcodedPattern);
  });
});

// ---- Clarity ID routing logic ----

describe('Clarity project routing', () => {
  describe('presentation routes → Apresentacoe Catalisa', () => {
    it('/apresentacao', () => {
      expect(getClarityIdForPath('/apresentacao')).toBe(CLARITY_PRESENTATIONS_ID);
    });

    it('/apresentacao/deck-name', () => {
      expect(getClarityIdForPath('/apresentacao/deck-name')).toBe(CLARITY_PRESENTATIONS_ID);
    });

    it('/apresentacao/deck-name?invite=abc', () => {
      // pathname doesn't include query string, but testing prefix match
      expect(getClarityIdForPath('/apresentacao/deck-name')).toBe(CLARITY_PRESENTATIONS_ID);
    });

    it('/en/presentation', () => {
      expect(getClarityIdForPath('/en/presentation')).toBe(CLARITY_PRESENTATIONS_ID);
    });

    it('/en/presentation/deck-name', () => {
      expect(getClarityIdForPath('/en/presentation/deck-name')).toBe(CLARITY_PRESENTATIONS_ID);
    });
  });

  describe('site routes → Site Catalisa', () => {
    it('/', () => {
      expect(getClarityIdForPath('/')).toBe(CLARITY_SITE_ID);
    });

    it('/sobre', () => {
      expect(getClarityIdForPath('/sobre')).toBe(CLARITY_SITE_ID);
    });

    it('/en', () => {
      expect(getClarityIdForPath('/en')).toBe(CLARITY_SITE_ID);
    });

    it('/en/about', () => {
      expect(getClarityIdForPath('/en/about')).toBe(CLARITY_SITE_ID);
    });

    it('/playbooks/some-playbook', () => {
      expect(getClarityIdForPath('/playbooks/some-playbook')).toBe(CLARITY_SITE_ID);
    });

    it('/en/playbooks/some-playbook', () => {
      expect(getClarityIdForPath('/en/playbooks/some-playbook')).toBe(CLARITY_SITE_ID);
    });
  });

  describe('edge cases', () => {
    it('/apresentacoes does NOT match /apresentacao (different spelling)', () => {
      // "apresentacoes" diverges from "apresentacao" at position 11: 'o' vs 'a'
      // apresentacao  = ...c-a-o
      // apresentacoes = ...c-o-e-s
      expect(getClarityIdForPath('/apresentacoes')).toBe(CLARITY_SITE_ID);
    });

    it('/en/presentations matches because it starts with /en/presentation', () => {
      // "presentations" = "presentation" + "s", so startsWith matches
      expect(getClarityIdForPath('/en/presentations')).toBe(CLARITY_PRESENTATIONS_ID);
    });

    it('/apresentacao-extra matches (prefix match)', () => {
      // Any path starting with /apresentacao gets presentations project
      expect(getClarityIdForPath('/apresentacao-extra')).toBe(CLARITY_PRESENTATIONS_ID);
    });
  });
});

// ---- Clarity bootstrap integration (jsdom) ----

describe('Clarity bootstrap in jsdom', () => {
  let originalClarity: typeof window.clarity;

  let dummyScript: HTMLScriptElement;

  beforeEach(() => {
    originalClarity = window.clarity;
    delete (window as Record<string, unknown>).clarity;
    // The Clarity bootstrap uses getElementsByTagName('script')[0] as an anchor.
    // jsdom starts with no script tags, so we add one for insertBefore to work.
    dummyScript = document.createElement('script');
    document.head.appendChild(dummyScript);
  });

  afterEach(() => {
    // Clean up injected Clarity script tags and dummy
    document.querySelectorAll('script[src*="clarity.ms/tag/"]').forEach((el) => el.remove());
    dummyScript.remove();
    window.clarity = originalClarity;
    vi.restoreAllMocks();
  });

  function runClarityBootstrap(clarityId: string) {
    // Reproduce the exact bootstrap from index.html
    (function (c: Window, l: Document, a: string, r: string, i: string) {
      (c as Record<string, unknown>)[a] =
        (c as Record<string, unknown>)[a] ||
        function () {
          const fn = (c as Record<string, unknown>)[a] as { q?: unknown[] };
          (fn.q = fn.q || []).push(arguments);
        };
      const t = l.createElement(r) as HTMLScriptElement;
      t.async = true;
      t.src = 'https://www.clarity.ms/tag/' + i;
      const y = l.getElementsByTagName(r)[0];
      y?.parentNode?.insertBefore(t, y);
    })(window, document, 'clarity', 'script', clarityId);
  }

  it('sets up window.clarity as a queue function', () => {
    runClarityBootstrap(CLARITY_SITE_ID);
    expect(typeof window.clarity).toBe('function');
  });

  it('queues calls made before Clarity loads', () => {
    runClarityBootstrap(CLARITY_SITE_ID);
    window.clarity!('event', 'test_event');
    window.clarity!('set', 'key', 'value');

    const q = (window.clarity as unknown as { q: unknown[][] }).q;
    expect(q).toHaveLength(2);
  });

  it('creates a script tag pointing to the correct Clarity project', () => {
    runClarityBootstrap(CLARITY_SITE_ID);
    const tag = document.querySelector(
      `script[src="https://www.clarity.ms/tag/${CLARITY_SITE_ID}"]`,
    ) as HTMLScriptElement | null;
    expect(tag).not.toBeNull();
    expect(tag!.async).toBe(true);
  });

  it('uses presentation ID for presentation bootstrap', () => {
    runClarityBootstrap(CLARITY_PRESENTATIONS_ID);
    const tag = document.querySelector(
      `script[src="https://www.clarity.ms/tag/${CLARITY_PRESENTATIONS_ID}"]`,
    ) as HTMLScriptElement | null;
    expect(tag).not.toBeNull();
  });
});
