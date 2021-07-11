import './firebase'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const auth = getAuth()
let appRendered = false

onAuthStateChanged(auth, (user) => {
  if (user) store.commit('SET_USER', user)

  if (!appRendered) {
    createApp(App).use(Quasar, quasarUserOptions).use(store).use(router).mount('#app')
    appRendered = true
  }
})
