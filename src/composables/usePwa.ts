import type { RouteRecordName } from 'vue-router'
import { useEventListener } from '@vueuse/core'
import { QSpinnerGears, useQuasar } from 'quasar'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAppSettingsStore } from '@/store/settings'
import { demoStorage, userSettingsStorage } from '@/utils/localStorage'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

export default function usePwa() {
  const { t } = useI18n()
  const { notify, loading } = useQuasar()
  const appSettingsStore = useAppSettingsStore()
  const router = useRouter()

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

  const { updateServiceWorker, needRefresh } = useRegisterSW({ immediate: true })
  function updateApp() {
    loading.show({ message: t('common.updatingApp'), spinner: QSpinnerGears, ignoreDefaults: true })
    if (appSettingsStore.appHasUpdate)
      appSettingsStore.appHasUpdate = false
    updateServiceWorker()
  }

  watch(
    needRefresh,
    () => {
      if (userSettingsStorage.value.autoUpdateApp) {
        const { name } = router.currentRoute.value
        const ignoreUpdateInPages: ReadonlyArray<RouteRecordName> = ['Create item', 'Edit item', 'Sign in', 'Sign up']
        if ((name && ignoreUpdateInPages.includes(name)) || demoStorage.value.active)
          return

        updateApp()
      }
      else {
        appSettingsStore.appHasUpdate = true
      }
    },
    { once: true },
  )
}
