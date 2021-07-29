<template>
  <div v-if="firebaseAuthIsLoading" class="loading-app">
    <q-circular-progress indeterminate size="50px" color="grey-4" />
    <div>Loading app...</div>
  </div>

  <q-layout v-if="!firebaseAuthIsLoading" container>
    <q-header class="bg-light-green-5 text-white">
      <q-toolbar>
        <q-btn v-show="showBackButton" icon="arrow_back" flat no-wrap padding="0" @click="router.back()" />
        <q-toolbar-title class="flex items-center justify-between">
          <q-btn flat icon="sell" label="Laundry Labels" to="/" :ripple="false" padding="0" />
          <q-btn flat icon="person" to="/profile" :ripple="false" padding="0" />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- <q-footer v-if="user" bordered class="bg-light-green-5 text-white" elevated>
      <q-tabs v-model="tab" inline-label>
        <q-route-tab name="Laundry" icon="home" label="Home" to="/" />
        <q-route-tab name="Profile" icon="person" label="Profile" to="/profile" />
      </q-tabs>
    </q-footer> -->

    <main>
      <q-page-container class="full-height">
        <router-view />
      </q-page-container>
    </main>

    <button v-if="showInstallButton" class="install-button" type="button" @click="installApp">Install App</button>
  </q-layout>
</template>

<script lang="ts">
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { useQuasar } from 'quasar'
import { computed, defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const laundryIcons: { [key: string]: string } = {
  'app:laundry-icon-bleaching': `img:/icons/laundry/wh-bleaching.svg`,
  'app:laundry-icon-iron': `img:/icons/laundry/wh-iron.svg`,
  'app:laundry-icon-washing-90deg': `img:/icons/laundry/wh-washing-90deg.svg`,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let installEvent: any

export default defineComponent({
  name: 'App',
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()

    const showInstallButton = ref(false)
    const firebaseAuthIsLoading = ref(true)

    const auth = getAuth()
    onAuthStateChanged(auth, () => (firebaseAuthIsLoading.value = false))

    const showBackButton = computed(() => ['/', '/welcome'].indexOf(route.path) === -1)

    $q.iconMapFn = (iconName) => {
      const icon = laundryIcons[iconName]
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
      // tab: ref('Home'),
      // user,
      showBackButton,
      showInstallButton,
      installApp,
      firebaseAuthIsLoading,
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
