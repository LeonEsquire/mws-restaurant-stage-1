importScripts('./js/idb.js');

self.addEventListener('install', function(event) {
  const urlsToCache = [
    '/',
    'index.html',
    'restaurant.html',
    'js/dbhelper.js',
    'js/index.js',
    'js/main.js',
    'js/idb.js',
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

// self.addEventListener('sync', function(event) {
//   if (event.tag == 'myFirstSync') {
//     event.waitUntil(return fetch('http://localhost:8000/'));
//   }
// });


self.addEventListener('fetch', function(event) {

  if (event.request.method === 'POST') {
    // Adding request in IDB
    if (navigator.onLine) {
      dbReview().then(function(db) {
        var tx = db.transaction('reviews', 'readwrite');
        var reviewsStore = tx.objectStore('reviews');
        reviewsStore.put(event.request.clone(), 0);
      })
      .catch(function(err) {
        console.log('error while putting POST request to IDB', err);
      });
    }

  }


  if (event.request.method === 'PUT') {
    const url = new URL(event.request.url)
    const is_favorite = url.searchParams.get('is_favorite');
    const restaurantId = parseInt(url.pathname.match(/\d{1,2}/g).join(','));
    event.respondWith(
      dbPromise().then(function(db) {
        var restaurantsStore = db.transaction('restaurants').objectStore('restaurants');
        return restaurantsStore.get(parseInt(restaurantId));
      })
      .then(function(restaurantStore) {


        //Changing is_favorite value in IndexDB
        return fetch(event.request)
        .then(response => response.json())
        .then(data => {
          dbPromise()
          .then(function(db) {
            const tx = db.transaction('restaurants', 'readwrite');
            const restaurantsStore = tx.objectStore('restaurants');
            restaurantsStore.iterateCursor(cursor => {
              if (!cursor) return;
              const currentValue = cursor.value;
              currentValue.is_favorite = is_favorite;
              if (cursor.value.id === restaurantId) cursor.update(currentValue);
              cursor.continue();
            });
            // restaurantsStore.complete.then(() => console.log('done'));
          });

          const response = new Response(JSON.stringify(data), {
            headers: new Headers({
              'Content-type': 'application/json',
              'Access-Control-Allow-Credentials': 'true'
            }),
            status: 200
          });
          return response;
        });
        // .then(response => response.json())
        // .then(data => {
        //   dbPromise()
        //   .then(function(db) {
        //     const tx = db.transaction('restaurants', 'readwrite');
        //     const restaurantsStore = tx.objectStore('restaurants');
        //     restaurantsStore.get(restaurantId)
        //     .then(val => console.log(val));
        //   });
        // });


      })
    );
    return;
  }

  // JSON request for individual restaurant
  if (/1337\/restaurants\/\d{1,2}$/.test(event.request.url)) {
    const restaurantId = event.request.url.match(/\d{1,2}$/g).join(',');
    event.respondWith(
      dbPromise().then(function(db) {
        var restaurantsStore = db.transaction('restaurants').objectStore('restaurants');
        return restaurantsStore.get(parseInt(restaurantId));
      })
      .then(function(restaurantStore) {
        if (!restaurantStore) {
          return fetch('http://localhost:1337/restaurants').then(function(response) {
            const responseToCache = response.clone().json();

            return responseToCache.then(function(json) {
              addData(json);
              return response;
            })
          });
        } else {
          // response from DB
          const response = new Response(JSON.stringify(restaurantStore), {
            headers: new Headers({
              'Content-type': 'application/json',
              'Access-Control-Allow-Credentials': 'true'
            }),
            status: 200
          });
          return response;
        }
      })
    );
    return
  }

  // JSON restaurants info for and from indexDb
  if (event.request.url.endsWith('1337/restaurants')) {
    event.respondWith(
      dbPromise().then(function(db) {
        var restaurantsStore = db.transaction('restaurants').objectStore('restaurants');
        return restaurantsStore.getAll();
      })
      .then(function(elements) {
        if (!elements.length) {
          return fetch(event.request).then(function(response) {
            const responseToCache = response.clone().json();

            return responseToCache.then(function(json) {
              addData(json);
              return response;
            })
          });
        } else {
          const response = new Response(JSON.stringify(elements), {
            headers: new Headers({
              'Content-type': 'application/json',
              'Access-Control-Allow-Credentials': 'true'
            }),
            status: 200
          });
          return response;
        }
      })
    );
    return
  }

    // Response without using indexDb
    event.respondWith(caches.open('restaurant-static-v1').then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return response || fetch(event.request).then(function(response) {
            if(event.request.method === 'GET') {
              cache.put(event.request, response.clone());
            }
            return response;
        });
      });
    })

  );
});


function dbPromise() {
  var dbPromise = idb.open('restaurant', 1, function(upgradeDb) {
    var store = upgradeDb.createObjectStore('restaurants', {
      keyPath: 'id'
    });
  });
  return dbPromise;
}

function dbReview() {
  var dbPromise = idb.open('review', 1, function(upgradeDb) {
    var store = upgradeDb.createObjectStore('reviews');
  });
  return dbPromise;
}

function addData(data) {
  dbPromise().then(function(db) {
    var tx = db.transaction('restaurants', 'readwrite');
    var restaurantsStore = tx.objectStore('restaurants');
    if (Array.isArray(data)) {
      data.forEach(element => {
        restaurantsStore.put(element);
      })
    } else {
      restaurantsStore.put(data);
    }
  })
  .catch(function(err) {
    console.log('something went wrong with DB adding', err);
  });
}

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//     .then(function(response) {
//       if (response) return response;
//       return fetch(event.request);
//     })
//   );
// });
