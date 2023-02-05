<template>
  <q-page class="q-pa-sm column flex-center">
    <div class="column q-gutter-y-sm">
      <q-btn
        v-if="userStore.settings.installApp?.show"
        color="primary"
        label="Install app"
        icon="install_mobile"
        @click="userStore.settings.installApp?.event.prompt()"
      />

      <!-- <q-toggle :model-value="dark.isActive" label="Dark mode" @update:model-value="dark.toggle()" /> -->

      <q-btn v-if="user" color="primary" label="Sign Out" icon="logout" @click="callLogoutDialog" />
    </div>

    <div class="column q-mt-sm">App version: {{ appVersion }}</div>
  </q-page>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const { loading, dialog, notify } = useQuasar()
const userStore = useUserStore()
const router = useRouter()

const user = computed(() => userStore.user)

const callLogoutDialog = () => {
  dialog({
    title: 'Logout',
    message: 'Would you like to sign out?',
    cancel: true,
  }).onOk(() => {
    loading.show()
    userStore
      .signOut()
      .then(() => {
        notify({
          type: 'positive',
          message: 'Sign out successfully',
        })
        router.push({ name: 'Home' })
      })
      .finally(() => loading.hide())
  })
}

const appVersion = import.meta.env.__APP_VERSION__
</script>
