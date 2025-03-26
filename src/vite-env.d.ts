/// <reference types="vite/client" />

// Declare media file modules
declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.srt' {
  const src: string;
  export default src;
}

// Extend Vite's ImportMeta interface to include environment variables
interface ImportMetaEnv {
  // Existing Supabase env vars
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  
  // Google Analytics env vars
  readonly VITE_GA_MEASUREMENT_ID: string;
  readonly VITE_ANALYTICS_ENABLED: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  
  // Google Tag Manager env vars
  readonly VITE_GTM_CONTAINER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
