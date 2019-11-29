const Joi = require("@hapi/joi");

const email_key = Joi.string()
  .pattern(/^[a-zA-Z0-9._~]+@uregina.ca$/)
  .required();

const pass_key = Joi.string()
  .pattern(/^(?=.{6,})(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$/)
  .required();

const register_user_schema = Joi.object({
  email: email_key,
  password: pass_key,
  role: Joi.string()
    .valid("Professor", "Program Chair", "Staff")
    .required(),
  faculty: Joi.string()
    .valid(
      "Software Systems Engineering",
      "Electronic Systems Engineering",
      "Environmental Systems Engineering",
      "Industrial Systems Engineering",
      "Petroleum Systems Engineering",
      "Process Systems Engineering"
    )
    .required()
});

const login_user_schema = Joi.object({
  user: {
    email: email_key,
    password: Joi.string().required(),
  }
});

module.exports = { register_user_schema, login_user_schema };
