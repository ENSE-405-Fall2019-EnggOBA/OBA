const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const shared_schemas = require("./shared-validation-schemas");

const add_class_schema = Joi.object({
  class: {
    name: shared_schemas.course_key,
    faculty: shared_schemas.faculty_key,
    term: Joi.string()
      .valid("Fall", "Winter", "Spring/Summer")
      .required(),
    year: Joi.number()
      .less(new Date().getFullYear() + 1)
      .greater(new Date().getFullYear() - 1)
      .required()
  }
});

const update_body_doc_schema_opt_sub = Joi.object({
  criteria: Joi.string()
    .max(500)
    .optional(),
  grade: Joi.number()
    .min(0)
    .max(100)
    .optional()
});

const data_object_opt_schema = Joi.object({
  grad_attribute: Joi.string()
    .max(50)
    .optional(),
  indicator: Joi.string()
    .max(50)
    .optional(),
  answers: Joi.array()
    .items(Joi.string().max(150))
    .when("questions", {
      is: Joi.array(),
      then: Joi.array().max(Joi.ref("questions.length"))
    })
    .optional(),
  questions: Joi.array()
    .items(Joi.string().max(500))
    .optional(),
  exceeds: update_body_doc_schema_opt_sub,
  meets: update_body_doc_schema_opt_sub,
  developing: update_body_doc_schema_opt_sub,
  fail: update_body_doc_schema_opt_sub
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

const data_object_schema = Joi.object({
  grad_attribute: Joi.string()
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

const data_object_array_opt_schema = Joi.array().items(data_object_opt_schema);
const data_object_array_schema = Joi.array().items(data_object_schema);

const update_body_schema = Joi.object({
  course_name: shared_schemas.course_key,
  term: Joi.alternatives().when("complete_flag", {
    is: true,
    then: Joi.alternatives()
      .try(Joi.string().valid("Fall", "Winter", "Spring/Summer"))
      .required(),
    otherwise: Joi.alternatives()
      .try(Joi.string().valid("Fall", "Winter", "Spring/Summer"))
      .optional()
  }),
  faculty: shared_schemas.faculty_key,
  year: Joi.alternatives().when("complete_flag", {
    is: true,
    then: Joi.alternatives()
      .try(Joi.number().equal(new Date().getFullYear()))
      .required(),
    otherwise: Joi.alternatives()
      .try(Joi.number().equal(new Date().getFullYear()))
      .optional()
  }),

  complete_flag: Joi.boolean().required(), // hidden field value passed to indicate if form is complete
  data: Joi.alternatives().when("complete_flag", {
    is: true,
    then: Joi.alternatives()
      .try(data_object_array_schema)
      .required(),
    otherwise: Joi.alternatives()
      .try(data_object_array_opt_schema)
      .optional()
  })
});

const get_id_body_schema = Joi.object({
  class: {
    object_id: Joi.objectId().required()
  }
});

const get_name_body_schema = Joi.object({
  class: {
    name: Joi.string()
      .regex(/^(ENEL|ENSE|ENPE|ENPC|ENIN|ENEV|ENGG)\d{3}[A-Z]{0,2}$/)
      .required()
  }
});

module.exports = {
  get_id_body_schema,
  get_name_body_schema,
  update_body_schema,
  add_class_schema
};
