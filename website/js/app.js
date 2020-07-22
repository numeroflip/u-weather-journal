//  Declare variables
const nameField = document.getElementById('name');
const locationField = document.getElementById('zip');
const textareaField = document.getElementById('feelings');
const titleField = document.getElementById('title-input');
const submitBtn = document.getElementById('generate');
const entriesHeader = document.getElementById('entries-header');
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

// Dropdown
const elem = document.querySelector('.autocomplete');
const instance = M.Autocomplete.init(elem);

class Entry {
  constructor({author = "Unknown", title, body, location = {zip: undefined, city: undefined, country: undefined}, weather = undefined }) {
      this.author = author;
      this.title = title;
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


async function getLocations(zip) {
  console.log('location requested');
  const url = corsPrepend + apiData.baseUrls.zip + '?apikey=' + apiData.key + '&q=' + zip
  const response = await fetch(url);
  let data = await response.json();
  console.log(data);
  return data;
};

async function getWeather(locationKey) {
  console.log('getWeatherFired');
  const url = corsPrepend + apiData.baseUrls.currentWeather + locationKey + '?apikey=' + apiData.key
  let response = await fetch(url).then((resolve) => resolve.json());
  response = response[0];
  const weatherData = {
    description: response.WeatherText,
    icon: response.WeatherIcon,
    iconUrl: `../assets/weather_icons/${this.icon}.png`,
    tempCels: response.Temperature.Metric.Value
  }
  console.log(weatherData);
  return weatherData;
};
// getWeather("497505_PC");

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
    let locations = await getLocations(value);
    possibleLocations = processLocations(locations);
    addToDropDown(possibleLocations);
    instance.open();
  }
};





const getEntryHTML = ({author, date, body, location, weather}) => {
  formatedDate = `${date.year}-${date.month}-${date.day}`
  const entryHTML = `
      <article class=" card-panel row">
          <figure class="col s2 figure">
              <img src="${weather.iconUrl}" alt="${weather.description}">
          </figure>
          <div class="separator col s9">
              <h3 class="article-title">${formatedDate}</h3>
              <p class="article-author">${author}</p>
              <p class="article-date grey-text text-darken-2">
              ${location.city} ${location.country}
              </p>
              <p class="article-body">${body}</p>
          </div>
      </article>
  `
  // ${location.city} - ${location.country}
  return entryHTML;
};

function insertEntryHTML(entryData) {
  entriesHeader.insertAdjacentHTML('afterend', getEntryHTML(entryData))
};

const getPageData = async (url = '/') => {
  try {
    console.info('Getting page data...')
    let data = await fetch (url);
    data = await data.json();

    return data.entries;
  } catch(err) {
    console.log(err)
  }
};

function renderPageEntries(entries) {
  console.log(entries)
  entries.forEach((entry) => {
    insertEntryHTML(entry)
  })
};

const postData = async ( url = '', data = {}) => {
  console.info('Data is starting to POST...')
  console.log(data)
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
    console.log(newData)

  } catch(error) {
    console.log("error", error);
    console.log("SHIT! SOMETHING IS WRONG WITH POST REQUEST");
  }
};


async function handleSubmit(e) {
  e.preventDefault();
  const city = locationField.value.split(" ")[1];
  console.log(city);
  const index = possibleLocations.map((location) => location.city).indexOf(city);
  console.log(index);

  const data = {
    title: titleField.value,
    author: nameField.value,
    // zip: locationField.value,
    body: textareaField.value,
    location: possibleLocations[index]
  }
  console.log ("submitted and data is defined");
  const entryData = new Entry(data);
  console.log(entryData);
  entryData.weather = await getWeather(entryData.location.locationKey)
  postData('/addEntry', entryData);
  // getPageData('/getData').then((entries) => {if(entries) {renderPageEntries(entries)}});
  insertEntryHTML(entryData);

};

async function init() {
  
  locationField.addEventListener('keyup', handleLocationDropdown);
  submitBtn.addEventListener('click', handleSubmit);
  getPageData('/get-data').then((entries) => {if(entries) {renderPageEntries(entries)}});

}

init();
