const endpoints = {
    USERREGISTER: "https://prod-18.uksouth.logic.azure.com/workflows/30a9787bb17a42c0b29183a48e45c250/triggers/manual/paths/invoke/rest/v1/users?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=X-MkWXYgsJuDjI8E2_rUXywrdXTX4h7kGYnGAWmppDs",
    USERLOGIN: "https://prod-06.uksouth.logic.azure.com/workflows/c8ca13fd1e054238974f1850cc6d5522/triggers/manual/paths/invoke/rest/v1/users/session?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=H5GfV5kutIM0AEgWmGlWca3QJAav50G3lcd7zoozA5I",
    GUESTLOGIN: "https://prod-24.uksouth.logic.azure.com/workflows/5ff41dbb07a542f5ac56126ea997c143/triggers/manual/paths/invoke/rest/v1/guests/session?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7guCUSoc6w8xwdqsSQO-0Tj4UpYsspo-GOt7aDJ4DcE"
};

$(document).ready(function () {
    const userLoginBtn = $("#userLoginBtn");
    const guestLoginBtn = $("#guestLoginBtn");
    const openRegisterModalBtn = $("#openRegisterModalBtn");
    const registerModal = $('#registerModal');
    const registerBtn = $("#registerBtn");
    const registerUsername = $('#registerUsername');
    const registerEmail = $('#registerEmail');
    const registerPassword = $('#registerPassword');

    userLoginBtn.click(function () {
        localStorage.setItem('token', '');
        const submitData = new FormData();
        submitData.append('username', $('#floatingUsername').val());
        submitData.append('password', $('#floatingPassword').val());

        $.ajax({
            url: endpoints.USERLOGIN,
            data: submitData,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (data) {
                handleLoginResponse(data);
            },
            error: function (error) {
                alert(error?.responseJSON?.message);
            }
        });        
    });

    guestLoginBtn.click(function () {
        $.getJSON({
            url: endpoints.GUESTLOGIN,
        }).done(handleLoginResponse);
    });

    openRegisterModalBtn.click(function() {
        registerModal.modal('show');
        registerBtn.off("click").on("click", function() {
            const registerData = {
                "username": registerUsername.val(),
                "email": registerEmail.val(),
                "password": registerPassword.val()
            };
            submitRegisterUser(registerData, function() {
                registerModal.modal('hide');
            });
        });
    });

    registerModal.on('hidden.bs.modal', function() {
        registerUsername.val('');
        registerEmail.val('');
        registerPassword.val('');
    });

    function handleLoginResponse(data) {
        const jwt = data?.token;
        localStorage.setItem('token', jwt);

        if (jwt) {
            window.location.href = "index.html";
        } else {
            alert("Invalid username or password. Please try again.");
        }
    }

    function submitRegisterUser(data, successCallback) {
        $.ajax({
            type: "POST",
            url: endpoints.USERREGISTER,
            data,
            success: function(response) {
                if (successCallback) {
                    successCallback(response);
                    alert("User Registered Successfully")
                }
            },
            error: function(error) {
                alert(error?.responseJSON?.message);
            }
        });
    }
});
