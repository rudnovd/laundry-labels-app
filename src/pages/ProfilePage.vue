<template>
  <q-page class="profile-page q-pa-sm">
    <section class="actions">
      <q-btn
        v-if="isOnline && userStore.settings.installApp?.show"
        color="primary"
        label="Install app"
        icon="install_mobile"
        @click="userStore.settings.installApp?.event.prompt()"
      />

      <!-- <q-toggle :model-value="dark.isActive" label="Dark mode" @update:model-value="dark.toggle()" /> -->

      <q-btn
        v-if="isOnline && userStore.user?._id"
        color="primary"
        label="Sign Out"
        icon="logout"
        @click="callLogoutDialog"
      />
    </section>

    <section class="app-version">
      App version: {{ appVersion }}
      <a href="https://github.com/rudnovd/laundry-labels-app" rel="noopener" target="_blank">
        <img src="/icons/social/github-mark.svg" width="16" />
      </a>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useOnline } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const appVersion = import.meta.env.__APP_VERSION__

const { loading, dialog, notify } = useQuasar()
const userStore = useUserStore()
const router = useRouter()
const isOnline = useOnline()

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
</script>

<style lang="scss" scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.actions {
  display: grid;
  gap: 1rem;
}

.app-version {
  display: flex;
  gap: 0.5rem;
  align-items: center;

  & > a {
    display: flex;
  }
}
</style>
