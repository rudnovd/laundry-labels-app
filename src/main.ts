import App from '@/App.vue'
import router from '@/router'
import pinia from '@/store'
import '@/styles/main.scss'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/roboto-font/roboto-font.css'
import type { QuasarPluginOptions } from 'quasar'
import { Dialog, Loading, LocalStorage, Notify, Quasar } from 'quasar'
import 'quasar/src/css/index.sass'
import { createApp } from 'vue'

const quasarOptions: Partial<QuasarPluginOptions> = {
  plugins: {
    Notify,
    Loading,
    LocalStorage,
    Dialog,
  },
  config: {
    loading: {
      delay: 500,
    },
  },
}

const app = createApp(App)
app.use(Quasar, quasarOptions).use(pinia).use(router).mount('#app')

// if (process.env.VITE_APP_SENTRY_DSN) {
//   Sentry.init({
//     app,
//     dsn: process.env.VITE_APP_SENTRY_DSN,
//     integrations: [
//       new Integrations.BrowserTracing({
//         routingInstrumentation: Sentry.vueRouterInstrumentation(router),
//         tracingOrigins: ['localhost', /^\//],
//       }),
//     ],
//     tracesSampleRate: 1.0,
//   })
// }
