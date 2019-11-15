$(document).on('submit', '#login', function(){
    // remove token
    setCookie("token", "", 1);

    var email = $('#email').val()
    var role = $('#role').val()
    var password = $('#password').val()

    var json_data_login = {"user": {"email" : email, "role" : role, "password": password}};

    $.ajax({
        url: "https://maciag.ursse.org/api/api/users/login",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json_data_login),
        success: function(result){
            // store token to cookie
            setCookie("token", result.token, 1);

            // show home page with JWT validation
            showHomePage();
            $('#login_response').append("<div>Successful login.</div>");

        },
        error: function(err){
            console.log(err)
            //$('#login_response').append(err);
        }
    })
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function showHomePage(){
    var token = getCookie('token');
    $.post("https://maciag.ursse.org/api/api/users", JSON.stringify({ token:token })).done(function(result){
        // redirect to home page if validate successfully
        console.log(result)
        //window.location.href = "/index.html";
    })
    .fail(function(result){
        $('#login_response').append("<div>Please login to access.</div>"); 
    });
}

function getCookie(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' '){
            c = c.substring(1);
        }
 
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
