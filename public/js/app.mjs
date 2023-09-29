var fetchWeather = "/weather";

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');


const weatherIcon = document.querySelector('.weatherIcon i');

const weatherCondition = document.querySelector('.weatherCondition');

const tempElement = document.querySelector('.temperature span');

const windElement = document.querySelector('.windSpeed');

const locationElement = document.querySelector('.place');

const humidityElement = document.querySelector('.humidity');

const dateElement = document.querySelector('.date');

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

dateElement.textContent = new Date().getDate() + ", " + monthNames[new Date().getMonth()].substring(0, 10) + " " + new Date().getFullYear();


weatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    locationElement.textContent = "Loading...";
    tempElement.textContent = "";
    windElement.textContent = "";
    weatherCondition.textContent = "";
    const locationApi = fetchWeather + "?address=" + search.value;
    
    fetch(locationApi).then(response => {
        response.json().then(data => {
            if(data.error) {
                locationElement.textContent = data.error;
                tempElement.textContent = "";
                windElement.textContent = "";
                weatherCondition.textContent = "";
            } else {
                locationElement.textContent = 'Stadt: ' + data.cityName.toUpperCase();
                tempElement.textContent = Math.round(data.temperature - 273.5) + String.fromCharCode(176) + 'C';
                windElement.textContent = 'Windgeschwindigkeit: ' + Math.round(data.windSpeed) + 'm/s';
                weatherCondition.textContent = 'Wetterbedingungen: ' + data.description;
                // humidityElement.textContent = 'Humidity: ' + data.humidity;
                weatherForm.reset();

            }
        }) 
    });
 
})