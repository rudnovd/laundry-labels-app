import type { RouteRecordName } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import type { AvailableLocale } from '@/i18n'
import { getBrowserLocale } from '@/utils/locale'

interface UserSettingsLocalStorage {
  locale: AvailableLocale
  autoUpdateApp: boolean
  offlineMode: boolean
  items: {
    standardTagsLocale: AvailableLocale
  }
}

interface DemoLocalStorage {
  active: boolean
  page: RouteRecordName | null | undefined
  step: string | null
}

export const userSettingsStorage = useLocalStorage<UserSettingsLocalStorage>('user-settings', {
  locale: getBrowserLocale(),
  autoUpdateApp: true,
  offlineMode: false,
  items: {
    standardTagsLocale: getBrowserLocale(),
  },
})

export const demoStorage = useLocalStorage<Partial<DemoLocalStorage>>(
  'demo',
  {},
  { listenToStorageChanges: false, writeDefaults: false },
)
