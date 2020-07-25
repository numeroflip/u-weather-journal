const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Environmental variables
const dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
const fs = require('fs');

// Connect to PostgreSQL database
const { Pool } = require('pg');
const pool = new Pool({
    "max": 10,
    "connectionTimeoutMillis" : 0,
    "idleTimeoutMillis" : 0
});


async function addEntryToDb(data) {
    try {
        const query = `
        INSERT INTO 
        entries (
            author,
            city,
            post_content, 
            country, 
            posting_date, 
            weather_code, 
            weather_description, 
            temp_cels
        ) VALUES ( 
             '${data.author}', 
             '${data.city}', 
             '${data.post_content}', 
             '${data.country}', 
             '${new Date(data.posting_date).toISOString()}', 
             ${data.weather_code}, 
             '${data.weather_description}', 
             ${data.temp_cels});
        `
        await pool.query(query)
    } catch(err) {console.log(err)};
};
//'${new Date().toISOString().split("T")[0]}',
// Create endpoint
let projectData;

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// Initalize the server files
app.use(express.static('website'));
// Start the server
app.listen(port, () => console.log(`server is running on port ${port}`));


async function getData() {
    try {
        let response = await pool.query('SELECT * FROM entries;');
        response = response.rows;
        return response;
        
    } catch(err) {console.log(err)}
}
getData();

// GET route
app.get('/get-database', async (req, res) => {
    try {
        let data = await getData()
        res.send(JSON.stringify(data))

    } catch(err) {console.log(err)}
});

// POST route
app.post('/addEntry', handlePOST);

async function handlePOST(req, res) {
    let postedData = req.body;
    await addEntryToDb(postedData);
    let response = await getData();
    res.send(JSON.stringify(response))
}

let testEntry = {
    author: 'GÁBOR',
    post_content: 'I wish I were Spongebob',
    city: 'I love cities',
    country: 'Slovenia',
    posting_date: new Date(),
    weather_code: '12',
    weather_description: 'SUNNY',
    temp_cels: '23'
}

function test() {
    addEntryToDb(testEntry);
}

// test();

