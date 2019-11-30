$(document).ready(function() {
    token = window.localStorage.getItem('oba-token')
    if (!token) {
        setTimeout(() => {
            window.location.href = 'login.html'
        }, 500);
        return
    }
    const table = $('#my-classes-tbody')
    $.ajax({
        type: 'GET',
        url: baseUrl + '/classes/all',
        headers: { 'Authorization': 'Bearer ' + token },
        success: ({ result }) => {
            result.forEach(element => {
                table.append($(`
<tr>
    <td>${element.course_id.faculty}</td>
    <td>${element.course_id.name}</td>
    <td>${element.term}</td>
    <td>YEAR</td>
    <td>STATUS</td>
</tr>                
                `).on('click', () => {
                    window.location.href = 'addclass.html#' + element._id
                }))
            })
        },
        error: (e) => {
            window.localStorage.removeItem('oba-token')
            alert(`error loading page: ${e}`)
            window.location.href = 'login.html'
        }
    })
})

$('#add-class-btn').on('click', function() {
    window.location.href = 'addclass.html'
})
