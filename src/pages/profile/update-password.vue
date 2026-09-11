<template>
  <BaseDialog
    v-model="isActive"
    :title="$t('pages.profile.dialogues.updatePassword.updatePassword')"
    class="update-password-page"
    @close="backToProfile"
  >
    <form class="update-password-page-form" @submit.prevent="updatePassword">
      <BaseInput
        v-model="passwords.new"
        type="password"
        :label="$t('pages.profile.dialogues.updatePassword.newPassword')"
        minlength="6"
        maxlength="72"
        :class="{ valid: r$.new.$correct, error: r$.new.$error }"
        :errors="r$.new.$errors"
      />
      <BaseInput
        v-model="passwords.confirmed"
        type="password"
        :label="$t('pages.profile.dialogues.updatePassword.confirmPassword')"
        minlength="6"
        maxlength="72"
        :class="{ valid: r$.confirmed.$correct, error: r$.confirmed.$error }"
        :errors="r$.confirmed.$errors"
      />
      <button class="button-success" :disabled="!r$.$correct || isLoading" type="submit">
        {{ $t('pages.profile.dialogues.updatePassword.updatePassword') }}
      </button>
    </form>
  </BaseDialog>
</template>

<script setup lang="ts">
import { useRegle } from '@regle/core'
import { maxLength, minLength, required, sameAs, withMessage } from '@regle/rules'
import { useThrottleFn } from '@vueuse/core'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import BaseDialog from '@/components/base/BaseDialog.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { REQUEST_THROTTLE_TIMEOUT, VALIDATION_DEBOUNCE } from '@/constants'
import { useUserStore } from '@/stores/user'

definePage({
  meta: {
    title: 'pages.profile.updatePassword',
  },
})

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

const isLoading = ref<boolean>(false)
const isActive = ref(true)
const passwords = reactive({
  new: '',
  confirmed: '',
})
const { r$ } = useRegle(passwords, {
  new: {
    required: withMessage(required, t('pages.profile.dialogues.updatePassword.validation.passwordEmpty')),
    minLength: withMessage(minLength(6), t('pages.signUp.validation.passwordMinLength')),
    maxLength: withMessage(maxLength(72), t('pages.signUp.validation.passwordMaxLength')),
  },
  confirmed: {
    required: withMessage(required, t('pages.profile.dialogues.updatePassword.validation.passwordEmpty')),
    minLength: withMessage(minLength(6), t('pages.profile.dialogues.updatePassword.validation.passwordMinLength')),
    maxLength: withMessage(maxLength(72), t('pages.profile.dialogues.updatePassword.validation.passwordMaxLength')),
    sameAs: withMessage(sameAs(() => passwords.new), t('pages.profile.dialogues.updatePassword.validation.passwordsNotMatch')),
  },
}, { debounce: VALIDATION_DEBOUNCE })
const updatePassword = useThrottleFn(async () => {
  isLoading.value = true
  try {
    await userStore.update({ password: passwords.new })
    toast.success(t('pages.profile.notifications.passwordUpdated'))
    router.replace('/profile')
  }
  finally {
    isLoading.value = false
  }
}, REQUEST_THROTTLE_TIMEOUT)

function backToProfile() {
  router.replace('/profile')
}
</script>

<style>
.update-password-page {
  .base-dialog__content .update-password-page-form {
    display: grid;
    gap: 1rem;
    .base-input {
      display: grid;
      gap: 0.25rem;
      .base-input__input {
        height: 2rem;
      }
    }
  }
}
</style>
