/** Rebase advisory snapshot hints after a partial Vite rebuild; never change page content. */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { init, parse } from 'es-module-lexer';
const argument = name => process.argv.find(value => value.startsWith('--' + name + '='))?.slice(name.length + 3);
const directory = path.resolve(argument('dist') || '');
const freshDirectory = path.resolve(argument('assets') || '');
const output = argument('output');
const apply = process.argv.includes('--apply');
await init;
const mutableRoot = path.resolve('.local/site/candidates') + path.sep;
if (!argument('dist') || !argument('assets') || !output || !directory.startsWith(mutableRoot))
  throw Error('Use a mutable .local/site/candidates directory, fresh Vite assets directory and explicit report output');
const names = (await fs.readdir(path.join(freshDirectory, 'assets'))).filter(name => name.endsWith('.js'));
const currentUrls = new Set(names.map(name => '/assets/' + name));
const stem = name => name.replace(/-[A-Za-z0-9_-]{8}\.js$/, '');
const groups = new Map();
for (const name of names) groups.set(stem(name), [...(groups.get(stem(name)) || []), name]);
const exportCache = new Map();
async function semanticExports(file) {
  if (!exportCache.has(file)) {
    const code = await fs.readFile(file, 'utf8');
    const [, exported] = parse(code);
    exportCache.set(file, exported.map(item => item.n).filter(name => name !== 'default' && name.length > 2).sort());
  }
  return exportCache.get(file);
}
const attribute = (tag, name) => tag.match(new RegExp('\\b' + name + '\\s*=\\s*(["\x27])([^"\x27]*)\\1', 'i'))?.[2];
const isModuleHint = tag => attribute(tag, 'rel') === 'modulepreload';
const stripHints = html => html.replace(/<link\b[^>]*>/gi, tag => isModuleHint(tag) ? '' : tag);
const nativeFiles = [];
for (const name of names) {
  if (!/^App-/.test(name)) continue;
  const code = await fs.readFile(path.join(freshDirectory, 'assets', name), 'utf8');
  if (code.includes('prepareInitialRoute')) nativeFiles.push(name);
}
assert.equal(nativeFiles.length, 1, 'Exactly one current native application required');
const records = [];
async function visit(parent) {
  for (const item of await fs.readdir(parent, { withFileTypes: true })) {
    const file = path.join(parent, item.name);
    if (item.isSymbolicLink()) throw Error('Candidate symlink rejected');
    if (item.isDirectory()) { await visit(file); continue; }
    if (!item.name.endsWith('.html')) continue;
    const before = await fs.readFile(file, 'utf8');
    const changes = [];
    const tags = before.match(/<link\b[^>]*>/gi) || [];
    const replacements = new Map();
    for (const tag of tags) {
      const url = attribute(tag, 'href');
      if (!isModuleHint(tag) || !url?.startsWith('/assets/') || !url.endsWith('.js') || currentUrls.has(url)) continue;
      let possible = groups.get(stem(path.basename(url))) || [];
      let resolution = 'unique-name';
      if (possible.length > 1) {
        const previousExports = await semanticExports(path.join(directory, url.slice(1)));
        if (previousExports.length) {
          const matches = [];
          for (const name of possible) {
            const currentExports = await semanticExports(path.join(freshDirectory, 'assets', name));
            if (JSON.stringify(currentExports) === JSON.stringify(previousExports)) matches.push(name);
          }
          if (matches.length === 1) { possible = matches; resolution = 'same-public-named-exports'; }
        }
      }
      if (possible.length !== 1 && path.basename(url).startsWith('App-')) {
        const oldCode = await fs.readFile(path.join(directory, url.slice(1)), 'utf8');
        if (oldCode.includes('prepareInitialRoute')) { possible = nativeFiles; resolution = 'native-application-export'; }
      }
      if (possible.length === 1) {
        const next = '/assets/' + possible[0];
        replacements.set(tag, tag.replace(/(\bhref\s*=\s*["'])[^"']*(["'])/i, '$1' + next + '$2'));
        changes.push({ previous: url, current: next, action: 'rebase', resolution });
      } else {
        // A hint is optional. Never guess between different modules sharing a name;
        // the current Vite runtime imports and preloads the actual dependency.
        replacements.set(tag, '');
        changes.push({ previous: url, current: null, action: 'remove-ambiguous-advisory-hint' });
      }
    }
    const after = before.replace(/<link\b[^>]*>/gi, tag => replacements.get(tag) ?? tag);
    assert.equal(stripHints(before), stripHints(after), 'Only advisory module hints may change');
    for (const tag of after.match(/<link\b[^>]*>/gi) || []) {
      const url = attribute(tag, 'href');
      if (isModuleHint(tag) && url?.startsWith('/assets/') && url.endsWith('.js'))
        assert(currentUrls.has(url), 'Stale snapshot module hint remains: ' + url);
    }
    if (apply && before !== after) await fs.writeFile(file, after);
    records.push({ file: path.relative(directory, file), changes, otherContentPreserved: true });
  }
}
await visit(directory);
const report = { checkedAt: new Date().toISOString(), passed: true, applied: apply,
  candidate: directory, freshAssets: freshDirectory, htmlFiles: records.length,
  changedHtmlFiles: records.filter(record => record.changes.length).length,
  rebasedHints: records.flatMap(record => record.changes).filter(change => change.action === 'rebase').length,
  semanticExportResolvedHints: records.flatMap(record => record.changes).filter(change => change.resolution === 'same-public-named-exports').length,
  ambiguousHintsRemoved: records.flatMap(record => record.changes).filter(change => change.current === null).length,
  scope: 'Advisory modulepreload tags alone; body, SEO, CSS and module entry preserved byte-for-byte. Every remaining local JavaScript hint names an asset in the current Vite build. Ambiguous optional hints removed; actual runtime dependency loading unchanged.', records };
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ passed: true, applied: apply, htmlFiles: report.htmlFiles,
  changedHtmlFiles: report.changedHtmlFiles, rebasedHints: report.rebasedHints,
  ambiguousHintsRemoved: report.ambiguousHintsRemoved }));
