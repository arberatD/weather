import express from 'express';
import hbs from 'hbs';
import path from 'path';
import { fileURLToPath } from 'url';
import weatherData from '../utils/weatherData.mjs';

// Notwendige Module für den Server importieren

// var users = [
//     {
//         username : 
//     }
// ]


// Initialisiere die Express-Anwendung
const app = express();
const port = 3000;

// Workaround, um den Verzeichnisnamen in ES6-Modulen zu erhalten, da __dirname nicht direkt verfügbar ist.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Verzeichnis festlegen, aus dem statische Dateien bereitgestellt werden
const publicStaticDirPath = path.join(__dirname, '../public');
// Pfade für die Ansichten (views) und Teile (partials) von Handlebars festlegen
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, '../templates/partials');

// Handlebars als Vorlagen-Engine für Express einrichten und die Verzeichnisse für Ansichten und Teile festlegen
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
// Verwende Express-Middleware, um statische Dateien bereitzustellen
app.use(express.static(publicStaticDirPath));

// Route-Handler für die Hauptseite definieren
app.get('/', (req, res) => {
    res.render('index', {
        title: "Wetter App"
    });
});

// Route-Handler für den /weather Pfad definieren
app.get('/weather', (req, res) => {
    const address = req.query.address;
    if (!address) {
        // Wenn kein Adress-Parameter angegeben wurde, sende eine Fehlerantwort
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

// Route-Handler für nicht definierte Pfade (404-Fehlerseite) definieren
app.get("*", (req, res) => {
    res.render('404', {
        title: "Seite nicht gefunden"
    })
})

// Den Server auf dem angegebenen Port starten und eine Nachricht in der Konsole anzeigen
app.listen(port, () => {
    console.log(`Server läuft auf dem Port: localhost:${port}`);
});
