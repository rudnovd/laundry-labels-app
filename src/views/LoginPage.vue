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
      <VueHcaptcha v-if="showCaptcha" ref="captchaForm" :sitekey="sitekey" @verify="onVerifyCaptcha" />
    </q-form>
  </section>
</template>

<script lang="ts">
import router from '@/router'
import { computed, defineComponent, ref, watch } from '@vue/runtime-core'
import { useQuasar, throttle } from 'quasar'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
import { useStore } from '@/store'

export default defineComponent({
  name: 'LoginPage',
  components: {
    VueHcaptcha,
  },
  setup() {
    const $q = useQuasar()
    const store = useStore()

    const user = computed(() => store.user)
    watch(user, () => user.value && user.value._id && router.push('/'))

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
      if (process.env.NODE_ENV !== 'development' && !captchaIsVerified.value) {
        return $q.notify({
          type: 'negative',
          message: 'Captcha required',
          timeout: 5000,
        })
      }

      $q.loading.show()
      store
        .login({ email: email.value, password: password.value, token: captchaVerificationToken.value })
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
      showCaptcha: process.env.NODE_ENV !== 'development',
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
  gap: 0.5rem;
  grid-auto-flow: row;
  width: 300px;
}
</style>
