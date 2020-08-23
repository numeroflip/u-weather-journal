// ***********************VARIABLES****************************
//  Declare DOM variables
const nameField = document.getElementById('name');
const locationField = document.getElementById('zip');
const textareaField = document.getElementById('feelings');
const submitBtn = document.getElementById('generate');
const entriesHeader = document.getElementById('entries-header');
const locationHelper = document.getElementById('location-helper')
const formWrapper = document.getElementById('main-form')

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
const zipRegExp = /\d{4,8}\s\/\s.+\s\/\s.+/;
const validZipRegExp = /\d{4,8}/


// **************************************************************************
// ------------------------------FUNCTIONS-----------------------------------
// **************************************************************************

// **********************-VALIDATIONS-********
// Validate Zip Code (See if the user selected a valid value from the dropdown)
function validateString(str, regExp) {
  return regExp.test(str);
}

function areInputsValid () {
  let ans = false;
  if (zipRegExp.test(locationField.value) && nameField.value.length > 0 && textareaField.value.length > 0) {
    ans = true
  }
  return ans;
}

function validateLocationInput(element) {
  const value = String(element.value);

  locationHelper.dataset.error = validZipRegExp.test(value)
    ? "Please select your location from the dropdown menu"
    : "Please provide a valid zip code"

  if (validateString(value, zipRegExp)) {
    element.classList.remove('invalid')
    element.classList.add('valid')
  } else {
    element.classList.remove('valid')
    element.classList.add('invalid')
  }


}




function clearFields(fieldsArr) {
  fieldsArr.forEach(field => field.value = "");
}

// ---------------------HTML and DOM related---------------
const getEntryHTML = ({
  author, 
  posting_date, 
  post_content, 
  city,
  country, 
  weather_code, 
  weather_description,
  temp_cels
  }) => {
  const formatedDat = posting_date.split("T")[0];
  
  // The HTML of a post entry
  const entryHTML = `
      <article class=" card-panel article-card">
          <figure class=" figure  weather-figure">
              <img class="weather-image" src="./assets/weather_icons/${weather_code}.png" alt="${weather_description}">
              <figcaption class="weather-figcaption">${temp_cels} C° </figcaption>
          </figure>
          <div class="article-text-wrapper ">
              <h3 class="article-title">${author}</h3>
              <div class="article-meta-wrapper">
                <p class="article-author blue white-text card">${formatedDat}</p>
                <p class="article-date grey-text text-darken-2">
                <i class="tiny material-icons loc-icon">location_on</i>
                  ${city} - ${country}
                </p>
              </div>
              <p class="article-body">${post_content}</p>
          </div>
      </article>
  `
  return entryHTML;
};

function insertEntryHTML(entryData) {
  entriesHeader.insertAdjacentHTML('afterend', getEntryHTML(entryData))
};

function renderPageEntries(entries) {
  entries.forEach((entry) => {
    insertEntryHTML(entry)
  })
};

//----------------------__DEALING WITH DATA___---------------------- 
// Fetching
const getPageData = async (url = '/') => {
  try {
    let data = await fetch (url);
    data = await data.json();
    return data;
  } catch(err) {console.log(err)}
};

async function getLocations(zip) {
  const url = corsPrepend + apiData.baseUrls.zip + '?apikey=' + apiData.key + '&q=' + zip;
  try {
    const response = await fetch(url);
    let data = await response.json();
    return data;
  }  catch(err) {console.log(err)};
};

async function getWeather(locationKey) {
  const url = corsPrepend + apiData.baseUrls.currentWeather + locationKey + '?apikey=' + apiData.key;
  try {
    let response = await fetch(url).then((resolve) => resolve.json());
    response = response[0];

    const weatherData = {
      description: response.WeatherText,
      icon: response.WeatherIcon,
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
    let response = await fetch(url, {
      method: 'POST', 
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    response = await response.json();
  } catch(err) {console.log(err)};
};

async function handleSubmit(e) {


  e.preventDefault();

  if (
    areInputsValid()
    ) {
    // Problem: there are many cities under the same zip code, but we need a specific location key...
    // get back the selected city from the input field
    const city = locationField.value.split(" / ")[1];
    const index = possibleLocations.map((location) => location.city).indexOf(city);
    const location = possibleLocations[index];
    // Find the location key from the array of zip code matching locations based on the city name.
    const key = location.locationKey;
  
    try {
      const weather = await getWeather(key)
      const entryData = {
        author: nameField.value,
        post_content: textareaField.value,
        city: location.city,
        country: location.country,
        posting_date: new Date().toISOString(),
        weather_code: weather.icon,
        weather_description: weather.description,
        temp_cels: weather.tempCels,
      };
      postData('/addEntry', entryData);
      insertEntryHTML(entryData);
  
    } catch(err) {console.log(err)}

  } 
};

function handleBtnState() {
  console.log('HandleBtnState')
  if (areInputsValid()) {
    console.log ('inputs are valid')
    submitBtn.disabled = false
  } else { console.log('inputs are invalid') ; submitBtn.disabled = true}
}

// *********_DROPDOWN (Location autocomplete) *************
function addToDropDown(locations) {
  let data = {}
  locations.forEach((location) => {
    const key = `${location.zip} / ${location.city} / ${location.country}`;
    data[key] = null 
  })
  instance.updateData(data)
};

async function handleLocationDropdown(e) {
  const value = e.target.value;
  
  // check for zip code entry is valid(number)
  
  //Only fetch if there is at least 4 number
  if(value.length >= 4 && !isNaN(value)) {
    try {
      let key = String(`${value} Loading... Please wait.`)
      const obj = {};
      obj[key] = null;
      instance.updateData(obj)
      let locations = await getLocations(value);
      possibleLocations = processLocations(locations);
      addToDropDown(possibleLocations);
      instance.open();
    } catch(err) {console.log(err)};
  };
};


// ******************__MAIN FUNCTION__*********************
async function init() {
  handleBtnState()
  clearFields([locationField, nameField, textareaField])
  formWrapper.onchange = handleBtnState
  formWrapper.onkeyup = handleBtnState
  locationField.oninput = handleLocationDropdown;
  locationField.onchange = (e) => validateLocationInput(e.target);
  submitBtn.addEventListener('click', handleSubmit);

  try {
    const entries = await getPageData('/get-database')
    if (entries) {renderPageEntries(entries)}
  } catch(err) {console.log(err)};
};

init();
