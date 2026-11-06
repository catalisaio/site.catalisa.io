import { getSiteBuildMode } from '../seo/release';
/** Local preview and release artifact are separate opt-in choices. */
export const liveRedesignPreview = import.meta.env.DEV && import.meta.env.VITE_REDESIGN_PREVIEW === '1';
export const redesignRelease = import.meta.env.VITE_SITE_RELEASE === 'redesign';
export const redesignIndexing = getSiteBuildMode({
  VITE_SITE_RELEASE: import.meta.env.VITE_SITE_RELEASE,
  VITE_SITE_INDEXING: import.meta.env.VITE_SITE_INDEXING,
  CONTEXT: import.meta.env.VITE_SITE_BUILD_CONTEXT,
}).indexing;
