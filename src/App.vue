<template>
  <router-view />
</template>

<script setup lang="ts">
import { laundryIcons } from '@/assets/laundryIcons'
import { useLocalStorage, watchOnce } from '@vueuse/core'
import { QSpinnerGears, useQuasar } from 'quasar'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, type RouteRecordName } from 'vue-router'
import { useLocale } from './i18n'
import type { UserSettings } from './interfaces/types'
import { useAppSettingsStore } from './store/settings'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
}

let icons: { [key: string]: string } = {}
laundryIcons.forEach((icon) => (icons[icon._id] = `img:/icons/laundry/${icon.group}/${icon._id}.svg`))

const $q = useQuasar()
const router = useRouter()
const isBrowser = window.matchMedia('(display-mode: browser)').matches
const { updateServiceWorker, needRefresh } = useRegisterSW({
  immediate: true,
})
const { t } = useI18n()
const { locale, initializeLocale } = useLocale()
initializeLocale()
const appSettingsStore = useAppSettingsStore()
const userSettings = useLocalStorage<UserSettings>(
  'user-settings',
  {
    autoUpdateApp: true,
    offlineMode: false,
    items: {
      standardTagsLocale: locale.value,
    },
  },
  { mergeDefaults: true }
)
const demoStorage = useLocalStorage(
  'demo',
  {
    active: false,
  },
  { writeDefaults: false }
)

$q.iconMapFn = (iconName) => {
  const icon = icons[iconName]
  if (icon !== void 0) return { icon }
}

onMounted(() => {
  if (isBrowser) {
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.removeEventListener('appinstalled', onAppInstalled)
  window.removeEventListener('update-app', updateApp)
})

watchOnce(needRefresh, () => {
  if (userSettings.value.autoUpdateApp) {
    const { name } = router.currentRoute.value
    const ignoreUpdateInPages: ReadonlyArray<RouteRecordName> = ['Create item', 'Edit item', 'Sign in', 'Sign up']

    if (!name || ignoreUpdateInPages.includes(name.toString()) || demoStorage.value.active) {
      return
    }

    updateApp()
  } else {
    appSettingsStore.appHasUpdate = true
  }
})

const onBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
  event.preventDefault()
  appSettingsStore.appInstallation = {
    showInstallButton: true,
    event,
  }
}

const onAppInstalled = () => {
  $q.notify({ type: 'positive', message: t('notifications.appInstalled') })
  delete appSettingsStore.appInstallation
}

const updateApp = () => {
  $q.loading.show({ message: 'Updating app...', spinner: QSpinnerGears, ignoreDefaults: true })
  if (appSettingsStore?.appHasUpdate) {
    appSettingsStore.appHasUpdate = false
  }
  updateServiceWorker()
}

if (!userSettings.value.autoUpdateApp) {
  window.addEventListener('update-app', updateApp)
}
</script>
