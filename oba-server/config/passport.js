// adapted from https://github.com/gothinkster/node-express-realworld-example-app/blob/master/config/passport.js

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = mongoose.model('User')

passport.use(new LocalStrategy({
    usernameField: 'user[email]'
}))
