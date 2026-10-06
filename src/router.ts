import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'
import { i18n } from './i18n'

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
router.beforeResolve((to) => {
  const title = to.meta?.title ?? null
  document.title = title ? `Laundry Labels | ${i18n.global.t(title)}` : 'Laundry Labels'
})

if (import.meta.hot) {
  handleHotUpdate(router)
}
