const routing_services = require("./services/form-services");
const router = require("express").Router();
const auth = require("../auth");

// end point to GET all graduate attributes
router.get("/get_all_graduate_attributes", auth.required, auth.guard, (req, res, next) => {
  routing_services.get_all_graduate_attributes(req, res);
});

// end point to GET all indicators
router.get("/get_all_indicators", auth.required, auth.guard, (req, res, next) => {
  routing_services.get_all_indicators(req, res);
});

module.exports = router;
