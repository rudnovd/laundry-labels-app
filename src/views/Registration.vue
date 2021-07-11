<template>
  <section class="registration-page">
    <q-form
      class="registration-form"
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
        :rules="[(val) => val.length >= 6 || 'Please use minimum 6 characters']"
      />

      <q-btn label="Registration" type="submit" color="primary" :disable="loading" />
    </q-form>
  </section>
</template>

<script lang="ts">
import router from '@/router'
import { defineComponent, ref } from '@vue/runtime-core'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'Registration',
  setup() {
    const $q = useQuasar()

    const email = ref('')
    const password = ref('')
    const loading = ref(false)

    const onSubmit = async () => {
      const auth = getAuth()

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)

        $q.notify({
          type: 'positive',
          message: 'Registration completed successfully',
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
.registration-page {
  display: grid;
  place-items: center;
  height: 100%;
}

.registration-form {
  display: grid;
  grid-template-columns: 100%;
  gap: 1rem;
  grid-auto-flow: row;
  max-width: 300px;
}
</style>
