function getSongs() {
  return new Promise( (resolve, reject) => {
    let url = 'https://s3.us-west-1.amazonaws.com/coding-exercise/songs';
    fetch(url).then(async response => {
      if (!response.ok) reject(`There was a problem fetching data from url ${url}`);
      resolve(await response.json())
      // resolve(null);
    }).catch(reject);
  });
}

function displayError(error) {
  if (error) {
    document.querySelector('div#songs').classList.add('hidden');
    document.querySelector('div#error').classList.remove('hidden');
    let error_div = document.querySelector('div#error p');
    error_div.innerHTML = 'ERROR: \n' + error;
  }
}

function activateFilterButtons() {
// activate filter buttons
//  TODO:
  document.querySelector('nav#filters').classList.remove('hidden');
}

function arrayIntersection(a, b) {
  // source: https://stackoverflow.com/a/16227294
  let temp;
  if (b.length > a.length) temp = b, b = a, a = temp; // indexOf to loop over shorter
  return a.filter(function (e) {
    return b.indexOf(e) > -1;
  });
}

function displaySongs(songs) {
  if (songs) {
    console.log(songs);

  //  find common keys in list of jsons
    let common_keys = songs.reduce(
      (accumulator, value) => arrayIntersection(accumulator, Object.keys(value)),
      Object.keys(songs[0])
    );

    // none of json have common keys among them
    // hard to tell what attributes of songs to display
    if (common_keys.length < 1) return;

    let table_for_songs = document.createElement('table');

  //  add common keys as header to the table that displays songs
    let songs_table_header = document.createElement('tr');
    for (let key of common_keys) {
      let key_tag = document.createElement('th');
      key_tag.innerText = key;
      songs_table_header.appendChild(key_tag);
    }

    table_for_songs.appendChild(songs_table_header);

    for (let song of songs) {
      let song_row_tag = document.createElement('tr');

      for (let key of common_keys) {
        let song_attribute = document.createElement('td');
        song_attribute.innerText = song[key];
        song_row_tag.appendChild(song_attribute)
      }

      table_for_songs.appendChild(song_row_tag);
    }

  //  display songs in html
    let destination = document.querySelector('div#songs');
    destination.innerHTML = '';
    destination.appendChild(table_for_songs);

    activateFilterButtons()
  }
}

window.onload = (function () {
  getSongs().then(displaySongs)
    .catch(displayError);
});
