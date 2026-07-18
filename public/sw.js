if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
  console.log('[Service Worker] Localhost detected. Self-deactivating...');

  self.addEventListener('install', (event) => {
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) => {
        return Promise.all(keys.map((key) => caches.delete(key)));
      })
      .then(() => self.registration.unregister())
      .then(() => {
        console.log('[Service Worker] Successfully unregistered self on localhost');
      })
    );
  });
} else {
  const CACHE_NAME = 'bookmydoc-cache-v1';
  const ASSETS_TO_CACHE = [
    '/',
    '/manifest.webmanifest',
    '/manifest.json',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png',
    '/icons/apple-touch-icon.png',
    '/icons/logo.svg'
  ];

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[Service Worker] Pre-caching static assets');
        return cache.addAll(ASSETS_TO_CACHE);
      }).then(() => self.skipWaiting())
    );
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('[Service Worker] Clearing old cache', cache);
              return caches.delete(cache);
            }
          })
        );
      }).then(() => self.clients.claim())
    );
  });

  self.addEventListener('fetch', (event) => {
    // Only handle HTTP/HTTPS requests (avoid chrome-extension:// etc.)
    if (!event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith('http')) {
      return;
    }

    // Skip Next.js internal dev requests and hot-reload/HMR requests
    const url = new URL(event.request.url);
    if (url.pathname.startsWith('/_next') || url.pathname.includes('webpack') || url.pathname.includes('hot-update')) {
      return;
    }

    // Avoid intercepting POST or other non-GET requests
    if (event.request.method !== 'GET') {
      return;
    }

    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch in background to update cache (Stale-While-Revalidate)
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
              }
            })
            .catch(() => { /* ignore update failures when offline */ });
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Dynamically cache new assets (CSS, JS, images, recently opened pages)
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return networkResponse;
          })
          .catch(() => {
            // If offline and request fails:
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
          });
      })
    );
  });
}
