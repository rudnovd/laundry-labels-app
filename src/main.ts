import '@/registerServiceWorker'
import { Integrations } from '@sentry/tracing'
import * as Sentry from '@sentry/vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import { createApp } from 'vue'
import App from './App.vue'
import quasarUserOptions from './quasar-user-options'
import router from './router'

const app = createApp(App)
app.use(Quasar, quasarUserOptions).use(createPinia()).use(router).mount('#app')

if (process.env.VUE_APP_SENTRY_DSN) {
  Sentry.init({
    app,
    dsn: process.env.VUE_APP_SENTRY_DSN,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ['localhost', /^\//],
      }),
    ],
    tracesSampleRate: 1.0,
  })
}
