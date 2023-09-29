import express from 'express';
import hbs from 'hbs';
import path from 'path';
import { fileURLToPath } from 'url';
import weatherData from '../utils/weatherData.mjs';


// var users = [
//     {
//         username : 
//     }
// ]
















const app = express();
const port = 3000;

// Setzt __dirname für ES6-Module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Angabe des Ordners, der die static files beinhaltet
const publicStaticDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicStaticDirPath));

app.get('/', (req, res) => {
    res.render('index', {
        title: "Wetter App"
    });
});

app.get('/weather', (req, res) => {
    const address = req.query.address;
    if (!address) {
        return res.send({
            error: "Bitte gebe bei der Suchleiste eine Stadt ein, sonst geht es nicht weiter"
        })
    }
    weatherData(address, (error, {temperature, windSpeed, description, cityName} = {}) => {
        if (error) {
            return res.send({ error });
        }
        console.log(temperature, windSpeed, description, cityName);
        res.send({
            temperature,
            windSpeed,
            description,
            cityName,
                    });
    });
});

app.get("*", (req, res) => {
    res.render('404', {
        title: "page not found"
    })
})

app.listen(port, () => {
    console.log(`Server is running on port: localhost:${port}`);
});
