const params = new URLSearchParams(window.location.search);
const albumId = params.get('id');
const albumImage = document.getElementById('albumImage');
const albumTitle = document.getElementById('albumTitle');
const albumArtist = document.getElementById('albumArtist');
const albumArtistImage = document.getElementById('albumArtistImage');
const artistLink = document.getElementById('artistLink');
const trackList = document.getElementById('trackList');
const URL = 'https://striveschool-api.herokuapp.com/api/deezer/album/';
let myAlbum;

document.addEventListener('load', init());

function init() {
  getAlbum(albumId);
}

async function getAlbum(id) {
  try {
    const response = await fetch(URL + id);
    const data = await response.json();
    myAlbum = data;
    printPage();
  } catch (error) {
    console.log(error);
  }
}

function printPage() {
  printAlbumDetails();
  printTracks(myAlbum.tracks.data);
}

function printAlbumDetails() {
  albumImage.src = myAlbum.cover_medium;
  albumTitle.innerText = myAlbum.title;
  albumArtist.innerText = myAlbum.artist.name;
  albumArtistImage.src = myAlbum.artist.picture_small;
  artistLink.href = `http://127.0.0.1:5500/artistPage.html?id=${myAlbum.artist.id}`;
}

function printTracks(tracks) {
  trackList.innerHTML = '';

  for (let i = 0; i < tracks.length; i++) {
    const newRow = document.createElement('div');
    newRow.classList.add('row');
    newRow.setAttribute(
      'onclick',
      `setPlayer("${tracks[i].preview}", "${tracks[i].title}", "${tracks[i].artist.name}", "${tracks[i].album.cover_small}")`
    );

    const newParagraph = document.createElement('p');
    newParagraph.classList.add('px-3', 'col-1', 'align-content-center', 'mb-0');
    newParagraph.innerText = i + 1;

    const newDiv = document.createElement('div');
    newDiv.classList.add('col-6');

    const newTitle = document.createElement('p');
    newTitle.classList.add('m-1', 'fw-bold');
    newTitle.innerText = tracks[i].title;

    const newArtist = document.createElement('a');
    newArtist.classList.add('m-0', 'text-secondary');
    newArtist.innerText = tracks[i].artist.name;
    newArtist.href = `artistPage.html?id=${tracks[i].artist.id}`;

    const newRank = document.createElement('p');
    newRank.classList.add('col-3');
    newRank.innerText = tracks[i].rank;

    const newTime = document.createElement('p');
    newTime.classList.add('col-2', 'pe-4');
    newTime.innerText = getTimeFormat(tracks[i].duration);

    newRow.appendChild(newParagraph);
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newArtist);
    newRow.appendChild(newDiv);
    newRow.appendChild(newRank);
    newRow.appendChild(newTime);

    trackList.appendChild(newRow);
  }
}

function getTimeFormat(val) {
  let min = 0;
  let sec;

  if (val > 60) {
    min = Math.floor(val / 60);
  }

  sec = val - min * 60;
  if (sec < 10) {
    sec = '0' + sec;
  }

  return `${min}:${sec}`;
}

function setPlayer(link, title, artist, imgUrl) {
  musicSource.innerHTML = '';
  musicSource.src = link;
  musicSource.setAttribute('autoplay', 'true');

  document.getElementById('trackImage').src = imgUrl;
  document.getElementById('trackName').innerText = `${title.slice(0, 16)}...`;
  document.getElementById('artistName').innerText = artist;
}
