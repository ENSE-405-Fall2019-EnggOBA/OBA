const mongoose = require('mongoose')
const router = require('express').Router()
const passport = require('passport')
const User = mongoose.model('User')

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

    // passport is meant to be used as a middleware, so
    // we have to call it with our req, res, next parameters
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err)
        }

        if (user) {
            return res.json({
                user: user.toAuthJSON()
            })
        }

        return res.status(422).json(info)
    })(req, res, next)
})

router.post('/users', (req, res, next) => {
    const user = new User()
    user.role = req.body.user.role
    user.email = req.body.user.email
    user.setPassword(req.body.user.password)

    user.save().then(() => {
        return res.json({
            user: user.toAuthJSON()
        })
    }).catch(next)
})

module.exports = router
