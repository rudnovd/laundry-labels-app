import { useEventListener } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { QSpinnerGears, useQuasar } from 'quasar'
import { useAppSettingsStore } from '@/store/settings'
import { userSettingsStorage } from '@/utils/localStorage'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
}

export default function usePwa() {
  const { t } = useI18n()
  const { notify, loading } = useQuasar()
  const appSettingsStore = useAppSettingsStore()

  const isBrowser = window.matchMedia('(display-mode: browser)').matches
  if (isBrowser) {
    useEventListener(window, 'beforeinstallprompt', (event: BeforeInstallPromptEvent) => {
      event.preventDefault()
      appSettingsStore.appInstallation = {
        showInstallButton: true,
        event,
      }
    })

    useEventListener(window, 'appinstalled', () => {
      notify({ type: 'positive', message: t('notifications.appInstalled') })
      delete appSettingsStore.appInstallation
    })
  }
  if (!userSettingsStorage.value.autoUpdateApp) {
    useEventListener(window, 'update-app', updateApp)
  }

  function updateApp() {
    loading.show({ message: 'Updating app...', spinner: QSpinnerGears, ignoreDefaults: true })
    if (appSettingsStore.appHasUpdate) {
      appSettingsStore.appHasUpdate = false
    }
    updateServiceWorker()
  }

  const { updateServiceWorker, needRefresh } = useRegisterSW({
    immediate: true,
  })

  return {
    needRefresh,
    updateApp,
  }
}
