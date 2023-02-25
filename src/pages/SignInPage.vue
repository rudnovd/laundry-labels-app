<template>
  <q-page class="sign-in-page">
    <section>
      <h1 class="text-h3 q-mt-none">Sign in</h1>
      <q-form
        class="q-mb-md"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        @submit="signIn"
      >
        <q-input
          v-model="payload.email"
          class="q-mb-md"
          type="email"
          label="Email"
          maxlength="320"
          bg-color="grey-1"
          :dark="false"
          filled
          lazy-rules
          :rules="[(v) => v?.length || 'The email field is not filled']"
        />
        <q-input
          v-model="payload.password"
          class="q-mb-md"
          type="password"
          label="Password"
          maxlength="64"
          bg-color="grey-1"
          :dark="false"
          filled
          lazy-rules
          :rules="[(v) => v?.length || 'The password field is not filled']"
        />
        <VueHcaptcha
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
          label="Sign in"
          :disable="!payload.email || !payload.password || (showCaptcha && !payload.token)"
          type="submit"
          color="positive"
        />
      </q-form>

      <section class="links">
        <div>
          Don't have an account? <router-link class="link-light" :to="{ name: 'Sign up' }">Sign up</router-link>
        </div>
        <router-link :to="{ name: 'Home' }" class="link-light">Back to home page</router-link>
      </section>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'

import { throttle, useQuasar } from 'quasar'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const sitekey = import.meta.env.VITE_APP_CAPTCHA_KEY
const showCaptcha = import.meta.env.PROD && !import.meta.env.VITE_APP_IS_LOCAL
const FIVE_SECONDS = 5000

const { notify, loading } = useQuasar()
const userStore = useUserStore()
const router = useRouter()

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

const signIn = throttle(async () => {
  if (showCaptcha) {
    return notify({
      type: 'negative',
      message: 'Captcha required',
    })
  }

  loading.show()
  try {
    await userStore.signIn(payload)
    notify({
      type: 'positive',
      message: 'Sign in successfully',
    })
    router.push({ name: 'Items' })
  } finally {
    loading.hide()
  }
}, FIVE_SECONDS)
</script>

<style lang="scss" scoped>
.sign-in-page {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  place-content: center;
  color: $grey-1;
  text-align: center;
  background: linear-gradient(135deg, rgb(9, 121, 46) 0%, rgb(75, 8, 129) 50%, rgb(9, 121, 46) 100%);

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
    background: rgba(0, 0, 0, 0.3);
    transition: padding 0.5s linear;

    @include media-small {
      padding: 64px;
      border-radius: 8px;
    }
  }
}
</style>
