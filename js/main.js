function getSongs() {
  return new Promise((resolve, reject) => {
  //  get songs from aws url
  });
}

function displayError(error) {
  if (error) {
    document.querySelector('div#songs').setAttribute('class', 'hidden');
    document.querySelector('div#error').removeAttribute('class');
    let errorDiv = document.querySelector('div#error p');
    errorDiv.innerHTML = error;
  }
}

function displaySongs(songs) {
  if (songs) {
  //  display songs in html
  }
}

window.onload = (function () {
//  get json from aws
  getSongs().then(displaySongs)
    .catch(displayError);

//  insert songs from json to html
});
