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

    <button v-if="showInstallButton" class="install-button" type="button" @click="installApp">Install App</button>
  </q-layout>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { computed, defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { laundryIcons } from './assets/laundryIcons'

let icons: { [key: string]: string } = {}

laundryIcons.forEach((icon) => (icons[icon.icon] = icon.path))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let installEvent: any

export default defineComponent({
  name: 'App',
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()

    const showInstallButton = ref(false)

    const showBackButton = computed(() => ['/', '/welcome'].indexOf(route.path) === -1)

    $q.iconMapFn = (iconName) => {
      const icon = icons[iconName]
      if (icon !== void 0) return { icon }
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      /* eslint-disable no-console */
      console.log('beforeinstallprompt called')
      e.preventDefault()
      installEvent = e
      showInstallButton.value = true
    })

    const installApp = () => {
      showInstallButton.value = false
      installEvent.prompt()
      installEvent.userChoice.then(() => {
        installEvent = null
      })
    }

    return {
      router,
      showBackButton,
      showInstallButton,
      installApp,
    }
  },
})
</script>

<style>
@import '~@/styles/main.scss';
</style>

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
