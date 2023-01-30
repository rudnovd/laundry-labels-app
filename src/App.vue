<template>
  <q-layout container>
    <q-header class="bg-light-green-5 text-white">
      <q-toolbar>
        <q-btn v-show="showBackButton" icon="arrow_back" flat no-wrap padding="0" :to="previousPageLink" replace />
        <q-toolbar-title class="flex items-center justify-between">
          <q-btn flat icon="sell" label="Laundry Labels" to="/" :ripple="false" padding="0" />
          <q-btn flat icon="person" to="/profile" :ripple="false" padding="0" />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <router-view v-slot="{ Component }">
          <KeepAlive :include="keepAliveComponents">
            <component :is="Component" />
          </KeepAlive>
        </router-view>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { laundryIcons } from '@/assets/laundryIcons'
import { computedWithControl, watchOnce } from '@vueuse/core'
import { QSpinnerGears, useQuasar } from 'quasar'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from './store/user'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
}

let icons: { [key: string]: string } = {}

laundryIcons.forEach((icon) => (icons[icon._id] = `img:/icons/laundry/${icon.group}/${icon._id}.svg`))

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const showBackButton = computed(() => ['/', '/welcome', '/signin', '/signup'].indexOf(route.path) === -1)
const keepAliveComponents = ['HomePage']
const isBrowser = window.matchMedia('(display-mode: browser)').matches

$q.iconMapFn = (iconName) => {
  const icon = icons[iconName]
  if (icon !== void 0) return { icon }
}

const { updateServiceWorker, needRefresh } = useRegisterSW({
  immediate: true,
})

const previousPageLink = computedWithControl(router.currentRoute, () => {
  if (window.history.state.back === router.currentRoute.value.path) {
    return '/'
  } else {
    return window.history.state.back || '/'
  }
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
