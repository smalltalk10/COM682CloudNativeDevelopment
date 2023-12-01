// Constants for REST endpoints
const endpoints = {
  CIM: "https://prod-17.uksouth.logic.azure.com/workflows/00db9b32c8fa4b83bdf1d99d4ac2a823/triggers/manual/paths/invoke/rest/v1/media?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=wj2Nq7-jKCm7im5o2Qy2r5sKB6mYiKY7LniOfEASbQo",
  RAM: "https://prod-08.uksouth.logic.azure.com/workflows/f2d7f5f4493e48539f24855e5e069e1b/triggers/manual/paths/invoke/rest/v1/media?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=nNEcwKdr8Ra8WXF5qPw9z6lsz5p2vSJLfPwUdXXht0E",
  UIMURI0: "https://prod-25.uksouth.logic.azure.com/workflows/c0a3fadf2e3c4e92bc0f7c3e5363ea10/triggers/manual/paths/invoke/rest/v1/media/",
  UIMURI1: "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=5XPVcuiDvqgl8WQWY-3H_hiP1qUOO7rlGhArzYvc6Mc",
  DIMURI0: "https://prod-26.uksouth.logic.azure.com/workflows/0199066f66d043c883292ae972e0b97d/triggers/manual/paths/invoke/rest/v1/media/",
  DIMURI1: "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=W36m41es2d6x-9EZf9PTa3HABaQj7aMxM0b3QtPP1hE",
  BLOB_ACCOUNT: "https://assignment2storageacc.blob.core.windows.net",
};

jwt = localStorage.getItem('token');

if (jwt == '') {
  window.location.href = "login.html"
} else {
  const jwtValues = jwt.split(".");
  const username = JSON.parse(atob(jwtValues[1]))['username'];
  const role = JSON.parse(atob(jwtValues[1]))['role'];  
}

// Event handlers for button clicks
$(document).ready(function() {
  $("#retMedia").click(function() {
    getMedia();
  });

$("#subNewForm").click(function() {
    submitNewAsset();
  });

  $("#logoutBtn").click(function () {
    // Perform logout actions as needed
    // For example, you can redirect the user back to the login page
    localStorage.setItem('token', '');
    window.location.href = "login.html"
  })
});

// Function to submit a new asset to the REST endpoint
function submitNewAsset() {
  var submitData = new FormData();
  submitData.append('fileName', $('#fileName').val());
  submitData.append('description', $('#description').val());
  submitData.append('file', $("#UpFile")[0].files[0]);
  submitData.append('fileType', $("#UpFile")[0].files[0].type);

  $.ajax({
    url: endpoints.CIM,
    headers: {'X-ACCESS-TOKEN': jwt},
    data: submitData,
    cache: false,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    type: 'POST',
  }).done(function() {
    getMedia();
  });
}

// Function to get a list of all assets and display them
async function getMedia() {
  $('table').empty();
  $.getJSON(
    {
      url:  endpoints.RAM, 
      headers: {'X-ACCESS-TOKEN': jwt}
    }, function(data) {
    var table = document.getElementById('mediaList');
    table.className = 'table';

    var row = table.insertRow();
    var labels = ["Media", "Type", "File Name", "Description", "User Name"];

    for (var i = 0; i < labels.length; i++) {
      var cell = row.insertCell(i);
      cell.textContent = labels[i];
    }

    $.each(data, function(key, val) {
      var row = table.insertRow();

      var fileType = val["fileType"];
      var split = fileType.split('/');
      var extension = split[split.length - 1];

      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      var cell7 = row.insertCell(6);

      // Populate cells with data
      switch (extension) {
        case 'video': case 'mp4': case 'mov': case 'wmv': case 'avi': case 'flv': case 'mkv':
          cell1.innerHTML = `<video controls width="350"><source src="${endpoints.BLOB_ACCOUNT}${val["filePath"]}" type="video/mp4"></video>`;
          cell2.textContent = "Video";
          break;
        case 'image': case 'jpeg': case 'pdf': case 'png': case 'raw': case 'bmp': case 'gif': case 'webp':
          cell1.innerHTML = `<img src="${endpoints.BLOB_ACCOUNT}${val["filePath"]}" width="350" alt="Image">`;
          cell2.textContent = "Image";
          break;
        case 'audio': case 'mp3': case 'mpeg': case 'wav': case 'acc': case 'wma':
          cell1.innerHTML = `<audio controls><source src="${endpoints.BLOB_ACCOUNT}${val["filePath"]}" type="audio/mp3"></audio>`;
          cell2.textContent = "Audio";
          break;
        default:
          cell1.textContent = 'Unsupported file type';
          break;
      }

      cell3.textContent = val["fileName"];
      cell4.textContent = val["description"];
      cell5.textContent = val["userName"];

      cell6.appendChild(createEditButton(val["id"]));
      cell7.appendChild(createDeleteButton(val["id"]));
    });
  });
}
function createEditButton(id) {
  return createButton('Edit', 'btn btn-info', function() {
    openEditForm(id);
  });
}

function createDeleteButton(id) {
  return createButton('Delete', 'btn btn-danger', function() {
    deleteMedia(id);
  });
}

function createButton(text, className, clickHandler) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = text;
  button.addEventListener('click', clickHandler);
  return button;
}

function openEditForm(id) {
  $('#updateMediaModal').modal('show');
  $("#submitEditButton").off("click").on("click", function() {
    const appendData = {"fileName": $('#appendFileName').val(), "description": $('#appendDescription').val()};
    submitEditMedia(id, appendData);
    $('#updateMediaModal').modal('hide');
  });
}

$(document).ready(function() {
  $('#updateMediaModal').on('hidden.bs.modal', function() {
    $('#appendFileName').val('');
    $('#appendDescription').val('');
  });
});

function submitEditMedia(id, appendData) {
  $.ajax({
    type: "PUT",
    url: `${endpoints.UIMURI0}${id}${endpoints.UIMURI1}`,
    headers: {'X-ACCESS-TOKEN': jwt},
    data: appendData,
  }).done(getMedia);
}

function deleteMedia(id) {
  $.ajax({
    type: "DELETE",
    url: `${endpoints.DIMURI0}${id}${endpoints.DIMURI1}`,
    headers: {'X-ACCESS-TOKEN': jwt}
  }).done(getMedia);
}
