import { isAccessTokenValid } from '@/services/jwt'
import { useUserStore } from '@/store/user'
import { useLocalStorage } from '@vueuse/core'
import { LocalStorage } from 'quasar'
import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from 'vue-router'
import type { LocalStorageDemo, UserSettings } from './interfaces/types'

function isUserSignedIn() {
  const userStore = useUserStore()
  const hasRefreshToken = LocalStorage.getItem<boolean>('hasRefreshToken')
  return !!userStore.user?._id || isAccessTokenValid() || (hasRefreshToken && !window.navigator.onLine) || false
}

async function trySignIn() {
  const userStore = useUserStore()
  const hasRefreshToken = LocalStorage.getItem<boolean>('hasRefreshToken')

  if (!window.navigator.onLine) {
    return null
  } else if (isAccessTokenValid()) {
    const auth = userStore.signInFromAccessToken()
    return auth.user
  } else if (hasRefreshToken) {
    const auth = await userStore.signInFromRefreshToken()
    return auth.user
  } else {
    return null
  }
}

function redirectIfSignedIn(_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) {
  isUserSignedIn() ? next({ name: 'Redirect' }) : next()
}

const publicRoutes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'Home',
    meta: {
      title: 'Laundry Labels App',
    },
    component: () => import('@/pages/HomePage.vue'),
    beforeEnter: async (_from, _to, next) => {
      if (isUserSignedIn() || (await trySignIn())) {
        next({ name: 'Items' })
      } else {
        next()
      }
    },
  },
  {
    path: 'sign-in',
    name: 'Sign in',
    component: () => import('@/pages/SignInPage.vue'),
    beforeEnter: redirectIfSignedIn,
    meta: {
      redirect: {
        text: 'You are already sign in, redirecting...',
        path: window.history.state?.back || '/',
      },
    },
  },
  {
    path: 'sign-up',
    name: 'Sign up',
    component: () => import('@/pages/SignUpPage.vue'),
    beforeEnter: redirectIfSignedIn,
    meta: {
      redirect: {
        text: 'You are already sign in, redirecting...',
        path: window.history.state?.back || '/',
      },
    },
  },
  {
    path: 'reset-password',
    name: 'Reset password',
    component: () => import('@/pages/ResetPasswordPage.vue'),
    beforeEnter: redirectIfSignedIn,
    meta: {
      redirect: {
        text: 'You are already signed in, redirecting...',
        path: window.history.state?.back || '/',
      },
    },
  },
  {
    path: '/redirect',
    name: 'Redirect',
    component: () => import('@/pages/RedirectPage.vue'),
    props: (route) => route.redirectedFrom?.meta.redirect,
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: publicRoutes,
      beforeEnter: (_to, _from, next) => {
        isUserSignedIn() ? next({ name: 'Items' }) : next()
      },
    },
    {
      path: '/items',
      component: () => import('@/layouts/UserLayout.vue'),
      children: [
        {
          path: '',
          name: 'Items',
          component: () => import('@/pages/ItemsPage.vue'),
        },
        {
          path: 'create',
          name: 'Create item',
          component: () => import('@/pages/items/CreateItemPage.vue'),
        },
        {
          path: 'edit/:id',
          name: 'Edit item',
          component: () => import('@/pages/items/EditItemPage.vue'),
        },
        {
          path: ':id',
          name: 'Item',
          component: () => import('@/pages/items/ItemPage.vue'),
        },
      ],
    },
    {
      path: '/profile',
      component: () => import('@/layouts/UserLayout.vue'),
      children: [
        {
          path: '',
          name: 'Profile',
          component: () => import('@/pages/ProfilePage.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Page not found',
      component: () => import('@/pages/ErrorPage.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      if (savedPosition) {
        return resolve(savedPosition)
      } else if (to.hash) {
        return document.querySelector(to.hash) ?? resolve({ el: to.hash })
      } else {
        return resolve({ left: 0, top: 0 })
      }
    })
  },
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const hasRefreshToken = LocalStorage.getItem<boolean>('hasRefreshToken') ?? false
  const isUserSignedIn = !!userStore.user?._id
  const demoStorage = useLocalStorage<Partial<LocalStorageDemo>>(
    'demo',
    {},
    { listenToStorageChanges: false, writeDefaults: false },
  )
  const userSettings = useLocalStorage<Partial<UserSettings>>('user-settings', {})

  const isFirstVisitToDemo = to.query.demo && !demoStorage.value?.active
  if (isFirstVisitToDemo) {
    localStorage.setItem('demo', JSON.stringify({ active: false, page: null, step: null }))
    useLocalStorage<Partial<UserSettings>>('user-settings', { offlineMode: !hasRefreshToken })
  }

  const isDemoActive = demoStorage.value?.active
  const isOfflineMode = userSettings.value.offlineMode
  const isPublicRoute = publicRoutes.some((route) => route.name === to.name)
  if (isPublicRoute || isFirstVisitToDemo || isDemoActive || isUserSignedIn || isOfflineMode) {
    return next()
  }

  if (!hasRefreshToken) {
    return next({ name: 'Sign in' })
  }

  if (!window.navigator.onLine) {
    next()
  } else if (isAccessTokenValid()) {
    const auth = userStore.signInFromAccessToken()
    next(auth.user?._id ? to.path : { name: 'Sign in' })
  } else {
    userStore.signInFromRefreshToken().then((response) => (response.user?._id ? next() : next({ name: 'Sign in' })))
  }
})

router.beforeResolve((to) => {
  document.title = (to.meta?.title as string) || to.name?.toString() || 'Laundry Labels App'
})

router.resolve({
  name: 'Page not found',
  params: { pathMatch: ['not', 'found'] },
}).href

export default router
