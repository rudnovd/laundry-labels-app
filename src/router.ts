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
