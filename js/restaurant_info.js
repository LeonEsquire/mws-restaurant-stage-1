let restaurant, isFirstTimeOnPage = true;
var map;
const places = [
  'https://maps.googleapis.com/maps/api/staticmap?center=171+E+Broadway,+New+York,+NY+10002&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C171+E+Broadway,+New+York,+NY+10002',
  'https://maps.googleapis.com/maps/api/staticmap?center=919+Fulton+St,+Brooklyn,+NY+11238&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C919+Fulton+St,+Brooklyn,+NY+11238',
  'https://maps.googleapis.com/maps/api/staticmap?center=1+E+32nd+St,+New+York,+NY+10016&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C1+E+32nd+St,+New+York,+NY+10016',
  'https://maps.googleapis.com/maps/api/staticmap?center=205+E+Houston+St,+New+York,+NY+10002&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C205+E+Houston+St,+New+York,+NY+10002',
  'https://maps.googleapis.com/maps/api/staticmap?center=261+Moore+St,+Brooklyn,+NY+11206&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C261+Moore+St,+Brooklyn,+NY+11206',
  'https://maps.googleapis.com/maps/api/staticmap?center=454+Van+Brunt+St,+Brooklyn,+NY+11231&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C454+Van+Brunt+St,+Brooklyn,+NY+11231',
  'https://maps.googleapis.com/maps/api/staticmap?center=430+E+9th+St,+New+York,+NY+10009&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C430+E+9th+St,+New+York,+NY+10009',
  'https://maps.googleapis.com/maps/api/staticmap?center=131+Sullivan+St,+New+York,+NY+10012&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C131+Sullivan+St,+New+York,+NY+10012',
  'https://maps.googleapis.com/maps/api/staticmap?center=1209+Jackson+Ave,+Queens,+NY+11101&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C1209+Jackson+Ave,+Queens,+NY+11101',
  'https://maps.googleapis.com/maps/api/staticmap?center=5-48+49th+Ave,+Queens,+NY+11101&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C5-48+49th+Ave,+Queens,+NY+11101',
]

/**
 * Initialize page.
 */
document.addEventListener('DOMContentLoaded', function(){
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      fillBreadcrumb();
      const mapImage = document.querySelector('#map-image');
      mapImage.src = places[self.restaurant.id - 1];
      mapImage.onclick = function(e){
        e.preventDefault();
        const body = document.querySelector('body');
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=initMap';
        script.setAttribute('defer', 'defer');
        script.setAttribute('async', 'async');
        body.append(script);
        e.target.remove();
      };
    }
  });

  // Leaving Review
  document.querySelector('#new_review').onsubmit = () => {
    const name = document.querySelector('#name').value;
    const comments = document.querySelector('#comments').value;
    const rating = document.querySelector('#rating').value;

    // Getting id from url
    const url = new URL(window.location.href);
    const restaurant_id = parseInt(url.searchParams.get('id'));

    const request = new XMLHttpRequest();
    request.open('POST', 'http://localhost:1337/reviews/')
    request.onload = () => {
      const data = JSON.parse(request.responseText);
    }
    const form = new FormData();
    form.append('name', name);
    form.append('comments', comments);
    form.append('rating', rating);
    form.append('restaurant_id', restaurant_id);
    request.send(form);

    return false;
  };

  // Favorite button functionality using Fetch api
  const favButton = document.querySelector('#favButton');

  favButton.addEventListener('click', function(e) {
    let url = new URL(window.location.href);
    const restaurant_id = parseInt(url.searchParams.get('id'));
    const otherFav = (self.restaurant.is_favorite === 'true') ? 'false' : 'true';
    url = `http://localhost:1337/restaurants/${restaurant_id}/?is_favorite=${otherFav}`;
    fetch(url, {method: 'PUT'})
      .then(response => response.json())
      .then(data => {
        favButton.innerHTML = isRestaurantFavorite(self.restaurant);
        self.restaurant.is_favorite = otherFav;
      }
    );
  })

  // Favorite button functionality using XMLHttpRequest
  // const favButton = document.querySelector('#favButton');
  //
  // favButton.addEventListener('click', function(e) {
  //   let url = new URL(window.location.href);
  //   const restaurant_id = parseInt(url.searchParams.get('id'));
  //   const otherFav = (self.restaurant.is_favorite === 'true') ? 'false' : 'true';
  //   url = `http://localhost:1337/restaurants/${restaurant_id}/?is_favorite=${otherFav}`;
  //   const xhr = new XMLHttpRequest();
  //   xhr.open("PUT", url);
  //   xhr.onload = function () {
  //     favButton.innerHTML = isRestaurantFavorite(self.restaurant);
  //     self.restaurant.is_favorite = otherFav;
  //   }
  //   xhr.send();
  // })


  // var data = {};
  // data.name = "John2";
  // data.lastname  = "Snow2";
  // var json = JSON.stringify(data);


});

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

// Returning string for favorite restaurant
isRestaurantFavorite = (restaurant) => {

  fetch(`http://localhost:1337/restaurants/${restaurant.id}`)
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://localhost:1337/restaurants/${restaurant.id}`)
  xhr.onload = function() {
    const data = JSON.parse(xhr.responseText);
    const favButton = document.querySelector('#favButton');
    if (data.is_favorite == 'true') {
      favButton.innerHTML = '&#11088; unfavorite';
    } else {
      favButton.innerHTML = '&#10032; favorite';
    }
  }
  xhr.send()
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const favButton = document.getElementById('favButton');
  favButton.innerHTML = isRestaurantFavorite(restaurant);

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  const currentImageUrl = DBHelper.imageUrlForRestaurant(restaurant);
  const lowerResolutionImage = DBHelper.lowerResolutionImage(restaurant);

  image.setAttribute('alt', restaurant.name + ' Restaurant');
  image.src = currentImageUrl;
  image.sizes = "(min-width: 767px) 40vw, 84vw";
  image.srcset =  currentImageUrl + ' 800w, ' + lowerResolutionImage + ' 400w';
  image.alt = `${restaurant.name}`;
  image.className = 'restaurant-img';


  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);

  // Changing focus on first page load
  if (isFirstTimeOnPage) {
    document.getElementById('main-title').focus();
    isFirstTimeOnPage = false;
  }
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const div = document.createElement('div');
  div.className = 'review-header';
  li.appendChild(div);

  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = review.date;
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `<span class="tags">Rating: ${review.rating}</span>`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  const currentPageAnchor = document.createElement('a');
  currentPageAnchor.setAttribute('aria-current', 'page');
  currentPageAnchor.href = "#";
  currentPageAnchor.innerHTML = restaurant.name;
  li.appendChild(currentPageAnchor);
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
