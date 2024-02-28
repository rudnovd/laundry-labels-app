<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useUserStore } from '@/store/user'
import usePwa from '@/composables/usePwa'
import { getBrowserLocale, setLocale } from '@/utils/locale'
import { useItemsStore } from '@/store/items'

const { loading } = useQuasar()
const userStore = useUserStore()
const { t } = useI18n()
const router = useRouter()

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
watch(
  router.currentRoute,
  ({ matched }) => {
    const { getStandardSymbols, getStandardTags } = useItemsStore()
    if (matched.some(({ path }) => path === '/items')) {
      getStandardSymbols()
      getStandardTags()
    }
  },
  { once: true },
)
</script>
