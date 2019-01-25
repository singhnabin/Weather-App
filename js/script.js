var currentLocation = document.getElementById("currentLocation");
var message = document.getElementById("message");
var cityName = document.getElementById("city");
var place = document.getElementById("place");
var currentTemperature = document.getElementById("current-temperature");
var currentWindSpeed = document.getElementById("current-windspeed");
var currentHumidity = document.getElementById("current-humidity");
var currentVisibility = document.getElementById("current-visibility");
var currentSummary = document.getElementById("current-summary");
var hourlyTime = document.querySelectorAll("#hourly-time");
var hourlyTemperature = document.querySelectorAll("#hourly-temperature");
var hourlySummary = document.querySelectorAll("#hourly-summary");
var days = document.querySelectorAll(".days");
var temperatureDaily = document.querySelectorAll(".temp-future");
var dailySummary = document.querySelectorAll("#daily-summary");
var currentIcon = document.getElementById("current-icon");
var dailyIcon = document.querySelectorAll("#dailyIcon");

// if (city === "") {
// }

var getLocation = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      currentLocationWeather(lat, long);
    });
  }
};

function getCityWeather() {
  if (!cityName.value) {
    message.textContent = "Please enter vadid city name";
  } else {
    var getAddressUrl =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      cityName.value +
      "&key=googleAPI";
    var xhrAddress = request();
    callToApi(xhrAddress, getAddressUrl);
    xhrAddress.onreadystatechange = addressData;
    message.textContent = "";
    cityName.value = "";
    cityName.focus();
  }
}

function currentLocationWeather(latOfCurrentLocation, longOfCurrentLocation) {
  var apiUrl =
    "https://api.darksky.net/forecast/WeatherAPIKEY/" +
    latOfCurrentLocation +
    "," +
    longOfCurrentLocation;

  var xhrApiData = request();

  callToApi(xhrApiData, apiUrl);

  xhrApiData.onreadystatechange = function() {
    if (xhrApiData.readyState === 4 && this.status === 200) {
      var weatherApiData = JSON.parse(this.responseText);
      var iconImage = getIcon(weatherApiData.currently.icon);
      showWeather(weatherApiData);
      currentIcon.setAttribute("class", `${iconImage}`);
    }
  };
  document
    .getElementById("display-weather")
    .classList.remove("display-weather");
}

function request() {
  return new XMLHttpRequest();
}

function callToApi(data, url) {
  data.open("GET", url, true);
  data.send();
}

function addressData() {
  if (this.readyState === 4 && this.status === 200) {
    var fullAddress = JSON.parse(this.responseText);
    if (!fullAddress) {
      message.textContent = "Something went wrong";
    } else {
      var locationLat = fullAddress.results[0].geometry.bounds.northeast.lat;
      var locationLng = fullAddress.results[0].geometry.bounds.northeast.lng;
      place.textContent = fullAddress.results[0].formatted_address;
      currentLocationWeather(locationLat, locationLng);
    }
  }
}

function convertTimestamp(timestamp) {
  var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
    dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
    hh = d.getHours(),
    h = hh,
    min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
    ampm = "AM",
    time;

  if (hh > 12) {
    h = hh - 12;
    ampm = "PM";
  } else if (hh === 12) {
    h = 12;
    ampm = "PM";
  } else if (hh == 0) {
    h = 12;
  }

  // ie: 2013-02-18, 8:35 AM
  time = yyyy + "-" + mm + "-" + dd + ", " + h + ":" + min + " " + ampm;

  return time;
}

function showWeather(weatherData) {
  currentTemperature.textContent = weatherData.currently.temperature;
  currentWindSpeed.textContent = weatherData.currently.windSpeed;
  currentHumidity.textContent = weatherData.currently.humidity;
  currentVisibility.textContent = weatherData.currently.visibility;
  currentSummary.textContent = weatherData.currently.summary;
  for (var i = 0; i < hourlySummary.length; i++) {
    hourlyTemperature[i].textContent =
      weatherData.hourly.data[i + 1].temperature;
    hourlySummary[i].textContent = weatherData.hourly.data[i + 1].summary;
    hourlyTime[i].textContent = calculateHour(
      weatherData.hourly.data[i + 1].time
    );
  }

  for (var j = 0; j < dailySummary.length; j++) {
    var iconDaily = getIcon(weatherData.daily.data[j + 1].icon);
    dailySummary[j].textContent = weatherData.daily.data[j + 1].summary;
    temperatureDaily[j].textContent =
      weatherData.daily.data[j + 1].temperatureMax;
    days[j].textContent = calculateDays(weatherData.daily.data[j + 1].time);
    dailyIcon[j].setAttribute("class", `${iconDaily}`);
  }
}

function calculateHour(time) {
  var x = new Date(time * 1000);
  hh = x.getHours();
  hours = hh;
  ampm = "AM";
  if (hh > 12) {
    hours = hh - 12;
    ampm = "PM";
  } else if (hh === 12) {
    hours = 12;
    ampm = "PM";
  } else if (hh == 0) {
    hours = 12;
  }
  time = hours + " " + ampm;
  return time;
}

function calculateDays(time) {
  var day = new Date(time * 1000);
  var weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  n = day.getDay();
  return weekDays[n];
}

function getIcon(icon) {
  var the_icon = "";
  if (icon === "clear-day") {
    the_icon = "wi wi-day-sunny";
    return the_icon;
  } else if (icon === "clear-night") {
    the_icon = "wi wi-night-clear";
    return the_icon;
  } else if (icon === "rain") {
    the_icon = "wi wi-day-rain";
    return the_icon;
  } else if (icon === "snow") {
    the_icon = "wi wi-day-snow";
    return the_icon;
  } else if (icon === "sleet") {
    the_icon = "wi wi-day-sleet";
    return the_icon;
  } else if (icon === "wind") {
    the_icon = "wi wi-day-wind";
    return the_icon;
  } else if (icon === "fog") {
    the_icon = "wi wi-day-fog";
    return the_icon;
  } else if (icon === "cloudy") {
    the_icon = "wi wi-day-cloudy";
    return the_icon;
  } else if (icon === "partly-cloudy-day") {
    the_icon = "wi wi-day-cloudy";
    return the_icon;
  } else if (icon === "partly-cloudy-night") {
    the_icon = "wi wi-night-partly-cloudy";
    return the_icon;
  } else if (icon === "hail") {
    the_icon = "wi wi-hail";
    return the_icon;
  } else if (icon === "thunderstorm") {
    the_icon = "wi wi-day-thunderstorm";
    return the_icon;
  } else if (icon === "tornado") {
    the_icon = "wi wi-tornado";
    return the_icon;
  } else {
    the_icon = "wi wi-cloud-refresh";
    return the_icon;
  }
}

function changeTemp() {
  console.log(currentTemperature.value);
}
