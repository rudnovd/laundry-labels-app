<template>
  <q-dialog ref="dialogRef" v-model="isActive" persistent>
    <q-card class="update-password-dialog-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ t('pages.profile.dialogs.updatePassword.updatePassword') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="backToProfile" />
      </q-card-section>

      <q-card-section>
        <q-form
          class="q-mb-md"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="off"
          spellcheck="false"
          @submit="updatePassword"
        >
          <q-input
            ref="newPasswordRef"
            v-model="passwords.new"
            outlined
            class="q-mb-md"
            type="password"
            :label="t('pages.profile.dialogs.updatePassword.newPassword')"
            maxlength="72"
            bg-color="grey-1"
            filled
            lazy-rules
            :rules="[validationRules.notEmpty, validationRules.minLength]"
          />
          <q-input
            ref="confirmedPasswordRef"
            v-model="passwords.confirmed"
            outlined
            class="q-mb-md"
            type="password"
            :label="t('pages.profile.dialogs.updatePassword.confirmPassword')"
            maxlength="72"
            bg-color="grey-1"
            filled
            lazy-rules
            :rules="[validationRules.notEmpty, validationRules.minLength, validationRules.equalPassword]"
          />
          <q-btn
            class="full-width"
            :label="t('pages.profile.dialogs.updatePassword.updatePassword')"
            :disable="hasValidationErrors || loading.isActive"
            type="submit"
            color="positive"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { type QDialog, QInput, type ValidationRule, throttle, useQuasar } from 'quasar'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { REQUEST_THROTTLE_TIMEOUT } from '@/constants'
import { computed } from 'vue'
import { validation } from '@/utils/validation'

const { notify, loading } = useQuasar()
const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

const isActive = ref(true)
const passwords = reactive({
  new: '',
  confirmed: '',
})
const newPasswordRef = ref<InstanceType<typeof QInput> | null>(null)
const confirmedPasswordRef = ref<InstanceType<typeof QInput> | null>(null)
const validationRules = computed<Record<string, ValidationRule<string>>>(() => {
  const notEmptyMessage = t('pages.profile.dialogs.updatePassword.validation.passwordEmpty')
  const minLengthMessage = t('pages.profile.dialogs.updatePassword.validation.minLength')
  const isEqualMessage = t('pages.profile.dialogs.updatePassword.validation.passwordsNotMatch')
  return {
    notEmpty: (value) => validation.notEmpty(value) || notEmptyMessage,
    minLength: (value) => validation.minLength(value, 6) || minLengthMessage,
    equalPassword: () => validation.isEqual(passwords.new, passwords.confirmed) || isEqualMessage,
  }
})
const hasValidationErrors = computed(() => {
  if (!newPasswordRef.value || !confirmedPasswordRef.value) return true
  const hasNewPasswordError = !newPasswordRef.value.modelValue || newPasswordRef.value.hasError
  const hasConfirmedPasswordError = !confirmedPasswordRef.value.modelValue || confirmedPasswordRef.value.hasError
  return hasNewPasswordError || hasConfirmedPasswordError
})

const updatePassword = throttle(async () => {
  loading.show()
  try {
    await userStore.update({ password: passwords.new })
    notify({
      type: 'positive',
      message: t('pages.profile.notifications.passwordUpdated'),
    })
    router.replace({ name: 'Profile' })
  } finally {
    loading.hide()
  }
}, REQUEST_THROTTLE_TIMEOUT)

const dialogRef = ref<InstanceType<typeof QDialog> | null>(null)
function backToProfile() {
  dialogRef.value?.hide()
  router.replace({ name: 'Profile' })
}
</script>

<style>
.update-password-dialog-card {
  min-width: 300px;
}
</style>
