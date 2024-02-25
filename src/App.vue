<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useUserStore } from '@/store/user'
import usePwa from '@/composables/usePwa'
import { getBrowserLocale, setLocale } from '@/utils/locale'

const { loading } = useQuasar()
const userStore = useUserStore()
const { t } = useI18n()

onBeforeMount(async () => {
  await setLocale(getBrowserLocale())
  loading.show({ message: t('common.authenticating') })
  try {
    await userStore.getSession()
  } finally {
    loading.hide()
  }
})

usePwa()
</script>
