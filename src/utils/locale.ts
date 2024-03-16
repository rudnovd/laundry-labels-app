import i18n, { type AvailableLocale, availableLocales } from '@/i18n'
import { Quasar } from 'quasar'
import { userSettingsStorage } from '@/utils/localStorage'

export function getBrowserLocale(): AvailableLocale {
  const userLanguage = navigator.language
  const languageCode = userLanguage.trim().split(/-|_/)[0]
  const supportedLocale = availableLocales.find((language) => userLanguage === language || languageCode === language)
  return supportedLocale ?? 'en-US'
}

export async function setLocale(locale: AvailableLocale) {
  userSettingsStorage.value.locale = locale
  const quasarLocaleData = import(`../../node_modules/quasar/lang/${locale}.mjs`)
  const appLocaleData = import(`../locales/${locale}.json`)
  const [quasarMessages, appMessages] = await Promise.all([quasarLocaleData, appLocaleData])
  Quasar.lang.set(quasarMessages.default)
  i18n.global.setLocaleMessage(locale, appMessages.default)
  i18n.global.locale.value = locale
  document.querySelector('html')!.setAttribute('lang', locale)
}
