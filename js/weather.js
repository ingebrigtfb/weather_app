document.addEventListener('DOMContentLoaded', function() {
    const openCageApiKey = 'd9c59f7bd5804175b1f22becee747982'; // nøkkel fra OpenCage API


    // Function to fetch weather data for a given latitude and longitude
    function fetchWeather(lat, lon, weatherDivId, cityName) {
        const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'MyTestApp/0.1', // User-Agent header for identification
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const weatherDiv = document.getElementById(weatherDivId);
            const weatherInfo = `
                <p>Temperatur: ${data.properties.timeseries[0].data.instant.details.air_temperature} °C</p>
                <p>Relative Humidity: ${data.properties.timeseries[0].data.instant.details.relative_humidity} %</p>
            `;
            weatherDiv.innerHTML = weatherInfo;

            // Update the heading with the city name
console.log(`#${weatherDivId} h1 span`);
const spanElement = document.querySelector(`#${weatherDivId} h1 span`);
console.log('spanElement:', spanElement);
if (spanElement) {
    spanElement.textContent = cityName;
} else {
    console.error(`Span element with id ${weatherDivId} h1 span not found.`);
}

        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
    }

    


    // Function to fetch coordinates for a given name
    function fetchCoordinates(place, weatherDivId, cityName) {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(place)}&key=${openCageApiKey}`;

        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry;
                fetchWeather(lat, lng, weatherDivId, cityName);
            } else {
                throw new Error('No results found');
            }
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
    }

// Get the buttons and add event listeners
const fetchWeatherButtons = document.querySelectorAll('.fetchWeatherButton');
fetchWeatherButtons.forEach(button => {
    const weatherDivId = button.dataset.weatherDivId; // Capture weatherDivId here
    button.addEventListener('click', (event) => {
        const place = event.target.previousElementSibling.value;
        const cityName = event.target.dataset.cityName;
        fetchCoordinates(place, weatherDivId, cityName);
    });
});






    // Fetch initial weather data for default places
    const defaultPlaces = [
        { place: 'Bergen, Norway', weatherDivId: 'weatherBergen', cityName: 'Bergen' },
        { place: 'Lønset, Norway', weatherDivId: 'weatherLonset', cityName: 'Lønset' }
    ];

    defaultPlaces.forEach(({ place, weatherDivId, cityName }) => {
        fetchCoordinates(place, weatherDivId, cityName);
    });
});
