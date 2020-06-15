

(function fetchCandidates(url) {
  var url = "http://localhost:3333/api/candidates";
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onload = function (response) {
    if (request.status >= 200 && request.status < 400) {
      var responseList = JSON.parse(request.responseText);
      // console.log(responseList);
      var listCandidates = createEntetisCandidates(responseList);
      localStorageList(listCandidates);
      displayCandidatesList(listCandidates);
    }
  };
  request.send();

  // constructor
  function Candidat(person) {
    this.id = person.id,
    this.name = person.name,
    this.email = person.email,
    this.avatar = person.avatar;
    this.birthday = person.birthday;
    this.education = person.education;
  }


  function createEntetisCandidates(responseList) {
    var entetisCandidatList = [];
    responseList.forEach(function (candidate, index) {
      entetisCandidatList[index] = new Candidat(candidate);
    });
    return entetisCandidatList;
  }

  // local storage
  function localStorageList(list) {
    list.forEach(function (candidate) {
      var nameCandidat = candidate.id;
      // console.log(nameCandidat);
      var text = JSON.stringify(candidate);
      // console.log(text);
      localStorage.setItem(nameCandidat, text);
      // console.log(JSON.parse(localStorage.getItem(nameCandidat)));
    });
    localStorage.setItem("list", JSON.stringify(list));
    // console.log(JSON.parse(localStorage.getItem("list")))
  }


  // display all candidates
  function displayCandidatesList(list) {
    var $showCanditates = $("#show-candidates");
    $showCanditates.html("")
    list.forEach((candidat) => {
      var $card = $(
        `<div class="col-md-4" class="cardId">
               <a href="#" data-candidat-id="${candidat.id}" id="${candidat.id}"><div class="card  mb-3">
              <img class="card-top img-responsive" src="${candidat.avatar}"   alt="image" >
              <div class="card-body">
                <p class="card-text name">${candidat.name}</p>
                <p class="card-text email">${candidat.email}</p>
              </div>
            </div>
            </a>
            </div>`
      );
      $showCanditates.append($card);
      $(".card-top").one("error", function (err) {
        $(this).attr("src", "../img/placeholder-profile2.jpg");
      });
    });
  }


  $(document).on("click", "a", function (event) {
    const id = $(this).attr("data-candidat-id");
    var candidataData = localStorage.getItem(id);
    console.log(candidataData);
    localStorage.setItem("candidatId", candidataData);
    window.location = "details.html";
  });

  // search
  var input = document.querySelector(".form-control");
  input.addEventListener("input", function (e) {
    var inputSearchValue = e.target.value.toLowerCase().trim();
    var newList = JSON.parse(localStorage.getItem("list"));
    // console.log(newList)
    var filterList = newList.filter(
      (e) => e.name.toLowerCase().indexOf(inputSearchValue) !== -1
    );
    // console.log(filterList);
    displayCandidatesList(filterList);
  });
})();
