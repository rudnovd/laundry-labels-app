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
        :rules="[(val) => (val && val.length >= 6) || 'Please use minimum 6 characters']"
      />

      <q-btn label="Registration" type="sumbmit" color="primary" />
      <VueHcaptcha ref="captchaForm" :sitekey="sitekey" @verify="onVerifyCaptcha" />
    </q-form>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/runtime-core'
import { throttle, useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'

export default defineComponent({
  name: 'RegistrationPage',
  components: {
    VueHcaptcha,
  },
  setup() {
    const $q = useQuasar()
    const store = useStore()
    const router = useRouter()

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
        .dispatch('registration', {
          email: email.value,
          password: password.value,
          token: captchaVerificationToken.value,
        })
        .then(() => {
          $q.notify({
            type: 'positive',
            message: 'Sign up successfully',
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
