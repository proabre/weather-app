# Weather App

A weather application built as part of The Odin Project JavaScript curriculum. It uses the Open-Meteo API to search for locations and display their current weather conditions.

## Features
Search for weather by city/location
Display current temperature
Display "feels like" temperature
Display humidity
Display wind speed
Display weather conditions
Celsius/Fahrenheit toggle
Loading indicator while fetching data
Error handling for invalid locations or failed requests
Responsive and simple UI
No API key required
Technologies
HTML5
CSS3
JavaScript (ES6+)
Fetch API
Async/Await
Open-Meteo API
Webpack
HTMLWebpackPlugin
CSS Loader
Style Loader

## How It Works
The application uses two Open-Meteo APIs.

### 1. Geocoding API

When the user searches for a location, the application first sends the location name to the Geocoding API.

For example:

"Addis Ababa"
       ↓
Geocoding API
       ↓
Latitude + Longitude

The application needs the coordinates because the weather API uses latitude and longitude to determine the location.

### 2. Weather API

The coordinates are then sent to the Weather API:

Latitude + Longitude
        ↓
Weather API
        ↓
Weather JSON data

## The application processes the response and extracts only the information it needs.

## Data Flow
User enters location
        ↓
Form submission
        ↓
getLocation()
        ↓
Geocoding API
        ↓
Latitude + Longitude
        ↓
getWeather()
        ↓
Weather API
        ↓
processWeather()
        ↓
Clean weather object
        ↓
displayWeather()
        ↓
Update the webpage

## Error Handling

The application checks whether the API request was successful:

if (!response.ok) {
  throw new Error(`Request failed: ${response.status}`);
}

Errors are then handled with try...catch:

try {
  // Fetch weather
} catch (error) {
  // Display error
}

This prevents the application from breaking when a location cannot be found or an API request fails.

## Celsius and Fahrenheit

The application keeps track of the selected temperature unit:

let currentUnit = "celsius";

When the user selects Celsius or Fahrenheit, the application requests the weather using the appropriate Open-Meteo temperature unit.

Webpack

Webpack is used to bundle the application's JavaScript and CSS and create the final files in the dist directory.

## The main source files are:

src/
├── index.html
├── index.js
└── style.css

## Webpack processes these files and generates the production build:

dist/
├── index.html
└── main.js
Running the Project

## Clone the repository and install the dependencies:

npm install

Start the Webpack development server:

npm run dev

To create a production build:

npm run build

The application can then be opened through the local development server.

## What I Learned

This project helped me practice:

Working with REST APIs
fetch()
Promises
async/await
try...catch
Processing JSON data
DOM manipulation
Event listeners
Form handling
Managing application state
HTTP response handling
Webpack
JavaScript modules
Separating API logic from UI logic

## API
Weather data is provided by Open-Meteo.

The project uses Open-Meteo's Geocoding API and Forecast API. No API key is required for the public non-commercial use case.
