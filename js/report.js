(function fetchCandidates(url) {
  var url = "http://localhost:3333/api/reports";
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onload = function (response) {
    if (request.status >= 200 && request.status < 400) {
      var responseList = JSON.parse(request.responseText);
      // console.log(responseList);
      var listEntetiesReport = createEntetiesReport(responseList);
      selectedCandidat();
      displayReport(listEntetiesReport);
      localSorageReport(listEntetiesReport);
    }
  };
  request.send();

// local storage report
  function localSorageReport(reports) {
    reports.forEach(function (report) {
      var id = report.id;
      // console.log(id)
      var text = JSON.stringify(report);
      // console.log(text);
      localStorage.setItem(id, text);
      // console.log(JSON.parse(localStorage.getItem(id)));//item report
    });
    localStorage.setItem("reports", JSON.stringify(reports));
    // console.log(JSON.parse(localStorage.getItem("reports")));//list report
  }

  // storage selected id
  function selectedCandidat() {
    var selectedCandidat = JSON.parse(localStorage.getItem("candidatId"));
    displaySelectedCandidate(selectedCandidat);
  }


  function displaySelectedCandidate(res) {
    var $template = $("#template").html();
    var $candidat = $("#candidat");
    var text = "";

    if ($template) {
      text = $template
        .replace("{{name}}", res.name)
        .replace("{{email}}", res.email)
        .replace("{{dateOfBirth}}", displayDate(res.birthday))
        .replace("{{education}}", res.education)
        .replace("{{image}}", res.avatar);
      $candidat.append(text);
    }
    $("img").one("error", function (err) {
      $(this).attr("src", "../img/placeholder-profile2.jpg");
    });
  }

  // constructor
  function Report(report) {
    this.id = report.id;
    this.candidateId = report.candidateId,
    this.candidateName = report.candidateName,
    this.companyName = report.companyName,
    this.interviewDate = report.interviewDate,
    this.note = report.note,
    this.phase = report.phase,
    this.status = report.status;
  }

  function displayDate(date){
    var newDate=new Date(date)
    var myDay = newDate.getDate();
    var myMonth = newDate.getUTCMonth();
    myMonth++;
    var year = newDate.getUTCFullYear();
    var fullDate = myDay + "." + myMonth + "." + year;
    return fullDate
  }

  function capitalLetter(string){
    return string.charAt(0).toUpperCase()+string.slice(1)

  }

  function createEntetiesReport(list) {
    var listEntetiesReport = [];
    list.forEach(function (report, index) {
      listEntetiesReport[index] = new Report(report);
    });
    return listEntetiesReport;
  }

// table reports
  function displayReport(listReports) {
    listReports.forEach(function (report) {
      var reportId = report.candidateId;
      var candidatLocalStorage = JSON.parse(localStorage.getItem("candidatId"));
      var candidatId = candidatLocalStorage.id;

      if (candidatId === reportId) {
        var row = document.createElement("tr");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        var cell3 = document.createElement("td");
        var cell4 = document.createElement("td");
        var img = document.createElement("img");

        img.setAttribute("src", "../img/Eye-icon.png");
        img.setAttribute("data-target", "myModal");
        img.setAttribute("data-toggle", "modal");
        img.setAttribute("id", "modal");
        img.setAttribute("data-id", report.id);

        var table = document.getElementById("table");
        cell1.innerHTML = report.companyName;
        cell2.innerHTML = displayDate(report.interviewDate);
        cell3.innerHTML = capitalLetter(report.status);
        cell4.appendChild(img);

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);

        table.appendChild(row);
      }
    });
  }


  // Modal
  $(document).on("click", "#modal", function (event) {
    event.preventDefault();

    const idReports = $(this).attr("data-id");
    var reportData = JSON.parse(localStorage.getItem(idReports));
    console.log(reportData);

    displayModal(reportData);
  });

  
  function displayModal(reportData) {
    var $modal = `
    <div class="modal-header">
    <h4 class="modal-title">${reportData.candidateName}</h4> 
    <button type="button" class="close" data-dismiss="modal">
      &times;
    </button>
   </div>
   <div class="modal-data">
      <h4>Company</h4>
      <p>${reportData.companyName}</p>
      <h4>Interview Date</h4>
      <p>${displayDate(reportData.interviewDate)}</p>
      <h4>Phase</h4>
      <p>${capitalLetter(reportData.phase)}</p>
      <h4>Status</h4>
      <p>${capitalLetter(reportData.status)}</p>
      </div>
      <div class="modal-about">
      <h4>Notes</h4>
        <p>${reportData.note}</p>
      </div>
      `;
    $(".modal-body").html("");
    $(".modal-body").append($modal);
    $("#myModal").modal("show");
  }
})();
