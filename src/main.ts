import App from '@/App.vue'
import i18n from '@/i18n'
import router from '@/router'
import pinia from '@/store'
import '@/styles/main.scss'
import '@quasar/extras/material-icons/material-icons.css'
import type { QuasarPluginOptions } from 'quasar'
import { Dark, Dialog, Loading, LocalStorage, Notify, Quasar } from 'quasar'
import 'quasar/src/css/index.sass'
import { createApp } from 'vue'

const quasarOptions: Partial<QuasarPluginOptions> = {
  plugins: {
    Notify,
    Loading,
    LocalStorage,
    Dialog,
    Dark,
  },
  config: {
    loading: {
      delay: 500,
    },
    dark: false,
  },
}

const app = createApp(App)
app.use(Quasar, quasarOptions).use(i18n).use(pinia).use(router).mount('#app')
