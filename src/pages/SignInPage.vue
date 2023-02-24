<template>
  <q-page class="sign-in-page">
    <section>
      <h1 class="text-h4">Sign in</h1>
      <q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" @submit="onSubmit">
        <q-input
          v-model="email"
          type="email"
          label="Email"
          maxlength="320"
          bg-color="grey-1"
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
          bg-color="grey-1"
          hide-hint
          filled
          dense
          lazy-rules
          :rules="[(v) => (v && v.length) || 'The password field is not filled']"
        />
        <VueHcaptcha v-if="showCaptcha && !isLocal" ref="captchaForm" :sitekey="sitekey" @verify="onVerifyCaptcha" />
        <q-btn label="Sign in" type="submit" color="positive" />
      </q-form>

      <section class="links">
        <div>
          Don't have an account? <router-link class="link-light" :to="{ name: 'Sign up' }">Sign up</router-link>
        </div>
        <router-link :to="{ name: 'Home' }" class="link-light">Back to home page</router-link>
      </section>
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
  color: white;
  background: linear-gradient(135deg, rgba(9, 121, 46, 1) 0%, rgba(75, 8, 129, 1) 50%, rgba(9, 121, 46, 1) 100%);

  & > section {
    display: grid;
    grid-template-columns: clamp(300px, 25vw, 600px);
    gap: 1rem;
    justify-content: center;
    padding: 32px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;

    h1,
    .links {
      text-align: center;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;

      & > * {
        width: 100%;
      }
    }
  }
}
</style>
