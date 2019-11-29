const baseUrl = 'https://maciag.ursse.org/api'

$(document).ready(function() {
    token = window.localStorage.getItem('oba-token')
    if (!token) {
        setTimeout(() => {
            window.location.href = 'https://maciag.ursse.org/oba/login.html'
        }, 500);
        return
    }
    const table = $('#my-classes-tbody')
    $.ajax({
        type: 'GET',
        url: baseUrl + '/courses/all',
        headers: { 'Authorization': 'Bearer ' + token },
        success: ({ result }) => {
            result.forEach(element => {
                table.append($(`
<tr>
    <td>FACULTY NAME</td>
    <td>${element.faculty_name} ${element.course_number}</td>
    <td>TERM</td>
    <td>YEAR</td>
    <td>${element.status}</td>
</tr>                
                `).on('click', () => {
                    window.location.href = 'addclass.html#' + element._id
                }))
            })
        },
        error: (e) => {
            window.localStorage.removeItem('oba-token')
            alert(`error loading page: ${e}`)
            window.location.href = 'https://maciag.ursse.org/oba/login.html'
        }
    })
})

$('#add-class-btn').on('click', function() {
    window.location.href = 'addclass.html'
})