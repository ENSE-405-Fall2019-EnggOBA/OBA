const Joi = require("@hapi/joi");

const faculty_key = Joi.string()
  .valid(
    "General Engineering",
    "Software Systems Engineering",
    "Electronic Systems Engineering",
    "Environmental Systems Engineering",
    "Industrial Systems Engineering",
    "Petroleum Systems Engineering",
    "Process Systems Engineering"
  )
  .required();

const course_key = Joi.string()
  .when("faculty", {
    is: "Software Systems Engineering",
    then: Joi.string()
      .regex(/^ENSE\d{3}[A-Z]{0,2}$/)
      .required()
  })
  .when("faculty", {
    is: "Electronic Systems Engineering",
    then: Joi.string()
      .regex(/^ENEL\d{3}[A-Z]{0,2}$/)
      .required()
  })
  .when("faculty", {
    is: "Environmental Systems Engineering",
    then: Joi.string()
      .regex(/^ENEV\d{3}[A-Z]{0,2}$/)
      .required()
  })
  .when("faculty", {
    is: "Industrial Systems Engineering",
    then: Joi.string()
      .regex(/^ENIN\d{3}[A-Z]{0,2}$/)
      .required()
  })
  .when("faculty", {
    is: "Petroleum Systems Engineering",
    then: Joi.string()
      .regex(/^ENPE\d{3}[A-Z]{0,2}$/)
      .required()
  })
  .when("faculty", {
    is: "Process Systems Engineering",
    then: Joi.string()
      .regex(/^ENPC\d{3}[A-Z]{0,2}$/)
      .required()
  })
  .when("faculty", {
    is: "General Engineering",
    then: Joi.string()
      .regex(/^ENGG\d{3}[A-Z]{0,2}$/)
      .required()
  });

module.exports = { course_key, faculty_key };
