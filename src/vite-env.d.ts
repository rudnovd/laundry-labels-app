interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}
interface ImportMetaEnv {
  readonly VITE_IS_OFFLINE: 'true' | 'false' // Disables all network requests when set to `'true'`
  readonly VITE_IS_LOCAL_SUPABASE: 'true' | 'false' // Disables all limits enforced by the local Supabase instance when set to `'true'`
  readonly VITE_SUPABASE_URL: string // Required unless `VITE_IS_OFFLINE` is `'true'`
  readonly VITE_SUPABASE_KEY: string // Required unless `VITE_IS_OFFLINE` is `'true'`
  readonly VITE_CAPTCHA_KEY: string // Required when using a cloud-hosted Supabase instance
  readonly VITE_IS_TAURI: 'true' | 'false' // Enables Tauri-specific features for Android builds when set to `'true'`
  readonly VITE_APP_VERSION: `${string}.${string}.${string}`
  readonly VITE_GIT_COMMIT_SHA: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
