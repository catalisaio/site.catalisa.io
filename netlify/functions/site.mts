import type { Config, Context } from '@netlify/functions';
import { siteRuntime } from '../../server/site/runtime';

let runtime: ReturnType<typeof siteRuntime> | undefined;
export default async (request: Request, context: Context) => {
  try {
    runtime ??= siteRuntime(process.env, false).catch(error => { runtime = undefined; throw error; });
    return await (await runtime)(request, context.ip);
  } catch {
    return Response.json({ code: 'service_unavailable', message: 'A conversa está temporariamente indisponível.', retryable: true, requestId: crypto.randomUUID() }, { status: 503, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
  }
};
export const config: Config = { path: ['/api/site/*','/api/internal/handoff-events'] };
