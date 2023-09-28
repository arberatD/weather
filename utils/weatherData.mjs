// Verwenden Sie 'import' anstelle von 'require'
import request from 'request';
import constants from '../config.mjs';

const weatherData = (address, callback) => {
    const url = constants.openWeatherMap.BASE_URL + encodeURIComponent(address) + '&appid=' + constants.openWeatherMap.SECRET_KEY;
    console.log(url);

    request({url, json: true}, (error, {body}) => {
        if (error) {
            callback("Bitte gebe einen gültigen Städtenamen ein, sonst geht es nicht weiter", undefined);
        } else if(!body.main || !body.main.temp || !body.name || !body.weather) {
            callback("Bitte gebe einen gültigen Städtenamen ein, sonst geht es nicht weiter", undefined);
        } else {
            callback(undefined, {
                temperature: body.main.temp,
                description: body.weather[0].description,
                cityName: body.name,
                            });
        }
    });
}

// Verwenden Sie 'export' anstelle von 'module.exports'
export default weatherData;
