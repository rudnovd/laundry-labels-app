import { getBrowserLocale } from '@/i18n'
import type { LocalStorageDemo, UserSettings } from '@/types/types'
import { useLocalStorage } from '@vueuse/core'

export const userSettingsStorage = useLocalStorage<UserSettings>('user-settings', {
  language: getBrowserLocale(),
  autoUpdateApp: true,
  offlineMode: false,
  items: {
    standardTagsLocale: getBrowserLocale(),
  },
})

export const demoStorage = useLocalStorage<Partial<LocalStorageDemo>>(
  'demo',
  {},
  { listenToStorageChanges: false, writeDefaults: false },
)
