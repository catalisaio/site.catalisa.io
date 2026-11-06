import fs from 'node:fs/promises';
import vm from 'node:vm';
import postcss from 'postcss';

export const referenceAssets = 'docs/redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/reference/site/dist/assets';

export async function referenceContext(extras = []) {
  const ctx = vm.createContext({ window: {}, console });
  for (const file of ['products.js', 'platforms.js', 'connection/site.js', 'connection/platform.js', ...extras]) {
    vm.runInContext(await fs.readFile(`${referenceAssets}/${file}`, 'utf8'), ctx);
  }
  return ctx;
}

export function svgToJsx(svg) {
  if (/<script|\bon\w+=|<foreignObject|\{/.test(svg)) throw new Error('Unexpected executable SVG');
  return svg.replace(/\bclass=/g, 'className=')
    .replace(/\bstyle="([^"]*)"/g, (_, value) => {
      const styles = Object.fromEntries(value.split(';').filter(Boolean).map(declaration => {
        const colon = declaration.indexOf(':');
        const name = declaration.slice(0, colon).trim();
        return [name.startsWith('--') ? name : name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()), declaration.slice(colon + 1).trim()];
      }));
      return `style={${JSON.stringify(styles)} as CSSProperties}`;
    })
    .replace(/\b([a-z]+(?:-[a-z]+)+)=/g, (match, name) => /^(aria|data)-/.test(name) ? match : name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()) + '=');
}

export async function writeScopedCss({ file, output, prefix, owner, ownerRoot }) {
  const scope = ownerRoot.startsWith(':where(') ? ownerRoot : `:where(${ownerRoot})`;
  const css = postcss.parse(await fs.readFile(`${referenceAssets}/connection/${file}.css`, 'utf8'));
  const keyframes = new Map();
  css.walkAtRules('keyframes', node => { const name = node.params; node.params = `${prefix}-${name}`; keyframes.set(name, node.params); });
  css.walkRules(rule => {
    if (rule.parent.type === 'atrule' && rule.parent.name === 'keyframes') return;
    rule.selectors = rule.selectors.map(selector => {
      const normalized = selector.replace(/^main\s+/, '').replace(/\.wrap\b/g, '.c-wrap').replace(/\.label\b/g, '.c-eyebrow').replace(/\.text-link\b/g, '.c-text-link');
      const rooted = owner.test(selector);
      return `.c-site ${rooted ? '' : `${scope} `}${normalized}`;
    });
  });
  css.walkDecls(decl => {
    decl.value = decl.value.replace(/Inter,Arial/g, 'var(--c-font)');
    decl.value = decl.value.replace(/var\(--(line|paper|ink|purple|muted|lavender)\)/g, (_, name) => `var(--c-${({ line: 'rule', paper: 'paper', ink: 'ink', purple: 'brand', muted: 'body', lavender: 'lavender' })[name]})`);
    for (const [before, after] of keyframes) decl.value = decl.value.replace(new RegExp(`\\b${before}\\b`, 'g'), after);
  });
  // The final handoff loads mobile.css after every family stylesheet. Preserve
  // that cascade in the native family instead of stopping at its earlier CSS.
  if (file !== 'mobile') {
    const mobile = postcss.parse(await fs.readFile(`${referenceAssets}/connection/mobile.css`, 'utf8'));
    const familyPrefix = ownerRoot.match(/^\.([a-z]+)-page$/)?.[1];
    mobile.walkRules(rule => {
      const selectors = rule.selectors.filter(selector =>
        selector.startsWith('main ') || (familyPrefix && new RegExp(`\\.${familyPrefix}-(?:[\\w-]+)`).test(selector))
      );
      if (!selectors.length) { rule.remove(); return; }
      rule.selectors = selectors.map(selector => {
        const normalized = selector.replace(/^main\s+/, '').replace(/\.wrap\b/g, '.c-wrap').replace(/\.label\b/g, '.c-eyebrow').replace(/\.text-link\b/g, '.c-text-link');
        return `.c-site ${owner.test(selector) ? '' : `${scope} `}${normalized}`;
      });
    });
    mobile.walkAtRules(rule => { if (rule.nodes?.length === 0) rule.remove(); });
    css.append(mobile.nodes);
  }
  await fs.writeFile(output, `/* Generated and scoped from N01 ${file}.css and final mobile overrides. Keep the reference immutable. */\n${css.toString()}\n`);
}
