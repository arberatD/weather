const request = require('request');
const constants = require('../config');

//callback to return the data to partiqular endpoint
const weatherData = (adress, callback) => {
    const url = constants.openWeatherMap.BASE_URL + encodeURIComponent(adress) + '&appid=' + constants.openWeatherMap.SECRET_KEY;
    console.log(url);
    
    request({url, json:true}, (error, {body}) => {
        if(error){
            callback("Cannt fetch data from open weather map api", undefined);
        } else {
            //ruft die daten der api ab
            callback(undefined, {
                temperature: body.main.temp,
                description: body.weather[0].description,
                cityName: body.name,
                // country: body.sys.country
            })
        }
    })
}



module.exports = weatherData;