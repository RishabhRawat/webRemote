const CACHE = "remote-v1";

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE).then(cache =>
            cache.addAll([
                "./",
                "./index.html",
                "./style.css",
                "./app.js",
                "./manifest.json"
            ])
        )
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});