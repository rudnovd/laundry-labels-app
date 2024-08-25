import { useUserStore } from '@/store/user'
import { type NavigationGuard, type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { demoStorage, userSettingsStorage } from '@/utils/localStorage'
import { IS_OFFLINE_APP } from './constants'

async function isUserSignedIn() {
  const userStore = useUserStore()
  const session = await userStore.getSession()
  return !!userStore.user?.id || !!session
}

const redirectIfSignedIn: NavigationGuard = async (_from, _to, next) => {
  const isSignedIn = await isUserSignedIn()
  return isSignedIn ? next({ name: 'Redirect' }) : next()
}

const pushIfSignedIn: NavigationGuard = async (_from, _to, next) => {
  const isSignedIn = await isUserSignedIn()
  return isSignedIn ? next({ name: 'Items' }) : next()
}

const publicRoutes: Array<RouteRecordRaw> = (() => {
  const baseRoutes: Array<RouteRecordRaw> = [
    {
      path: '',
      name: 'Home',
      meta: {
        title: 'Laundry Labels App',
      },
      component: () => import('@/pages/HomePage.vue'),
      beforeEnter: IS_OFFLINE_APP ? [] : [pushIfSignedIn],
    },

    {
      path: '/redirect',
      name: 'Redirect',
      component: () => import('@/pages/RedirectPage.vue'),
      props: (route) => route.redirectedFrom?.meta.redirect,
    },
  ]
  const onlineAppRoutes: Array<RouteRecordRaw> = [
    {
      path: 'sign-in',
      name: 'Sign in',
      component: () => import('@/pages/SignInPage.vue'),
      beforeEnter: redirectIfSignedIn,
      meta: {
        redirect: {
          text: 'You are already sign in, redirecting',
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
          text: 'You are already sign in, redirecting',
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
          text: 'You are already signed in, redirecting',
          path: window.history.state?.back || '/',
        },
      },
    },
  ]
  return baseRoutes.concat(IS_OFFLINE_APP ? [] : onlineAppRoutes)
})()

const profileChildren: Array<RouteRecordRaw> = (() => {
  const baseRoutes: Array<RouteRecordRaw> = [
    {
      path: 'core-options',
      name: 'Core options',
      component: () => import('@/pages/profile/CoreOptionsDialog.vue'),
    },
    {
      path: 'language-options',
      name: 'Language options',
      component: () => import('@/pages/profile/LanguageOptionsDialog.vue'),
    },
  ]
  const onlineAppRoutes: Array<RouteRecordRaw> = [
    {
      path: 'update-password',
      name: 'Update password',
      component: () => import('@/pages/profile/UpdatePasswordDialog.vue'),
    },
  ]
  return baseRoutes.concat(IS_OFFLINE_APP ? [] : onlineAppRoutes)
})()

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: publicRoutes,
  },
  {
    path: '/items',
    name: 'Items parent',
    component: () => import('@/layouts/UserLayout.vue'),
    children: [
      {
        path: '',
        name: 'Items',
        component: () => import('@/pages/ItemsPage.vue'),
        children: [
          {
            path: 'filter',
            name: 'Filter items',
            component: () => import('@/pages/items/FilterItemsDialog.vue'),
          },
        ],
      },
      {
        path: 'create',
        name: 'Create item',
        component: () => import('@/pages/items/ModifyItemPage.vue'),
      },
      {
        path: 'edit/:id',
        name: 'Edit item',
        component: () => import('@/pages/items/ModifyItemPage.vue'),
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
    name: 'Profile parent',
    component: () => import('@/layouts/UserLayout.vue'),
    children: [
      {
        path: '',
        name: 'Profile',
        component: () => import('@/pages/ProfilePage.vue'),
        children: profileChildren,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Page not found',
    component: () => import('@/pages/ErrorPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior(to, _, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      const ignoredHashes = ['#access_token', '#error']
      const hashName = to.hash.split('=').shift()
      if (hashName && ignoredHashes.includes(hashName)) return { top: 0 }
      return document.querySelector(to.hash) ? { el: to.hash, behavior: 'smooth' } : undefined
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach(async (to, _, next) => {
  const userStore = useUserStore()
  const isSignedIn = IS_OFFLINE_APP ? false : await isUserSignedIn()

  const isFirstVisitToDemo = to.query.demo && !demoStorage.value?.active
  if (isFirstVisitToDemo) {
    localStorage.setItem('demo', JSON.stringify({ active: false, page: null, step: null }))
    userSettingsStorage.value.offlineMode = !isSignedIn
  }

  const isDemoActive = demoStorage.value?.active
  const isOfflineMode = userStore.isOfflineMode
  const isOffline = !userStore.isOnline
  const isPublicRoute = publicRoutes.some((route) => route.name === to.name)
  if (
    IS_OFFLINE_APP ||
    isPublicRoute ||
    isFirstVisitToDemo ||
    isDemoActive ||
    isOfflineMode ||
    isOffline ||
    isSignedIn
  ) {
    return next()
  }
  if (!isSignedIn) {
    return next({ name: 'Sign in' })
  }
  next()
})

router.beforeResolve((to) => {
  document.title = to.meta?.title?.toString() || to.name?.toString() || 'Laundry Labels App'
})

router.resolve({
  name: 'Page not found',
  params: { pathMatch: ['not', 'found'] },
}).href

export default router
