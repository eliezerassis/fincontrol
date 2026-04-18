// FinControl Service Worker v1.0
const CACHE_NAME = 'fincontrol-v1';
const ASSETS = [
  './',
  './portfolio-tracker.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// Install — cache core assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[SW] Caching core assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch — Network first, fall back to cache
self.addEventListener('fetch', function(event) {
  // Skip non-GET and chrome-extension requests
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension')) return;

  event.respondWith(
    fetch(event.request).then(function(response) {
      // Cache successful responses
      if (response && response.status === 200) {
        var responseClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseClone);
        });
      }
      return response;
    }).catch(function() {
      // Network failed, try cache
      return caches.match(event.request).then(function(cached) {
        return cached || new Response('Offline — abra o app quando estiver com internet.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      });
    })
  );
});

// Push notifications
self.addEventListener('push', function(event) {
  var data = { title: 'FinControl', body: 'Voce tem contas pendentes!', icon: './icons/icon-192x192.png' };
  try {
    if (event.data) data = Object.assign(data, event.data.json());
  } catch(e) {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || './icons/icon-192x192.png',
      badge: './icons/icon-96x96.png',
      vibrate: [200, 100, 200],
      tag: data.tag || 'fincontrol-notify',
      data: { url: data.url || './portfolio-tracker.html' }
    })
  );
});

// Notification click — open the app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || './portfolio-tracker.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(function(clients) {
      for (var i = 0; i < clients.length; i++) {
        if (clients[i].url.indexOf('portfolio-tracker') !== -1 && 'focus' in clients[i]) {
          return clients[i].focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
