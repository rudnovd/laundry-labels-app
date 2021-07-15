<template>
  <section class="welcome-page q-pa-sm">
    <section class="buttons-section">
      <q-btn color="primary" label="Login" icon="login" to="/login" />
      <q-btn color="primary" label="Registration" icon="person" to="/registration" />
      <q-btn color="primary" label="Try without registration" icon="person_off" @click="tryWithoutRegistration" />
    </section>
  </section>
</template>

<script lang="ts">
import { getAuth, signInAnonymously } from '@firebase/auth'
import { defineComponent } from '@vue/runtime-core'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Welcome',
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const auth = getAuth()

    if (auth.currentUser) router.push('/')

    const tryWithoutRegistration = () => {
      signInAnonymously(auth)
        .then(() => {
          router.push('/')
        })
        .catch((error) => {
          $q.notify({
            type: 'negative',
            message: error.message,
          })
        })
    }

    return {
      tryWithoutRegistration,
    }
  },
})
</script>

<style lang="scss" scoped>
.welcome-page {
  display: grid;
}

.buttons-section {
  display: grid;
  justify-content: center;
  gap: 2rem;

  button,
  a {
    max-width: 300px;
  }
}
</style>
