<template>
  <section class="registration-page q-pa-sm">
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
        :loading="isRegistrationLoading"
        :disable="isRegistrationLoading"
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
        :loading="isRegistrationLoading"
        :disable="isRegistrationLoading"
        type="password"
        label="Password"
        maxlength="64"
        hide-hint
        filled
        dense
        lazy-rules
        :rules="[(val) => (val && val.length >= 6) || 'Please use minimum 6 characters']"
      />

      <q-btn
        label="Registration"
        type="submit"
        color="primary"
        :disable="isRegistrationLoading"
        :loading="isRegistrationLoading"
      />
    </q-form>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/runtime-core'
import { getAuth, createUserWithEmailAndPassword, linkWithCredential, EmailAuthProvider } from 'firebase/auth'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Registration',
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const auth = getAuth()

    const email = ref('')
    const password = ref('')
    const isRegistrationLoading = ref(false)

    if (auth.currentUser && !auth.currentUser.isAnonymous) router.push('/')

    const onSubmit = async () => {
      try {
        if (auth.currentUser && auth.currentUser.isAnonymous) {
          await linkWithCredential(auth.currentUser, EmailAuthProvider.credential(email.value, password.value))
        } else {
          await createUserWithEmailAndPassword(auth, email.value, password.value)
        }

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
      } finally {
        isRegistrationLoading.value = false
      }
    }

    return {
      email,
      password,
      isRegistrationLoading,
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
