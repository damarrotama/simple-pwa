const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    'css/style.css',
    '/manifest.json',
    'assets/android-chrome-192x192.png',
    'assets/android-chrome-512x512.png',
    'assets/favicon.ico',
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function(event) {
    var cacheWhitelist = ['pwa-cache-v1'];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const networkResponse = await fetch(event.request);
      cache.put(event.request, networkResponse.clone());
      return networkResponse;
    } catch (error) {
      return cache.match(event.request);
    }
  })());
});

