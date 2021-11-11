import '@/registerServiceWorker'
import { Quasar } from 'quasar'
import { createApp } from 'vue'
import App from './App.vue'
import quasarUserOptions from './quasar-user-options'
import router from './router'
import store from './store'

createApp(App).use(Quasar, quasarUserOptions).use(store).use(router).mount('#app')
