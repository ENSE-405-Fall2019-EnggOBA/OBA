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
})

$('#save-btn').on('click', function() {
    alert("Successfully submitted!");
})

$(document).ready(function() {
    setupAttributesAndIndicators($('#attributeSelect'), $('#indicatorSelect'))
    const id = location.hash
    if (id) {
        loadForId(id)
    } else {
        createNew()
    }
})

function setupAttributesAndIndicators(attributeSelect, indicatorSelect) {
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
}

function createNew() {

}

function loadForId(id) {

}
