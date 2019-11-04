const mongoose = require("mongoose");
const router = require("express").Router();
const passport = require("passport");
const User = mongoose.model("User");
const auth = require("../auth");
const http_status = require("http-status-codes");

router.get("/user", auth.required, async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.currentUser.id);
    if (!currentUser) {
      return res.sendStatus(401);
    }
    return res.json({ user: currentUser.toAuthJSON() });
  } catch (ex) {
    return next(ex);
  }
});

router.post("/users/login", (req, res, next) => {
  const res_body = { status: "", errors: {}, result: {} };
  let errors = undefined;
  if (!req.body.user.email) {
    errors = {
      ...errors,
      email: `can't be blank`
    };
  }
  if (!req.body.user.password) {
    errors = {
      ...errors,
      password: `can't be blank`
    };
  }
  if (errors) {
    return res.status(422).json({ errors });
  }

  // passport is meant to be used as a middleware, so
  // we have to call it with our req, res, next parameters
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      res_body.status =
        http_status.UNPROCESSABLE_ENTITY.toString() +
        " (" +
        http_status.getStatusText(http_status.UNPROCESSABLE_ENTITY) +
        ")";
      res_body.errors["user-login"] = "unable to authenticate user";
      return res.json(res_body);
    }

    if (user) {
      res_body.status =
        http_status.OK.toString() +
        " (" +
        http_status.getStatusText(http_status.OK) +
        ")";

      res_body.result = user.toAuthJSON();

      return res.json(res_body);
    }

    res_body.status =
      http_status.UNPROCESSABLE_ENTITY.toString() +
      " (" +
      http_status.getStatusText(http_status.UNPROCESSABLE_ENTITY) +
      ")";
    res_body.errors["user-login"] = info.errors;
    return res.status(422).json(res_body);
  })(req, res, next);
});

router.post("/users", async (req, res, next) => {
  const res_body = { status: "", errors: {}, result: {} };
  try {
    const user = new User();
    user.role = req.body.user.role;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);
    await user.save();
    res_body.status =
      http_status.OK.toString() +
      " (" +
      http_status.getStatusText(http_status.OK) +
      ")";

    res_body.result = user.toAuthJSON();
  } catch (ex) {
    res_body.status =
      http_status.UNPROCESSABLE_ENTITY.toString() +
      " (" +
      http_status.getStatusText(http_status.UNPROCESSABLE_ENTITY) +
      ")";
    res_body.errors = { "user-register": ex.errors };
  }
  return res.json(res_body);
});

module.exports = router;
