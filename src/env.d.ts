/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VUE_APP_CAPTCHA_KEY: string
  readonly VUE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
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
