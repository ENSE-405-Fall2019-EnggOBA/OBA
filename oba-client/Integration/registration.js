$(document).on('submit', '#sign_up', function(){
    var email = $('#email').val()
    var role = $('#role').val()
    var password = $('#password').val()

    var json_data_register = {"user": {"email" : email, "role" : role, "password": password}};

    $.ajax({
		type:'POST', 
		data: JSON.stringify(json_data_register), 
		dataType: 'json', 
    	contentType: 'application/json',
    	url: "https://maciag.ursse.org/api/api/users", 
    	success: function(result){
			console.log(result)
			$('#signup_response').append("<div>Successful sign up. Please login.</div>");
		  },
		  error: function(err){
    		$('#signup_response').append(err);
    	}
	});
	return false;
  });
