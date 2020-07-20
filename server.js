const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;
const fs = require('fs');

// Create endpoint
let appData;


const moreData = {
    date: 'added data',
    name: 'data is added',
    content: 'I LOVE YOU'
};


const addToData  = (data) => {
    appData.push(data);
};

const writeFile = () => {
    fs.writeFileSync('./data.json', JSON.stringify(appData) ,'utf8')
};

const readFile = () => {
    appData = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
};

if (!fs.readFileSync('./data.json', 'utf8')) {
    appData = [];
    writeFile();
};

readFile();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

// BaseUrl
// const baseUrl =
// API Key
const key = 'WJDCsvHiNT5AMwGVS9IvROBmTOYJUjnM';

// Initalize the server files
app.use(express.static('website'));

// Start the server
app.listen(port, () => console.log(`server is running on port ${port}`));

// GET route
app.get('/all', (req, res) => {
    res.send(appData);
});
console.log('GET route is set');

// POST route
app.post('/addEntry', addAndUpdateData);
console.log('POST route is set');



function addAndUpdateData(req, res) {
    console.log('POST happened');
    addToData(req.body);
    writeFile();
    readFile()
    res.send(appData);
    console.log(appData)
}
