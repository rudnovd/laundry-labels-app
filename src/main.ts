import { createApp } from 'vue'
import { Dialog, Loading, Notify, Quasar, type QuasarPluginOptions } from 'quasar'
import App from '@/App.vue'
import i18n from '@/i18n'
import router from '@/router'
import pinia from '@/store'
import '@/styles/main.css'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const quasarOptions: Partial<QuasarPluginOptions> = {
  plugins: {
    Notify,
    Loading,
    Dialog,
  },
  config: {
    loading: {
      delay: 500,
    },
  },
}

createApp(App).use(Quasar, quasarOptions).use(i18n).use(pinia).use(router).mount('#app')
