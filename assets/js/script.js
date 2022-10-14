// Global variables
// search history as an empty array
// var searchHistory = [''];
const apiKey = '338d1628f784e2c0c339e4ade3ce2735';
var city = '';
const queryUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=' + apiKey;

// DOM element references
// search form
// search input
const searchSubmitBtn = document.getElementById('search-submit');
const searchHistoryBtn = document.getElementById('search-history')
var searchInput = document.getElementById('search-input');
// container/section for today's weather
// container/section for the forecast 
// search history container


// Function to display the search history list.
function renderSearchHistory() {
  // empty the search history container

  // loop through the history array creating a button for each item

  // append to the search history container

}

// Function to update history in local storage then updates displayed history.
function appendToHistory(search) {
  // push search term into search history array

  // set search history array to local storage
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

  // fetch, using the api url, .then that returns the response as json, .then that calls renderItems(city, data)

}

function fetchCoords(search) {
  var city = search;
  var geoUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + apiKey;

  // fetch with your url, .then that returns the response in json, .then that does 2 things - calls appendToHistory(search), calls fetchWeather(the data)
  fetch()
    .then(function (response) {
      console.log(response.json())
      return response.json();
    })
    .then(function (data) {
      if (!data[0]) {
        console.log('nothing')
        return;
      }
      clearScreen();
      fetchWeather(data);
    });
}

// Pulls down the value of the User Input when search is clicked
function handleSearchFormSubmit(e) {
  console.log('search button clicked')
  if (!searchInput.value) {
    return;
  }
  e.preventDefault();

  console.log(searchInput.value);
  var search = searchInput.value.trim();
  fetchCoords(search);
  searchInput.value = '';
}

function handleSearchHistoryClick(e) {
  // grab whatever city is is they clicked

  fetchCoords(search);
}

// Pulls from local storage previous search history
initSearchHistory();

// Event listeners for 1. Searching a new city and 2. Clicking a previously searched city
searchSubmitBtn.addEventListener('click', handleSearchFormSubmit)
searchHistoryBtn.addEventListener('click', handleSearchHistoryClick)