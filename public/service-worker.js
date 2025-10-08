const CACHE_NAME = "evivi-bakery-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/logo.png",
  "/manifest.json",
];

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("✅ Service Worker: Caching files");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cache or fetch from network
      return (
        response ||
        fetch(event.request).catch(() =>
          caches.match("/index.html")
        )
      );
    })
  );
});

// Activate new service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (!cacheWhitelist.includes(name)) {
            console.log("🧹 Service Worker: Clearing old cache", name);
            return caches.delete(name);
          }
        })
      )
    )
  );
});
