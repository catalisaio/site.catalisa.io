/** Release flags are opt-in. They never authorize a production deployment. */
export interface SiteBuildMode { redesign: boolean; indexing: boolean }
export function getSiteBuildMode(env: Record<string, string | undefined>): SiteBuildMode {
  const redesign = env.VITE_SITE_RELEASE === 'redesign';
  return { redesign, indexing: redesign && env.VITE_SITE_INDEXING === 'enabled' && env.CONTEXT === 'production' };
}
