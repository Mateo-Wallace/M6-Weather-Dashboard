// Global variables
// search history as an empty array
const apiKey = '338d1628f784e2c0c339e4ade3ce2735';
var city = '';
var search = '';
var lat;
var lon;
const queryUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=' + apiKey;

// DOM element references
const searchSubmitBtn = document.getElementById('search-submit');
const searchInput = document.getElementById('search-input');
const savedSearchEl = document.getElementById('saved-search');
const todaysForecastEl = document.getElementById('todays-forecast');
const fiveDayForecastEl = document.getElementById('5-day-forecast');

// Pulls searches from local storage and displays them on page
function renderSearchHistory() {
  savedSearchEl.innerHTML = "";
  for (var i = 0; i < localStorage.length; i++) {
    city = localStorage.getItem(localStorage.key(i));
    var cityButton = document.createElement("button");
    cityButton.setAttribute("class", "btn btn-dark col-3 col-md-11 m-1");
    cityButton.textContent = city;
    savedSearchEl.appendChild(cityButton);
  }
}

// Adds searched city to local storage. Calls function to add button to page
function appendToHistory(search) {
  localStorage.setItem(search, search);
  renderSearchHistory();
}

// Function to get search history from local storage
function initSearchHistory() {
  // get search history item from local storage

  // set search history array equal to what you got from local storage
  renderSearchHistory();
}

// Function to display the CURRENT weather data fetched from OpenWeather api.
function renderCurrentWeather(city, weather) {
  // Store response data from our fetch request in variables
  // temperature, wind speed, etc.


  // document.create the elements you'll want to put this information in  

  // append those elements somewhere

  // give them their appropriate content

}

// Function to display a FORECAST card given an object (from our renderForecast function) from open weather api
// daily forecast.
function renderForecastCard(forecast) {
  // variables for data from api
  // temp, windspeed, etc.

  // Create elements for a card

  // append

  // Add content to elements

  // append to forecast section
}

// Function to display 5 day forecast.
function renderForecast(dailyForecast) {
  // set up elements for this section

  // append

  // loop over dailyForecast

  for (var i = 0; i < dailyForecast.length; i++) {

    // send the data to our renderForecast function as an argument
    renderForecastCard(dailyForecast[i]);
  }
}

function renderItems(city, data) {
  renderCurrentWeather(city, data.list[0]);
  renderForecast(data.list);
}

// Fetches weather data for given location from the Weather Geolocation
// endpoint; then, calls functions to display current and forecast weather data.
function fetchWeather(location) {
  // varialbles of longitude, latitude, city name - coming from location
  // api url
  var weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&lang=en&appid=' + apiKey;
  // fetch, using the api url, .then that returns the response as json, .then that calls renderItems(city, data)
  fetch(weatherUrl)
    .then(function (response) {
      if (response.ok) {
        response.json()
        .then(function (data) {
          console.log(data);
        })
      } else {
        return;
      }
    })
}

function fetchCoords(search) {
  var city = search;
  var geoUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + apiKey;

  // Determines lat and lon of city. Calls appendToHistory and FetchWeather
  fetch(geoUrl)
    .then(function (response) {
      if (response.ok) {
        response.json()
          .then(function (data) {
            // Returns nothing if the data has no information, ex: city does not exist in api
            if (data.length === 0) {
              alert('Unknown City. \nBe sure to only type the city name without the State.\n\nIf issue persists please try another city.')
              return;
            }
            console.log(data)
            lat = data[0].lat;
            lon = data[0].lon;
            search = data[0].name;
            city = search
            console.log('lat: ' + lat + ', lon: ' + lon);

            appendToHistory(search);
            fetchWeather(lat, lon, city);
          })
      } else {
        return;
      }
    })
}

// Pulls down the value of the User Input when search is clicked
function handleSearchFormSubmit(e) {
  console.log('Search Button Clicked');
  if (!searchInput.value) {
    return;
  }
  e.preventDefault();

  search = searchInput.value.trim();
  console.log('Searched item = ' + search);
  fetchCoords(search);
  searchInput.value = '';
}

// Selects value of button clicked 
function handleSearchHistoryClick(e) {
  console.log('Previous Search Button Clicked');
  console.log('Searched item = ' + e.target.textContent);
  search = e.target.textContent;
  fetchCoords(search);
}

// Pulls from local storage previous search history
initSearchHistory();

// Event listeners for 1. Searching a new city and 2. Clicking a previously searched city
searchSubmitBtn.addEventListener('click', handleSearchFormSubmit);
savedSearchEl.addEventListener('click', handleSearchHistoryClick);