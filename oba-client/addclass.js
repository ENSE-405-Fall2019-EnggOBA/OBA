let token;

// hardcoded for convenience
const config = {
    attributes: [
        {
            name: 'ATTRIBUTE 1',
            indicators: [
                {
                    name: 'INDICATOR 1.1'
                }
            ],
        },
        {
            name: 'ATTRIBUTE 2',
            indicators: [
                {
                    name: 'INDICATOR 2.1'
                }
            ]
        }
    ],
    questions: [
        'QUESTION 1',
    ],
	faculties: {
		'ENSE': 'Software Systems Engineering',
		'ENEL': 'Electronic Systems Engineering',
		'ENEV': 'Environmental Systems Engineering',
		'ENIN': 'Industrial Systems Engineering',
		'ENPE': 'Petroleum Systems Engineering',
        'ENPC': 'Process Systems Engineering',
        'ENGG': 'General Engineering'
	}
}

$('#back-btn').on('click', function() {
    location.href='myclasses.html'
})

$('#add-ga-btn').on('click', function() {
    alert("added GA!");
}).prop('hidden', true)

$('#save-btn').on('click', async function() {
    $('#save-btn').prop('disabled', true);
    const id = location.hash.substr(1) || generateId()
    const formInfo = prepareFormInfo()
    // ensure the course exists
    await upsertCourse(formInfo.course_name, formInfo.faculty)
	const formData = getFormData(formInfo)
	const request = new XMLHttpRequest()
    request.open('PUT', baseUrl + '/classes/' + id)
    request.setRequestHeader('Authorization', 'Bearer ' + token)
	request.onload = () => {
        if (request.status === 200) {
            location.href='myclasses.html'
        }
	}
	request.send(formData)
})

function generateId() {
    return (Math.random() * 100000000).toString().replace('.','').substr(0, 24).padEnd(24, '0')
}

function prepareFormInfo() {
	const ga = getGa($('#data'))
	const data = [ga]
	const form = {
		term: $('#termSelect').val(),
		faculty: config.faculties[$('#facultySelect').val()],
		course_name: $('#facultySelect').val() + $('#courseNoInput').val(),
		year: 2019,
		data,
	}
	return form
}

$(document).ready(function() {
    token = window.localStorage.getItem('oba-token')
	$('#facultySelect').html(null)
	for (const key in config.faculties) {
		$('#facultySelect').append(`<option>${key}</option>`)
	}
    if (!token) {
        setTimeout(() => {
            window.location.href = 'login.html'
        }, 500);
        return
    }
    const id = location.hash.substr(1)
    if (id) {
        loadForId(id, token)
    } else {
        createNew()
    }
})

function setupAttributesAndIndicators(
    attributeSelect,
    indicatorSelect,
    attributeValue,
    indicatorValue,
) {
    // by default, indicator select is disabled
    indicatorSelect.prop('disabled', true)

    // clear out old attributes
    attributeSelect.html('<option value="">Graduate Attribute</option>')
    config.attributes.forEach(attribute => {
        attributeSelect.append(`<option>${attribute.name}</option>`)
    })

    attributeSelect.on('change', e => {
        indicatorSelect.html(null)
        const value = e.target.value
        const attribute = config.attributes.find(attr => attr.name === value)
        if (attribute) {
            indicatorSelect.prop('disabled', false)
            attribute.indicators.forEach(indicator => {
                indicatorSelect.append(`<option>${indicator.name}</option>`)
            })
        } else {
            indicatorSelect.prop('disabled', true)
        }
    })

    if (attributeValue) {
        attributeSelect.val(attributeValue)
        const value = attributeValue
        const attribute = config.attributes.find(attr => attr.name === value)
        if (attribute) {
            indicatorSelect.prop('disabled', false)
            attribute.indicators.forEach(indicator => {
                indicatorSelect.append(`<option>${indicator.name}</option>`)
            })
        }
    }
    if (indicatorValue) {
        indicatorSelect.val(indicatorValue)
    }
}

function createNew() {
    $('#yearInput').val(new Date().getFullYear())
    addGa($('#data'))
}

function loadForId(id, token) {
    $.ajax({
        type: 'GET',
        url: baseUrl + '/classes/' + id,
        headers: { 'Authorization': 'Bearer ' + token },
        success: async ({ result }) => {
            course = await getCourse(result.course_id)
            $('#yearInput').val(result.year || new Date().getFullYear())
            $('#termSelect').val(result.term)
            $('#facultySelect').val(course.name.substr(0, 4))
            $('#courseNoInput').val(course.name.substr(4))
            addGa($('#data'), result.data[0])
        }
    })
}

function addGa(div, data = {
    questions_answers: config.questions.map(question => ({
        question,
        answer: '',
    }))
}) {
    const id = div.prop('id')
    div.html(null)
    div.append(`
<section class="py-0">
    <div class="col-sm">
        <div class="form-group">
            <select class="form-control" id="${id}-attribute"></select>
        </div>
    </div>
    <div class="col-sm">
        <div class="form-group">
            <select class="form-control" id="${id}-indicator"></select>
        </div>
    </div>
    <table class="table table-bordered">
        <thead class="thead dark">
            <tr>
                <th scope="col">Fails to meet expectations</th>
                <th scope="col">Developing</th>
                <th scope="col">Meets Expectations</th>
                <th scope="col">Exceeds Expectations</th>
            </tr>
        </thead>
        <tbody>
            <tr class="table-primary">
                <td><input type="text" id="${id}-fail-criteria"/></td>
                <td><input type="text" id="${id}-developing-criteria"/></td>
                <td><input type="text" id="${id}-meets-criteria"/></td>
                <td><input type="text" id="${id}-exceeds-criteria"/></td>
            </tr>
            <tr class="table-success">
                <td><input type="number" id="${id}-fail-grade"/></td>
                <td><input type="number" id="${id}-developing-grade"/></td>
                <td><input type="number" id="${id}-meets-grade"/></td>
                <td><input type="number" id="${id}-exceeds-grade"/></td>
            </tr>
            <tr class="table-warning">
                <td><div class="custom-file">
                    <input type="file" class="custom-file-input" id="${id}-fail-document">
                    <label class="custom-file-label" for="${id}-fail-document">Add Document</label>
                </div></td>
                <td><div class="custom-file">
                    <input type="file" class="custom-file-input" id="${id}-developing-document">
                    <label class="custom-file-label" for="${id}-developing-document">Add Document</label>
                </div></td>
                <td><div class="custom-file">
                    <input type="file" class="custom-file-input" id="${id}-meets-document">
                    <label class="custom-file-label" for="${id}-meets-document">Add Document</label>
                </div></td>
                <td><div class="custom-file">
                    <input type="file" class="custom-file-input" id="${id}-exceeds-document">
                    <label class="custom-file-label" for="${id}-exceeds-document">Add Document</label>
                </div></td>
            </tr>
        </tbody>
    </table>
</section>
<section class="py-5">
    <div class="row" id="${id}-questions"></div>
</section>
    `)
    setupAttributesAndIndicators(
        $('#' + id + '-attribute'),
        $('#' + id + '-indicator'),
        data.grad_attribute,
        data.indicator,
    )
    const report = data.evaluation_report
    if (report) {
        ['fail', 'developing', 'meets', 'exceeds'].forEach(key => {
            $(`#${id}-${key}-criteria`).val(report[key].criteria)
            $(`#${id}-${key}-grade`).val(report[key].grade)
            if (report[key].documents) {
                $(`#${id}-${key}-document`).prop('disabled', true)
            }
        })
    }
    const questions = data.questions_answers || []
    const qDiv = $(`#${id}-questions`)
    qDiv.data('count', questions.length)
    questions.forEach((question, index) => {
        qDiv.append(`
<div class="col">
    <div class="form-group">
        <label class="form-control" for="${id}-questions-${index}">${question.question}</label>
    </div>
</div>
<div class="col">
    <div class="form-group">
        <textarea class="form-control" rows="3" data-question="${question.question}" id="${id}-questions-${index}">${question.answer}</textarea>
    </div>
</div>
<div class="w-100"></div>    
        `)
    })
}

function getGa(div) {
    const id = div.prop('id')
    const grad_attribute = $(`#${id}-attribute`).val()
    const indicator = $(`#${id}-indicator`).val()
    const evaluation_report = {}
    ;['fail', 'developing', 'meets', 'exceeds'].forEach(key => {
        const criteria = $(`#${id}-${key}-criteria`).val()
        const grade = $(`#${id}-${key}-grade`).val()
		const file = $(`#${id}-${key}-document`).prop('files')[0]
        evaluation_report[key] = {
            criteria,
            grade,
			file,
        }
    })
    const numQuestions = Number($(`#${id}-questions`).data('count'))
    questions_answers = []
    for (let i = 0; i < numQuestions; ++i) {
        htmlelement = $(`#${id}-questions-${i}`)
        question = htmlelement.data('question')
        answer = htmlelement.val()
        questions_answers[i] = { question, answer }
    }
    return {
        grad_attribute,
        indicator,
        evaluation_report,
        questions_answers,
    }
}

function getFormData(form) {
	const formData = new FormData()
	formData.append('term', form.term)
	formData.append('faculty', form.faculty)
	formData.append('course_name', form.course_name)
	formData.append('year', form.year)
	form.data.forEach((ga, index) => {
		formData.append(`data[${index}][grad_attribute]`, ga.grad_attribute)
		formData.append(`data[${index}][indicator]`, ga.indicator)
		;['fail', 'developing', 'meets', 'exceeds'].forEach(key => {
			formData.append(`data[${index}][${key}][criteria]`, ga.evaluation_report[key].criteria)
			formData.append(`data[${index}][${key}][grade]`, ga.evaluation_report[key].grade)
			const file = ga.evaluation_report[key].file
			if (file) {
				formData.append(`${ga.grad_attribute.trim().replace(' ', '_')}_${key}`, file)
			}
		})
		ga.questions_answers.forEach((question, qIndex) => {
			formData.append(`data[${index}][questions][${qIndex}]`, question.question)
			formData.append(`data[${index}][answers][${qIndex}]`, question.answer)
		})
	})
	formData.append('complete_flag', false)
	return formData
}

function getCourse(courseId) {
    return new Promise((resolve, error) => {
        $.ajax({
            type: 'GET',
            url: baseUrl + '/courses/all',
            headers: { 'Authorization': 'Bearer ' + token },
            success: ({ result }) => {
                const course = result.find(c => c._id === courseId)
                if (!course) {
                    error('404')
                } else {
                    resolve(course)
                }
            },
            error,
        })
    })
}

function upsertCourse(name, faculty) {
    return new Promise((success, error) => {
        $.ajax({
            type: 'GET',
            url: baseUrl + '/courses/all',
            headers: { 'Authorization': 'Bearer ' + token },
            success: ({ result }) => {
                const courseAlreadyExists = result.some(course => course.name === name)
                if (!courseAlreadyExists) {
                    $.ajax({
                        type: 'POST',
                        url: baseUrl + '/courses',
                        data: JSON.stringify({
                            course: {
                                name,
                                faculty,
                            }
                        }),
                        dataType: 'json',
                        contentType: 'application/json',
                        headers: { 'Authorization': 'Bearer ' + token },
                        success,
                        error,
                    })
                } else {
                    success()
                }
            },
            error,
        })
    })
}
