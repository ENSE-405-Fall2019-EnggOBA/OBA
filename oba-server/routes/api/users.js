const router = require("express").Router();
const routing_services = require("../api/services/user-services");
const validator = require("express-joi-validation").createValidator({
  passError: true
});
const validation_schemas = require("./services/user-validation-schemas");

router.post(
  "/users/login",
  validator.body(validation_schemas.login_user_schema),
  (req, res, next) => {
    routing_services.login(req, res, next);
  }
);

router.post("/users", (req, res, next) => {
  routing_services.register(req, res);
});

module.exports = router;
