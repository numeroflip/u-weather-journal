

const nameField = document.getElementById('name');
const locationField = document.getElementById('location');
const textareaField = document.getElementById('textarea-main');
const titleField = document.getElementById('title-input');
const submitBtn = document.getElementById('submit-btn');
const entriesWrapper = document.getElementById('entries-wrapper');

class Entry {
  constructor({author = "Unknown", title, body }) {
      this.author = author;
      this.title = title;
      this.body = body;
      this.date = new Date;
  }
}

const getEntryHTML = ({author, title, date, body}) => {
  const entryHTML = `
      <article class="card-panel row">
          <figure class="col s2 figure">
              <img src="#" alt="weather-image">
          </figure>
          <div class="separator col s9">
              <h3 class="article-title">${title}</h3>
              <p class="article-author">${author}</p>
              <p class="article-date grey-text text-darken-2">${date.getYear()} - ${date.getMonth()} - ${date.getDay()}</p>
          </div>
          <p class="article-body col s12">${body}</p>
      </article>
  `
  return entryHTML;
}



const postData = async ( url = '', data = {}) => {
  console.info('Data is starting to POST...')
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
    // entriesWrapper.insertAdjacentHTML('afterbegin', getEntryHTML(newData))

    
  } catch(error) {
    console.log("error", error);
    console.log("SHIT! SOMETHING IS WRONG WITH POST REQUEST");
  }
};


  // const getData = async ( url = '') => {
  //   console.info('Data is starting to GET...')

  //     try {
  //       const response = await fetch(url);
  //       const newData = await response.json();
  //       console.log(newData);
  //     } catch(error) {
  //       console.log("error", error);
  //       console.log("SHIT! SOMETHING IS WRONG WITH GET REQUEST");
  //     }
  // };

  // .then((data) => getData('/all'))

submitBtn.addEventListener('click', handleSubmit)

// TODO: on Submit, update the DOM, adding an entry

function handleSubmit(e) {

  e.preventDefault();

  const data = {
    title: titleField.value,
    author: nameField.value,
    location: locationField.value,
    body: textareaField.value,
  }
  const entryData = new Entry(data);

  postData('/addEntry', entryData);
  entriesWrapper.insertAdjacentHTML('afterbegin', getEntryHTML(entryData))
  // test
  console.log('Button submitted');


};

locationField.addEventListener('change', handleLocationField);

//  TODO: connect to the API, and get location completition
async function handleLocationField() {
  const resultArr = await fetch()
}

