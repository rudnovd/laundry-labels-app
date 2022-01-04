import '@/registerServiceWorker'
import '@/styles/main.scss'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/roboto-font/roboto-font.css'
import { Quasar } from 'quasar'
import 'quasar/src/css/index.sass'
import { createApp } from 'vue'
import App from './App.vue'
import quasarUserOptions from './quasar-user-options'
import router from './router'
import { store } from './store'

const app = createApp(App)
app.use(Quasar, quasarUserOptions).use(store).use(router).mount('#app')

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
