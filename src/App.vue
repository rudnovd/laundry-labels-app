<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount, watch } from 'vue'
import { type RouteRecordName, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useUserStore } from '@/store/user'
import usePwa from '@/composables/usePwa'
import { setLocale } from '@/utils/locale'
import { useItemsStore } from '@/store/items'
import { userSettingsStorage } from '@/utils/localStorage'

const { loading } = useQuasar()
const userStore = useUserStore()
const { t } = useI18n()
const router = useRouter()

onBeforeMount(async () => {
  await setLocale(userSettingsStorage.value.locale)
  loading.show({ message: t('common.authenticating') })
  try {
    await userStore.getSession()
  } finally {
    loading.hide()
  }
})

usePwa()
const stop = watch(router.currentRoute, ({ matched }) => {
  const matchedPages: Array<RouteRecordName> = ['Items parent', 'Profile parent']
  const { getStandardSymbols, getStandardTags } = useItemsStore()
  if (matched.some(({ name }) => name && matchedPages.includes(name))) {
    getStandardSymbols()
    getStandardTags()
    stop()
  }
})
</script>
