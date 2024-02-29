<template>
  <teleport to="body">
    <q-dialog v-model="isActive" persistent>
      <q-card class="update-password-dialog-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ t('pages.profile.dialogs.updatePassword.updatePassword') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="router.push({ name: 'Profile' })" />
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
              v-model="passwords.newPassword"
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
              v-model="passwords.confirmPassword"
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
              :disable="!passwords.newPassword.length || !isPasswordsEqual || loading.isActive"
              type="submit"
              color="positive"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </teleport>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { throttle, useQuasar, type ValidationRule } from 'quasar'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { REQUEST_THROTTLE_TIMEOUT } from '@/constants'
import { computed } from 'vue'

const { notify, loading } = useQuasar()
const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

const passwords = reactive({
  newPassword: '',
  confirmPassword: '',
})
const isActive = ref(true)
const isPasswordsEqual = computed(() => passwords.newPassword === passwords.confirmPassword)
const validationRules = computed<Record<string, ValidationRule<string>>>(() => {
  return {
    notEmpty: (value) => !!value?.length || t('pages.profile.dialogs.updatePassword.validation.passwordEmpty'),
    minLength: (value) => value?.length >= 6 || t('pages.profile.dialogs.updatePassword.validation.minLength'),
    equalPassword: () =>
      isPasswordsEqual.value || t('pages.profile.dialogs.updatePassword.validation.passwordsNotMatch'),
  }
})

const updatePassword = throttle(async () => {
  loading.show()
  try {
    await userStore.update({ password: passwords.newPassword })
    notify({
      type: 'positive',
      message: t('pages.profile.notifications.passwordUpdated'),
    })
    router.push({ name: 'Profile' })
  } finally {
    loading.hide()
  }
}, REQUEST_THROTTLE_TIMEOUT)
</script>

<style>
.update-password-dialog-card {
  min-width: 300px;
}
</style>
