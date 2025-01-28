const CACHE_NAME = 'to-do-pwa-cache-v1';
const FILES_TO_CACHE = [
    '/Checklistv0/',
    '/Checklistv0/index.html',
    '/Checklistv0/style.css',
    '/Checklistv0/app.js',
    '/Checklistv0/manifest.json',
    '/Checklistv0/icons/icon-128.png',
    '/Checklistv0/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});