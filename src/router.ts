import { LocalStorage } from 'quasar'
import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/HomePage.vue'
import { useUserStore } from './store/user'

const publicRoutes = [
  // {
  //   path: '/welcome',
  //   name: 'Welcome',
  //   component: () => import(/* webpackChunkName: "welcome" */ '@/pages/WelcomePage.vue'),
  // },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
  },
  {
    path: '/registration',
    name: 'Registartion',
    component: () => import('@/pages/RegistrationPage.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/ProfilePage.vue'),
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
  const user = useUserStore()
  if (user.offlineMode) return next()

  const hasRefreshToken = LocalStorage.getItem('hasRefreshToken') as boolean
  if (publicRoutes.findIndex((route) => route.path === to.path) !== -1) {
    if (!user.user._id && hasRefreshToken) user.getAuthFromRefreshToken()
    next()
  } else if (!user.user._id && hasRefreshToken) {
    user.getAuthFromRefreshToken().then((response) => (response.user._id ? next() : next({ path: '/login' })))
  } else if (!user.user._id && !hasRefreshToken) {
    next({ path: '/login' })
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
}).href // '/not/found'

export default router
