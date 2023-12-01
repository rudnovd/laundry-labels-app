import type { RouteRecordName } from 'vue-router'

export interface UserSettings {
  autoUpdateApp: boolean
  offlineMode: boolean
  items: {
    standardTagsLocale: string
  }
}

export interface ErrorResponse {
  name: string
  message: string
}

export interface LocalStorageDemo {
  active: boolean
  page: RouteRecordName | null | undefined
  // step id
  step: string | null
}
