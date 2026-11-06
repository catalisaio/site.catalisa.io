/** Read-only discovery. Never send a chat message, create a lead or exercise a delivery channel. */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { parse } from 'dotenv';

const envFile = process.argv[2] ?? path.join(os.homedir(), '.config/catalisa/hotsite-tenant-agora.staging.env');
const config = parse(await fs.readFile(envFile));
const allowedOrigin = 'https://panel-api.wpp.bb.stg.catalisa.app';
const origin = new URL(config.PANEL_API ?? allowedOrigin);
if (origin.origin !== allowedOrigin || origin.username || origin.password) throw new Error('Only the verified staging origin is allowed.');
const result = { date: new Date().toISOString(), origin: allowedOrigin, scope: 'Read-only discovery using an existing staging hotsite configuration. This candidate is not yet selected as the new institutional site tenant/agent.', candidateOnly: true, operations: [] };
let transportFailed = false;

async function inspect(label, resource, authenticated, summarize) {
  if (authenticated && !config.AGORA_API_TOKEN) { result.operations.push({ label, skipped: 'Candidate API token is not configured.' }); return; }
  try {
    const response = await fetch(allowedOrigin + resource, { method: 'GET', redirect: 'error', headers: { Accept: 'application/json', ...(authenticated ? { Authorization: `Bearer ${config.AGORA_API_TOKEN}` } : {}) }, signal: AbortSignal.timeout(15000) });
    let payload;
    if (response.ok && response.headers.get('content-type')?.includes('application/json')) payload = await response.json();
    result.operations.push({ label, method: 'GET', status: response.status, ...(response.ok && payload ? summarize(payload) : {}) });
  } catch (error) {
    transportFailed = true;
    result.operations.push({ label, method: 'GET', transportError: error.cause?.code ?? error.code ?? error.name });
  }
}

await inspect('AI service status', '/ai/status', false, data => ({ enabled: data.enabled === true }));
if (config.CHAT_AGENT_ID && /^[\w-]{1,120}$/.test(config.CHAT_AGENT_ID)) {
  await inspect('Configured candidate agent metadata', `/agents/${config.CHAT_AGENT_ID}`, true, data => ({ agentReachable: true, active: typeof data.active === 'boolean' ? data.active : typeof data.isActive === 'boolean' ? data.isActive : null, declaredToolCount: Array.isArray(data.tools) ? data.tools.length : null }));
}
if (config.CAPTURE_CODE && /^[\w-]{1,160}$/.test(config.CAPTURE_CODE)) {
  await inspect('Configured candidate public capture contract', `/public/capture/${config.CAPTURE_CODE}`, false, data => ({ captureReachable: true, fields: Array.isArray(data.formFields) ? data.formFields.map(field => ({ type: String(field.type ?? ''), required: field.required === true })) : null }));
}
await fs.mkdir('docs/redesign-2026-10-22/qa/integrations', { recursive: true });
await fs.writeFile('docs/redesign-2026-10-22/qa/integrations/staging-readonly.json', JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
if (transportFailed) process.exitCode = 1;
