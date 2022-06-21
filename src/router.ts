import { LocalStorage } from 'quasar'
import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/HomePage.vue'
import { useUserStore } from './store/user'

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
]

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    ...publicRoutes,
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/pages/ProfilePage.vue'),
    },
    {
      path: '/create',
      name: 'Create new item',
      component: () => import('@/pages/CreateItemPage.vue'),
    },
    {
      path: '/edit/:id',
      name: 'Edit item',
      component: () => import('@/pages/CreateItemPage.vue'),
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

router.beforeEach((to, _, next) => {
  const userStore = useUserStore()

  const hasRefreshToken = LocalStorage.getItem('hasRefreshToken') as boolean
  if (publicRoutes.some((route) => route.path === to.path)) {
    next()
  } else if (!userStore.user?._id && hasRefreshToken) {
    userStore.getAuthFromRefreshToken().then((response) => (response.user?._id ? next() : next({ path: '/signIn' })))
  } else if (!userStore.user?._id && !hasRefreshToken) {
    next({ path: '/signin' })
  } else {
    next()
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
