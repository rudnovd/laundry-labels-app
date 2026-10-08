<template>
  <section class="sign-up-page">
    <h1 class="sign-up-page__title">
      {{ $t('common.signUp') }}
    </h1>
    <section v-if="isSignedUp" class="sign-up-page-account-registered">
      <span>{{ $t('pages.signUp.accountRegistered') }}</span>
      <router-link to="/">
        {{ $t('pages.signUp.backToHomePage') }}
      </router-link>
    </section>
    <form v-else class="sign-up-page-form" @submit.prevent="signUp">
      <button :disabled="isLoading" class="button-primary" @click="signUpWithGoogle">
        <IconGoogle />
        {{ $t('pages.signUp.signUpWithGoogle') }}
      </button>
      <span>{{ $t('common.or').toLocaleLowerCase() }}</span>
      <BaseInput
        v-model="credentials.email"
        class="sign-up-page-form-input"
        type="email"
        :label="$t('common.email')"
        :disabled="isLoading"
        maxlength="254"
        :class="{ valid: r$.email.$correct, error: r$.email.$error }"
        :errors="r$.email.$errors"
      />
      <BaseInput
        v-model="credentials.password"
        class="sign-up-page-form-input"
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
        {{ $t('common.signUp') }}
      </button>
    </form>
    <div v-if="!isSignedUp" class="sign-up-page-links">
      <div>
        {{ $t('pages.signUp.alreadyRegistered') }}
        <router-link to="/signin">
          {{ $t('common.signIn') }}
        </router-link>
      </div>
      <router-link to="/">
        {{ $t('pages.signUp.backToHomePage') }}
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRegle } from '@regle/core'
import { email, maxLength, minLength, required, requiredIf, withMessage } from '@regle/rules'
import { useThrottleFn } from '@vueuse/core'
import { defineAsyncComponent, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import IconGoogle from '~icons/mdi/google'
import BaseInput from '@/components/base/BaseInput.vue'
import {
  IS_LOCAL_SUPABASE,
  IS_OFFLINE_APP,
  REQUEST_THROTTLE_TIMEOUT,
  VALIDATION_DEBOUNCE,
} from '@/constants'
import { useUserStore } from '@/stores/user'

definePage({
  meta: {
    title: 'common.signUp',
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
interface SignUpWithPasswordCredentials {
  email: string
  password: string
  options: {
    captchaToken: string
  }
}
const credentials = reactive<SignUpWithPasswordCredentials>({
  email: '',
  password: '',
  options: {
    captchaToken: '',
  },
})
const { r$ } = useRegle(credentials, {
  email: {
    required: withMessage(required, t('pages.signUp.validation.emailEmpty')),
    email: withMessage(email, t('pages.signUp.validation.emailPattern')),
  },
  password: {
    minLength: withMessage(minLength(6), t('pages.signUp.validation.passwordMinLength')),
    maxLength: withMessage(maxLength(72), t('pages.signUp.validation.passwordMaxLength')),
  },
  options: {
    captchaToken: {
      required: requiredIf(() => !IS_OFFLINE_APP && !IS_LOCAL_SUPABASE),
    },
  },
}, { debounce: VALIDATION_DEBOUNCE })

const captchaRef = ref<InstanceType<typeof HCaptcha> | null>(null)
const isSignedUp = ref(false)
const userStore = useUserStore()
const isLoading = ref<boolean>(false)
const signUp = useThrottleFn(async () => {
  isLoading.value = true
  try {
    await userStore.signUp(credentials)
    isSignedUp.value = true
  }
  catch {
    captchaRef.value?.resetCaptcha()
  }
  finally {
    isLoading.value = false
  }
}, REQUEST_THROTTLE_TIMEOUT)
const signUpWithGoogle = useThrottleFn(async () => {
  isLoading.value = true
  toast.success(t('notifications.signUpSuccess'))
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
.sign-up-page {
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
  .sign-up-page__title {
    font-size: 4rem;
    line-height: 4rem;
    text-align: center;
  }
  .sign-up-page-account-registered {
    display: flex;
    flex-direction: column;
  }
  .sign-up-page-form {
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
      .sign-up-page-form-input {
        height: 2rem;
      }
    }
  }
  .sign-up-page-links {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
