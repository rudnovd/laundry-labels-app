<template>
  <section class="logout-page">
    <q-circular-progress v-if="isLogoutLoading" size="50px" color="orange" class="q-ma-md" />
    <q-btn v-if="!isLogoutLoading" color="primary" label="Reload" icon="refresh" @click="router.go(0)" />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'Logout',
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const auth = getAuth()

    const isLogoutLoading = ref(true)

    signOut(auth)
      .then(() => {
        router.push('/welcome')
      })
      .catch(() => {
        $q.notify({
          message: 'Registration completed successfully',
        })
      })
      .finally(() => {
        isLogoutLoading.value = false
      })

    return {
      isLogoutLoading,
    }
  },
})
</script>
