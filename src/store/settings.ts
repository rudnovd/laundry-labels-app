import { defineStore } from 'pinia'

interface AppSettingsState {
  appHasUpdate: boolean
  appInstallation?: {
    event: Event & { prompt(): Promise<void> }
    showInstallButton: boolean
  }
}

export const useAppSettingsStore = defineStore('app-settings', {
  state: (): AppSettingsState => ({
    appHasUpdate: false,
  }),
})
