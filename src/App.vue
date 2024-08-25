<template>
  <router-view />
</template>

<script setup lang="ts">
import { computed, onBeforeMount, watch } from 'vue'
import { type RouteRecordName, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useUserStore } from '@/store/user'
import usePwa from '@/composables/usePwa'
import { setLocale } from '@/utils/locale'
import { userSettingsStorage } from '@/utils/localStorage'
import { useLaundryDataStore } from './store/laundryData'

const { loading } = useQuasar()
const userStore = useUserStore()
const { t } = useI18n()
const router = useRouter()

onBeforeMount(async () => {
  await setLocale(userSettingsStorage.value.locale)
  if (userStore.isOfflineMode) return
  loading.show({ message: t('common.authenticating'), delay: 2000 })
  try {
    await userStore.getSession()
  } finally {
    loading.hide()
  }
})
const isOnline = computed(() => userStore.isOnline)
watch(isOnline, (online) => {
  userSettingsStorage.value.offlineMode = online ? userSettingsStorage.value.previousOfflineMode : true
})

usePwa()
const stop = watch(router.currentRoute, ({ matched }) => {
  const matchedPages: Array<RouteRecordName> = ['Items parent', 'Profile parent']
  const { getStandardSymbols, getStandardTags, getStandardMaterials } = useLaundryDataStore()
  if (matched.some(({ name }) => name && matchedPages.includes(name))) {
    getStandardSymbols()
    getStandardTags()
    getStandardMaterials()
    stop()
  }
})
</script>
