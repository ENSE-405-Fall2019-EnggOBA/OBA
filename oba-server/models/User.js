const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { secret } = require('../config')

const User = 'User'

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    role: String,
    hash: String,
    salt: String,
}, { timestamps: true })

UserSchema.plugin(uniqueValidator, { message: 'is already taken' })

UserSchema.methods.setPassword = function(password) {
    this.salt = salt()
    this.hash = hash(password, this.salt)
}

UserSchema.methods.isPassword = function(password) {
    const hash = hash(password, this.salt)
    return this.hash === hash
}

UserSchema.methods.toAuthJSON = function() {
    return {
        email: this.email,
        token: this.generateJWT(),
    }
}

UserSchema.methods.generateJWT = function() {
    const today = new Date()
    const expires = new Date(today)
    expires.setDate(today.getDate() + 60)

    return jwt.sign({
        id: this._id,
        username: this.username,

        // https://tools.ietf.org/html/rfc7519#section-4.1.4
        exp: Math.round(expires.getTime() / 1000),
    }, secret)
}

module.exports.User = User

mongoose.model(User, UserSchema)

function salt() {
    return crypto.randomBytes(16).toString('hex')
}

function hash(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')
}
