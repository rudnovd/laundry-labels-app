import type { AvailableLocale } from '@/i18n'
import { Quasar } from 'quasar'
import i18n, { availableLocales } from '@/i18n'
import { userSettingsStorage } from '@/utils/localStorage'

export function getBrowserLocale(): AvailableLocale {
  const userLanguage = navigator.language
  // eslint-disable-next-line e18e/prefer-static-regex
  const languageCode = userLanguage.trim().split(/-|_/)[0]
  const supportedLocale = availableLocales.find(language => userLanguage === language || languageCode === language)
  return supportedLocale ?? 'en-US'
}

export async function setLocale(locale: AvailableLocale) {
  userSettingsStorage.value.locale = locale
  const quasarLocaleData = import(`../../node_modules/quasar/lang/${locale}.js`)
  const appLocaleData = import(`../locales/${locale}.json`)
  const [quasarMessages, appMessages] = await Promise.all([quasarLocaleData, appLocaleData])
  Quasar.lang.set(quasarMessages.default)
  i18n.global.setLocaleMessage(locale, appMessages.default)
  i18n.global.locale.value = locale
  document.querySelector('html')!.setAttribute('lang', locale)
}
