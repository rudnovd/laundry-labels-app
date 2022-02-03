import { LocalStorage } from 'quasar'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from './store/user'
import Home from './views/HomePage.vue'

const publicRoutes = [
  // {
  //   path: '/welcome',
  //   name: 'Welcome',
  //   component: () => import(/* webpackChunkName: "welcome" */ '@/views/WelcomePage.vue'),
  // },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/LoginPage.vue'),
  },
  {
    path: '/registration',
    name: 'Registartion',
    component: () => import(/* webpackChunkName: "registration" */ '@/views/RegistrationPage.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/ProfilePage.vue'),
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
      component: () => import(/* webpackChunkName: "createitem" */ '@/views/CreateItemPage.vue'),
    },
    {
      path: '/edit/:id',
      name: 'Edit item',
      component: () => import(/* webpackChunkName: "createitem" */ '@/views/CreateItemPage.vue'),
    },
    {
      path: '/item/:id',
      name: 'Item',
      component: () => import(/* webpackChunkName: "item" */ '@/views/ItemPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Page not found',
      component: () => import(/* webpackChunkName: "error" */ '@/views/ErrorPage.vue'),
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
