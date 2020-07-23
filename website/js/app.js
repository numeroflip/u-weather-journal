// ***********************VARIABLES****************************
//  Declare DOM variables
const nameField = document.getElementById('name');
const locationField = document.getElementById('zip');
const textareaField = document.getElementById('feelings');
const submitBtn = document.getElementById('generate');
const entriesHeader = document.getElementById('entries-header');

// API and data related variables
let pageData, possibleLocations;
const corsPrepend = 'https://cors-anywhere.herokuapp.com/';
const apiData = {
  baseUrls: {
      zip: 'http://dataservice.accuweather.com/locations/v1/postalcodes/search',
      location: 'http://dataservice.accuweather.com/locations/v1/cities/search',
      currentWeather: 'http://dataservice.accuweather.com/currentconditions/v1/'
  },
  key: 'WJDCsvHiNT5AMwGVS9IvROBmTOYJUjnM'
};

// create a materializecss dropdown instance, for locatin autocomplete
const elem = document.querySelector('.autocomplete');
const instance = M.Autocomplete.init(elem);

// Entry class - this completely describes a journal entry's data
class Entry {
  constructor({author = "Unknown", body, location = {zip: undefined, city: undefined, country: undefined}, weather = undefined }) {
      this.author = author;
      this.body = body;
      // date
      this.date = {};
      this.date.date = new Date;
      this.date.year = this.date.date.getFullYear();
      this.date.month = this.formatDate(this.date.date.getMonth());
      this.date.day = this.formatDate(this.date.date.getDay());
      // location
      this.location = location;
      this.weather = weather;
  };

  formatDate(num)  {
    if (num < 10) {
      num = '0' + num;
    }
    return num;
  };
};



// **************************************************************************
// ------------------------------FUNCTIONS-----------------------------------
// **************************************************************************

// ---------------------HTML and DOM related---------------

const getEntryHTML = ({author, date, body, location, weather}) => {
  formatedDate = `${date.year}-${date.month}-${date.day}`
  const entryHTML = `
      <article class=" card-panel article-card">
          <figure class=" figure  weather-figure">
              <img class="weather-image" src="./assets/weather_icons/${weather.icon}.png" alt="${weather.description}">
              <figcaption class="weather-figcaption">${weather.tempCels} C° </figcaption>
          </figure>
          <div class="article-text-wrapper ">
              <h3 class="article-title">${formatedDate}</h3>
              <div class="article-meta-wrapper">
                <p class="article-author blue white-text card">${author}</p>
                <p class="article-date grey-text text-darken-2">
                <i class="tiny material-icons loc-icon">location_on</i>
                  ${location.city} - ${location.country}
                </p>
              </div>
              <p class="article-body">${body}</p>
          </div>
      </article>
  `
  return entryHTML;
};

function insertEntryHTML(entryData) {
  entriesHeader.insertAdjacentHTML('afterend', getEntryHTML(entryData))
};



function renderPageEntries(entries) {
  console.log(entries)
  entries.forEach((entry) => {
    insertEntryHTML(entry)
  })
};



//----------------------__DEALING WITH DATA___---------------------- 
// Fetching
const getPageData = async (url = '/') => {
  try {
    console.info('Getting page data...')
    let data = await fetch (url);
    data = await data.json();

    return data.entries;
  } catch(err) {console.log(err)}
};

async function getLocations(zip) {
  const url = corsPrepend + apiData.baseUrls.zip + '?apikey=' + apiData.key + '&q=' + zip;
  try {
    const response = await fetch(url);
    let data = await response.json();
    console.log(data);
    return data;
  }  catch(err) {console.log(err)};
};

async function getWeather(locationKey) {
  console.log('getWeatherFired');
  const url = corsPrepend + apiData.baseUrls.currentWeather + locationKey + '?apikey=' + apiData.key;
  try {
    let response = await fetch(url).then((resolve) => resolve.json());
    response = response[0];

    const weatherData = {
      description: response.WeatherText,
      icon: response.WeatherIcon,
      iconUrl: `./assets/weather_icons/${this.icon}.png`,
      tempCels: response.Temperature.Metric.Value
    }
    return weatherData;
  } catch(err) {console.log(err)}
};

//Processing 
function processLocations(locObjects) {
  const formattedLocationArray = [];

  locObjects.forEach((locObj) => {
    const formattedLocation = {
      zip: locObj.PrimaryPostalCode,
      city: locObj.EnglishName,
      country: locObj.Country.EnglishName,
      locationKey: locObj.Key
    }
    formattedLocationArray.push(formattedLocation);
  });
  return formattedLocationArray;
};

// ***************-POST DATA; SUBMIT BTN*******************
const postData = async ( url = '', data = {}) => {
  try {
    const response = await fetch(url, {
      method: 'POST', 
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const newData = await response.json();

  } catch(err) {console.log(err)};
};

async function handleSubmit(e) {

  e.preventDefault();
  const city = locationField.value.split(" ")[1];
  console.log(city);
  const index = possibleLocations.map((location) => location.city).indexOf(city);
  console.log(index);

  const data = {
    author: nameField.value,
    body: textareaField.value,
    location: possibleLocations[index]
  };

  console.log ("submitted and data is defined");
  const entryData = new Entry(data);
  console.log(entryData);

  try {
    entryData.weather = await getWeather(entryData.location.locationKey)
    postData('/addEntry', entryData);
    insertEntryHTML(entryData);

  } catch(err) {console.log(err)}
};

// ******************_DROPDOWN (Location autocomplete) **************************
function addToDropDown(locations) {
  let data = {}
  locations.forEach((location) => {
    const key = `${location.zip} ${location.city} ${location.country}`;
    data[key] = null 
  })
  instance.updateData(data)
};

async function handleLocationDropdown(e) {
  const value = e.target.value;
  console.log('Location change handling fired')
  instance.updateData({});
  if(isNaN(value.slice(0, 4))) {e.target.classList.add('invalid')}
  else {e.target.classList.remove('invalid');};

  if(value.length >= 4 && !isNaN(value)) {

    try {
      let locations = await getLocations(value);
      possibleLocations = processLocations(locations);
      addToDropDown(possibleLocations);
      instance.open();
    } catch(err) {console.log(err)};
  };
};

// ******************__MAIN FUNCTION__*********************
async function init() {

  locationField.addEventListener('keyup', handleLocationDropdown);
  submitBtn.addEventListener('click', handleSubmit);
  try {
    getPageData('/get-data').then((entries) => {if(entries) {renderPageEntries(entries)}}); 
  } catch(err) {console.log(err)};
};

init();
