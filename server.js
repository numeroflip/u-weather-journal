const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
const fs = require('fs');

// Create endpoint
let projectData;
readFile();

// In case data.json is empty, give default values
if (!fs.readFileSync('./data.json', 'utf8')) {
    projectData = {entries: [], pages: 1};
    writeFile();
};

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// HELPER FUNCTIONS------------------
function addToData(data) {
    projectData.entries.push(data);
};

function writeFile(file = './data.json') {
    fs.writeFileSync(file, JSON.stringify(projectData) ,'utf8')
};   

function readFile(file = './data.json') {
    projectData = JSON.parse(fs.readFileSync(file, 'utf8'))
};

// Initalize the server files
app.use(express.static('website'));
// Start the server
app.listen(port, () => console.log(`server is running on port ${port}`));
// GET route
app.get('/get-data', (req, res) => {
    res.send(JSON.stringify(projectData));
});
// POST route
app.post('/addEntry', handlePOST);

async function handlePOST(req, res) {
    try {
        addToData(req.body);
        writeFile();
        readFile();
    } catch(err) {console.log(err)}
}

