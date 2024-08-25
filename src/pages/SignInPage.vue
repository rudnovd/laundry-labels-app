<template>
  <q-page class="sign-in-page">
    <section>
      <h1 class="text-h3 q-mt-none">{{ t('common.signIn') }}</h1>

      <q-form
        class="q-mb-md"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        @submit="signIn"
      >
        <q-btn
          :disable="loading.isActive"
          size="small"
          class="full-width q-mb-sm"
          color="white"
          text-color="black"
          @click="signInWithGoogle"
        >
          <l-icon class="q-mr-sm" icon="google-logo" />
          {{ t('pages.signIn.signInWithGoogle') }}
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
          :rules="[
            (v) => validation.notEmpty(v) || t('pages.signIn.validation.emailEmpty'),
            (v) => validation.isEmail(v) || t('pages.signIn.validation.emailPattern'),
          ]"
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
          :rules="[(v) => validation.notEmpty(v) || t('pages.signIn.validation.password')]"
        />
        <l-captcha
          v-if="!IS_LOCAL"
          ref="captchaRef"
          class="q-mb-md full-width"
          @verify="credentials.options.captchaToken = $event"
        />
        <q-btn
          class="full-width"
          :label="t('common.signIn')"
          :disable="isSignedInButtonDisabled"
          type="submit"
          color="positive"
        />
      </q-form>

      <section class="links">
        <div>
          {{ t('pages.signIn.noAccount') }}
          <router-link class="link-light" :to="{ name: 'Sign up' }">{{ t('common.signUp') }}</router-link>
        </div>
        <router-link :to="{ name: 'Reset password' }" class="link-light">
          {{ t('pages.signIn.resetPassword') }}
        </router-link>
        <router-link :to="{ name: 'Home' }" class="link-light">{{ t('pages.signIn.backToHomePage') }}</router-link>
      </section>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { throttle, useQuasar } from 'quasar'
import { computed, defineAsyncComponent, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { UserSignInCredentials } from '@/types/user'
import { IS_LOCAL, REQUEST_THROTTLE_TIMEOUT } from '@/constants'
import LIcon from '@/components/LIcon.vue'
import { validation } from '@/utils/validation'
const LCaptcha = defineAsyncComponent(() => import('@/components/LCaptcha.vue'))

const { notify, loading } = useQuasar()
const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

const credentials = reactive<UserSignInCredentials>({
  email: '',
  password: '',
  options: {
    captchaToken: '',
  },
})
const captchaRef = ref<InstanceType<typeof LCaptcha> | null>(null)

const signIn = throttle(async () => {
  loading.show({ message: t('pages.signIn.signingIn') })
  try {
    await userStore.signIn(credentials)
    notify({ type: 'positive', message: t('notifications.signInSuccess') })
    router.push({ name: 'Items' })
  } catch {
    captchaRef.value?.resetCaptcha()
  } finally {
    loading.hide()
  }
}, REQUEST_THROTTLE_TIMEOUT)

const signInWithGoogle = throttle(async () => {
  loading.show({ message: t('pages.signIn.signingIn') })
  try {
    await userStore.signInWithOAuth({ provider: 'google' })
  } catch {
    captchaRef.value?.resetCaptcha()
  } finally {
    loading.hide()
  }
}, REQUEST_THROTTLE_TIMEOUT)

const isSignedInButtonDisabled = computed(() => {
  const { email, password, options } = credentials
  return loading.isActive || !email || !password || (!IS_LOCAL && !options.captchaToken)
})
</script>

<style>
.sign-in-page {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  place-content: center;
  color: rgb(250 250 250);
  text-align: center;
  background: linear-gradient(135deg, rgb(9 121 46) 0%, rgb(75 8 129) 50%, rgb(9 121 46) 100%);

  @media (width >= 576px) {
    grid-template-rows: initial;
    grid-template-columns: 592px;
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

  .links {
    display: flex;
    flex-direction: column;
  }
}
</style>
