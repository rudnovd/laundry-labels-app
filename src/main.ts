import '@/registerServiceWorker'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import { createApp } from 'vue'
import App from './App.vue'
import quasarUserOptions from './quasar-user-options'
import router from './router'

createApp(App).use(Quasar, quasarUserOptions).use(createPinia()).use(router).mount('#app')

console.log(process.env)
