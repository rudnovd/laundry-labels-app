export interface UserSettings {
  autoUpdateApp: boolean
  items: {
    standardTagsLocale: string
  }
}

export interface ErrorResponse {
  name: string
  message: string
}
