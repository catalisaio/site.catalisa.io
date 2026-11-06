/** Semantic acceptance for anonymous public snapshots, beyond metadata/H1 counts. */
export function snapshotShellName({partial,hasSpa}) {
  // A complete postbuild follows Vite and must use its new entrypoint. spa.html
  // is a previous capture's shell and is safe only for an explicit partial run.
  return partial && hasSpa ? 'spa.html' : 'index.html';
}

export function publicSnapshotIssue(state) {
  const path = state.path.replace(/\/+$/, '') || '/';
  if (!['/contato','/lab'].includes(path)) return undefined;
  if (state.busy) return 'Anonymous public snapshot is still loading';
  if (state.errors?.length) return 'Anonymous public snapshot contains an error: ' + state.errors.join(' | ');
  if (!state.controlReady) return 'Anonymous public form is missing or disabled';
  if (typeof state.expectedHeading === 'string') {
    if ((state.h1 ?? '').replace(/\s/g, '') !== state.expectedHeading.replace(/\s/g, '')) return 'Localized public snapshot must show its translated introduction';
    return undefined;
  }
  if (path === '/contato' && !state.h1?.startsWith('Converse sobre o que sua empresa precisa.')) return 'Contact snapshot must show its public introduction, not a restored/error state';
  if (path === '/lab' && state.h1 !== 'Descreva sua ideia e explore um conceito de produto.') return 'Lab snapshot must show its public introduction';
  return undefined;
}
