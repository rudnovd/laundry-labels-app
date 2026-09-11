<template>
  <NavigationHeader v-if="routerIsReady && isNavigationDisplayed" ref="navigationHeaderElement" />
  <RouterView v-slot="{ Component }">
    <main>
      <KeepAlive include="index">
        <component :is="Component" />
      </KeepAlive>
    </main>
  </RouterView>
  <Toaster theme="system" position="bottom-center" :toast-options="{ class: 'notification' }" />
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { whenever } from '@vueuse/core'
import { computed, defineAsyncComponent, nextTick, onBeforeMount, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast, Toaster } from 'vue-sonner'
import { useUserStore } from '@/stores/user'
import useItems from './composables/useItems'
import { useOnboarding } from './composables/useOnboarding'
import { IS_OFFLINE_APP } from './constants'
import { IS_ONBOARDING_FINISHED_KEY } from './constants/onboarding'
import { useLaundryDataStore } from './stores/laundryData'
import { supabase } from './supabase'

const NavigationHeader = defineAsyncComponent(() => import('@/components/NavigationHeader.vue'))

const router = useRouter()
const { getItems } = useItems()
const { stop } = watch(() => router.currentRoute.value.path, (path) => {
  const pages: ReadonlyArray<RouteLocationRaw> = ['/items/filter', '/profile']
  if (pages.includes(path)) {
    getItems()
    stop()
  }
})
const isNavigationDisplayed = computed<boolean>(() => !router.currentRoute.value.meta.isNavbarHidden)
const { t } = useI18n()
async function exchangeCodeForSession(urlString: string) {
  if (IS_OFFLINE_APP || !supabase) {
    return
  }
  const code = new URL(urlString).searchParams.get('code')
  if (!code) {
    return
  }
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    toast.error(t('pages.signIn.notifications.failedToSignedIn'))
    console.error(error)
    return
  }
  toast.success(t('pages.signIn.notifications.successfullySignedIn'))
}
onBeforeMount(async () => {
  if (import.meta.env.VITE_IS_TAURI) {
    await exchangeCodeForSession(window.location.href)
    router.replace('/')
  }
})
if (import.meta.env.VITE_IS_TAURI) {
  let listenerRemover: (() => void) | null = null
  import('@tauri-apps/plugin-deep-link').then(async ({ onOpenUrl }) => {
    listenerRemover = await onOpenUrl(async (urls) => {
      if (!urls.length) {
        return
      }
      await exchangeCodeForSession(urls[0])
    })
  })
  onUnmounted(() => {
    if (listenerRemover) {
      listenerRemover()
    }
  })
}
const routerIsReady = ref<boolean>(false)
onMounted(async () => {
  await router.isReady()
  routerIsReady.value = true
  if (router.currentRoute.value.query.error_description) {
    toast.error(router.currentRoute.value.query.error_description.toString())
  }
  if (router.currentRoute.value.query.error_description) {
    toast.error(router.currentRoute.value.query.error_description.toString())
  }
})
const isOnboardingFinished = localStorage.getItem(IS_ONBOARDING_FINISHED_KEY) === 'true'
const navigationHeaderRef = useTemplateRef('navigationHeaderElement')
if (!isOnboardingFinished) {
  const { onboardingStep, start } = useOnboarding()
  whenever(navigationHeaderRef, () => {
    if (onboardingStep.value !== null) {
      nextTick(start)
    }
  })
}

const userStore = useUserStore()
if (supabase) {
  supabase.auth.onAuthStateChange((_, session) => {
    userStore.user = session?.user ?? null
  })
}
const { getStandardSymbols, getStandardTags, getStandardMaterials } = useLaundryDataStore()
getStandardSymbols()
getStandardTags()
getStandardMaterials()
</script>

<style>
@import url('./assets/styles/root');
@import url('./assets/styles/fonts');
@import url('./assets/styles/buttons');
@import url('./assets/styles/notifications');
</style>
