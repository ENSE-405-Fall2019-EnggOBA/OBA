const routing_services = require("./services/course-services");
const router = require("express").Router();
const auth = require("../auth");
const validator = require("express-joi-validation").createValidator({
  passError: true
});
const validation_schemas = require("./services/course-validation-schemas");

// end point to get a course by name
router.get(
  "/",
  auth.required,
  auth.guard,
  validator.body(validation_schemas.get_name_body_schema),
  (req, res, next) => {
    routing_services.get_by_name(req, res);
  }
);

// end point to get a course by ObjectId
router.get(
  "/id",
  auth.required,
  auth.guard,
  validator.body(validation_schemas.get_id_body_schema),
  (req, res, next) => {
    routing_services.get_by_id(req, res);
  }
);

// end point to get all courses
router.get("/all", auth.required, auth.guard, (req, res, next) => {
  routing_services.get_all(req, res);
});

// end point to add a new course
router.post(
  "/",
  auth.required,
  auth.guard,
  validator.body(validation_schemas.create_body_schema),
  (req, res, next) => {
    routing_services.create(req, res);
  }
);

module.exports = router;
