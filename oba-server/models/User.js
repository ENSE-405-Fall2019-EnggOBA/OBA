const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    role: { type: String, required: true },
    faculty: { type: String, required: true },
    avatar: String,
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    hash: String,
    salt: String
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken" });

UserSchema.methods.setPassword = function(password) {
  this.salt = salt();
  this.hash = hash(password, this.salt);
};

UserSchema.methods.isPassword = function(password) {
  return this.hash === hash(password, this.salt);
};

UserSchema.methods.toAuthJSON = function() {
  return {
    email: this.email,
    token: this.generateJWT(),
    role: this.role
  };
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expires = new Date(today);
  expires.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      role: this.role,

      // https://tools.ietf.org/html/rfc7519#section-4.1.4
      exp: Math.round(expires.getTime() / 1000)
    },
    secret
  );
};

mongoose.model("User", UserSchema, "Users");

function salt() {
  return crypto.randomBytes(16).toString("hex");
}

function hash(password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex");
}
