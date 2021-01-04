
function checkParams() {
  let urlParams = new URLSearchParams(window.location.search);
  let searchText = urlParams.get("search");
  document.getElementById("suggestion").value = searchText;
  if (searchText != null) {
    search(searchText);
  }
}

function search(searchText) {
  let item = searchText || document.getElementById("suggestion").value;
  console.log(item);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      showSuggestions(JSON.parse(xhttp.responseText));
      scrollToView();
    }
  };
  xhttp.open("GET", `https://cors-anywhere.herokuapp.com/https://api.lyrics.ovh/suggest/${item}`, true);
  xhttp.send();
}

document.addEventListener("DOMContentLoaded", function(event) {
  checkParams();
});

var navigate = {
  next : '',
  prev : '',
  total : 0
}

console.log(navigate);

function networkRequest(url){
  var xhttp = new XMLHttpRequest();
 
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      showSuggestions(JSON.parse(xhttp.responseText));
      scrollToView();
    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequests')
  xhttp.send();
}

function showSuggestions(songs) {
  var inject = ``;
  
  if(typeof songs.next != 'undefined'){
    navigate.next =  songs.next;
  }

  if(typeof songs.prev != 'undefined'){
    navigate.prev =  songs.prev;
  }


  songs.data.forEach((elem) => {
    var template = `<div style="width:48%;float:left;padding:10px;margin-top:10px">
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
                    </div>`;
    inject += template;
  });

  inject += `<div style="padding: 20px;clear: both;text-align: center;font-weight: bold;font-size: 22px;">
      <span onclick="paginate('prev')" class="link">Prev</span>
      <span onclick="paginate('next')" class="link" style="margin-left:20px">Next</span>
    </div>`;
  document.getElementById("songs").innerHTML = inject;
}

function scrollToView() {
  window.scrollTo(0, document.body.scrollHeight - 1400);
}


function paginate(type) {
  networkRequest(`https://cors-anywhere.herokuapp.com/${navigate[type]}`);
}
