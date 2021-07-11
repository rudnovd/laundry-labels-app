import store from '@/store'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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
    name: 'Create',
    component: () => import(/* webpackChunkName: "createitem" */ '@/views/CreateItem.vue'),
  },
  {
    path: '/item/:id',
    name: 'Item',
    component: () => import(/* webpackChunkName: "item" */ '@/views/Item.vue'),
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

const pagesWithoutAuth = ['/login', '/registration']

router.beforeEach((to, _, next) => {
  if (pagesWithoutAuth.indexOf(to.path) !== -1) next()
  else if (store.state.user) next()
  else next({ path: '/login' })
})

router.afterEach((to) => {
  if (to.name) document.title = to.name.toString()
})

export default router
