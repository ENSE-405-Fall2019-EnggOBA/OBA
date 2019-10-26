const { Schema } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    role: String,
    hash: String,
    salt: String,
}, { timestamps: true })

UserSchema.methods.isPassword = function(password) {

}

UserSchema.methods.toAuthJSON = function() {
    return {
        email: this.email,

    }
}

UserSchema.methods.generateJWT = function() {
    const today = new Date()
    
}
