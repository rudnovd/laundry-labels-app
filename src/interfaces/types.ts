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
