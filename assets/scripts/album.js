const colorThief = new ColorThief();
const background = document.getElementById('background');

const params = new URLSearchParams(window.location.search);
const albumId = params.get('id');
const albumImage = document.getElementById('albumImage');
const albumTitle = document.getElementById('albumTitle');
const albumArtist = document.getElementById('albumArtist');
const albumArtistImage = document.getElementById('albumArtistImage');
const artistLink = document.getElementById('artistLink');
const trackList = document.getElementById('trackList');
const musicSource = document.getElementById('musicSource');
const searchedList = document.getElementById('searchedList');
const URL = 'https://striveschool-api.herokuapp.com/api/deezer/album/';
let myAlbum;
const btnRandomPlay = document.getElementById('randomPlay');

const btnPlay = document.getElementById('btnPlay');
const btnNext = document.getElementById('btnNext');

const myHistory = [];

document.addEventListener('load', init());

btnRandomPlay.addEventListener('click', playRandomTrack);

function init() {
  getAlbum(albumId);
  getFromLocalStorage();
  updateHistoryList();
}

function getFromLocalStorage() {
  const hist = JSON.parse(localStorage.getItem('history'));

  if (hist) {
    hist.forEach((element) => {
      myHistory.push(element);
    });
  }
}

function updateHistoryList() {
  searchedList.innerHTML = '';

  for (let i = 0; i < myHistory.length; i++) {
    const newLi = document.createElement('li');
    newLi.innerText = myHistory[i].title;
    newLi.setAttribute(
      'onclick',
      `setPlayer("${myHistory[i].preview}", "${myHistory[i].title}", "${myHistory[i].artist}", "${myHistory[i].albumCover}")`
    );

    searchedList.prepend(newLi);
  }
}

function updateHistory(obj) {
  const myObj = { ...obj };
  for (let i = 0; i < myHistory.length - 1; i++) {
    if (
      myHistory[i].preview === myObj.preview &&
      myHistory[i].title === myObj.title &&
      myHistory[i].artist === myObj.artist &&
      myHistory[i].albumCover === myObj.albumCover
    ) {
      myHistory.splice(i, 1);
    }
  }

  if (myHistory.length > 30) {
    myHistory.shift();
  }
}

function updateLocalStorage() {
  localStorage.setItem('history', JSON.stringify(myHistory));
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
  setTimeout(() => {
    setBackgroundColor();
  }, 50);
}

function printAlbumDetails() {
  albumImage.src = myAlbum.cover_medium;
  albumTitle.innerText = myAlbum.title;
  albumArtist.innerText = myAlbum.artist.name;
  albumArtistImage.src = myAlbum.artist.picture_small;
  artistLink.href = `http://127.0.0.1:5500/artistPage.html?id=${myAlbum.artist.id}`;
}

async function setBackgroundColor() {
  let color;
  let linearGradient;

  try {
    const img = document.getElementById('albumImage');
    const dominantRGB = await colorThief.getColor(img);
    // console.log(dominantRGB['0']);
    // console.log(dominantRGB['1']);
    // console.log(dominantRGB['2']);
    // console.log(rgbToHex(dominantRGB[0], dominantRGB[1], dominantRGB[2]));

    color = rgbToHex(dominantRGB['0'], dominantRGB['1'], dominantRGB['2']);

    linearGradient = 'linear-gradient(' + color + ' 3%,#181818)';

    background.style.background = linearGradient;

    return;
  } catch (error) {
    console.log(error);
  }
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function printTracks(tracks) {
  trackList.innerHTML = '';

  for (let i = 0; i < tracks.length; i++) {
    const newRow = document.createElement('div');
    newRow.classList.add('row', 'row-hover');
    newRow.setAttribute(
      'onclick',
      `setPlayer("${tracks[i].preview}", "${tracks[i].title}", "${tracks[i].artist.name}", "${tracks[i].album.cover_small}")`
    );

    const newParagraph = document.createElement('p');
    newParagraph.classList.add(
      'px-3',
      'col-1',
      'align-content-center',
      'mb-0',
      'numberLine',
      'track-num'
    );
    newParagraph.innerText = i + 1;
    // icona play
    const newPlayIcon = document.createElement('span');
    newPlayIcon.classList.add(
      'col-1',
      'px-3',
      'align-content-center',
      'mb-0',
      'play-icon'
    );
    newPlayIcon.innerHTML = `<i class="bi bi-play-fill"></i>`;

    const newDiv = document.createElement('div');
    newDiv.classList.add('col-6');

    const newTitle = document.createElement('p');
    newTitle.classList.add('m-1', 'fw-bold', 'titleSong');
    newTitle.innerText = tracks[i].title;

    const newArtist = document.createElement('a');
    newArtist.classList.add('m-0', 'text-secondary');
    newArtist.innerText = tracks[i].artist.name;
    newArtist.href = `artistPage.html?id=${tracks[i].artist.id}`;

    const newRank = document.createElement('p');
    newRank.classList.add('col-3', 'numberVisual');
    newRank.innerText = tracks[i].rank;

    const newTime = document.createElement('p');
    newTime.classList.add('col-2', 'pe-4', 'numberTime');
    newTime.innerText = getTimeFormat(tracks[i].duration);

    newRow.appendChild(newParagraph);
    newRow.appendChild(newPlayIcon);
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

function playRandomTrack() {
  const myTrack =
    myAlbum.tracks.data[Math.floor(Math.random() * myAlbum.tracks.data.length)];

  setPlayer(
    myTrack.preview,
    myTrack.title_short,
    myTrack.artist.name,
    myTrack.album.cover_small
  );
}

class Track {
  constructor(_preview, _title, _artist, _albumCover) {
    this.preview = _preview;
    this.title = _title;
    this.artist = _artist;
    this.albumCover = _albumCover;
  }
}

function setPlayer(link, title, artist, imgUrl) {
  musicSource.innerHTML = '';
  musicSource.src = link;
  musicSource.setAttribute('autoplay', 'true');

  document.getElementById('trackImage').src = imgUrl;
  document.getElementById('trackName').innerText = `${title.slice(0, 16)}...`;
  document.getElementById('nomeArtista').innerHTML = artist;
  setPause();

  const myTrack = new Track(link, title, artist, imgUrl);
  myHistory.push(myTrack);
  updateHistory(myTrack);
  updateLocalStorage();
  updateHistoryList();
}

btnPlay.addEventListener('click', () => {
  const pause = '<i class="bi bi-pause-fill fs-1"></i>';
  const play = '<i class="bi bi-play-fill fs-1"></i>';
  if (btnPlay.innerHTML == play) {
    document.getElementById('musicSource').play();
    setPause();
  } else if (btnPlay.innerHTML == pause) {
    document.getElementById('musicSource').pause();
    setPlay();
  }
});

btnNext.addEventListener('click', playRandomTrack);

function setPlay() {
  btnPlay.innerHTML = '<i class="bi bi-play-fill fs-1"></i>';
}

function setPause() {
  btnPlay.innerHTML = '<i class="bi bi-pause-fill fs-1"></i>';
}
