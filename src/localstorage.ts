import { LocalStorage } from 'quasar'

interface UserSettings {
  offlineMode: boolean
}

export const userSettings = LocalStorage.getItem('userSettings') as UserSettings

export function setUserSettings(values: Record<string, unknown>) {
  LocalStorage.set('userSettings', { ...userSettings, ...values })
}
