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
        type="password"
        label="Password"
        maxlength="64"
        hide-hint
        filled
        dense
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-btn label="Login" type="submit" color="primary" />
      <VueHcaptcha ref="captchaForm" :sitekey="sitekey" @verify="onVerifyCaptcha" />
    </q-form>
  </section>
</template>

<script lang="ts">
import router from '@/router'
import { defineComponent, ref } from '@vue/runtime-core'
import { useQuasar, throttle } from 'quasar'
import { useStore } from 'vuex'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'

export default defineComponent({
  name: 'LoginPage',
  components: {
    VueHcaptcha,
  },
  setup() {
    const $q = useQuasar()
    const store = useStore()

    const email = ref('')
    const password = ref('')
    const captchaForm = ref<VueHcaptcha>()
    const captchaIsVerified = ref(false)
    const captchaVerificationToken = ref('')

    const onVerifyCaptcha = (token: string) => {
      captchaIsVerified.value = true
      captchaVerificationToken.value = token
    }

    const onSubmit = throttle(() => {
      if (!captchaIsVerified.value) {
        return $q.notify({
          type: 'negative',
          message: 'Captcha required',
          timeout: 5000,
        })
      }

      $q.loading.show()
      store
        .dispatch('login', { email: email.value, password: password.value, token: captchaVerificationToken.value })
        .then(() => {
          $q.notify({
            type: 'positive',
            message: 'Sign in successfully',
          })
          router.push('/')
        })
        .catch(() => captchaForm.value?.reset())
        .finally(() => $q.loading.hide())
    }, 5000)

    return {
      sitekey: process.env.VUE_APP_CAPTCHA_KEY,
      captchaForm,
      email,
      password,

      onSubmit,
      onVerifyCaptcha,
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
