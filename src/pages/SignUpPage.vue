<template>
  <q-page class="sign-up-page bg-positive text-weight-bold">
    <section>
      <h1 class="text-h4">Sign up</h1>
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
          type="email"
          label="Email"
          maxlength="320"
          filled
          dense
          lazy-rules
          :rules="[(v) => (v && v.length) || 'The email field is not filled']"
        />
        <q-input
          v-model="password"
          type="password"
          label="Password"
          maxlength="64"
          hide-hint
          filled
          dense
          lazy-rules
          :rules="[(v) => (v && v.length >= 6) || 'Please use minimum 6 characters']"
        />

        <q-btn label="Sign up" type="submit" color="primary" />
        <VueHcaptcha v-if="showCaptcha && !isLocal" ref="captchaForm" :sitekey="sitekey" @verify="onVerifyCaptcha" />
      </q-form>
      <div>Already registered? <router-link :to="{ name: 'Sign in' }">Sign in</router-link></div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
import { throttle, useQuasar } from 'quasar'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { notify, loading } = useQuasar()
const userStore = useUserStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const captchaForm = ref()
const captchaIsVerified = ref(false)
const captchaVerificationToken = ref('')

const onVerifyCaptcha = (token: string) => {
  captchaIsVerified.value = true
  captchaVerificationToken.value = token
}

const onSubmit = throttle(() => {
  if (import.meta.env.PROD && !isLocal && !captchaIsVerified.value) {
    return notify({
      type: 'negative',
      message: 'Captcha required',
      timeout: 5000,
    })
  }

  loading.show()
  userStore
    .signUp({
      email: email.value,
      password: password.value,
      token: captchaVerificationToken.value,
    })
    .then(() => {
      notify({
        type: 'positive',
        message: 'Sign up successfully',
      })
      router.push({ name: 'Items' })
    })
    .catch(() => captchaForm.value?.reset())
    .finally(() => loading.hide())
}, 5000)

const sitekey = import.meta.env.VITE_APP_CAPTCHA_KEY
const showCaptcha = import.meta.env.PROD
const isLocal = import.meta.env.VITE_APP_IS_LOCAL
</script>

<style lang="scss" scoped>
.sign-up-page {
  display: flex;
  align-items: center;
  justify-content: center;

  & > section:first-child {
    display: grid;
    gap: 1rem;
    justify-content: center;

    h1,
    div {
      text-align: center;
    }

    form {
      display: grid;
      gap: 0.5rem;
      width: 300px;
    }
  }
}
</style>
