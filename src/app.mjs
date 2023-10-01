import express from 'express';
import hbs from 'hbs';
import path from 'path';
import { fileURLToPath } from 'url';
import weatherData from '../utils/weatherData.mjs';
import fs from 'fs/promises';


const app = express();
const port = 3000;

// Setzt __dirname für ES6-Module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Angabe des Ordners, der die static files beinhaltet
const publicStaticDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, '../templates/partials');

//middleware um json zu verarbeiten
app.use(express.json());
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicStaticDirPath));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});


// app.get('/', (req, res) => {
//     res.render('index', {
//         title: "Wetter App"
//     });
// });


// app.get('/', (req, res) => {
//     if (req.session.username) {
//         res.render('index', { title: 'Wetter App', username: req.session.username });
//     } else {
//         res.redirect('/login');
//     }
// });




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


// login route
app.post('/login', async (req, res) => {
   const { username, password } = req.body;
   try {
       const users = JSON.parse(await fs.readFile('users.json', 'utf-8'));
       const user = users.find(u => u.username === username && u.password === password);
       if (user) {
           res.redirect('/');
       } else {
           res.status(401).send({ error: "Ungültiger Benutzername oder Passwort" });
       }
   } catch (error) {
       res.status(500).send({ error: "Ein Fehler ist aufgetreten" });
   }
});


// registrierung route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const users = JSON.parse(await fs.readFile('users.json', 'utf-8'));
        if (users.find(u => u.username === username)) {
            return res.status(400).send({ error: "Benutzername bereits vergeben" });
        }
        users.push({ username, password, favorisierteStaedte: [] });
        await fs.writeFile('users.json', JSON.stringify(users));
        res.redirect('/');
    } catch (error) {
        res.status(500).send({ error: "Ein Fehler ist aufgetreten" });
    }
 });
 

 // JavaScript-Funktionen für Login und Registrierung
 function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        
        } else if (data.error) {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Ein Fehler ist aufgetreten:', error);
    });
}

function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else if (data.error) {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Ein Fehler ist aufgetreten:', error);
    });
}