document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '28262e8577c804c4ff710ae086861124';  // Your OpenWeatherMap API key

    const searchButton = document.getElementById('search-button');
    const cityInput = document.getElementById('city-input');
    const timeContainer = document.getElementById('time-container');
    const currentCondition = document.getElementById('current-condition');
    const currentTime = document.getElementById('current-time');

    searchButton.addEventListener('click', function() {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        }
    });

    function fetchWeatherData(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const cityName = document.querySelector('.city-name');
                const temperature = document.querySelector('.temperature');
                const description = document.querySelector('.description');
                const currentWeather = document.querySelector('.current-weather');
                const weatherDetails = document.querySelector('.weather-details');

                cityName.textContent = data.name;
                temperature.textContent = `${Math.round(data.main.temp)}°C`;
                description.textContent = data.weather[0].description;

                weatherDetails.innerHTML = `
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                    <p>Pressure: ${data.main.pressure} hPa</p>
                `;

                currentWeather.classList.remove('sunny', 'cloudy', 'rainy');
                switch (data.weather[0].main.toLowerCase()) {
                    case 'clear':
                        currentWeather.classList.add('sunny');
                        currentCondition.textContent = 'Condition: Sunny';
                        break;
                    case 'clouds':
                        currentWeather.classList.add('cloudy');
                        currentCondition.textContent = 'Condition: Cloudy';
                        break;
                    case 'rain':
                        currentWeather.classList.add('rainy');
                        currentCondition.textContent = 'Condition: Rainy';
                        break;
                    default:
                        currentWeather.classList.add('sunny');
                        currentCondition.textContent = 'Condition: Unknown';
                }

                // Update map if available
                if (data.coord) {
                    showMap(data.coord.lat, data.coord.lon);
                }

                // Fetch forecast data and update the forecast section
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

                return fetch(forecastUrl);
            })
            .then(response => response.json())
            .then(data => {
                const forecast = document.querySelector('.forecast');
                forecast.innerHTML = '';

                data.list.slice(0, 5).forEach(item => {
                    const forecastItem = document.createElement('div');
                    forecastItem.classList.add('forecast-item');

                    const date = new Date(item.dt_txt);
                    const day = date.toLocaleString('en-US', { weekday: 'short' });
                    const temp = `${Math.round(item.main.temp)}°C`;

                    forecastItem.innerHTML = `
                        <p>${day}</p>
                        <p>${temp}</p>
                    `;

                    forecast.appendChild(forecastItem);
                });
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    // Function to show map for a specific city using latitude and longitude
    function showMap(lat, lon) {
        const mapContainer = document.getElementById('map-container');
        const mapOptions = {
            center: { lat, lng: lon },
            zoom: 8,
        };
        const map = new google.maps.Map(mapContainer, mapOptions);
        const marker = new google.maps.Marker({
            position: { lat, lng: lon },
            map: map,
            title: 'Weather Location'
        });
    }

    // Function to update current time
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        currentTime.textContent = `Current time: ${timeString}`;
    }

    // Update time every second
    setInterval(updateTime, 1000);
});
