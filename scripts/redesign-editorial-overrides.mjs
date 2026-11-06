import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';

const messaging = JSON.parse(await fs.readFile(new URL('../src/redesign/data/financial-messaging.json', import.meta.url), 'utf8'));

/** Apply explicit editorial decisions offline; the handoff remains immutable. */
export function applyFinancialMessaging(route, html) {
  const document = new JSDOM(`<main>${html}</main>`).window.document;
  for (const change of messaging.financial.filter(item => item.route === route)) {
    const matches = document.querySelectorAll(change.selector);
    if (matches.length !== 1) throw new Error(`Editorial decision ${change.id}: expected one ${change.selector}`);
    const node = matches[0];
    if (node.innerHTML !== change.beforeHtml) throw new Error(`Editorial baseline changed for ${change.id}`);
    const replacement = new JSDOM(`<main>${change.afterHtml}</main>`).window.document.querySelector('main');
    const structure = element => [...element.children].map(child => `${child.localName}(${structure(child)})`).join(',');
    if (structure(node) !== structure(replacement)) throw new Error(`Editorial decision ${change.id} changes composition`);
    node.innerHTML = change.afterHtml;
    node.dataset.editorialDecision = messaging.decision;
    node.dataset.editorialCopy = change.id;
    if (change.href && node.getAttribute('href') !== change.href) throw new Error(`Editorial target changed for ${change.id}`);
  }
  return document.querySelector('main').innerHTML;
}
