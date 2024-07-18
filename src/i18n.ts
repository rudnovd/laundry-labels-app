import { createI18n } from 'vue-i18n'

export type AvailableLocale = 'en-US' | 'ru'
export const availableLocales: ReadonlyArray<AvailableLocale> = ['en-US', 'ru']

const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  availableLocales,
  pluralRules: {
    ru: pluralizationRu,
  },
})

function pluralizationRu(count: number) {
  if (count % 10 === 1 && count % 100 !== 11) return 0
  else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 1
  return 2
}

export default i18n
