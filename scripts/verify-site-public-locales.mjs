/** Run explicitly after installation; this wrapper never changes a deployment. */
import {tsImport} from 'tsx/esm/api';
await tsImport('./verify-site-public-locales.ts', import.meta.url);
