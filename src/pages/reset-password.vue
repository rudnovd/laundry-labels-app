<template>
  <section class="reset-password-page">
    <template v-if="!isRequestSent">
      <h1 class="reset-password-page__title">
        {{ $t('common.resetPassword') }}
      </h1>
      <form class="reset-password-page-form" @submit.prevent="resetPassword">
        <BaseInput
          v-model="credentials.email"
          class="reset-password-page-form-input"
          type="email"
          :label="$t('common.email')"
          :disabled="isLoading"
          maxlength="254"
          :class="{ valid: r$.email.$correct, error: r$.email.$error }"
        />
        <HCaptcha v-if="!IS_OFFLINE_APP && !IS_LOCAL_SUPABASE" @verify="credentials.captchaToken = $event" />
        <button class="button-primary" :disabled="!r$.$correct || isLoading" type="submit">
          {{ $t('common.resetPassword') }}
        </button>
      </form>
      <section class="links">
        <router-link to="/signin">
          {{ $t('pages.resetPassword.backToSignIn') }}
        </router-link>
      </section>
    </template>
    <template v-else>
      <span>{{ $t('pages.resetPassword.requestSended') }}</span>
      <router-link to="/">
        {{ $t('pages.signUp.backToHomePage') }}
      </router-link>
    </template>
  </section>
  <teleport to="body">
    <router-view v-slot="{ Component, route }">
      <component :is="Component" v-if="route.path === '/reset-password/new-password'" />
    </router-view>
  </teleport>
</template>

<script setup lang="ts">
import { useRegle } from '@regle/core'
import { email, required, requiredIf, withMessage } from '@regle/rules'
import { useThrottleFn } from '@vueuse/core'
import { defineAsyncComponent, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import BaseInput from '@/components/base/BaseInput.vue'
import { IS_LOCAL_SUPABASE, IS_OFFLINE_APP, REQUEST_THROTTLE_TIMEOUT, VALIDATION_DEBOUNCE } from '@/constants'
import { useUserStore } from '@/stores/user'

definePage({
  meta: {
    title: 'common.resetPassword',
    isNavbarHidden: true,
  },
  async beforeEnter() {
    if (IS_OFFLINE_APP) {
      return '/items'
    }
    const userStore = useUserStore()
    const session = await userStore.getSession()
    const isSignedIn = !!userStore.user?.id || !!session
    const query = {
      title: 'Signin',
      description: 'Already signed in, redirect...',
      redirectTo: '/items',
    }
    return isSignedIn ? { path: '/redirect', query } : true
  },
})

const HCaptcha = defineAsyncComponent(() => import('@/components/HCaptcha.vue'))

interface UserResetPasswordCredentials {
  email: string
  captchaToken: string
}
const { t } = useI18n()
const userStore = useUserStore()
const isRequestSent = ref(false)
const credentials = reactive<UserResetPasswordCredentials>({
  email: '',
  captchaToken: '',
})
const { r$ } = useRegle(credentials, {
  email: {
    required: withMessage(required, t('pages.resetPassword.validation.emailEmpty')),
    email: withMessage(email, t('pages.resetPassword.validation.emailPattern')),
  },
  captchaToken: {
    required: requiredIf(() => !IS_OFFLINE_APP && !IS_LOCAL_SUPABASE),
  },
}, {
  debounce: VALIDATION_DEBOUNCE,
})

const isLoading = ref<boolean>(false)
const resetPassword = useThrottleFn(async () => {
  isLoading.value = true
  try {
    await userStore.resetPassword(credentials)
    toast.success(t('notifications.passwordResetRequestSended'))
    isRequestSent.value = true
  }
  finally {
    isLoading.value = false
  }
}, REQUEST_THROTTLE_TIMEOUT)
</script>

<style>
.reset-password-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  color: oklch(94% 0.01 245deg);
  background: linear-gradient(
    135deg,
    oklch(50.34% 0.1439 147.6deg) 0%,
    oklch(34.25% 0.1736 301.49deg) 50%,
    oklch(50.34% 0.1439 147.6deg) 100%
  );
  .reset-password-page__title {
    font-size: 4rem;
    line-height: 4rem;
    text-align: center;
  }
  .reset-password-page-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    max-width: 300px;
    > span {
      text-align: center;
    }
    .base-input {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      .reset-password-page-form-input {
        height: 2rem;
      }
    }
  }
}
</style>
