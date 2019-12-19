/**
 * Fetches songs from url
 * @returns {Promise<JSON[]|string>} Returns list of songs on success or error message on failure
 */
function getSongs() {
  return new Promise( (resolve, reject) => {
    let url = 'https://s3.us-west-1.amazonaws.com/coding-exercise/songs';
    fetch(url).then(async response => {
      if (!response.ok) reject(`There was a problem fetching data from url ${url}`);
      resolve(await response.json())
    }).catch(reject);
  });
}

/**
 * Clears songs and display error message
 * @param {string} error - error message
 */
function displayError(error) {
  if (error) {
    document.querySelector('div#songs').classList.add('hidden');
    document.querySelector('div#error').classList.remove('hidden');
    let error_div = document.querySelector('div#error p');
    error_div.innerHTML = 'ERROR: \n' + error;
  }
}

function sortBy(prop) {
  // source: https://www.c-sharpcorner.com/UploadFile/fc34aa/sort-json-object-array-based-on-a-key-attribute-in-javascrip/
  return function(a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  }
}


/**
 * creates filter buttons
 * @param {Array.<JSON>} songs - songs to apply filter to. Should be consistent with the headers in the songs table
 * @param {Array.<string>} filter_keys - types of filter to apply to songs
 */
function activateFilterButtons(songs, filter_keys) {
  let nav = document.querySelector('nav#filters');
  nav.classList.remove('hidden');

  let table_for_songs = document.querySelector('div#songs table');
  let table_headers = table_for_songs.childNodes[0];

  for (let key of filter_keys) {
  //  create button
    let button_for_key_filter = document.createElement('button');
    button_for_key_filter.setAttribute('id', `sort_by_${key}`);
    button_for_key_filter.innerText = key;

  //  add listener to button
    button_for_key_filter.addEventListener('click', ev => {
      songs.sort(sortBy(key));
      let song_rows = createTableRows(songs, filter_keys);
      // remove all rows except header row in table
      table_for_songs.innerHTML = '';
      table_for_songs.appendChild(table_headers);
      song_rows.forEach(row => table_for_songs.appendChild(row));
    });

  //  add button to nav
    nav.appendChild(button_for_key_filter);
  }
}

function arrayIntersection(a, b) {
  // source: https://stackoverflow.com/a/16227294
  let temp;
  if (b.length > a.length) temp = b, b = a, a = temp; // indexOf to loop over shorter
  return a.filter(function (e) {
    return b.indexOf(e) > -1;
  });
}

/**
 * create table row tags
 * @param {Array.<JSON>} rows - array of values to display in each row
 * @param {Array.<string>} headers - keys for each block on each row
 * @returns {HTMLTableRowElement[]}
 */
function createTableRows(rows, headers) {
  if (!rows || !headers) {
    return []
  }

  return rows.map(row => {
    let row_tag = document.createElement('tr');

    for (let key of headers) {
      let row_attribute = document.createElement('td');
      row_attribute.innerText = row[key];
      row_tag.appendChild(row_attribute)
    }

    return row_tag
  });
}

/**
 * create and append table tag for songs provided
 * @param {Array.<JSON>} songs - array of songs to display
 */
function displaySongs(songs) {
  if (songs) {
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

  //  add each song as a row in table that displays songs
    let song_rows = createTableRows(songs, common_keys);
    song_rows.forEach(row => table_for_songs.appendChild(row));

  //  display songs in html
    let destination = document.querySelector('div#songs');
    destination.innerHTML = '';
    destination.appendChild(table_for_songs);

    activateFilterButtons(songs, common_keys);
  }
}

window.onload = (function () {
  getSongs().then(displaySongs)
    .catch(displayError);
});
