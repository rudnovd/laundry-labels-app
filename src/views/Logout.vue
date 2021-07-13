<template>
  <section class="logout-page">
    <q-circular-progress v-if="loading" size="50px" color="orange" class="q-ma-md" />
    <q-btn v-if="!loading" color="primary" label="Reload" icon="refresh" @click="router.go(0)" />
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

    const loading = ref(true)

    signOut(auth)
      .then(() => {
        router.push('/login')
      })
      .catch(() => {
        $q.notify({
          message: 'Registration completed successfully',
        })
      })
      .finally(() => {
        loading.value = false
      })
  },
})
</script>
