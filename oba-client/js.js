const baseUrl = 'https://maciag.ursse.org/api/api'

function registerUser({
	email,
	password,
	role,
}) {
	return new Promise((resolve, reject) => {
		request = {
			url: baseUrl + '/users',
			type: 'POST',
			crossDomain: true,
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify({
				user: {
					email,
					role,
					password,
				},
			}),
			success: (result) => {
				resolve(result.user)
			},
			error: reject,
		}
		$.ajax(request)
	})
}

function loginUser({
	email,
	password,
}) {
	return new Promise((resolve, reject) => {
		request = {
			url: baseUrl + '/users/login',
			type: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify({
				user: {
					email,
					password,
				},
			}),
			success: (result) => {
				resolve(result.user)
			},
			error: reject,
		}
		$.ajax(request)
	})
}

function getIndicators({
	token,
}) {
	return new Promise((resolve, reject) => {
		
	})
}

function getGraduateAttributes({
	token,
}) {
	return new Promise((resolve, reject) => {
		
	})
}

function getQuestions({
	token,
}) {
	return new Promise((resolve, reject) => {
		
	})
}
