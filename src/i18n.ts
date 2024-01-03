import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { createI18n } from 'vue-i18n'
import type { UserSettings } from './types/types'
import { ref } from 'vue'

export type AvailableLocale = 'en-US' | 'ru'
export const availableLocales: ReadonlyArray<AvailableLocale> = ['en-US', 'ru']

const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  availableLocales,
})

export function getBrowserLocale(): AvailableLocale {
  const userLanguage = navigator.language
  const languageCode = userLanguage.trim().split(/-|_/)[0]
  const supportedLocale = availableLocales.find((language) => userLanguage === language || languageCode === language)
  return supportedLocale ?? 'en-US'
}

export const useLocale = () => {
  const { lang } = useQuasar()
  const userSettings = ref<UserSettings>(
    JSON.parse(localStorage.getItem('user-settings') ?? `{ language: ${getBrowserLocale()} }`),
  )
  const locale = computed({
    get() {
      return userSettings.value.language
    },
    async set(locale) {
      userSettings.value.language = locale
      const userSettingsInLocalStorage: Partial<UserSettings> = JSON.parse(
        localStorage.getItem('user-settings') ?? '{}',
      )
      localStorage.setItem('user-settings', JSON.stringify({ ...userSettingsInLocalStorage, ...userSettings.value }))
      const quasarLocaleData = import(`../node_modules/quasar/lang/${locale}.mjs`)
      const appLocaleData = import(`./locales/${locale}.json`)
      const locales = await Promise.all([quasarLocaleData, appLocaleData])
      lang.set(locales[0].default)
      i18n.global.setLocaleMessage(locale, locales[1].default)
      i18n.global.locale.value = locale
      document.querySelector('html')?.setAttribute('lang', locale)
    },
  })

  function initializeLocale() {
    locale.value = userSettings.value.language
  }

  return {
    locale,
    initializeLocale,
  }
}

export default i18n
