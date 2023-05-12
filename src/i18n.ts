import { useLocalStorage } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { createI18n } from 'vue-i18n'

export const availableLocales: Readonly<Array<string>> = ['en-US', 'ru']

const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  availableLocales,
})

export function getBrowserLocale() {
  if (!navigator.language) {
    return 'en-US'
  }

  const navigatorLanguage = navigator.language === 'en-US' ? 'en-US' : navigator.language.trim().split(/-|_/)[0]
  if (availableLocales.includes(navigatorLanguage)) {
    return navigatorLanguage
  } else {
    return 'en-US'
  }
}

export const useLocale = () => {
  const { lang } = useQuasar()
  const selectedLocale = useLocalStorage('locale', getBrowserLocale() || 'en-US')
  const locale = computed({
    get() {
      return selectedLocale.value
    },
    async set(value) {
      selectedLocale.value = value
      const quasarLocaleData = import(`../node_modules/quasar/lang/${value}.mjs`)
      const appLocaleData = import(`./locales/${value}.json`)
      const locales = await Promise.all([quasarLocaleData, appLocaleData])
      lang.set(locales[0].default)
      i18n.global.setLocaleMessage(selectedLocale.value, locales[1].default)
      i18n.global.locale.value = selectedLocale.value
      document.querySelector('html')?.setAttribute('lang', selectedLocale.value)
    },
  })

  function initializeLocale() {
    locale.value = selectedLocale.value
  }

  return {
    locale,
    initializeLocale,
  }
}

export default i18n
