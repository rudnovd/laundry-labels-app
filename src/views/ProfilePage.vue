<template>
  <section class="profile-page q-pa-sm flex justify-center">
    <q-btn v-if="user" color="primary" label="Logout" icon="logout" @click="callLogoutDialog" />
    App version: {{ version }}
  </section>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { defineComponent, computed } from '@vue/runtime-core'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ProfilePage',
  setup() {
    const $q = useQuasar()
    const store = useStore()
    const router = useRouter()

    const user = computed(() => store.user)

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

    return {
      user,
      version: process.env.VUE_APP_VERSION,

      callLogoutDialog,
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
