const router = require("express").Router();
router.use("/", require("./users"));
router.use("/classes", require("./classes"));
router.use("/courses", require("./courses"));
router.use("/forms", require("./forms"));

module.exports = router;
