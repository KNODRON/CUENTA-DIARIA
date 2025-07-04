const CACHE_NAME = 'pwa-asistencia-v4';
const urlsToCache = [
  '.', 'index.html', 'styles.css', 'app.js',
  'manifest.json', 'icon-192.png', 'icon-512.png',
  'bg.jpeg'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)));
});

self.addEventListener('activate', e => {
  e.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then(keys => Promise.all(
      keys.map(k => k !== CACHE_NAME && caches.delete(k))
    ))
  ]));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
