/**
 * Common database helper functions.
 */
class DBHelper {
  /**
   * IndexDb JSON.
   */
  static get dbRestaurant() {
    var dbPromise = idb.open('restaurant', 1, function(upgradeDb) {
      var store = upgradeDb.createObjectStore('restaurants', {
        keyPath: 'id'
      });
    });
    return dbPromise;
  }

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  static get REVIEWS_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/reviews/`;
  }
  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    fetch(DBHelper.DATABASE_URL)
    .then((response) => {
      if (response.status !== 200) {
        throw Error(response.status);
      }
      return response.json();
    })
    .then(restaurants => callback(null, restaurants))
    .catch((err) => callback(err, null))

    // fetch(DBHelper.DATABASE_URL)
    // .then(function(response) {
    //   if (response.status !== 200) {
    //     throw Error(response.status);
    //   }
    //   return response.json();
    // })
    // .then(function(json) {
    //   DBHelper.dbRestaurant.then(function(db) {
    //     var tx = db.transaction('restaurants', 'readwrite');
    //     var restaurantsStore = tx.objectStore('restaurants');
    //
    //     json.forEach(restaurant => {
    //       restaurantsStore.put(restaurant);
    //     });
    //   })
    //   .then(() => {
    //     return DBHelper.dbRestaurant.then(function(db) {
    //       var tx = db.transaction('restaurants');
    //       var restaurantsStore = tx.objectStore('restaurants');
    //
    //       return restaurantsStore.getAll();
    //     })
    //   })
    //   .then(restaurants => callback(null, restaurants));
    //   //callback(null, json);
    // })
    // .catch(function(err) {
    //   const error = (`Request failed. ${err}`);
    //   callback(error, null);
    // })



    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', DBHelper.DATABASE_URL);
    // xhr.onload = () => {
    //   if (xhr.status === 200) { // Got a success response from server!
    //     const json = JSON.parse(xhr.responseText);
    //     const restaurants = json.restaurants;
    //     callback(null, restaurants);
    //   } else { // Oops!. Got an error from server.
    //     const error = (`Request failed. Returned status of ${xhr.status}`);
    //     callback(error, null);
    //   }
    // };
    // xhr.send();
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    fetch(`http://localhost:1337/restaurants/${id}`)
    .then(response => response.json())
    .then(restaurant => callback(null, restaurant))
    .catch(() => callback('Restaurant does not exist', null))

    // fetch all restaurants with proper error handling.
    // fetch(DBHelper.DATABASE_URL + `/${id}`)
    // .then(function(response) {
    //   if (response.status !== 200) {
    //     throw Error(response.status);
    //   }
    //   return response.json();
    // })
    // .then(function(json) {
    //   DBHelper.dbRestaurant.then(function(db) {
    //     var tx = db.transaction('restaurants', 'readwrite');
    //     var restaurantsStore = tx.objectStore('restaurants');
    //
    //     restaurantsStore.put(json);
    //   })
    //   .then(() => {
    //     return DBHelper.dbRestaurant.then(function(db) {
    //       var tx = db.transaction('restaurants');
    //       var restaurantsStore = tx.objectStore('restaurants');
    //
    //       return restaurantsStore.get(parseInt(id));
    //     })
    //   })
    //   .then(restaurant => callback(null, restaurant));
    //   //callback(null, json);
    // })
    // .catch(function(err) {
    //   const error = (`Restaurant does not exist. ${err}`);
    //   callback(error, null);
    // })

    // fetch(`http://localhost:1337/restaurants/${id}`)
    // .then(response => response.json())
    // .then(restaurant => callback(null, restaurant))
    // .catch(() => callback('Restaurant does not exist', null))
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}.jpg`);
  }

  /**
   * Restaurant thumbnail-image URL.
   */
  static thumbnailImageUrlForRestaurant(restaurant) {
    const image = restaurant.photograph;
    //const thumbnailUrl = image.slice(0, image.indexOf('.')) + '-thumbnail.jpg';
    const thumbnailUrl = `${image}-thumbnail.jpg`
    return (`/img/thumbnail/${thumbnailUrl}`);
  }

  /**
   * Restaurant 1x resolution image URL.
   */
   static lowerResolutionImage(restaurant) {
     const image = restaurant.photograph;
     //const lowResUrl = image.slice(0, image.indexOf('.')) + '_1x.jpg';
     const lowResUrl = `${image}_1x.jpg`;
     return (`/img/1x/${lowResUrl}`);
   }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
