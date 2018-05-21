self.addEventListener('install', function(event) {
  const urlsToCache = [
    '/',
    'index.html',
    'restaurant.html',
    'js/dbhelper.js',
    'js/index.js',
    'js/main.js',
    'css/styles.css',
    'https://fonts.googleapis.com/css?family=Roboto',
    'https://cdn.jsdelivr.net/npm/idb@2.1.1/lib/idb.min.js'
  ]

  event.waitUntil(caches.open('restaurant-static-v1')
  .then(function(cache){
    return cache.addAll(urlsToCache);
  })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('restaurant-static-v1').then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return response || fetch(event.request).then(function(response) {
            cache.put(event.request, response.clone());
            return response;
        });
      });
    })
  );
});


// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//     .then(function(response) {
//       if (response) return response;
//       return fetch(event.request);
//     })
//   );
// });
