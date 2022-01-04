<template>
  <q-layout container>
    <q-header class="bg-light-green-5 text-white">
      <q-toolbar>
        <q-btn v-show="showBackButton" icon="arrow_back" flat no-wrap padding="0" @click="router.back()" />
        <q-toolbar-title class="flex items-center justify-between">
          <q-btn flat icon="sell" label="Laundry Labels" to="/" :ripple="false" padding="0" />
          <q-btn flat icon="person" to="/profile" :ripple="false" padding="0" />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <main>
      <q-page-container class="full-height">
        <router-view />
      </q-page-container>
    </main>
  </q-layout>
</template>

<script lang="ts">
import { laundryIcons } from '@/assets/laundryIcons'
import { useStore } from '@/store'
import { useOnline } from '@vueuse/core'
import { LocalStorage, useQuasar } from 'quasar'
import { computed, defineComponent, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

let icons: { [key: string]: string } = {}

laundryIcons.forEach((icon) => (icons[icon.icon] = icon.path))

export default defineComponent({
  name: 'App',
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const online = useOnline()

    const isOnline = computed({ get: () => store.isOnline, set: (newOnline) => (store.isOnline = newOnline) })
    const install = computed(() => store.options.install)
    const showBackButton = computed(() => ['/', '/welcome'].indexOf(route.path) === -1)

    $q.iconMapFn = (iconName) => {
      const icon = icons[iconName]
      if (icon !== void 0) return { icon }
    }

    window.addEventListener('beforeinstallprompt', (event) => {
      /* eslint-disable no-console */
      console.log('beforeinstallprompt called')
      event.preventDefault()
      install.value.event = event
      install.value.showInstallButton = true
    })

    window.addEventListener('appinstalled', () => {
      install.value.event = null
      /* eslint-disable no-console */
      console.log('PWA was installed')
    })

    // create localstorage item with user settings
    if (!LocalStorage.getItem('userSettings')) {
      LocalStorage.set('userSettings', { offlineMode: false })
    }

    watch(online, (newOnline) => (isOnline.value = newOnline))

    return {
      router,

      showBackButton,
    }
  },
})
</script>

<style lang="scss" scoped>
.install-button {
  position: fixed;
  right: 24px;
  bottom: 24px;
}

.loading-app {
  display: grid;
  gap: 1rem;
  height: 100vh;
  place-content: center;
  place-items: center;
}
</style>
