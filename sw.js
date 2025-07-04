// sw.js

const CACHE_NAME = 'pwa-asistencia-v4';  // **cambia de v3 a v4** para invalidar caché viejo

const urlsToCache = [
  '.', 
  'index.html',
  'styles.css',
  'app.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'bg.jpeg'     // asegúrate de que sea exactamente este nombre
];

self.addEventListener('install', event => {
  // forzar activation inmediato:
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // tomar control inmediatamente y borrar cachés viejos
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(keys =>
        Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME) return caches.delete(key);
          })
        )
      )
    ])
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
  );
});
