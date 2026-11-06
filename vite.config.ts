import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { siteReleasePlugin } from './scripts/vite-release';
import { siteApiPlugin } from './server/site/vite-plugin'

export default defineConfig(({mode}) => {
  const environment = {...loadEnv(mode, process.cwd(), ''), ...process.env};
  return {
  // Keep the browser indexing gate aligned with the hosting build context.
  define: { 'import.meta.env.VITE_SITE_BUILD_CONTEXT': JSON.stringify(environment.CONTEXT ?? '') },
  plugins: [
    react(),
    siteReleasePlugin(environment),
    siteApiPlugin(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      // Keep the supplied, downloadable brand originals byte-for-byte.
      exclude: /\.svg$|redesign[\\/]brand[\\/]/,
    }),
  ],
  server: {
    port: 5175,
    host: true,
    allowedHosts: true,
    watch: { ignored: ['**/docs/**', '**/.local/**'] },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Native and compatibility apps share only actual static imports.
          // Forcing framework chunks creates CommonJS initialization cycles;
          // automatic Rollup splitting preserves the native bootstrap boundary.
          if(environment.VITE_SITE_RELEASE==='redesign')return undefined;
          // Vendor libs
          if (id.includes('node_modules/react-dom')) return 'vendor';
          if (id.includes('node_modules/react-router')) return 'vendor';
          if (id.includes('node_modules/react/')) return 'vendor';
          if (id.includes('node_modules/@chakra-ui') || id.includes('node_modules/@emotion')) return 'chakra';
          if (id.includes('node_modules/framer-motion')) return 'motion';
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) return 'i18n';
          if (id.includes('node_modules/react-icons')) return 'icons';

          // Presentation slides — single chunk (not loaded on home)
          if (id.includes('/presentation/')) return 'presentation';

          // Insights — consolidate into single chunk to avoid duplicates
          if (id.includes('/insights/') || id.includes('data/articles')) return 'insights';

          // Playbooks — consolidate
          if (id.includes('/playbooks') || id.includes('PlaybookCard') || id.includes('PlaybookDetail')) return 'playbooks';
        },
      },
    },
  },
};
})
