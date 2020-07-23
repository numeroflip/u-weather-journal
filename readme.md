# Weather Journal

## What is it?

A quite simple app. You type in your name, zip code, and how do you feel, and it will make it into a Journal entry. When you type in the zip code, a dropdown will appear, showing the possible matches with the city and country name. In your entry you will see the current weather and temperature in celsius too. It uses a .json database, so your entry is persistent, and you can even see what others wrote lately.

It is my first project, tinkering around with server side Javascript. The server starts, sets up the routes, reads in the .json data. On Heroku I am not allowed to write files, so I had to change it to use PostgreSQL.


## Technologies used
* HTML
* CSS, SASS, MaterializeCSS
* JavaScript
* Node.js and Express as a server 
* JSON as a "database"
* AccuWeather API

## How does it work?

### Server side:
* Server starts.
* Sets up routes.
* Reads in .json data.
* If it gets a POST request:
* * Updates the project data.
* * Writes it into the .json file.
* * Reads the .json file to update the project data.

### Client side: 

* Request for the entries from the server.
* Render the page based on the given data.
* Creates the class: Entry (to contain all the data of a journal entry).
* If at least 4 number is typed into the Zip code field, it sends a query to the API.
* Opens a dropdown with the matching locations based on the API response.
* After you submit: 
* * It creates a new Entry with the data.
* * It processes the location info, and finds the proper location key.
* * It sends a weather information query to the API.
* * Updates the Entry data.
* * Sends a POST request to the server, and updates the DOM with the new entry.

## But... Why?
I started learning web development a while ago, followed a bunch of tutorials, but never felt confident enough with my skills. Now I enrolled for the free month of Udacity's [Front End nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd0011), to check it out. 

To practice, I made this site from scratch. The new things were for me the Node.js part and the database. Besides It is my first time trying out a CSS framework. It is kinda nice, a bit faster to create a site, but a lot less control, and a bunch of tinkering with it... It was fun, I have learned a lot. 


