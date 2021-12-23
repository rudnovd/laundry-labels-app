/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (import.meta.env.PROD) {
  register(`./sw.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' + 'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated(registration) {
      console.log('New content is available; please refresh.')
      const confirmationResult = confirm('New content found! Do you want to reload the app?')
      if (registration.waiting && confirmationResult) registration.waiting.postMessage({ action: 'skipWaiting' })
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    },
  })

  let refreshing: unknown
  navigator.serviceWorker.addEventListener('controllerchange', (e) => {
    if (refreshing) return
    window.location.reload()
    refreshing = true
  })
}
