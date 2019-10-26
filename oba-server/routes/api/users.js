const router = require('express').Router()

router.post('/users/login', (req, res, next) => {
    let errors = undefined
    if (!req.body.user.email) {
        errors = { 
            ...errors,
            email: `can't be blank`,
        }
    }
    if (!req.body.user.password) {
        errors = {
            ...errors,
            password: `can't be blank`,
        }
    }
    if (errors) {
        return res.status(422).json({ errors })
    }

})

module.exports = router
