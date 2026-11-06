import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { parseEnv } from 'node:util';

export function checkEnvironment(env, target) {
  const failures = [];
  const backend = env.SITE_HANDOFF_BACKEND;
  const required = ['SITE_SESSION_SECRET','SITE_ALLOWED_ORIGINS','SITE_CATALISA_ORIGIN','SITE_CATALISA_TOKEN','SITE_CATALISA_OWNER_EMAIL','SITE_CATALISA_AGENT_ID','SITE_STORE_COLLECTION','SITE_HANDOFF_BACKEND','SITE_HANDOFF_CHANNELS'];
  if (backend === 'site-inbox') required.push('SITE_INBOX_COLLECTION');
  else if (backend === 'http') required.push('SITE_HANDOFF_URL','SITE_HANDOFF_TOKEN','SITE_HANDOFF_SIGNING_SECRET','SITE_WEBHOOK_SECRET');
  else failures.push('invalid:SITE_HANDOFF_BACKEND');
  for (const key of required) if (!env[key]) failures.push('missing:' + key);
  if (env.SITE_STORE !== 'catalisa') failures.push('SITE_STORE must be catalisa');
  for (const key of ['SITE_SESSION_SECRET', ...(backend === 'http' ? ['SITE_HANDOFF_SIGNING_SECRET','SITE_WEBHOOK_SECRET'] : [])]) if ((env[key] || '').length < 32) failures.push('too_short:' + key);
  if (/local-development|development-only|change[-_]?me/i.test(env.SITE_SESSION_SECRET || '')) failures.push('development:SITE_SESSION_SECRET');
  if (env.SITE_CATALISA_OWNER_EMAIL !== 'admin@catalisa.app') failures.push('unexpected:SITE_CATALISA_OWNER_EMAIL');
  for (const key of ['SITE_CATALISA_ORIGIN', ...(backend === 'http' ? ['SITE_HANDOFF_URL'] : [])]) {
    try { const url = new URL(env[key]); if (url.protocol !== 'https:' || url.username || url.password || url.hash || (key === 'SITE_CATALISA_ORIGIN' && (url.pathname !== '/' || url.search))) failures.push('invalid_https:' + key); } catch { failures.push('invalid_url:' + key); }
  }
  const origins = (env.SITE_ALLOWED_ORIGINS || '').split(',').map(x => x.trim());
  if (origins.some(value => { try { const url = new URL(value); return url.protocol !== 'https:' || url.origin !== value; } catch { return true; } })) failures.push('invalid:SITE_ALLOWED_ORIGINS');
  if (target === 'staging' && origins.some(value => ['https://catalisa.io','https://www.catalisa.io'].includes(value))) failures.push('staging origins include production');
  if (target === 'staging' && env.SITE_CATALISA_ORIGIN !== 'https://panel-api.wpp.bb.stg.catalisa.app') failures.push('staging must use staging Catalisa runtime');
  if (target === 'production' && !origins.includes('https://catalisa.io')) failures.push('production origin missing');
  if (target === 'production' && /(^|[./_-])(stg|staging)([./_-]|$)/i.test(env.SITE_CATALISA_ORIGIN || '')) failures.push('production points at staging Catalisa');
  if ((env.SITE_HANDOFF_CHANNELS || '').split(',').some(value => !['here','email','whatsapp'].includes(value.trim()))) failures.push('invalid:SITE_HANDOFF_CHANNELS');
  if (backend === 'site-inbox') {
    if (env.SITE_INBOX_COLLECTION !== 'site_catalisa_inbox_v1') failures.push('unexpected:SITE_INBOX_COLLECTION');
    if (env.SITE_HANDOFF_CHANNELS !== 'here') failures.push('site-inbox only supports here');
  }
  return failures;
}

export async function checkArtifact(directory, target, options = {}) {
  const failures = [];
  const reviewProductionArtifact = options.reviewProductionArtifact === true;
  if (reviewProductionArtifact && (target !== 'staging' || options.httpsStaging !== true)) failures.push('production artifact review requires HTTPS staging target');
  for (const file of ['index.html','404.html','robots.txt','sitemap.xml','site-build.json','site-hosting.caddy']) {
    try { if (!(await stat(join(directory, file))).isFile()) failures.push('missing:' + file); } catch { failures.push('missing:' + file); }
  }
  try { const mode = JSON.parse(await readFile(join(directory, 'site-build.json'), 'utf8')); if (mode.redesign !== true) failures.push('artifact does not select redesign'); if (target === 'staging' && mode.indexing !== (reviewProductionArtifact ? true : false)) failures.push(reviewProductionArtifact ? 'production review artifact must enable indexing at build time' : 'staging artifact allows indexing'); if (target === 'production' && mode.indexing !== true) failures.push('production artifact disables indexing'); } catch { failures.push('invalid:site-build.json'); }
  async function inspect(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) { failures.push('artifact contains symlink'); continue; }
      if (/^\.env|^\.local$|^node_modules$|\.sqlite|\.pem$|\.key$/.test(entry.name)) failures.push('private file in artifact:' + entry.name);
      if (entry.isDirectory()) await inspect(join(path, entry.name));
    }
  }
  try { await inspect(directory); } catch { failures.push('artifact unreadable'); }
  return failures;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  const args = Object.fromEntries(process.argv.slice(2).map(value => value.replace(/^--/, '').split(/=(.*)/s).slice(0, 2)));
  const target = args.target || 'staging';
  if (!['staging','production'].includes(target)) throw Error('Invalid target');
  const env = args['env-file'] ? parseEnv(await readFile(resolve(args['env-file']), 'utf8')) : process.env;
  const reviewProductionArtifact = args['review-production-artifact'] === 'true';
  const failures = [...checkEnvironment(env, target), ...await checkArtifact(resolve(args.dist || 'dist'), target, { reviewProductionArtifact, httpsStaging: args['https-staging'] === 'true' })];
  console.info(JSON.stringify({ target, reviewProductionArtifact, passed: failures.length === 0, failures, checks: ['server configuration (values withheld)','artifact required files','redesign release mode','artifact private-file exclusion'], limits: ['Does not prove remote connectivity, delivery, visual QA or production authorization'] }, null, 2));
  if (failures.length) process.exitCode = 1;
}
