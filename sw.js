// sw.js

// 1) Subimos la versión de caché para que descargue todo de cero
const CACHE_NAME = 'pwa-asistencia-v4';

const urlsToCache = [
  '.',               // index.html
  'index.html',
  'styles.css',
  'app.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'bg.jpeg'          // <-- aquí tu imagen de fondo EXACTAMENTE
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // Limpiamos versiones viejas de caché
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
  );
});
