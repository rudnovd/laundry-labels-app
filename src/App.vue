<template>
  <router-view />
</template>

<script setup lang="ts">
import { laundryIcons } from '@/assets/laundryIcons'
import { useLocalStorage, watchOnce } from '@vueuse/core'
import { QSpinnerGears, useQuasar } from 'quasar'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { UserSettings } from './interfaces/types'
import { useUserStore } from './store/user'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
}

let icons: { [key: string]: string } = {}
laundryIcons.forEach((icon) => (icons[icon._id] = `img:/icons/laundry/${icon.group}/${icon._id}.svg`))

const $q = useQuasar()
const userStore = useUserStore()
const router = useRouter()
const isBrowser = window.matchMedia('(display-mode: browser)').matches
const userSettings = useLocalStorage<UserSettings>('user-settings', {
  autoUpdateApp: true,
})

const { updateServiceWorker, needRefresh } = useRegisterSW({
  immediate: true,
})
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
    const ignoreUpdateInPages = ['Create item', 'Edit item']
    if (router.currentRoute.value.name && !ignoreUpdateInPages.includes(router.currentRoute.value.name as string)) {
      updateApp()
    }
  } else {
    userStore.settings.appHasUpdate = true
  }
})

const onBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
  event.preventDefault()
  userStore.settings.installApp = {
    show: true,
    event,
  }
}

const onAppInstalled = () => {
  $q.notify({ type: 'positive', message: 'App installed' })
  delete userStore.settings.installApp
}

const updateApp = () => {
  $q.loading.show({ message: 'Updating app...', spinner: QSpinnerGears, ignoreDefaults: true })
  if (userStore?.settings?.appHasUpdate) {
    userStore.settings.appHasUpdate = false
  }
  updateServiceWorker()
}

if (!userSettings.value.autoUpdateApp) {
  window.addEventListener('update-app', updateApp)
}
</script>
