import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'

declare let self: ServiceWorkerGlobalScope

clientsClaim()

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

// to allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')), new CacheFirst())
self.skipWaiting()

// cache api requests example
// registerRoute(
//   ({ url }) => url.pathname.startsWith('/api/'),
//   new StaleWhileRevalidate({
//     cacheName: 'api-cache',
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [200],
//       }),
//     ],
//   })
// )
