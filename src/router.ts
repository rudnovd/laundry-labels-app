import type { RouteLocationRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'
import { useUserStore } from '@/stores/user'
import { IS_OFFLINE_APP } from './constants'
import { IS_ONBOARDING_FINISHED_KEY, ONBOARDING_STEP_KEY } from './constants/onboarding'
import { i18n } from './i18n'

async function isUserSignedIn() {
  const userStore = useUserStore()
  const session = await userStore.getSession()
  return !!userStore.user?.id || !!session
}
const PUBLIC_ROUTES: Array<RouteLocationRaw> = ['/', '/redirect', '/signin', '/signup', '/reset-password', '/reset-password/new-password']

export const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior(to, _, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    else if (to.hash) {
      const ignoredHashes = ['#access_token', '#error']
      const hashName = to.hash.split('=').shift()
      if (hashName && ignoredHashes.includes(hashName)) {
        return { top: 0 }
      }
      return document.querySelector(to.hash) ? { el: to.hash, behavior: 'smooth' } : undefined
    }
    else {
      return { top: 0 }
    }
  },
})

router.beforeEach(async (to, _) => {
  if (import.meta.env.VITE_IS_TAURI) {
    return true
  }
  const userStore = useUserStore()
  const isSignedIn = IS_OFFLINE_APP ? false : await isUserSignedIn()
  const isOfflineMode = userStore.settings.offlineMode
  const isOffline = !userStore.isOnline
  const isPublicRoute = PUBLIC_ROUTES.includes(to.name)
  const isOnboardingFinished = localStorage.getItem(IS_ONBOARDING_FINISHED_KEY) === 'true'
  const isOnboardingActive = !isOnboardingFinished && localStorage.getItem(ONBOARDING_STEP_KEY) !== null
  if (
    IS_OFFLINE_APP
    || isPublicRoute
    || isOnboardingActive
    || isOfflineMode
    || isOffline
    || isSignedIn
  ) {
    return true
  }
  if (!isSignedIn) {
    return '/signin'
  }
  return true
})

router.beforeResolve((to) => {
  const title = to.meta?.title ?? null
  document.title = title ? `Laundry Labels | ${i18n.global.t(title)}` : 'Laundry Labels'
})

if (import.meta.hot) {
  handleHotUpdate(router)
}
