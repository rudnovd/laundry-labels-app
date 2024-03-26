import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

// to allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')), new CacheFirst())

// Supabase items cache
registerRoute(
  ({ url }) => url.pathname === '/rest/v1/items',
  // Return cached items when user is offline
  new NetworkFirst({
    cacheName: 'supabase-items-rest',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })],
  }),
  'GET',
)

// Supabase items photos cache
registerRoute(
  ({ url }) => url.pathname.startsWith('/storage/v1/object/public/items'),
  new StaleWhileRevalidate({
    cacheName: 'supabase-items-storage',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })],
  }),
  'GET',
)

registerRoute(
  ({ url }) => url.pathname.startsWith('/icons'),
  new CacheFirst({
    cacheName: 'icons',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  }),
  'GET',
)

registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  }),
)
