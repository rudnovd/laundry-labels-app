<template>
  <section class="q-pa-sm column items-center">
    <h1 class="text-h6">Sign up</h1>

    <q-form
      class="registration-form column items-center"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
      @submit="onSubmit"
    >
      <q-input
        v-model="email"
        class="q-mb-sm"
        type="email"
        label="Email"
        maxlength="128"
        filled
        dense
        lazy-rules
        :rules="[(val: any) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        v-model="password"
        class="q-mb-sm"
        type="password"
        label="Password"
        maxlength="64"
        hide-hint
        filled
        dense
        lazy-rules
        :rules="[(val: any) => (val && val.length >= 6) || 'Please use minimum 6 characters']"
      />

      <VueHcaptcha v-if="showCaptcha" ref="captchaForm" class="q-mb-sm" :sitekey="sitekey" @verify="onVerifyCaptcha" />

      <q-btn label="Sign up" type="submit" color="primary" />
    </q-form>

    <div class="row q-mt-lg">
      <div class="col-xs-12">Already registered? <router-link to="/signin">Sign in</router-link></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
import { throttle, useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const userStore = useUserStore()
const router = useRouter()

const user = computed(() => userStore.user)
if (user.value?._id) router.push('/')
watch(user, () => user.value?._id && router.push('/'))

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
  if (import.meta.env.PROD && !captchaIsVerified.value) {
    return $q.notify({
      type: 'negative',
      message: 'Captcha required',
      timeout: 5000,
    })
  }

  $q.loading.show()
  userStore
    .signUp({
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

const sitekey = import.meta.env.VITE_APP_CAPTCHA_KEY
const showCaptcha = import.meta.env.PROD
</script>

<style lang="scss" scoped>
.registration-form > label {
  min-width: 250px;
}
</style>
