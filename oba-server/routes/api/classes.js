const routing_services = require("./services/class-services");
const router = require("express").Router();
const auth = require("../auth");

// end point to GET all courses associated to an instructors "my classes" page (oba page 4).
router.get("/get_all", auth.required, auth.guard, (req, res, next) => {
  routing_services.get_all(req, res);
});

// end point to ADD a course to an instructors "my classes" page (oba page 4).
router.post("/create", auth.required, auth.guard, (req, res, next) => {
  routing_services.create(req, res);
});

module.exports = router;
