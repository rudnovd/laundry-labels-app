import type { RouteRecordName } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import type { AvailableLocale } from '@/i18n'
import { getBrowserLocale } from '@/utils/locale'
import { IS_OFFLINE_APP } from '@/constants'

interface UserSettingsLocalStorage {
  locale: AvailableLocale
  autoUpdateApp: boolean
  offlineMode: boolean
  previousOfflineMode: boolean
  items: {
    standardTagsLocale: AvailableLocale
  }
}

interface DemoLocalStorage {
  active: boolean
  page: RouteRecordName | null | undefined
  step: string | null
}

export const userSettingsStorage = useLocalStorage<UserSettingsLocalStorage>(
  'user-settings',
  {
    locale: getBrowserLocale(),
    autoUpdateApp: !IS_OFFLINE_APP,
    offlineMode: IS_OFFLINE_APP,
    previousOfflineMode: IS_OFFLINE_APP,
    items: {
      standardTagsLocale: getBrowserLocale(),
    },
  },
  {
    mergeDefaults(storageValue: Partial<UserSettingsLocalStorage>, defaults) {
      return {
        autoUpdateApp: storageValue?.autoUpdateApp ?? defaults.autoUpdateApp,
        locale: storageValue?.locale ?? defaults.locale,
        offlineMode: storageValue?.offlineMode ?? defaults.offlineMode,
        previousOfflineMode: storageValue?.previousOfflineMode ?? defaults.previousOfflineMode,
        items: {
          standardTagsLocale: storageValue.items?.standardTagsLocale ?? defaults.items.standardTagsLocale,
        },
      }
    },
    serializer: {
      read(value) {
        return JSON.parse(value)
      },
      write(value) {
        if (IS_OFFLINE_APP) {
          value.autoUpdateApp = true
          value.offlineMode = true
          value.previousOfflineMode = true
        }
        return JSON.stringify(value)
      },
    },
  },
)

export const demoStorage = useLocalStorage<Partial<DemoLocalStorage>>(
  'demo',
  {},
  { listenToStorageChanges: false, writeDefaults: false },
)
