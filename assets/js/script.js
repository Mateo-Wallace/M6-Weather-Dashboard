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
    cityButton.setAttribute("class", "btn btn-dark col-3 col-md-11 m-1 saved-search-btn");
    cityButton.setAttribute('id', city)
    cityButton.textContent = city;
    savedSearchEl.appendChild(cityButton);
    document.getElementById(city).addEventListener('click', handleSearchHistoryClick)
  }
}

// Adds searched city to local storage. Calls function to add button to page
function appendToHistory(search) {
  localStorage.setItem(search, search);
  renderSearchHistory();
}

// Function to display the CURRENT weather data
function renderCurrentWeather(city, weather) {
  todaysForecastEl.innerHTML = ''

  // Elements  
  var cityName = document.createElement('h3')
  cityName.setAttribute('class', 'card-header fw-bold')
  var cardBody = document.createElement('div')
  cardBody.setAttribute('class', 'card-body')
  var cardTemp = document.createElement('p')
  var cardWind = document.createElement('p')
  var cardHumidity = document.createElement('p')

  var iconImg = weather.weather[0].main;
  if (iconImg == 'Rain') {
    iconImg = `<i class="fa-solid fa-cloud-showers-heavy"></i>`;
  } else if (iconImg == 'Clouds') {
    iconImg = `<i class="fa-solid fa-cloud"></i>`;
  } else if (iconImg == 'Clear') {
    iconImg = `<i class="fa-solid fa-sun"></i>`;
  } else {
    iconImg = "";
  }

  var date = new Date();
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0');
  var yyyy = date.getFullYear();
  date = mm + '/' + dd + '/' + yyyy;

  // Appended elements
  todaysForecastEl.appendChild(cityName)
  todaysForecastEl.appendChild(cardBody)
  cardBody.appendChild(cardTemp)
  cardBody.appendChild(cardWind)
  cardBody.appendChild(cardHumidity)

  // Text content of appended elements
  cityName.innerHTML = city + ' (' + date + ') ' + iconImg
  cardTemp.innerText = 'Temp: ' + weather.main.temp + ' °F'
  cardWind.innerText = 'Wind: ' + weather.wind.speed + ' mph'
  cardHumidity.innerText = 'Humidity: ' + weather.main.humidity + '%'
}

// Function to display 5 day forecast. VIP FIRST LOAD
function renderForecast(dailyForecast) {
  fiveDayForecastEl.innerHTML = "";

  // create elements for current section 
  var headerForecast = document.createElement("h4");
  var newForecastDiv = document.createElement("div");

  var now = dayjs();

  // append elements to document and style
  fiveDayForecastEl.appendChild(headerForecast);
  headerForecast.setAttribute('class', 'fw-bold');
  fiveDayForecastEl.appendChild(newForecastDiv);
  newForecastDiv.setAttribute("class", "row justify-content-around");

  // Add text content
  headerForecast.textContent = "5 Day Forecast:";

  // loop over dailyForecast
  for (var i = 0; i < 5; i++) {

    // create elements for each day card 
    var forecastCard = document.createElement("div");
    var dateEl = document.createElement("h5");
    var imageEl = document.createElement('p');
    var tempEl = document.createElement("p");
    var windEl = document.createElement("p");
    var humidityEl = document.createElement("p");

    var iconImage = dailyForecast[i].weather[0].main;
    if (iconImage == 'Rain') {
      iconImage = `<i class="fa-solid fa-cloud-showers-heavy"></i>`;
    } else if (iconImage == 'Clouds') {
      iconImage = `<i class="fa-solid fa-cloud"></i>`;
    } else if (iconImage == 'Clear') {
      iconImage = `<i class="fa-solid fa-sun"></i>`;
    } else {
      iconImage = "";
    }

    var date = now.add(i, "day").format("MM/DD");

    // append elements to document
    newForecastDiv.appendChild(forecastCard);
    forecastCard.setAttribute("class", "card text-bg-dark mb-3");
    forecastCard.setAttribute('style', 'max-width: 33%;');
    forecastCard.appendChild(dateEl);
    dateEl.setAttribute('class', 'card-header');
    forecastCard.appendChild(imageEl);
    imageEl.setAttribute('class', 'card-text mt-3');
    forecastCard.appendChild(tempEl);
    tempEl.setAttribute('class', 'card-text');
    forecastCard.appendChild(windEl);
    windEl.setAttribute('class', 'card-text');
    forecastCard.appendChild(humidityEl);
    humidityEl.setAttribute('class', 'card-text mb-3');

    // give elements appropriate data and content 
    dateEl.textContent = date;
    tempEl.textContent = `Temp: ${dailyForecast[i].main.temp} °F`;
    windEl.textContent = `Wind: ${dailyForecast[i].wind.speed} mph`;
    humidityEl.textContent = `Hum: ${dailyForecast[i].main.humidity} %`;
  }
}

// Seperates data and calls functions to print to page
function renderItems(city, data) {
  renderCurrentWeather(city, data.list[0]);
  renderForecast(data.list);
}

// Fetches weather data and sends to renderItems function
function fetchWeather(lat, lon, city) {
  var weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&lang=en&appid=' + apiKey;

  fetch(weatherUrl)
    .then(function (response) {
      if (response.ok) {
        response.json()
          .then(function (data) {
            renderItems(city, data)
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

renderSearchHistory();

// Clear Local Storage on click
const btnClear = document.getElementById('clear-history')
btnClear.onclick = function () {
  localStorage.clear();
  if(localStorage.length === 0)
     lsOutput.innerHTML = "";
};

// Event listeners for 1. Searching a new city and 2. Clicking a previously searched city
searchSubmitBtn.addEventListener('click', handleSearchFormSubmit);
