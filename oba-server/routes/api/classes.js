const routing_services = require("./services/class-services");
const router = require("express").Router();
const auth = require("../auth");
const validator = require("express-joi-validation").createValidator({
  passError: true
});
const validation_schemas = require("./services/class-validation-schemas");

// end point to update an exisiting class
router.put("/:id", auth.required, auth.guard, (req, res) => {
  routing_services.update(req, res);
});

// end point to GET all classes associated to an instructor
router.get("/all", auth.required, auth.guard, (req, res) => {
  routing_services.get_all(req, res);
});

// end point to GET a class by its id
router.get('/:id', auth.required, auth.guard, (req, res) => {
  routing_services.get_by_id(req, res)
});

// end point to GET a class by name
router.get(
  "/",
  auth.required,
  auth.guard,
  validator.body(validation_schemas.get_name_body_schema),
  (req, res) => {
    routing_services.get_by_name(req, res);
  }
);

module.exports = router;
