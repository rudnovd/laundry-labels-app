import { createI18n } from 'vue-i18n'

export type AvailableLocale = 'en-US' | 'ru'
export const availableLocales: ReadonlyArray<AvailableLocale> = ['en-US', 'ru']

const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  availableLocales,
})

export default i18n
