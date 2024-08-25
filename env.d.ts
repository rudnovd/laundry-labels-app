/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/vue" />
/// <reference types="vite-svg-loader" />

interface ImportMetaEnv {
  // disable all limits on the local supabase instance
  readonly VITE_APP_IS_LOCAL_SUPABASE: 'true' | 'false'

  readonly VITE_APP_SUPABASE_URL: string
  readonly VITE_APP_SUPABASE_KEY: string

  // if VITE_APP_IS_LOCAL_SUPABASE is false
  readonly VITE_APP_CAPTCHA_KEY: string
  readonly __APP_VERSION__: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
