const suggestionsElement = document.querySelector("#suggestion");
const songsElement = document.querySelector("#songs");
const searchButton = document.querySelector("#search");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");

var navigate = {
  next: "",
  prev: "",
  total: 0,
};

document.addEventListener("DOMContentLoaded", function (event) {
  checkParams();
});

const checkParams = function () {
  let urlParams = new URLSearchParams(window.location.search);
  let searchText = urlParams.get("search");
  suggestionsElement.value = searchText;
  if (searchText != null) {
    search(searchText);
  }
};


const networkRequest = function (url) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      showSuggestions(JSON.parse(xhttp.responseText));
      scrollToView();
    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequests");
  xhttp.send();
};

const renderSuggestions = function (elem) {
  return (
    `<div style="width:48%;float:left;padding:10px;margin-top:10px">
        <div class="album-media-wrapper">
          <img class="img" src="${elem.album.cover_medium}">
        </div>
        <div class="album-info-wrapper">
          <span>#${elem.rank}</span>
            <h3 class="mt-4 no-break">${elem.title}</h3>
          <div>
            <span class="no-break"><b>Artist :</b> <a class="link" href="${window.location.origin}/?search=${elem.artist.name}">${elem.artist.name}</a></span>
          </div>
          <div>
            <span class="no-break"><b>Album :</b> <a class="link" href="${window.location.origin}/?search=${elem.album.title}">${elem.album.title}</a></span>
          </div>
          <div>
            <span class="no-break"><b>Duration :</b> ${elem.duration} sec</span>
          </div>
          <div>
            <span class="link">Show Lyrics</span>
          </div>
        </div>
    </div>`);
};

function showSuggestions(songs) {
  if (typeof songs.next != "undefined") {
    navigate.next = songs.next;
  } else {
    navigate.next = "";
  }

  if (typeof songs.prev != "undefined") {
    navigate.prev = songs.prev;
  } else {
    navigate.prev = "";
  }
  navigate.total = songs.total;

  let inject = ``;
  songs.data.forEach((elem) => {
    var template = renderSuggestions(elem);
    inject += template;
  });
  songsElement.innerHTML = inject;
}

const scrollToView = function () {
  window.scrollTo(0, document.body.scrollHeight - 1400);
};

const paginate = function (type) {
  if (navigate[type] == "") {
    alert("That's it. No more results available.");
  } else {
    networkRequest(`https://cors-anywhere.herokuapp.com/${navigate[type]}`);
  }
};

const search = (searchText) => {
  networkRequest(
    `https://api.lyrics.ovh/suggest/${searchText || suggestionsElement.value}`
  );
};

searchButton.addEventListener("click", search);
nextButton.addEventListener("click", () => {  paginate("next");  });
prevButton.addEventListener("click", () => {  paginate("prev"); });
