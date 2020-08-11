const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const prepareObjForSQL = require('./server_functions');
const app = express();

// Environmental variables
const dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

// Connect to PostgreSQL database
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});


async function addEntryToDb(data) {

    const processedData = prepareObjForSQL(data);
    const keys = Object.keys(processedData);
    const values = Object.values(processedData)
        .map(value => typeof value === 'string' ? `'${value}'` : value);

    try {
        const query = `INSERT INTO 
        entries ( ${keys.join(',')})
        VALUES ( ${values.join(',')});
        `
        await pool.query(query)
    } catch(err) {console.log(err)};
};

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
    try {
        let postedData = req.body;
        await addEntryToDb(postedData);
    } catch(err) {console.log(err)}
}


