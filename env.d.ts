/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/vue" />
/// <reference types="vite-svg-loader" />

interface ImportMetaEnv {
  readonly VITE_APP_CAPTCHA_KEY: string
  readonly __APP_VERSION__: string
  readonly VITE_APP_IS_LOCAL: string
  readonly VITE_APP_SUPABASE_URL: string
  readonly VITE_APP_SUPABASE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
