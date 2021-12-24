<template>
  <section class="profile-page q-pa-sm flex justify-center">
    <q-btn v-if="user" color="primary" label="Logout" icon="logout" @click="callLogoutDialog" />
    <q-btn v-if="showInstallButton" color="primary" label="Install app" @click="installApp" />
    App version: {{ appVersion }}
  </section>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { useQuasar } from 'quasar'
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let installEvent: any
const appVersion = '__APP_VERSION__'

export default defineComponent({
  name: 'ProfilePage',
  setup() {
    const $q = useQuasar()
    const store = useStore()
    const router = useRouter()

    const user = computed(() => store.user)
    const showInstallButton = ref(false)

    window.addEventListener('beforeinstallprompt', (event) => {
      /* eslint-disable no-console */
      console.log('beforeinstallprompt called')
      event.preventDefault()
      installEvent = event
      showInstallButton.value = true
    })

    window.addEventListener('appinstalled', () => {
      showInstallButton.value = false
      installEvent = null
      /* eslint-disable no-console */
      console.log('PWA was installed')
    })

    const callLogoutDialog = () => {
      $q.dialog({
        title: 'Logout',
        message: 'Would you like to sign out?',
        cancel: true,
      }).onOk(() => {
        $q.loading.show()
        store
          .logout()
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

    const installApp = () => installEvent.prompt()

    return {
      user,
      showInstallButton,
      appVersion,

      callLogoutDialog,
      installApp,
    }
  },
})
</script>

<style lang="scss" scoped>
.profile-page {
  display: grid;
  gap: 1rem;
}
</style>
