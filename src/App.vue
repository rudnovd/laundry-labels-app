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

    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { laundryIcons } from '@/assets/laundryIcons'
import { watchOnce } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

let icons: { [key: string]: string } = {}

laundryIcons.forEach((icon) => (icons[icon._id] = `img:/icons/laundry/${icon.group.replace(' ', '-')}/${icon._id}.svg`))

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
// const install = computed(() => userStore.options.install)
const showBackButton = computed(() => ['/', '/welcome', '/signin', '/signup'].indexOf(route.path) === -1)

$q.iconMapFn = (iconName) => {
  const icon = icons[iconName]
  if (icon !== void 0) return { icon }
}

const { updateServiceWorker, needRefresh } = useRegisterSW({
  immediate: true,
  onRegistered(registration) {
    if (registration) {
      /* eslint-disable no-console */
      console.log('Service worker registered')
    }
  },
  onRegisterError(error) {
    /* eslint-disable no-console */
    console.error(error)
  },
})

watchOnce(needRefresh, () => {
  $q.loading.show({ message: 'Updating app...' })
  updateServiceWorker()
})

// window.addEventListener('beforeinstallprompt', (event) => {
//   /* eslint-disable no-console */
//   console.log('beforeinstallprompt called')
//   event.preventDefault()
//   // install.value.event = event
//   // install.value.showInstallButton = true
// })

// window.addEventListener('appinstalled', () => {
//   install.value.event = null
//   /* eslint-disable no-console */
//   console.log('PWA was installed')
// })
</script>

<style lang="scss" scoped>
// .install-button {
//   position: fixed;
//   right: 24px;
//   bottom: 24px;
// }
</style>
