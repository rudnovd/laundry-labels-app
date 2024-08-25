<template>
  <q-page class="reset-password-page">
    <section v-if="!isRequestSended" class="reset-form">
      <h1 class="text-h3 q-mt-none">{{ t('common.resetPassword') }}</h1>

      <q-form
        class="q-mb-md"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        @submit="resetPassword"
      >
        <q-input
          v-model="credentials.email"
          class="q-mb-md"
          type="email"
          :label="t('common.email')"
          maxlength="320"
          bg-color="grey-1"
          filled
          lazy-rules
          :rules="[
            (v) => validation.notEmpty(v) || t('pages.signIn.validation.emailEmpty'),
            (v) => validation.isEmail(v) || t('pages.signIn.validation.emailPattern'),
          ]"
        />
        <l-captcha v-if="!IS_LOCAL_SUPABASE" class="q-mb-md full-width" @verify="credentials.captchaToken = $event" />
        <q-btn
          class="full-width"
          :label="t('common.resetPassword')"
          :disable="isResetPasswordButtonDisabled"
          type="submit"
          color="positive"
        />
      </q-form>

      <section class="links">
        <router-link class="link-light" :to="{ name: 'Sign in' }">
          {{ t('pages.resetPassword.backToSignIn') }}
        </router-link>
      </section>
    </section>
    <section v-else class="request-sended">
      <span class="text-body1">{{ t('pages.resetPassword.requestSended') }}</span>
      <router-link :to="{ name: 'Home' }" class="link-light">{{ t('pages.signUp.backToHomePage') }}</router-link>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { throttle, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import type { UserResetPasswordCredentials } from '@/types/user'
import { computed, defineAsyncComponent, reactive, ref } from 'vue'
import { IS_LOCAL_SUPABASE, REQUEST_THROTTLE_TIMEOUT } from '@/constants'
import { validation } from '@/utils/validation'
const LCaptcha = defineAsyncComponent(() => import('@/components/LCaptcha.vue'))

const { notify, loading } = useQuasar()
const { t } = useI18n()
const userStore = useUserStore()

const isRequestSended = ref(false)
const credentials = reactive<UserResetPasswordCredentials>({
  email: '',
  captchaToken: '',
})

const resetPassword = throttle(async () => {
  loading.show({ message: t('loading.sendingRequest') })
  try {
    await userStore.resetPassword(credentials)
    notify({ type: 'positive', message: t('notifications.passwordResetRequestSended') })
    isRequestSended.value = true
  } finally {
    loading.hide()
  }
}, REQUEST_THROTTLE_TIMEOUT)
const isResetPasswordButtonDisabled = computed(() => {
  return loading.isActive || !credentials.email || (!IS_LOCAL_SUPABASE && !credentials.captchaToken)
})
</script>

<style>
.reset-password-page {
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

  & > section {
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
  }

  & > .request-sended {
    gap: 1rem;
  }
}
</style>
