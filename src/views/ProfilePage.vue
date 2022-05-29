<template>
  <section class="profile-page q-pa-sm flex justify-center">
    <div>
      <q-toggle v-model="offlineMode" :disable="!isOnline" color="green" label="Offline mode" left-label />
      <q-btn icon="help_outline" flat dense @click="showOfflineModeModal" />
    </div>
    <q-btn v-if="!user" color="primary" label="Login" icon="login" to="/login" />
    <q-btn v-if="!user" color="primary" label="Registration" icon="person" to="/registration" />
    <q-btn v-if="user" color="primary" label="Logout" icon="logout" @click="callLogoutDialog" />
    <q-btn v-if="showInstallButton" color="primary" label="Install app" @click="installApp" />
    App version: {{ appVersion }}
  </section>
</template>

<script setup lang="ts">
import { setUserSettings } from '@/localstorage'
import { useUserStore } from '@/store/user'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const userStore = useUserStore()
const router = useRouter()

const isOnline = computed(() => userStore.isOnline)
const user = computed(() => userStore.user._id)
const install = computed(() => userStore.options.install)
const offlineMode = computed({
  get: () => userStore.offlineMode,
  set: (value) => {
    userStore.offlineMode = value
    setUserSettings({ offlineMode: value })
  },
})
const showInstallButton = computed(() => userStore.options.install.showInstallButton)

const callLogoutDialog = () => {
  $q.dialog({
    title: 'Logout',
    message: 'Would you like to sign out?',
    cancel: true,
  }).onOk(() => {
    $q.loading.show()
    userStore
      .logout()
      .then(() => {
        $q.notify({
          type: 'positive',
          message: 'Sign out successfully',
        })
        router.push('/')
      })
      .finally(() => $q.loading.hide())
  })
}

const showOfflineModeModal = () => {
  $q.dialog({
    message: 'All items store in your device. They can be synced with server if you have account.',
  })
}

const installApp = () => {
  install.value.event?.prompt()
}

const appVersion = import.meta.env.__APP_VERSION__
</script>

<style lang="scss" scoped>
.profile-page {
  display: grid;
  gap: 1rem;
}
</style>
