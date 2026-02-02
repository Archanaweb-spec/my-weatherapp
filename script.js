const apiKey = "78880ba8631db40dbba6fef8f6acd526";

function getWeather() {
    const city = document.getElementById("cityInput").value;

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    // CURRENT WEATHER
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => showCurrentWeather(data));

    // FORECAST (hourly + daily)
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            showHourly(data);
            showForecast(data);
        });
}

function showCurrentWeather(data) {
    const icon = data.weather[0].icon;

    document.getElementById("currentWeather").innerHTML = `
        <h2>${data.name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
        <div class="temp">${Math.round(data.main.temp)}°C</div>
        <p>${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s</p>
    `;
}

function showHourly(data) {
    const hourlyDiv = document.getElementById("hourly");
    hourlyDiv.innerHTML = "";

    // Next 24 hours (3-hour interval)
    for (let i = 0; i < 8; i++) {
        const hourData = data.list[i];
        const time = new Date(hourData.dt_txt).toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true
        });
        const icon = hourData.weather[0].icon;

        hourlyDiv.innerHTML += `
            <div class="hour">
                <p>${time}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png">
                <p>${Math.round(hourData.main.temp)}°</p>
            </div>
        `;
    }
}

function showForecast(data) {
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";

    // One forecast per day
    for (let i = 8; i < data.list.length; i += 8) {
        const day = data.list[i];
        const icon = day.weather[0].icon;
        const dayName = new Date(day.dt_txt).toLocaleDateString("en-US", {
            weekday: "short"
        });

        forecastDiv.innerHTML += `
            <div class="day">
                <p>${dayName}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png">
                <p>${Math.round(day.main.temp)}°</p>
            </div>
        `;
    }
}
