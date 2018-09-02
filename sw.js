let cacheName = 'restaurant-v25';

self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(cacheName).then(function(cache){
            return cache.addAll([
                './',
                'index.html',
                'restaurant.html',
                'css/styles.css',
                'js/main.js',
                'js/restaurant_info.js',
                'js/dbhelper.js',
                'js/app.js',
                'data/restaurants.json',
                'img/',
                'img/1.jpg',
                'img/2.jpg',
                'img/3.jpg',
                'img/4.jpg',
                'img/5.jpg',
                'img/6.jpg',
                'img/7.jpg',
                'img/8.jpg',
                'img/9.jpg',
                'img/10.jpg',
                'restaurant.html?id=1',
                'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
                'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
                'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png',
                'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1207/1540.jpg70?access_token=pk.eyJ1IjoiaW5lczI1MDgiLCJhIjoiY2psZTN5N3Q5MGdtbzN3cnZ3cGo3ZjUyciJ9.fsVakG1B8cGbE8vR9m9Ffg',
                'https://unpkg.com/leaflet@1.3.1/dist/images/marker-shadow.png'
            ]);
        })  
    )
});

self.addEventListener('active', function(event){

});

self.addEventListener('fetch', function(event){
    console.log(event.request);
    event.respondWith(
        caches.match(event.request).then(function(response){
            if (response) {
                return response;
            } else {return fetch(event.request)};
        })
    )

});

//cache.put(request. response);

//cache.addAll([
//    'foo',
//    'barr'
//])
//caches.match(request);
