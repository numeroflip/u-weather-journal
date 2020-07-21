const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;
const fs = require('fs');
const classes = require('./server_modules/classes.js')



// Create endpoint
let appData, appDataChopped;
readFile();

function addToData(data) {appData.push(data);};
function writeFile(file = './data.json') {fs.writeFileSync(file, JSON.stringify(appData) ,'utf8')};    
function readFile(file = './data.json') {appData = JSON.parse(fs.readFileSync(file, 'utf8'))};
function chopData(len = 5, dataset = appData) {
    let choppedData = [[]];
    dataset.map((data, i) => {
        console.log(data.length - 1);
        if (i % len == 0) {choppedData.push([])}
        choppedData[data.length - 1].push(data)
        
    });
    console.log('THIS IS CHOPPEDDATA')
    console.log(choppedData[0])
}

chopData();

if (!fs.readFileSync('./data.json', 'utf8')) {
    appData = [];
    writeFile();
};



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
    readFile();
    res.send(appData);
    console.log(appData);

}
