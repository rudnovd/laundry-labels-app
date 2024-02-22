<template>
  <vue-hcaptcha
    ref="captchaForm"
    :sitekey="sitekey"
    @verify="verifyCaptcha"
    @expired="resetCaptcha"
    @error="resetCaptcha"
    @challenge-expired="resetCaptcha"
  />
</template>

<script setup lang="ts">
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
import { ref } from 'vue'

const emit = defineEmits<{
  verify: [token: string]
  reset: []
}>()

const sitekey = import.meta.env.VITE_APP_CAPTCHA_KEY
const captchaForm = ref<VueHcaptcha | null>(null)
const captchaToken = ref<string>('')

function verifyCaptcha(token: string) {
  captchaToken.value = token
  emit('verify', token)
}

function resetCaptcha() {
  captchaToken.value = ''
  captchaForm.value?.reset()
  emit('reset')
}
</script>
