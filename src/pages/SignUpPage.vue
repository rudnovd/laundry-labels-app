<template>
  <q-page class="sign-up-page">
    <section>
      <h1 class="text-h3 q-mt-none">{{ t('common.signUp') }}</h1>
      <q-form
        class="q-mb-md"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        @submit="signUp"
      >
        <q-input
          v-model="payload.email"
          class="q-mb-md"
          type="email"
          :label="t('common.email')"
          maxlength="320"
          bg-color="grey-1"
          filled
          lazy-rules
          :rules="[(v) => v?.length || t('pages.signUp.validation.email')]"
        />
        <q-input
          v-model="payload.password"
          class="q-mb-md"
          type="password"
          :label="t('common.password')"
          maxlength="64"
          bg-color="grey-1"
          filled
          lazy-rules
          :rules="[(v) => v?.length >= 6 || t('pages.signUp.validation.email')]"
        />
        <vue-hcaptcha
          v-if="showCaptcha"
          ref="captchaForm"
          class="q-mb-md full-width"
          :sitekey="sitekey"
          @verify="verifyCaptcha"
          @expired="resetCaptcha"
          @challenge-expired="resetCaptcha"
        />
        <q-btn
          class="full-width"
          :label="t('common.signUp')"
          :disable="!payload.email || !payload.password || (showCaptcha && !payload.token)"
          type="submit"
          color="positive"
        />
      </q-form>

      <section class="links">
        <div>
          {{ t('pages.signUp.alreadyRegistered') }}
          <router-link class="link-light" :to="{ name: 'Sign in' }">{{ t('common.signIn') }}</router-link>
        </div>
        <router-link :to="{ name: 'Home' }" class="link-light">{{ t('pages.signUp.backToHomePage') }}</router-link>
      </section>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { type ErrorResponse } from '@/interfaces/types'
import { useUserStore } from '@/store/user'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
import { throttle, useQuasar } from 'quasar'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const sitekey = import.meta.env.VITE_APP_CAPTCHA_KEY
const showCaptcha = import.meta.env.PROD && !import.meta.env.VITE_APP_IS_LOCAL
const FIVE_SECONDS = 5000

const { notify, loading } = useQuasar()
const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n()

const captchaForm = ref<VueHcaptcha>()
const payload = reactive({
  email: '',
  password: '',
  token: '',
})

const verifyCaptcha = (token: string) => {
  payload.token = token
}

const resetCaptcha = () => {
  payload.token = ''
  captchaForm.value?.reset()
}

const signUp = throttle(async () => {
  if (showCaptcha && !payload.token) {
    return notify({
      type: 'negative',
      message: t('notifications.captchaError'),
      timeout: 5000,
    })
  }

  loading.show()
  try {
    await userStore.signUp(payload)
    notify({
      message: t('notifications.signUpSuccess'),
    })
    router.push({ name: 'Items' })
  } catch (e) {
    const error = e as ErrorResponse
    if (error.name === 'ERR_AUTH_REGISTRATION_EMAIL_ALREADY_REGISTERED') {
      try {
        await userStore.signIn(payload)
        notify({
          type: 'positive',
          message: t('notifications.signInSuccess'),
        })
        router.push({ name: 'Items' })
      } finally {
        loading.hide()
      }
    }
  } finally {
    loading.hide()
  }
}, FIVE_SECONDS)
</script>

<style lang="scss" scoped>
.sign-up-page {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  place-content: center;
  color: $grey-1;
  text-align: center;
  background: linear-gradient(135deg, rgb(9 121 46) 0%, rgb(75 8 129) 50%, rgb(9 121 46) 100%);

  @include media-small {
    grid-template-rows: initial;
    grid-template-columns: calc($breakpoint-sm-min - 8px);
    padding: 8px;
  }

  & > section {
    display: grid;
    grid-template-columns: 1fr;
    place-content: center;
    padding: 32px;
    background: rgb(0 0 0 / 30%);
    transition: padding 0.5s linear;

    @include media-small {
      padding: 64px;
      border-radius: 8px;
    }
  }
}
</style>
