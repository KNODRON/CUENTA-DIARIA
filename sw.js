// sw.js

const CACHE_NAME = 'pwa-asistencia-v4';
const urlsToCache = [
  '.','index.html','styles.css','app.js','manifest.json',
  'icon-192.png','icon-512.png','bg.jpeg'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(urlsToCache)));
});
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.map(key=>{
        if (key!==CACHE_NAME) return caches.delete(key);
      }))
    )
  );
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
