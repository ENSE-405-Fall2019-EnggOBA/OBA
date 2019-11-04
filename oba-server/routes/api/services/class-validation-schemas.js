const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const shared_schemas = require("./shared-validation-schemas");

const add_class_schema = Joi.object({
  class: {
    name: shared_schemas.course_key,
    faculty: shared_schemas.faculty_key,
    status: Joi.string()
      .valid("active", "inactive")
      .required(),
    term: Joi.string()
      .valid("Fall", "Winter", "Spring", "Summer")
      .required(),
    year: Joi.number()
      .equal(new Date().getFullYear())
      .required()
  }
});

const update_body_doc_schema_sub = Joi.object({
  criteria: Joi.string()
    .max(500)
    .required(),
  grade: Joi.number()
    .min(0)
    .max(100)
    .required()
});

const update_body_schema = Joi.object({
  class_id: Joi.objectId().required(),
  graduateattr: Joi.string()
    .max(50)
    .required(),
  indicator: Joi.string()
    .max(50)
    .required(),
  answers: Joi.array()
    .items(Joi.string().max(150))
    .when("questions", {
      is: Joi.array(),
      then: Joi.array().max(Joi.ref("questions.length"))
    })
    .required(),
  questions: Joi.array()
    .items(Joi.string().max(500))
    .required(),
  exceeds: update_body_doc_schema_sub,
  meets: update_body_doc_schema_sub,
  developing: update_body_doc_schema_sub,
  fail: update_body_doc_schema_sub
});

const get_id_body_schema = Joi.object({
  class: {
    object_id: Joi.objectId().required()
  }
});

const get_name_body_schema = Joi.object({
  class: {
    name: Joi.string()
      .regex(/^(ENEL|ENSE|ENPE|ENPC|ENIN|ENEV)\d{3}$/)
      .required()
  }
});

module.exports = {
  get_id_body_schema,
  get_name_body_schema,
  update_body_schema,
  add_class_schema
};
