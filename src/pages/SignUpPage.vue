<template>
  <q-page class="sign-up-page">
    <article>
      <h1 class="text-h3 q-mt-none">{{ t('common.signUp') }}</h1>

      <section v-if="isSignedUp" class="account-registered">
        <span class="text-body1">{{ t('pages.signUp.accountRegistered') }}</span>
        <router-link :to="{ name: 'Home' }" class="link-light">{{ t('pages.signUp.backToHomePage') }}</router-link>
      </section>
      <q-form
        v-else
        class="q-mb-md"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        @submit="signUp"
      >
        <q-btn
          :disable="loading.isActive"
          size="small"
          class="full-width q-mb-sm"
          color="white"
          text-color="black"
          @click="signUpWithGoogle"
        >
          <l-icon class="q-mr-sm" icon="google-logo" />
          {{ t('pages.signUp.signUpWithGoogle') }}
        </q-btn>
        <span class="q-mb-sm inline-block">{{ t('common.or').toLocaleLowerCase() }}</span>
        <q-input
          v-model="credentials.email"
          class="q-mb-md"
          type="email"
          :label="t('common.email')"
          :disable="loading.isActive"
          maxlength="320"
          bg-color="grey-1"
          filled
          lazy-rules
          :rules="[(v) => v?.length || t('pages.signUp.validation.email')]"
        />
        <q-input
          v-model="credentials.password"
          class="q-mb-md"
          type="password"
          :label="t('common.password')"
          :disable="loading.isActive"
          maxlength="72"
          bg-color="grey-1"
          filled
          lazy-rules
          :rules="[(v) => v?.length >= 6 || t('pages.signUp.validation.email')]"
        />
        <l-captcha v-if="!IS_LOCAL" class="q-mb-md full-width" @verify="credentials.options.captchaToken = $event" />
        <q-btn
          class="full-width"
          :label="t('common.signUp')"
          :disable="isSignedUpButtonDisabled"
          :loading="loading.isActive"
          type="submit"
          color="positive"
        />
      </q-form>

      <section v-if="!isSignedUp">
        <div>
          {{ t('pages.signUp.alreadyRegistered') }}
          <router-link class="link-light" :to="{ name: 'Sign in' }">{{ t('common.signIn') }}</router-link>
        </div>
        <router-link :to="{ name: 'Home' }" class="link-light">{{ t('pages.signUp.backToHomePage') }}</router-link>
      </section>
    </article>
  </q-page>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { throttle, useQuasar } from 'quasar'
import { defineAsyncComponent, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import type { UserSignUpCredentials } from '@/types/user'
import { REQUEST_THROTTLE_TIMEOUT, IS_LOCAL } from '@/constants'
import { ref } from 'vue'
import { computed } from 'vue'
const LIcon = defineAsyncComponent(() => import('@/components/LIcon.vue'))
const LCaptcha = defineAsyncComponent(() => import('@/components/LCaptcha.vue'))

const { loading } = useQuasar()
const userStore = useUserStore()
const { t } = useI18n()

const credentials = reactive<UserSignUpCredentials>({
  email: '',
  password: '',
  options: {
    captchaToken: '',
  },
})

const isSignedUp = ref(false)
const signUp = throttle(async () => {
  loading.show({ message: `${t('pages.signUp.signingUp')}...` })
  try {
    await userStore.signUp(credentials)
    isSignedUp.value = true
  } finally {
    loading.hide()
  }
}, REQUEST_THROTTLE_TIMEOUT)

const signUpWithGoogle = throttle(async () => {
  loading.show({ message: `${t('pages.signUp.signingUp')}...` })
  try {
    await userStore.signInWithOAuth({ provider: 'google' })
  } finally {
    loading.hide()
  }
}, REQUEST_THROTTLE_TIMEOUT)

const isSignedUpButtonDisabled = computed(() => {
  const { email, password, options } = credentials
  return loading.isActive || !email || !password || (!IS_LOCAL && !options.captchaToken)
})
</script>

<style>
.sign-up-page {
  display: grid;
  grid: 1fr / 1fr;
  place-content: center;
  color: rgb(250 250 250);
  text-align: center;
  background: linear-gradient(135deg, rgb(9 121 46) 0%, rgb(75 8 129) 50%, rgb(9 121 46) 100%);

  @media (width >= 576px) {
    grid: auto-flow / 592px;
    padding: 8px;
  }

  > article {
    display: grid;
    grid-template-columns: 1fr;
    place-content: center;
    padding: 32px;
    background: rgb(0 0 0 / 30%);
    transition: padding 0.5s linear;

    @media (width >= 576px) {
      padding: 64px;
      border-radius: 8px;
    }

    > .account-registered {
      display: grid;
      gap: 1rem;
    }
  }
}
</style>
