const logging_utils = require("../../../utils/logger");
const http_utils = require("../../../utils/web");
const file_utils = require("../../../utils/files");

const { upload_file, passport_auth } = require("./promises");

const mongoose = require("mongoose");
const User = mongoose.model("User");

const upload_schema = require("./user-validation-schemas");

function register(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  const user = new User();
  Promise.resolve(upload_schema.register_user_schema.validate(req.body))
  //
  // upload_file(file_utils.multer_single_file_upload, req, res)
  //   .then(result => {
  //     if (!result)
  //       throw http_utils.mongoose_promise_chain_error("missing avatar field");
  //
  //     logging_utils.info("avatar uploaded.");
  //     return upload_schema.register_user_schema.validate(req.body);
  //   })
    .then(result => {
      if (result.error) {
        throw http_utils.mongoose_promise_chain_error(result.error.details);
      }
      return User.findOne({ email: req.body.email }).exec();
    })
    .then(record => {
      if (record)
        throw http_utils.mongoose_promise_chain_error("user already exists");

      logging_utils.info("unique user confirmed.");

      logging_utils.info("form fields validated, saving user");
      user.email = req.body.email;
      user.role = req.body.role;
      user.faculty = req.body.faculty;
      user.setPassword(req.body.password);
      if (req.files && req.files.avatar) user.avatar = req.files.avatar[0].path;

      // find equivalent course to create an instance of.
      return user.save();
    })
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error("invalid user record");

      logging_utils.info("user registered succesfully!");
      http_utils.responsify(
        res_body,
        http_utils.FLAG_VALID_INPUT,
        user.toAuthJSON(),
        [],
        res
      );
    })
    .catch(err => {
      logging_utils.error(`error registering user: ${err}`);
      http_utils.responsify(
        res_body,
        http_utils.FLAG_INVALID_INPUT,
        [],
        err,
        res
      );
    })
    .finally(() => {
      return res.json(res_body);
    });
}

function login(req, res, next) {
  const res_body = { status: "", errors: [], result: {} };

  passport_auth(req, res, next)
    .then(user => {
      if (user) {
        logging_utils.info("found user, logged in succesfully");
        http_utils.responsify(
          res_body,
          http_utils.FLAG_VALID_INPUT,
          user.toAuthJSON(),
          [],
          res
        );
      } else {
        logging_utils.error("could not find user");
        http_utils.responsify(
          res_body,
          web.FLAG_INVALID_INPUT,
          [],
          "unable to find user",
          res
        );
      }
    })
    .catch(err => {
      if (err) {
        logging_utils.error(
          `unable to authenticate user. Invalid email or pass.${err.errors}`
        );
        http_utils.responsify(
          res_body,
          http_utils.FLAG_INVALID_INPUT,
          [],
          "unable to authenticate user. Invalid email or pass.",
          res
        );
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

module.exports = {
  register,
  login
};
