import { getAuth } from 'firebase/auth'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import(/* webpackChunkName: "welcome" */ '@/views/Welcome.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import(/* webpackChunkName: "logout" */ '@/views/Logout.vue'),
  },
  {
    path: '/registration',
    name: 'Registartion',
    component: () => import(/* webpackChunkName: "registration" */ '@/views/Registration.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/Profile.vue'),
  },
  {
    path: '/create',
    name: 'Create new item',
    component: () => import(/* webpackChunkName: "createitem" */ '@/views/CreateItem.vue'),
  },
  {
    path: '/edit/:id',
    name: 'Edit item',
    component: () => import(/* webpackChunkName: "createitem" */ '@/views/CreateItem.vue'),
  },
  {
    path: '/item/:id',
    name: 'Item',
    component: () => import(/* webpackChunkName: "item" */ '@/views/Item.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Page not found',
    component: () => import(/* webpackChunkName: "error" */ '@/views/Error.vue'),
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

const pagesWithoutAuth = ['/welcome', '/login', '/registration', '/logout']

router.beforeEach((to, _, next) => {
  if (pagesWithoutAuth.indexOf(to.path) !== -1) next()
  else if (getAuth().currentUser) next()
  else next({ path: '/welcome' })
})

router.afterEach((to) => {
  if (to.name) document.title = to.name.toString()
})

router.resolve({
  name: 'Page not found',
  params: { pathMatch: ['not', 'found'] },
}).href // '/not/found'

export default router
