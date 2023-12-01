const endpoints = {
    USERREGISTER: "https://prod-18.uksouth.logic.azure.com/workflows/30a9787bb17a42c0b29183a48e45c250/triggers/manual/paths/invoke/rest/v1/users?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=X-MkWXYgsJuDjI8E2_rUXywrdXTX4h7kGYnGAWmppDs",
    USERLOGIN: "https://prod-06.uksouth.logic.azure.com/workflows/c8ca13fd1e054238974f1850cc6d5522/triggers/manual/paths/invoke/rest/v1/users/session?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=H5GfV5kutIM0AEgWmGlWca3QJAav50G3lcd7zoozA5I",
    GUESTLOGIN: "https://prod-24.uksouth.logic.azure.com/workflows/5ff41dbb07a542f5ac56126ea997c143/triggers/manual/paths/invoke/rest/v1/guests/session?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7guCUSoc6w8xwdqsSQO-0Tj4UpYsspo-GOt7aDJ4DcE"
};

$(document).ready(function () {
    $("#userLoginBtn").click(function () {
        localStorage.setItem('token', '');
        var submitData = new FormData();
        submitData.append('username', $('#floatingUsername').val());
        submitData.append('password', $('#floatingPassword').val());
      
        $.ajax({
          url: endpoints.USERLOGIN,
          data: submitData,
          cache: false,
          enctype: 'multipart/form-data',
          contentType: false,
          processData: false,
          type: 'POST',
        }).done(function(data) {
            const jwt = JSON.parse(data).token
            localStorage.setItem('token', jwt);

            const jwtValues = jwt.split(".");
            const role = JSON.parse(atob(jwtValues[1]))['role'];

            // Check if username and password match the dummy data
            if (jwt !== undefined && role == "Logged-in User") {
            // If successful, redirect to the main page
            window.location.href = "index.html"
            } else {
            // If login fails, show an alert (you can customize this part)
            alert("Invalid username or password. Please try again.")
            }
        });
    })
})

$(document).ready(function () {
    $("#guestLoginBtn").click(function () {  
        $.getJSON(
            {
              url:  endpoints.GUESTLOGIN, 
            }, function(data) {

            const jwt = data?.token
            localStorage.setItem('token', jwt);

            const jwtValues = jwt.split(".");
            const role = JSON.parse(atob(jwtValues[1]))['role'];

            // Check if username and password match the dummy data
            if (jwt !== '' && role == "Guest User") {
            // If successful, redirect to the main page
            window.location.href = "index.html"
            } else {
            // If login fails, show an alert (you can customize this part)
            conso
            alert("Could not contact server. Please try again.")
            }
        });
    })
})

$(document).ready(function () {
    $("#openRegisterModalBtn").click(function() {
        $('#registerModal').modal('show');
        $("#registerBtn").off("click").on("click", function() {
            const data = {
                "username": $('#registerUsername').val(),
                "email": $('#registerEmail').val(),
                "password": $('#registerPassword').val()
            };
            submitRegisterUser(data);
            $('#registerModal').modal('hide');
          });
    });
})
  
$(document).ready(function() {
    $('#openRegisterModalBtn').on('hidden.bs.modal', function() {
        $('#registerUsername').val('');
        $('#registerEmail').val('');
        $('#registerPassword').val('');
    });
});

function submitRegisterUser(data) {
    $.ajax({
      type: "POST",
      url: endpoints.USERREGISTER,
      data,
    }).done();
  }
