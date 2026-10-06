interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  // disable any network requests
  readonly VITE_IS_OFFLINE: 'true' | 'false'

  // disable all limits on the local supabase instance
  readonly VITE_IS_LOCAL_SUPABASE: 'true' | 'false'

  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_KEY: string

  // if using cloud supabase
  readonly VITE_CAPTCHA_KEY: string

  readonly VITE_IS_TAURI: 'true' | 'false'
  readonly VITE_APP_VERSION: string
  readonly VITE_GIT_COMMIT_SHA: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
