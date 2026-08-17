import "./style.css";

// -----------------------------
// DOM elements
// -----------------------------

const form = document.querySelector("#weather-form");
const locationInput = document.querySelector("#location-input");

const loading = document.querySelector("#loading");
const errorMessage = document.querySelector("#error");

const weatherContainer = document.querySelector("#weather-container");

const locationElement = document.querySelector("#location");
const temperatureElement = document.querySelector("#temperature");
const conditionElement = document.querySelector("#condition");
const weatherIconElement = document.querySelector("#weather-icon");

const feelsLikeElement = document.querySelector("#feels-like");
const humidityElement = document.querySelector("#humidity");
const windElement = document.querySelector("#wind");

const celsiusButton = document.querySelector("#celsius-btn");
const fahrenheitButton = document.querySelector("#fahrenheit-btn");

// -----------------------------
// Application state
// -----------------------------

let currentWeather = null;
let currentUnit = "celsius";

// -----------------------------
// Weather code descriptions
// -----------------------------

function getWeatherDescription(code) {
  const weatherCodes = {
    0: "Clear sky",

    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",

    45: "Fog",
    48: "Depositing rime fog",

    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",

    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",

    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",

    66: "Light freezing rain",
    67: "Heavy freezing rain",

    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",

    77: "Snow grains",

    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",

    85: "Slight snow showers",
    86: "Heavy snow showers",

    95: "Thunderstorm",

    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  return weatherCodes[code] || "Unknown weather";
}

// -----------------------------
// Get location coordinates
// -----------------------------

async function getLocation(location) {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(location)}` +
    `&count=1` +
    `&language=en` +
    `&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Location request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("Location not found.");
  }

  return {
    name: data.results[0].name,
    country: data.results[0].country,
    latitude: data.results[0].latitude,
    longitude: data.results[0].longitude,
  };
}

// -----------------------------
// Get weather
// -----------------------------

async function getWeather(latitude, longitude) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
    `&temperature_unit=${currentUnit}` +
    `&wind_speed_unit=kmh` +
    `&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather request failed: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

// -----------------------------
// Process API data
// -----------------------------

function processWeather(location, data) {
  return {
    location: `${location.name}, ${location.country}`,

    temperature: data.current.temperature,

    feelsLike: data.current.apparent_temperature,

    humidity: data.current.relative_humidity_2m,

    windSpeed: data.current.wind_speed_10m,

    weatherCode: data.current.weather_code,

    condition: getWeatherDescription(data.current.weather_code),

    timezone: data.timezone,

    time: data.current.time,
  };
}

// -----------------------------
// Display weather
// -----------------------------

function displayWeather(weather) {
  locationElement.textContent = weather.location;

  temperatureElement.textContent = `${Math.round(weather.temperature)}°`;

  conditionElement.textContent = weather.condition;

  feelsLikeElement.textContent = `${Math.round(weather.feelsLike)}°`;

  humidityElement.textContent = `${weather.humidity}%`;

  windElement.textContent = `${Math.round(weather.windSpeed)} km/h`;

  weatherIconElement.textContent = getWeatherEmoji(weather.weatherCode);

  weatherContainer.classList.remove("hidden");
}

// -----------------------------
// Weather emoji
// -----------------------------

function getWeatherEmoji(code) {
  if (code === 0) {
    return "☀️";
  }

  if ([1, 2].includes(code)) {
    return "🌤️";
  }

  if (code === 3) {
    return "☁️";
  }

  if ([45, 48].includes(code)) {
    return "🌫️";
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return "🌦️";
  }

  if ([61, 63, 65, 66, 67].includes(code)) {
    return "🌧️";
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return "🌨️";
  }

  if ([80, 81, 82].includes(code)) {
    return "🌦️";
  }

  if ([95, 96, 99].includes(code)) {
    return "⛈️";
  }

  return "🌡️";
}

// -----------------------------
// Search for weather
// -----------------------------

async function searchWeather(location) {
  try {
    showLoading();

    hideError();

    const locationData = await getLocation(location);

    const weatherData = await getWeather(
      locationData.latitude,
      locationData.longitude,
    );

    console.log("Location:", locationData);
    console.log("Weather:", weatherData);

    const processedWeather = processWeather(locationData, weatherData);

    console.log("Processed weather:", processedWeather);

    currentWeather = processedWeather;

    displayWeather(currentWeather);
  } catch (error) {
    console.error(error);

    showError(error.message);
  } finally {
    hideLoading();
  }
}

// -----------------------------
// Form submit
// -----------------------------

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const location = locationInput.value.trim();

  if (!location) {
    showError("Please enter a location.");
    return;
  }

  searchWeather(location);
});

// -----------------------------
// Celsius button
// -----------------------------

celsiusButton.addEventListener("click", async () => {
  if (!currentWeather) {
    return;
  }

  currentUnit = "celsius";

  const location = locationInput.value.trim();

  await searchWeather(location);
});

// -----------------------------
// Fahrenheit button
// -----------------------------

fahrenheitButton.addEventListener("click", async () => {
  if (!currentWeather) {
    return;
  }

  currentUnit = "fahrenheit";

  const location = locationInput.value.trim();

  await searchWeather(location);
});

// -----------------------------
// Loading functions
// -----------------------------

function showLoading() {
  loading.classList.remove("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

// -----------------------------
// Error functions
// -----------------------------

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");

  weatherContainer.classList.add("hidden");
}

function hideError() {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

// -----------------------------
// Initial weather
// -----------------------------

searchWeather("Addis Ababa");
