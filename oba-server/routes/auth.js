const jwt = require('express-jwt')
const { secret } = require('../config')

function getToken(req) {
    const { authorization } = req.headers
    const [ method, token ] = authorization.split(' ')
    if ([ 'Token', 'Bearer' ].includes(method)) {
        return token
    }
    return null
}

module.exports.required = jwt({
    secret,
    userProperty: 'currentUser',
    getToken,
})
