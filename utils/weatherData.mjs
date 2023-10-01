import request from 'request';
import constants from '../config.mjs';

// Die Funktion 'weatherData' ruft Wetterdaten für eine gegebene Adresse ab
const weatherData = (address, callback) => {
    // Erstelle die URL für die OpenWeatherMap-API unter Verwendung von Konfigurationsdaten
    const url = constants.openWeatherMap.BASE_URL 
                + encodeURIComponent(address) 
                // hier wird de = deutsch als sprache für die api abfrage eingestellt
                + '&lang=de&appid=' 
                + constants.openWeatherMap.SECRET_KEY;

    // Zeige die erstellte URL in der Konsole an
    console.log(url);

    // Verwenden Sie das 'request'-Paket, um eine Anfrage an die OpenWeatherMap-API zu senden
    request({url, json: true}, (error, {body}) => {
        if (error) {
            // Bei einem Fehler wird eine Fehlermeldung an den Callback zurückgegeben
            callback("Bitte gebe einen gültigen Städtenamen ein, sonst geht es nicht weiter", undefined);
        } else if(!body.main || !body.main.temp || !body.name || !body.weather) {
            // Wenn die Antwortdaten unvollständig sind, gebe eine Fehlermeldung zurück
            callback("Bitte gebe einen gültigen Städtenamen ein, sonst geht es nicht weiter", undefined);
        } else {
            // Bei einer erfolgreichen Anfrage sende die Wetterdaten an den Callback zurück
            callback(undefined, {
                temperature: body.main.temp,
                windSpeed:  body.wind.speed,
                description: body.weather[0].description,
                cityName: body.name,
            });
        }
    });
}

// Exportiere die 'weatherData'-Funktion, sodass sie in anderen Modulen verwendet werden kann
export default weatherData;
