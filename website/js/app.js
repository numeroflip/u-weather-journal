

const nameField = document.getElementById('name');
const locationField = document.getElementById('location');
const textareaField = document.getElementById('textarea-main');
const titleField = document.getElementById('title-input');
const submitBtn = document.getElementById('submit-btn')

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
    console.log(newData);
    
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

  const entryData = {
    title: titleField.value,
    author: nameField.value,
    location: locationField.value,
    body: textareaField.value,
    date: new Date
  }

  postData('/addEntry', entryData);

};

locationField.addEventListener('change', handleLocationField);

//  TODO: connect to the API, and get location completition
async function handleLocationField() {
  const resultArr = await fetch()
}