import { isAccessTokenValid } from '@/services/jwt'
import { useUserStore } from '@/store/user'
import { LocalStorage } from 'quasar'
import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from 'vue-router'

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
    path: '/redirect',
    name: 'Redirect',
    component: () => import('@/pages/RedirectPage.vue'),
    props: (route) => route.redirectedFrom?.meta.redirect,
  },
]

const userRoutes: Array<RouteRecordRaw> = [
  {
    path: 'items',
    name: 'Items',
    component: () => import('@/pages/ItemsPage.vue'),
  },
  {
    path: 'items/create',
    name: 'Create item',
    component: () => import('@/pages/items/CreateItemPage.vue'),
  },
  {
    path: 'items/edit/:id',
    name: 'Edit item',
    component: () => import('@/pages/items/EditItemPage.vue'),
  },
  {
    path: 'items/:id',
    name: 'Item',
    component: () => import('@/pages/items/ItemPage.vue'),
  },
  {
    path: 'profile',
    name: 'Profile',
    component: () => import('@/pages/ProfilePage.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'Page not found',
    component: () => import('@/pages/ErrorPage.vue'),
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
      path: '/:pathMatch(.*)*',
      component: () => import('@/layouts/UserLayout.vue'),
      children: userRoutes,
    },
  ],
})

router.beforeEach((to, _, next) => {
  const userStore = useUserStore()
  const hasRefreshToken = LocalStorage.getItem<boolean>('hasRefreshToken')
  const isUserSignedIn = !!userStore.user?._id

  if (isUserSignedIn) {
    next()
  } else {
    if (publicRoutes.some((route) => route.name === to.name)) {
      next()
    } else if (hasRefreshToken) {
      if (!window.navigator.onLine) {
        next()
      } else if (isAccessTokenValid()) {
        const auth = userStore.signInFromAccessToken()
        next(auth.user?._id ? to.path : { name: 'Sign in' })
      } else {
        userStore.signInFromRefreshToken().then((response) => (response.user?._id ? next() : next({ name: 'Sign in' })))
      }
    } else {
      next({ name: 'Sign in' })
    }
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
