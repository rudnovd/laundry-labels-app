import { isAccessTokenValid } from '@/services/jwt'
import { useUserStore } from '@/store/user'
import { LocalStorage } from 'quasar'
import { createRouter, createWebHistory } from 'vue-router'

const publicRoutes = [
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('@/pages/WelcomePage.vue'),
  },
  {
    path: '/signin',
    name: 'Sign in',
    component: () => import('@/pages/SignInPage.vue'),
  },
  {
    path: '/signup',
    name: 'Sign up',
    component: () => import('@/pages/SignUpPage.vue'),
  },
  // {
  //   path: '/redirect',
  //   name: 'Redirect',
  //   component: () => import('@/pages/RedirectPage.vue'),
  // },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    ...publicRoutes,
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/pages/ProfilePage.vue'),
    },
    {
      path: '/item/create',
      name: 'Create item',
      component: () => import('@/pages/CreateItemPage.vue'),
    },
    {
      path: '/item/edit/:id',
      name: 'Edit item',
      component: () => import('@/pages/EditItemPage.vue'),
    },
    {
      path: '/item/:id',
      name: 'Item',
      component: () => import('@/pages/ItemPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Page not found',
      component: () => import('@/pages/ErrorPage.vue'),
    },
  ],
})

// function redirectIfLoggedIn(_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) {
//   console.log('redirectIfLoggedIn')
//   const userStore = useUserStore()
//   const isUserLoggedIn = !!userStore.user?._id
//   if (isUserLoggedIn) {
//     next({ name: 'Redirect', state: { message: 'You are already signed in', path: '/' } })
//   }
// }

router.beforeEach((to, _, next) => {
  const userStore = useUserStore()
  const hasRefreshToken = LocalStorage.getItem<boolean>('hasRefreshToken')
  const isUserLoggedIn = !!userStore.user?._id

  if (isUserLoggedIn) {
    next()
  } else {
    if (publicRoutes.some((route) => route.path === to.path)) {
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

router.afterEach((to) => {
  if (to.name) document.title = to.name.toString()
})

router.resolve({
  name: 'Page not found',
  params: { pathMatch: ['not', 'found'] },
}).href

export default router
