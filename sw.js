// sw.js

// 1) Cambiamos el nombre del caché para forzar recarga
const CACHE_NAME = 'pwa-asistencia-v3';

// 2) Listamos TODO lo que queremos cachear, incluyendo bg.jpg en raíz
const urlsToCache = [
  '.',            // apunta a index.html
  'index.html',
  'styles.css',
  'app.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'bg.jpg'        // ¡tu imagen de fondo en la raíz!
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Eliminar cachés viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Responder con caché o red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
