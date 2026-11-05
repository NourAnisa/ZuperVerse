/**
 * ZuperVerse - Service Worker for PWA & Offline Play
 * Caches core static assets, 3D libraries, CSS, and sound scripts
 */

const CACHE_NAME = "zuperverse-cache-v2";
const ASSETS_TO_CACHE = [
    "./",
    "./index.html",
    "./student.html",
    "./teacher.html",
    "./manifest.json",
    "./css/style.css",
    "./js/supabase-config.js",
    "./js/audio.js",
    "./js/questions-default.js",
    "./js/world3d.js",
    "./js/student.js",
    "./js/teacher.js",
    "./js/minigames.js",
    "./js/psychometrics.js",
    "./js/certificate.js",
    "https://cdn.tailwindcss.com",
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
];

// Install: Cache core assets
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("📦 ZuperVerse Service Worker: Caching Offline Assets");
            return cache.addAll(ASSETS_TO_CACHE).catch(err => console.warn("Caching error (non-fatal):", err));
        })
    );
    self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch: Cache First, Network Fallback
self.addEventListener("fetch", (e) => {
    // Skip non-GET requests or Supabase Realtime WebSocket connections
    if (e.request.method !== "GET" || e.request.url.includes("supabase.co")) {
        return;
    }

    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(e.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
                    return networkResponse;
                }
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, responseToCache);
                });
                return networkResponse;
            }).catch(() => {
                // If offline and requesting page, return cached index
                if (e.request.headers.get("accept").includes("text/html")) {
                    return caches.match("./index.html");
                }
            });
        })
    );
});
