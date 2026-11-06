import { JSDOM } from 'jsdom';

const booleans = new Set(['disabled', 'checked', 'multiple', 'required', 'autofocus', 'open', 'hidden', 'readonly', 'controls', 'loop', 'muted', 'playsinline', 'novalidate']);
const numeric = new Set(['tabindex', 'rows', 'cols', 'maxlength', 'minlength', 'size', 'start', 'rowspan', 'colspan']);
const aliases = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', autofocus: 'autoFocus', autocomplete: 'autoComplete', maxlength: 'maxLength', minlength: 'minLength', novalidate: 'noValidate', rowspan: 'rowSpan', colspan: 'colSpan', srcset: 'srcSet', crossorigin: 'crossOrigin', playsinline: 'playsInline', fetchpriority: 'fetchPriority', 'xlink:href': 'xlinkHref', 'xmlns:xlink': 'xmlnsXlink' };
const voids = new Set(['img', 'input', 'br', 'hr', 'source', 'wbr', 'area', 'meta', 'link', 'col', 'embed', 'param', 'track']);
export function fragment(html) { return JSDOM.fragment(html); }
const json = JSON.stringify;
const classAliases = {wrap:'c-wrap',label:'c-eyebrow','text-link':'c-text-link'};
const classes = value => value.replace(/\S+/g, name => classAliases[name] ?? name);
const property = value => aliases[value] ?? (/^(aria|data)-/.test(value) ? value : value.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase()));

/** Offline conversion of the trusted final handoff HTML. No HTML injection or legacy JS at runtime. */
export function compileHtml(htmlOrNode, overrides = () => null) {
  const root = typeof htmlOrNode === 'string' ? fragment(htmlOrNode) : htmlOrNode;
  function walk(node) {
    if (node.nodeType === 3) return `{${json(node.data)}}`;
    if (node.nodeType === 8) return '';
    if (node.nodeType === 11) return [...node.childNodes].map(walk).join('');
    if (node.nodeType !== 1) throw new Error('Unexpected HTML node');
    if (['script', 'iframe', 'object', 'style'].includes(node.localName)) throw new Error(`Executable/embedded tag: ${node.localName}`);
    const override = overrides(node);
    if (typeof override === 'string') return override;
    const options = override ?? {};
    // JSDOM's HTML parser does not restore this newer SVG element's mixed case.
    let tag = node.localName === 'fedropshadow' ? 'feDropShadow' : node.localName;
    const attributes = {};
    for (const { name, value } of node.attributes) {
      if (/^on/i.test(name)) throw new Error('Legacy event attribute');
      if (name === 'selected') continue;
      let prop = property(name);
      if (booleans.has(name)) { attributes[prop] = '{true}'; continue; }
      if (numeric.has(name) && /^-?\d+$/.test(value)) { attributes[prop] = `{${Number(value)}}`; continue; }
      if (name === 'style') {
        const declarations = Object.fromEntries(value.split(';').filter(Boolean).map(line => {
          const split = line.indexOf(':'); const key = line.slice(0, split).trim();
          return [key.startsWith('--') ? key : property(key), line.slice(split + 1).trim()];
        }));
        attributes.style = `{${json(declarations)} as CSSProperties}`; continue;
      }
      let target = value;
      if (name === 'class') target = classes(value);
      if (['src','poster'].includes(name) && /^\/assets\/(screens|media)\//.test(value)) target = value.replace('/assets/', '/redesign/');
      if (name === 'href' && value.startsWith('/') && !value.startsWith('//') && !node.hasAttribute('download')) { tag = 'Link'; prop = 'to'; }
      attributes[prop] = `{${json(target)}}`;
    }
    Object.assign(attributes, options.attributes ?? {});
    for (const [key, value] of Object.entries(attributes)) if (value === null) delete attributes[key];
    const attrs = Object.entries(attributes).map(([key, value]) => ` ${key}=${value}`).join('');
    if (voids.has(tag)) return `<${tag}${attrs} />`;
    const children = options.children ?? [...node.childNodes].map(walk).join('');
    return `<${tag}${attrs}>${children}</${tag}>`;
  }
  return walk(root);
}
