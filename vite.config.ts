import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      exclude: /\.svg$/,
    }),
  ],
  server: {
    port: 5175,
    host: true,
    allowedHosts: true,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
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
})
