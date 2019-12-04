const routing_services = require("./services/form-services");
const router = require("express").Router();
const auth = require("../auth");

// end point to GET a graduate attribute by number
router.get("/grad_attribute", auth.required, auth.guard, (req, res, next) => {
  routing_services.get_graduate_attribute_by_number(req, res);
});

// end point to CREATE a NEW graduate attribute
router.post("/grad_attribute", auth.required, auth.guard, (req, res, next) => {
  routing_services.create_graduate_attribute(req, res);
});

// end point to UPDATE an existing graduate attribute
router.put("/grad_attribute", auth.required, auth.guard, (req, res, next) => {
  routing_services.update_graduate_attribute(req, res);
});

// end point to GET all graduate attributes
router.get("/grad_attributes", auth.required, auth.guard, (req, res, next) => {
  routing_services.get_all_graduate_attributes(req, res);
});

// end point to DELETE a graduate attribute
router.delete("/grad_attribute/:number", auth.required, auth.guard, (req, res, next) => {
  routing_services.delete_graduate_attribute(req, res);
});

// end point to GET a indicator(sub-ga) by number
router.get("/indicator", auth.required, auth.guard, (req, res, next) => {
  routing_services.get_indicator_by_number(req, res);
});

// end point to CREATE a NEW indicator(sub-ga)
router.post("/indicator", auth.required, auth.guard, (req, res, next) => {
  routing_services.create_indicator(req, res);
});

// end point to UPDATE an existing indicator(sub-ga)
router.put("/indicator", auth.required, auth.guard, (req, res, next) => {
  routing_services.update_indicator(req, res);
});

// end point to GET all indicators(sub-ga)
router.get("/indicators", auth.required, auth.guard, (req, res, next) => {
  routing_services.get_all_indicators(req, res);
});

// end point to DELETE an indicator
router.delete("/indicator/:number", auth.required, auth.guard, (req, res, next) => {
  routing_services.delete_indicator(req, res);
});

// end point to GET all questions
router.get("/questions", auth.required, auth.guard, (req, res, next) => {
  routing_services.get_all_questions(req, res);
});

module.exports = router;
