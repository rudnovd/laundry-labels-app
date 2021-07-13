<template>
  <section class="login-page q-pa-sm">
    <q-form
      class="login-form"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
      @submit="onSubmit"
    >
      <q-input
        v-model="email"
        :loading="loading"
        :disable="loading"
        type="email"
        label="Email"
        maxlength="128"
        filled
        dense
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        v-model="password"
        :loading="loading"
        :disable="loading"
        type="password"
        label="Password"
        maxlength="64"
        hide-hint
        filled
        dense
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-btn label="Login" type="submit" color="primary" :disable="loading" />
    </q-form>
  </section>
</template>

<script lang="ts">
import router from '@/router'
import { defineComponent, ref } from '@vue/runtime-core'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Login',
  setup() {
    const $q = useQuasar()
    const store = useStore()

    const email = ref('')
    const password = ref('')
    const loading = ref(false)

    const onSubmit = async () => {
      const auth = getAuth()

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)

        store.commit('SET_USER', userCredential.user)

        $q.notify({
          type: 'positive',
          message: 'Sign in successfully',
        })

        router.push('/')
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: error.message,
        })
      }
    }

    return {
      email,
      password,
      loading,
      onSubmit,
    }
  },
})
</script>

<style lang="scss" scoped>
.login-page {
  display: grid;
  place-items: center;
  height: 100%;
}

.login-form {
  display: grid;
  grid-template-columns: 100%;
  gap: 1rem;
  grid-auto-flow: row;
  max-width: 300px;
}
</style>
