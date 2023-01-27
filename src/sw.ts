import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'

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

// cache images
registerRoute(
  ({ url }) => url.pathname.startsWith('/upload/items'),
  new StaleWhileRevalidate({
    cacheName: 'upload-items-images-cache',
    fetchOptions: {
      method: 'get',
    },
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
)

registerRoute(
  ({ url }) => url.pathname.startsWith('res.cloudinary.com'),
  new StaleWhileRevalidate({
    cacheName: 'cloudinary-items-images-cache',
    fetchOptions: {
      method: 'get',
    },
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
)
