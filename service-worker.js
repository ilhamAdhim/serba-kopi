// Register Cache to service - worker
const CACHE_NAME = 'serba-kopi-v2';
let urlsToCache = [
    '/',
    '/iconkopi.png',
    '/nav.html',
    '/index.html',
    '/pages/home.html',
    '/pages/jenisKopi.html',
    '/pages/kreasiKopi.html',
    '/css/materialize.min.css',
    '/css/style.css',
    '/js/materialize.min.js',
    '/js/script.js',
    '/images/affogato.jpg',
    '/images/americano.jpeg',
    '/images/brain.png',
    '/images/bullseye.png',
    '/images/capucino.jpg',
    '/images/choco-coffee.jpg',
    '/images/coffee-jumbotron.jpeg',
    '/images/coffee-latte.jpg',
    '/images/coffee-mix.jpeg',
    '/images/cold-brew.jpg',
    '/images/espresso-chill.jpg',
    '/images/espresso.jpg',
    '/images/homemade-coffee.jpg',
    '/images/idea.png',
    '/images/latte.jpg',
    '/images/moccachino.jpg',
    './images/offline.png',
    './manifest.json',
    'https://unpkg.com/aos@next/dist/aos.js',
    'https://unpkg.com/aos@next/dist/aos.css'
];

// Using assets from browser cache 
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
})

self.addEventListener("fetch", event => {
    event.respondWith(
        caches
            .match(event.request, { cacheName: CACHE_NAME })
            .then(response => {
                if (response) {
                    console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
                    return response;
                }

                console.log(
                    "ServiceWorker: Memuat aset dari server: ",
                    event.request.url
                );
                return fetch(event.request);
            })
    );
});

// Delete Old Cache in case of updating the web layout or content
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});