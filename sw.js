/* CA CDL Class A Study — service worker */
const CACHE = 'ca-cdl-study-v14';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './sw.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request, { ignoreSearch: true });
    if (cached) return cached;
    const isNav = event.request.mode === 'navigate';
    const scope = self.registration.scope;
    const atRoot = url.href.split('?')[0] === scope || url.href.split('?')[0] === scope + 'index.html';
    if (isNav && atRoot) {
      const page = await caches.match('./index.html');
      if (page) return page;
    }
    try {
      const resp = await fetch(event.request);
      if (resp && resp.ok) {
        const copy = resp.clone();
        const cache = await caches.open(CACHE);
        cache.put(event.request, copy);
      }
      // Unknown page inside the app folder: send the visitor to the app instead of a broken copy at the wrong path.
      if (isNav && resp.status === 404) return Response.redirect(scope, 302);
      return resp;
    } catch (err) {
      if (isNav) {
        if (atRoot) { const page = await caches.match('./index.html'); if (page) return page; }
        return Response.redirect(scope, 302);
      }
      throw err;
    }
  })());
});
