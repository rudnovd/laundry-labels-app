/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_CAPTCHA_KEY: string
  readonly __APP_VERSION__: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '@hcaptcha/vue3-hcaptcha' {
  import Vue from 'vue'

  declare class VueHcaptcha extends Vue {
    sitekey: string
    theme?: string
    size?: string
    tabindex?: string
    language?: string
    reCaptchaCompat?: boolean
    challengeContainer?: string
    rqdata?: string
    sentry?: boolean
    endpoint?: string
    reportapi?: string
    assethost?: string
    imghost?: string

    execute(): void
    reset(): void
  }

  export default VueHcaptcha
}
