var map,restaurant=void 0,isFirstTimeOnPage=!0,places=["https://maps.googleapis.com/maps/api/staticmap?center=171+E+Broadway,+New+York,+NY+10002&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C171+E+Broadway,+New+York,+NY+10002","https://maps.googleapis.com/maps/api/staticmap?center=919+Fulton+St,+Brooklyn,+NY+11238&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C919+Fulton+St,+Brooklyn,+NY+11238","https://maps.googleapis.com/maps/api/staticmap?center=1+E+32nd+St,+New+York,+NY+10016&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C1+E+32nd+St,+New+York,+NY+10016","https://maps.googleapis.com/maps/api/staticmap?center=205+E+Houston+St,+New+York,+NY+10002&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C205+E+Houston+St,+New+York,+NY+10002","https://maps.googleapis.com/maps/api/staticmap?center=261+Moore+St,+Brooklyn,+NY+11206&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C261+Moore+St,+Brooklyn,+NY+11206","https://maps.googleapis.com/maps/api/staticmap?center=454+Van+Brunt+St,+Brooklyn,+NY+11231&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C454+Van+Brunt+St,+Brooklyn,+NY+11231","https://maps.googleapis.com/maps/api/staticmap?center=430+E+9th+St,+New+York,+NY+10009&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C430+E+9th+St,+New+York,+NY+10009","https://maps.googleapis.com/maps/api/staticmap?center=131+Sullivan+St,+New+York,+NY+10012&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C131+Sullivan+St,+New+York,+NY+10012","https://maps.googleapis.com/maps/api/staticmap?center=1209+Jackson+Ave,+Queens,+NY+11101&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C1209+Jackson+Ave,+Queens,+NY+11101","https://maps.googleapis.com/maps/api/staticmap?center=5-48+49th+Ave,+Queens,+NY+11101&zoom=16&scale=1&size=640x640&maptype=roadmap&key=AIzaSyCzBUgWVVOxeKk8LbADaNMvNwuvrXZPJ2Y&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C5-48+49th+Ave,+Queens,+NY+11101"];document.addEventListener("DOMContentLoaded",function(){fetchRestaurantFromURL(function(e,t){if(e)console.error(e);else{fillBreadcrumb();var a=document.querySelector("#map-image");a.src=places[self.restaurant.id-1],a.onclick=function(e){e.preventDefault();var t=document.querySelector("body"),a=document.createElement("script");a.src="https://maps.googleapis.com/maps/api/js?libraries=places&callback=initMap",a.setAttribute("defer","defer"),a.setAttribute("async","async"),t.append(a),e.target.remove()}}});var n=document.querySelector("#favButton");n.addEventListener("click",function(e){var t=new URL(window.location.href),a=parseInt(t.searchParams.get("id")),r="true"===self.restaurant.is_favorite?"false":"true";t="http://localhost:1337/restaurants/"+a+"/?is_favorite="+r,fetch(t,{method:"PUT"}).then(function(e){return e.json()}).then(function(e){n.innerHTML=isRestaurantFavorite(self.restaurant),self.restaurant.is_favorite=r})})}),window.initMap=function(){fetchRestaurantFromURL(function(e,t){e?console.error(e):(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:t.latlng,scrollwheel:!1}),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))})},fetchRestaurantFromURL=function(a){if(self.restaurant)a(null,self.restaurant);else{var e=getParameterByName("id");e?DBHelper.fetchRestaurantById(e,function(e,t){(self.restaurant=t)?(fillRestaurantHTML(),a(null,t)):console.error(e)}):(error="No restaurant id in URL",a(error,null))}},isRestaurantFavorite=function(e){fetch("http://localhost:1337/restaurants/"+e.id);var a=new XMLHttpRequest;a.open("GET","http://localhost:1337/restaurants/"+e.id),a.onload=function(){var e=JSON.parse(a.responseText),t=document.querySelector("#favButton");"true"==e.is_favorite?t.innerHTML="&#11088; unfavorite":t.innerHTML="&#10032; favorite"},a.send()},fillRestaurantHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant;document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("favButton").innerHTML=isRestaurantFavorite(e),document.getElementById("restaurant-address").innerHTML=e.address;var t=document.getElementById("restaurant-img"),a=DBHelper.imageUrlForRestaurant(e),r=DBHelper.lowerResolutionImage(e);t.setAttribute("alt",e.name+" Restaurant"),t.src=a,t.sizes="(min-width: 767px) 40vw, 84vw",t.srcset=a+" 800w, "+r+" 400w",t.alt=""+e.name,t.className="restaurant-img",document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&fillRestaurantHoursHTML(),fillReviewsHTML()},fillRestaurantHoursHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.operating_hours,t=document.getElementById("restaurant-hours");for(var a in e){var r=document.createElement("tr"),n=document.createElement("td");n.innerHTML=a,r.appendChild(n);var o=document.createElement("td");o.innerHTML=e[a],r.appendChild(o),t.appendChild(r)}},fillReviewsHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.reviews,t=document.getElementById("reviews-container"),a=document.createElement("h3");if(a.innerHTML="Reviews",t.appendChild(a),!e){var r=document.createElement("p");return r.innerHTML="No reviews yet!",void t.appendChild(r)}var n=document.getElementById("reviews-list");e.forEach(function(e){n.appendChild(createReviewHTML(e))}),t.appendChild(n),isFirstTimeOnPage&&(document.getElementById("main-title").focus(),isFirstTimeOnPage=!1)},createReviewHTML=function(e){var t=document.createElement("li"),a=document.createElement("div");a.className="review-header",t.appendChild(a);var r=document.createElement("p");r.innerHTML=e.name,t.appendChild(r);var n=document.createElement("p"),o=new Date(e.createdAt);n.innerHTML=o.toLocaleDateString(),t.appendChild(n);var s=document.createElement("p");s.innerHTML='<span class="tags">Rating: '+e.rating+"</span>",t.appendChild(s);var i=document.createElement("p");return i.innerHTML=e.comments,t.appendChild(i),t},fillBreadcrumb=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("breadcrumb"),a=document.createElement("li"),r=document.createElement("a");r.setAttribute("aria-current","page"),r.href="#",r.innerHTML=e.name,a.appendChild(r),t.appendChild(a)},getParameterByName=function(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var a=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);return a?a[2]?decodeURIComponent(a[2].replace(/\+/g," ")):"":null};
