<template>
  <router-view />
</template>

<script setup lang="ts">
import { laundryIcons } from '@/assets/laundryIcons'
import { watchOnce } from '@vueuse/core'
import { QSpinnerGears, useQuasar } from 'quasar'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { onMounted, onUnmounted } from 'vue'
import { useUserStore } from './store/user'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
}

let icons: { [key: string]: string } = {}

laundryIcons.forEach((icon) => (icons[icon._id] = `img:/icons/laundry/${icon.group}/${icon._id}.svg`))

const $q = useQuasar()
const userStore = useUserStore()
const isBrowser = window.matchMedia('(display-mode: browser)').matches

$q.iconMapFn = (iconName) => {
  const icon = icons[iconName]
  if (icon !== void 0) return { icon }
}

const { updateServiceWorker, needRefresh } = useRegisterSW({
  immediate: true,
})

onMounted(() => {
  if (isBrowser) {
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.removeEventListener('appinstalled', onAppInstalled)
})

watchOnce(needRefresh, () => {
  $q.loading.show({ message: 'Updating app...', spinner: QSpinnerGears, ignoreDefaults: true })
  updateServiceWorker()
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
</script>
