import { useUserStore } from '@/store/user'
import { type NavigationGuard, type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { demoStorage, userSettingsStorage } from '@/utils/localStorage'

async function isUserSignedIn() {
  const userStore = useUserStore()
  const session = await userStore.getSession()
  return !!userStore.user || !!session
}

const redirectIfSignedIn: NavigationGuard = async (_from, _to, next) => {
  const isSignedIn = await isUserSignedIn()
  return isSignedIn ? next({ name: 'Redirect' }) : next()
}

const pushIfSignedIn: NavigationGuard = async (_from, _to, next) => {
  const isSignedIn = await isUserSignedIn()
  return isSignedIn ? next({ name: 'Items' }) : next()
}

const publicRoutes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'Home',
    meta: {
      title: 'Laundry Labels App',
    },
    component: () => import('@/pages/HomePage.vue'),
    beforeEnter: pushIfSignedIn,
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
    path: 'new-version-announcement',
    name: 'New version announcement',
    components: {
      default: () => import('@/pages/HomePage.vue'),
      dialog: () => import('@/pages/NewVersionAnnouncementDialog.vue'),
    },
  },
  {
    path: '/redirect',
    name: 'Redirect',
    component: () => import('@/pages/RedirectPage.vue'),
    props: (route) => route.redirectedFrom?.meta.redirect,
  },
]

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
        children: [
          {
            path: 'update-password',
            name: 'Update password',
            component: () => import('@/pages/profile/UpdatePasswordDialog.vue'),
          },
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
        ],
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
    return new Promise((resolve) => {
      if (savedPosition) {
        return resolve(savedPosition)
      } else if (to.hash) {
        const ignoredHashes = ['#access_token', '#error']
        const hashName = to.hash.split('=').shift()
        if (hashName && ignoredHashes.includes(hashName)) return resolve()

        return document.querySelector(to.hash) ?? resolve({ el: to.hash })
      } else {
        return resolve({ left: 0, top: 0 })
      }
    })
  },
})

router.beforeEach(async (to, _, next) => {
  const userStore = useUserStore()
  const isSignedIn = await isUserSignedIn()

  const isFirstVisitToDemo = to.query.demo && !demoStorage.value?.active
  if (isFirstVisitToDemo) {
    localStorage.setItem('demo', JSON.stringify({ active: false, page: null, step: null }))
    userSettingsStorage.value.offlineMode = !isSignedIn
  }

  const isDemoActive = demoStorage.value?.active
  const isOfflineMode = userSettingsStorage.value.offlineMode
  const isOffline = !userStore.isOnline
  const isPublicRoute = publicRoutes.some((route) => route.name === to.name)
  if (isPublicRoute || isFirstVisitToDemo || isDemoActive || isSignedIn || isOfflineMode || isOffline) {
    return next()
  }
  if (!isSignedIn) {
    return next({ name: 'Sign in' })
  }
  next()
})

router.beforeResolve((to) => {
  document.title = (to.meta?.title as string) || to.name?.toString() || 'Laundry Labels App'
})

router.resolve({
  name: 'Page not found',
  params: { pathMatch: ['not', 'found'] },
}).href

export default router
