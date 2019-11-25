const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const shared_schemas = require("./shared-validation-schemas");

const get_id_body_schema = Joi.object({
  course: {
    object_id: Joi.objectId().required()
  }
});

const get_name_body_schema = Joi.object({
  course: {
    name: shared_schemas.course_key
  }
});

const create_body_schema = Joi.object({
  course: {
    name: shared_schemas.course_key,
    faculty: shared_schemas.faculty_key,
  }
});

module.exports = {
  get_id_body_schema,
  get_name_body_schema,
  create_body_schema
};
