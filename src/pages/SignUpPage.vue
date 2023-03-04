<template>
  <q-page class="sign-up-page">
    <section>
      <h1 class="text-h4">{{ t('signUp.title') }}</h1>
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
          :label="t('signUp.email')"
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
          :label="t('signUp.password')"
          maxlength="64"
          bg-color="grey-1"
          hide-hint
          filled
          dense
          lazy-rules
          :rules="[(v) => (v && v.length >= 6) || 'Please use minimum 6 characters']"
        />

        <q-btn :label="t('signUp.action')" type="submit" color="positive" />
        <VueHcaptcha v-if="showCaptcha && !isLocal" ref="captchaForm" :sitekey="sitekey" @verify="onVerifyCaptcha" />
      </q-form>

      <section class="links">
        <div>
          {{ t('signUp.alreadyRegistered') }}
          <router-link class="link-light" :to="{ name: 'Sign in' }">{{ t('signUp.signIn') }}</router-link>
        </div>
        <router-link :to="{ name: 'Home' }" class="link-light">{{ t('signUp.back') }}</router-link>
      </section>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
import { throttle, useQuasar } from 'quasar'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { notify, loading } = useQuasar()
const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n()

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
      message: t('notification.captchaError'),
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
        message: t('notification.signUpSuccess'),
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
