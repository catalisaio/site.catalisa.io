import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getSiteBuildMode, type SiteBuildMode } from '../src/seo/release';

/** Read the Vite artifact's flags, so postbuild never indexes a different release mode. */
export function getArtifactBuildMode(directory = process.env.SITE_DIST_DIR || 'dist'): SiteBuildMode {
  const manifest = resolve(directory, 'site-build.json');
  if (!existsSync(manifest)) return getSiteBuildMode(process.env);
  const mode = JSON.parse(readFileSync(manifest, 'utf8')) as SiteBuildMode;
  if (typeof mode.redesign !== 'boolean' || typeof mode.indexing !== 'boolean' || (mode.indexing && !mode.redesign)) throw new Error('Invalid site-build.json');
  return mode;
}
