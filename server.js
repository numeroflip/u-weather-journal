const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

// BaseUrl
// const baseUrl =
// API Key
const key = 'WJDCsvHiNT5AMwGVS9IvROBmTOYJUjnM';

// Use the website folder to serve files
app.use(express.static(path.join(__dirname, 'website')))

app.listen(port, () => console.log(`Servvvverer is running on port ${port}`));
