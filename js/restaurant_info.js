let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiaW5lczI1MDgiLCJhIjoiY2psZTN5N3Q5MGdtbzN3cnZ3cGo3ZjUyciJ9.fsVakG1B8cGbE8vR9m9Ffg',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}  
 
/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

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

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = `${restaurant.neighborhood} <br/> ${restaurant.address}`;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.alt = `Restaurant ${restaurant.name}, serves ${restaurant.cuisine_type.toLowerCase()} type of cuisine.`
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

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
    day.innerHTML = `${key}:`;
    day.className = 'time-day';
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    var newTime = '';
    
    // to display hours in two lines
    if (time.innerHTML.includes(',')) {
      var newText = time.innerHTML.split(',');
      newTime = `${newText[0]}<br>${newText[1]}`
      time.innerHTML = newTime;
    } else {
      time.innerHTML = operatingHours[key];
    }

    row.appendChild(time);
    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  
/**
 * Create review HTML and add it to the webpage.
 */
  createReviewHTML = (review) => {
    const li = document.createElement('li');
    li.className = 'short-description';
    li.setAttribute("id", `longer-review-${reviews.indexOf(review)}`);
    const reviewContainer = document.createElement('div');
    reviewContainer.className = 'review-data-container';
    const name = document.createElement('p');
    name.innerHTML = review.name;
    name.className = 'review-name';
    reviewContainer.appendChild(name);

    const date = document.createElement('p');
    date.innerHTML = review.date;
    date.className = 'review-date';
    reviewContainer.appendChild(date);
    li.appendChild(reviewContainer);


    const rating = document.createElement('p');
    rating.innerHTML = `Rating: ${review.rating}`;
    rating.className = 'review-rating';
    li.appendChild(rating);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    comments.className = 'review-comments';
    li.appendChild(comments);

    
    const readMore = document.createElement('p');
    readMore.innerHTML = 'Read more review';
    readMore.setAttribute('data-toggle', 'short-description');
    readMore.className = 'read-more';
    readMore.setAttribute("tabindex","0");
    readMore.setAttribute("aria-controls",`longer-review-${reviews.indexOf(review)}`);
    readMore.setAttribute("aria-expanded", "false");
    li.appendChild(readMore);

    return li;

  }

  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);

  // show more review
  const readMoreContainer = document.querySelectorAll(".read-more");
  readMoreContainer.forEach(function(oneRead){

    const changeRead = (readButton) => {
      readButton.parentElement.classList.toggle('short-description');        
         
      if (readButton.parentElement.classList.contains('short-description')) {
        readButton.innerHTML = "Read more review";
        readButton.setAttribute("aria-expanded", "false");
      } else {
        readButton.innerHTML = "Close review";
        readButton.setAttribute("aria-expanded", "true");
      }  
    }

  // event for mouse "click"
    oneRead.addEventListener("click", function(){
      
      let readButton = this; 
      changeRead(readButton);

    })

    // event for focus with "Enter" key press
    oneRead.addEventListener("keypress", function(e){
      let button = e.keyCode;
      let character = e.which;

      if (button === 13 || character === 13) {
        
        let readButton = this;        
        changeRead(readButton);

      } else {undefined}
     
    })

  })
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
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



