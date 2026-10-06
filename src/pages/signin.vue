<template>
  <section class="sign-in-page">
    <h1 class="sign-in-page__title">
      {{ $t('common.signIn') }}
    </h1>
    <form class="sign-in-page-form" @submit.prevent="signIn">
      <button :disabled="isLoading" class="button-primary" @click="signInWithGoogle">
        <IconGoogle />
        {{ $t('pages.signIn.signInWithGoogle') }}
      </button>
      <span>{{ $t('common.or').toLocaleLowerCase() }}</span>
      <BaseInput
        v-model="credentials.email"
        class="sign-in-page-form-input"
        type="email"
        :label="$t('common.email')"
        :disabled="isLoading"
        maxlength="254"
        :class="{ valid: r$.email.$correct, error: r$.email.$error }"
        :errors="r$.email.$errors"
      />
      <BaseInput
        v-model="credentials.password"
        class="sign-in-page-form-input"
        type="password"
        :label="$t('common.password')"
        :disabled="isLoading"
        minlength="6"
        maxlength="72"
        :class="{ valid: r$.password.$correct, error: r$.password.$error }"
        :errors="r$.password.$errors"
      />
      <HCaptcha
        v-if="!IS_OFFLINE_APP && !IS_LOCAL_SUPABASE"
        ref="captchaRef"
        @verify="credentials.options.captchaToken = $event"
      />
      <button class="button-primary" :disabled="!r$.$correct || isLoading">
        {{ $t('common.signIn') }}
      </button>
    </form>
    <div class="sign-in-page-links">
      <div>
        {{ $t('pages.signIn.noAccount') }}
        <router-link to="/signup">
          {{ $t('common.signUp') }}
        </router-link>
      </div>
      <router-link to="/reset-password">
        {{ $t('pages.signIn.resetPassword') }}
      </router-link>
      <router-link to="/">
        {{ $t('pages.signIn.backToHomePage') }}
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UserSignInCredentials } from '@/types/user'
import { useRegle } from '@regle/core'
import { email, required, requiredIf, withMessage } from '@regle/rules'
import { useThrottleFn } from '@vueuse/core'
import { defineAsyncComponent, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import IconGoogle from '~icons/mdi/google'
import BaseInput from '@/components/base/BaseInput.vue'
import { IS_LOCAL_SUPABASE, IS_OFFLINE_APP, REQUEST_THROTTLE_TIMEOUT, VALIDATION_DEBOUNCE } from '@/constants'
import { useUserStore } from '@/stores/user'

definePage({
  meta: {
    title: 'common.signIn',
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

const { t } = useI18n()
const credentials = reactive<UserSignInCredentials>({
  email: '',
  password: '',
  options: {
    captchaToken: '',
  },
})
const { r$ } = useRegle(credentials, {
  email: {
    required: withMessage(required, t('pages.signIn.validation.emailEmpty')),
    email: withMessage(email, t('pages.signIn.validation.emailPattern')),
  },
  password: {
    required: withMessage(required, t('pages.signIn.validation.password')),
  },
  options: {
    captchaToken: {
      required: requiredIf(() => !IS_OFFLINE_APP && !IS_LOCAL_SUPABASE),
    },
  },
}, {
  debounce: VALIDATION_DEBOUNCE,
})

const captchaRef = ref<InstanceType<typeof HCaptcha> | null>(null)
const userStore = useUserStore()
const router = useRouter()
const isLoading = ref<boolean>(false)
const signIn = useThrottleFn(async () => {
  isLoading.value = true
  try {
    await userStore.signIn(credentials)
    toast.success(t('notifications.signInSuccess'))
    router.push('/items')
  }
  catch {
    captchaRef.value?.resetCaptcha()
  }
  finally {
    isLoading.value = false
  }
}, REQUEST_THROTTLE_TIMEOUT)
const signInWithGoogle = useThrottleFn(async () => {
  isLoading.value = true
  try {
    await userStore.signInWithOAuth({ provider: 'google' })
  }
  catch {
    captchaRef.value?.resetCaptcha()
  }
  finally {
    isLoading.value = false
  }
}, REQUEST_THROTTLE_TIMEOUT)
</script>

<style>
.sign-in-page {
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
  .sign-in-page__title {
    font-size: 4rem;
    line-height: 4rem;
    text-align: center;
  }
  .sign-in-page-form {
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
      .sign-in-page-form-input {
        height: 2rem;
      }
    }
  }
  .sign-in-page-links {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
