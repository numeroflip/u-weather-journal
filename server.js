const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
const fs = require('fs');
// BaseUrl


// GET /locations/v1/postalcodes/search?apikey=WJDCsvHiNT5AMwGVS9IvROBmTOYJUjnM&q=9400 HTTP/1.1





// Create endpoint
let projectData;
readFile();

function addToData(data) {
    projectData.entries.push(data);
};

function writeFile(file = './data.json') {
    fs.writeFileSync(file, JSON.stringify(projectData) ,'utf8')
};   

function readFile(file = './data.json') {
    projectData = JSON.parse(fs.readFileSync(file, 'utf8'))
};

if (!fs.readFileSync('./data.json', 'utf8')) {
    projectData = {entries: [], pages: 1};
    writeFile();
};

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// Initalize the server files
app.use(express.static('website'));
// Start the server
app.listen(port, () => console.log(`server is running on port ${port}`));
// GET route
app.get('/get-data', (req, res) => {
    console.log('GET requested')
    res.send(JSON.stringify(projectData));
});
console.log('GET route is set');
// POST route
app.post('/addEntry', handlePOST);
console.log('POST route is set');


async function handlePOST(req, res) {
    console.log('POST happened');
    let postedData = req.body;    
    addToData(req.body);
    writeFile();
    readFile();
}

