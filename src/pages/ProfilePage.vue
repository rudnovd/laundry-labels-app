<template>
  <section class="q-pa-sm column flex-center">
    <div class="column q-gutter-y-sm">
      <q-btn v-if="!user" color="primary" label="Sign in" icon="login" to="/signin" />
      <q-btn v-if="!user" color="primary" label="Sign up" icon="person" to="/signup" />
      <q-btn v-if="user" color="primary" label="Sign Out" icon="logout" @click="callLogoutDialog" />
      <!-- <q-btn v-if="showInstallButton" color="primary" label="Install app" @click="installApp" /> -->
    </div>

    <div class="column q-mt-sm">App version: {{ appVersion }}</div>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const userStore = useUserStore()
const router = useRouter()

const user = computed(() => userStore.user)
// const install = computed(() => userStore.options.install)
// const showInstallButton = computed(() => userStore.options.install.showInstallButton)

const callLogoutDialog = () => {
  $q.dialog({
    title: 'Logout',
    message: 'Would you like to sign out?',
    cancel: true,
  }).onOk(() => {
    $q.loading.show()
    userStore
      .signOut()
      .then(() => {
        $q.notify({
          type: 'positive',
          message: 'Sign out successfully',
        })
        router.push('/welcome')
      })
      .finally(() => $q.loading.hide())
  })
}
// const installApp = () => {
//   install.value.event?.prompt()
// }

const appVersion = import.meta.env.__APP_VERSION__
</script>
