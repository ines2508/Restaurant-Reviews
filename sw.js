let cacheName = 'restaurant-v01';
let filesToCache = [
'./',
'./index.html',
'./restaurant.html',
'./css/styles.css',
'./js/main.js',
'./js/restaurant_info.js',
'./js/dbhelper.js',
'./js/app.js',
'./data/restaurants.json',
'./img/',
'./img/1.jpg',
'./img/2.jpg',
'./img/3.jpg',
'./img/4.jpg',
'./img/5.jpg',
'./img/6.jpg',
'./img/7.jpg',
'./img/8.jpg',
'./img/9.jpg',
'./img/10.jpg',
'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png',
'https://unpkg.com/leaflet@1.3.1/dist/images/marker-shadow.png'
]

self.addEventListener('install', function(e){
    //self.skipWaiting();

    e.waitUntil(
       caches.open(cacheName).then(function(cache){
           return cache.addAll(filesToCache);
       }).catch(function(err){
           console.log("There is nothing to install " + err)
       }) 
    );

})

self.addEventListener('activate', function(e){

    e.waitUntil(
        // remove old caches
        caches.keys().then(function(cachesNames){
            return Promise.all(
                cachesNames.filter(function(oneCache){
                    return oneCache.startsWith('rest') &&
                    oneCache != cacheName;
                }).map(function(oneCache){
                    return caches.delete(oneCache);
                })
            )
        }).catch(function(err){
            console.log("Servise Worker is not activated" + err)
        })
    );
})


self.addEventListener('fetch', function(e){
    
    // Fixing Bug in Chrome https://github.com/josephfrazier/Reported-Web/commit/3f67dfe3eabdf45bbd3e49c172d8dca7017fe5b8
    const { request } = e;
    if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
        return;
    }

    e.respondWith(

        caches.match(e.request)
        .then(function(response){
            if (response) {
                return response
            } else {
                return fetch(e.request);
            }

        }).catch(function(err){
            console.log('There is nothing to fetch.' + err)
        })
    )
})

