// URL zum Abrufen von Wetterdaten
var fetchWeather = "/weather";

// DOM-Elemente selektieren
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const weatherIcon = document.querySelector('.weatherIcon i');
const weatherCondition = document.querySelector('.weatherCondition');
const tempElement = document.querySelector('.temperature span');
const windElement = document.querySelector('.windSpeed');
const locationElement = document.querySelector('.place');
const humidityElement = document.querySelector('.humidity');
const dateElement = document.querySelector('.date');

// Monatsnamen, die später für das Anzeigen des aktuellen Datums verwendet werden
const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]

// Setze das aktuelle Datum im vorgesehenen Element
dateElement.textContent = new Date().getDate() + ", " + monthNames[new Date().getMonth()].substring(0, 3) + " " + new Date().getFullYear();

// Event-Listener für das Absenden des Formulars
weatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Zeigt "Laden..." während der Datenabruf im Gange ist
    locationElement.textContent = "Laden...";
    tempElement.textContent = "";
    windElement.textContent = "";
    weatherCondition.textContent = "";
    
    // Erstelle die vollständige URL für den Fetch
    const locationApi = fetchWeather + "?address=" + search.value;
    
    // Anfrage an die API senden
    fetch(locationApi).then(response => {
        response.json().then(data => {
            if(data.error) {
                // Zeige den Fehler, falls vorhanden
                locationElement.textContent = data.error;
                tempElement.textContent = "";
                windElement.textContent = "";
                weatherCondition.textContent = "";
            } else {
                // Zeige die empfangenen Wetterdaten
                locationElement.textContent = 'Stadt: ' + data.cityName.toUpperCase();
                tempElement.textContent = Math.round(data.temperature - 273.5) + String.fromCharCode(176) + 'C';
                windElement.textContent = 'Windgeschwindigkeit: ' + Math.round(data.windSpeed) + ' m/s';
                weatherCondition.textContent = 'Wetterbedingungen: ' + data.description;
                // Das Feuchtigkeitselement wird momentan nicht genutzt
                // humidityElement.textContent = 'Luftfeuchtigkeit: ' + data.humidity;
                
                // Setzt das Formular zurück nach erfolgreicher Anfrage
                weatherForm.reset();
            }
        });
    });
});
