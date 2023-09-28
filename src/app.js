const express = require('express');
const hbs = require ("hbs");
const path = require ("path");
const app = express();

const weatherData = require('../utils/weatherData');

const port = 3000;

//angabe des ordners der die static files beinhaltet
const publicStaticDirPath = path.join(__dirname, "../public");

const viewsPath = path.join(__dirname, "../templates/views");

const partialsPath = path.join(__dirname, "../templates/partials");

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath);
app.use(express.static(publicStaticDirPath));

app.get('/', (req, res) => {
    res.render('index', { //link to index.hbs -> das wird verlinkt in package.json 
        title: "Wetter App"
    })
})

//localhost:3000/weather?adress=whichCityYouWant
app.get('/weather', (req, res) => {
    const adress = req.query.adress
    //fehlerausgabe wenn keine stadt eingegeben
    if (!adress) {
        return res.send({
            error: "Bitte gebe bei der Suchleiste eine Stadt ein"
        })
    }
    weatherData(adress, (error, {temperature, description, cityName, country}) => {
        if(error){
            return res.send({
                error
            })
        }  
        console.log(temperature, description, cityName, country);
        res.send({
            temperature,
            description,
            cityName,
            country
        })
    })
});

app.get("*", (req, res) => {
    res.send("This site does not exist")
});

app.listen(port, () => {
    console.log(`Server is running on port: localhost:${port}`);
})