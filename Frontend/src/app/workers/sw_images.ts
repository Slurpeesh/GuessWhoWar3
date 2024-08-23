import { importAll } from '../lib/utils'

const CACHE = 'v1'

const images = importAll(
  require.context('@public/assets/img/units/', false, /\.(png|jpe?g)$/)
)

const ctx: ServiceWorkerGlobalScope = self as any

ctx.addEventListener('install', (e: ExtendableEvent) => {
  console.log('sw_images installed')
  ctx.skipWaiting()
  e.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(Object.values(images))
    })
  )
})

ctx.addEventListener('activate', (e: ExtendableEvent) => {
  console.log('sw_images activated')
  e.waitUntil(ctx.clients.claim())
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

ctx.addEventListener('fetch', (e: FetchEvent) => {
  console.log('sw_images fetching')

  if (e.request.destination === 'image') {
    e.respondWith(
      caches
        .match(e.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          return fetch(e.request).then((networkResponse) => {
            return caches.open(CACHE).then((cache) => {
              cache.put(e.request, networkResponse.clone())
              return networkResponse
            })
          })
        })
        .catch(() => {
          return new Response('Image not available and network is offline.')
        })
    )
  } else {
    return
  }
})
