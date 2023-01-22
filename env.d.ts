/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_CAPTCHA_KEY: string
  readonly __APP_VERSION__: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '@hcaptcha/vue3-hcaptcha'
