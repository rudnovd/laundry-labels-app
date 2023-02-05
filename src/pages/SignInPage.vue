<template>
  <q-page class="sign-in-page bg-positive text-weight-bold">
    <section>
      <h1 class="text-h4">Sign in</h1>
      <q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" @submit="onSubmit">
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
          :rules="[(v) => (v && v.length) || 'The password field is not filled']"
        />
        <VueHcaptcha v-if="showCaptcha && !isLocal" ref="captchaForm" :sitekey="sitekey" @verify="onVerifyCaptcha" />
        <q-btn label="Sign in" type="submit" color="primary" />
      </q-form>

      <div>Don't have an account? <router-link :to="{ name: 'Sign up' }">Sign up</router-link></div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/store/user'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
import { throttle, useQuasar } from 'quasar'
import { ref } from 'vue'

const { loading, notify } = useQuasar()
const userStore = useUserStore()

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
    })
  }

  loading.show()
  userStore
    .signIn({ email: email.value, password: password.value, token: captchaVerificationToken.value })
    .then(() => {
      notify({
        type: 'positive',
        message: 'Sign in successfully',
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
.sign-in-page {
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
