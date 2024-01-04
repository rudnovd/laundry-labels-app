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
          :rules="[(v) => v?.length || t('pages.signIn.validation.email')]"
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
          :rules="[(v) => v?.length || t('pages.signIn.validation.password')]"
        />
        <l-captcha v-if="!IS_LOCAL" class="q-mb-md full-width" @verify="credentials.options.captchaToken = $event" />
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
import { computed, reactive, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { UserSignInPayload } from '@/types/user'
import { IS_LOCAL, REQUEST_THROTTLE_TIMEOUT } from '@/constants'
import LIcon from '@/components/LIcon.vue'
const LCaptcha = defineAsyncComponent(() => import('@/components/LCaptcha.vue'))

const { notify, loading } = useQuasar()
const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

const credentials = reactive<UserSignInPayload>({
  email: '',
  password: '',
  options: {
    captchaToken: '',
  },
})

const signIn = throttle(async () => {
  loading.show()
  try {
    await userStore.signIn(credentials)
    notify({
      type: 'positive',
      message: t('notifications.signInSuccess'),
    })
    router.push({ name: 'Items' })
  } finally {
    loading.hide()
  }
}, REQUEST_THROTTLE_TIMEOUT)

const signInWithGoogle = throttle(async () => {
  loading.show()
  try {
    await userStore.signInWithOAuth({ provider: 'google' })
  } finally {
    loading.hide()
  }
}, REQUEST_THROTTLE_TIMEOUT)

const isSignedInButtonDisabled = computed(() => {
  const { email, password, options } = credentials
  return loading.isActive || !email || !password || (!IS_LOCAL && !options.captchaToken)
})
</script>

<style lang="scss" scoped>
.sign-in-page {
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

  .links {
    display: flex;
    flex-direction: column;
  }
}
</style>
