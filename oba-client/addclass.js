const baseUrl = 'https://maciag.ursse.org/api'

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
        'QUESTION 1'
    ]
}

$('#back-btn').on('click', function() {
    location.href='myclasses.html'
})

$('#add-ga-btn').on('click', function() {
    alert("added GA!");
}).prop('hidden', true)

$('#save-btn').on('click', function() {
    alert("Successfully submitted!");
})

$(document).ready(function() {
    token = window.localStorage.getItem('oba-token')
    if (!token) {
        setTimeout(() => {
            window.location.href = 'https://maciag.ursse.org/oba/login.html'
        }, 500);
        return
    }
    setupAttributesAndIndicators($('#attributeSelect'), $('#indicatorSelect'))
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
    attributeSelect.html('<option>Graduate Attribute</option>')
    config.attributes.forEach(attribute => {
        attributeSelect.append(`<option>${attribute.name}</option>`)
    })

    attributeSelect.on('change', e => {
        indicatorSelect.html(null)
        value = e.target.value
        attribute = config.attributes.find(attr => attr.name === value)
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
        attributeSelect.value = attributeValue
    }
    if (indicatorValue) {
        indicatorSelect.value = indicatorValue
    }
}

function createNew() {
    
}

function loadForId(id, token) {
    $.ajax({
        type: 'GET',
        url: baseUrl + '/classes/' + id,
        headers: { 'Authorization': 'Bearer ' + token },
        success: ({ result }) => {
            window.lastResult = result
        }
    })
}

function addGa(div, data) {
    const id = div.prop('id')
    div.append(`
<section class="py-0">
    <div class="col-sm">
        <div class="form-group">
            <select class="form-control" id="${id}.attribute"></select>
        </div>
    </div>
    <div class="col-sm">
        <div class="form-group">
            <select class="form-control" id="${id}.indicator"></select>
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
                <td><input type="text" id="${id}.fail.criteria"/></td>
                <td><input type="text" id="${id}.developing.criteria"/></td>
                <td><input type="text" id="${id}.meets.criteria"/></td>
                <td><input type="text" id="${id}.exceeds.criteria"/></td>
            </tr>
            <tr class="table-success">
                <td><input type="number" id="${id}.fail.grade"/></td>
                <td><input type="number" id="${id}.developing.grade"/></td>
                <td><input type="number" id="${id}.meets.grade"/></td>
                <td><input type="number" id="${id}.exceeds.grade"/></td>
            </tr>
            <tr class="table-warning>
                <td><div class="custom-file">
                    <input type="file" class="custom-file-input" id="${id}.fail.document">
                    <label class="custom-file-label" for="${id}.fail.document">Add Document</label>
                </div></td>
                <td><div class="custom-file">
                    <input type="file" class="custom-file-input" id="${id}.developing.document">
                    <label class="custom-file-label" for="${id}.developing.document">Add Document</label>
                </div></td>
                <td><div class="custom-file">
                    <input type="file" class="custom-file-input" id="${id}.meets.document">
                    <label class="custom-file-label" for="${id}.meets.document">Add Document</label>
                </div></td>
                <td><div class="custom-file">
                    <input type="file" class="custom-file-input" id="${id}.exceeds.document">
                    <label class="custom-file-label" for="${id}.exceeds.document">Add Document</label>
                </div></td>
            </tr>
        </tbody>
    </table>
</section>
    `)
    setupAttributesAndIndicators(
        $('#' + id + '.attribute'),
        $('#' + id + '.indicator'),
        data.grad_attribute,
        data.indicator,
    )
    const report = data.evaluation_report
    if (report) {
        ['fail', 'developing', 'meets', 'exceeds'].forEach(key => {
            $(`#${id}.${key}.criteria`).value = report[key].criteria
            $(`#${id}.${key}.grade`).value = report[key].grad_attribute
            if (report[key].documents) {
                $(`#${id}.${key}.document`).prop('disabled', true)
            }
        })
    }
}


