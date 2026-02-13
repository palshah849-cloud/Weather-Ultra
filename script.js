const apiKey = "e4051f7edbf9edc5a2ba79517e96eb31";

async function getWeather() {

    const city = document.getElementById("city").value;
    const country = document.getElementById("country").value;
    const query = country ? `${city},${country}` : city;

    const currentURL =
    `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`;

    const forecastURL =
    `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=metric&appid=${apiKey}`;

    const currentRes = await fetch(currentURL);
    const currentData = await currentRes.json();

    const forecastRes = await fetch(forecastURL);
    const forecastData = await forecastRes.json();

    displayCurrent(currentData);
    displayForecast(forecastData);
    displayHourly(forecastData);
    changeBackground(currentData.weather[0].main);
}

function displayCurrent(data) {

    document.getElementById("cityName").innerText =
        data.name + ", " + data.sys.country;

    document.getElementById("temperature").innerText =
        data.main.temp + "°C";

    document.getElementById("description").innerText =
        data.weather[0].description;

    const iconCode = data.weather[0].icon;
    document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    getAQI(data.coord.lat, data.coord.lon);
}

function displayForecast(data) {

    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";

    for (let i = 0; i < data.list.length; i += 8) {

        const day = data.list[i];
        const date = new Date(day.dt_txt).toDateString();

        forecastDiv.innerHTML += `
            <div>
                <p>${date}</p>
                <p>${day.main.temp}°C</p>
            </div>
        `;
    }
}

function displayHourly(data) {

    const hourlyDiv = document.getElementById("hourly");
    hourlyDiv.innerHTML = "";

    for (let i = 0; i < 8; i++) {

        const hour = data.list[i];
        const time = new Date(hour.dt_txt).getHours();

        hourlyDiv.innerHTML += `
            <div>
                <p>${time}:00</p>
                <p>${hour.main.temp}°C</p>
            </div>
        `;
    }
}

function changeBackground(type) {

    document.body.className = "";

    if (type === "Clear") document.body.classList.add("sunny");
    else if (type === "Clouds") document.body.classList.add("cloudy");
    else if (type === "Rain") document.body.classList.add("rainy");
}

function toggleTheme() {
    document.body.classList.toggle("dark");
}

function getLocationWeather() {

    navigator.geolocation.getCurrentPosition(async position => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();

        displayCurrent(data);
        changeBackground(data.weather[0].main);
    });
}

async function getAQI(lat, lon) {

    const url =
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    document.getElementById("aqiValue").innerText =
        data.list[0].main.aqi;
}
