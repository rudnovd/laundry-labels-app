<template>
  <section v-if="isAuthenticated" class="user-data">
    <img class="user-data__avatar-img" :src="avatarUrl" :alt="`${username} avatar`">
    {{ username }}
    <div v-if="!isEmailVerified" class="user-data__verification">
      <span class="color-error">{{ $t('pages.profile.emailNotVerified') }}</span>
      <button
        class="button-primary user-data__verification-button"
        :disabled="!userStore.isOnline || (showEmailConfirmationCaptcha && !emailConfirmationCaptchaToken)"
        @click="showEmailConfirmationCaptcha ? sendEmailConfirmation() : (showEmailConfirmationCaptcha = true)"
      >
        <IconEmail />
        {{ $t('pages.profile.verifyEmail') }}
      </button>
      <HCaptcha
        v-if="showEmailConfirmationCaptcha"
        ref="captchaRef"
        @verify="emailConfirmationCaptchaToken = $event"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/user'

const HCaptcha = defineAsyncComponent(() => import('@/components/HCaptcha.vue'))
const IconEmail = defineAsyncComponent(() => import('~icons/mdi/email'))

const userStore = useUserStore()
const isAuthenticated = computed(() => userStore.isAuthenticated)
const username = computed(() => {
  const name: string = userStore.user?.user_metadata.full_name
  const email = userStore.user?.email
  return name ? `${name} (${email})` : email
})
const avatarUrl = computed(() => userStore.user?.user_metadata.avatar_url ?? '/favicon.svg')
const isEmailVerified = computed(() => userStore.user?.user_metadata?.email_verified ?? false)

const showEmailConfirmationCaptcha = ref(false)
const emailConfirmationCaptchaToken = ref<string | null>(null)
const captchaRef = ref<InstanceType<typeof HCaptcha> | null>(null)

const { t } = useI18n()
async function sendEmailConfirmation() {
  try {
    if (!emailConfirmationCaptchaToken.value) {
      throw new Error('Captcha token not found')
    }
    await userStore.sendEmailConfirmation(emailConfirmationCaptchaToken.value)
    showEmailConfirmationCaptcha.value = false
    emailConfirmationCaptchaToken.value = null
    toast.success(t('notifications.confirmationEmailSent'))
  }
  catch {
    captchaRef.value?.resetCaptcha()
    emailConfirmationCaptchaToken.value = null
  }
}
</script>
