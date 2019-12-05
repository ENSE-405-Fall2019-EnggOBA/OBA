const http_utils = require("../../../utils/web");
const logging_utils = require("../../../utils/logger");
const file_utils = require("../../../utils/files");

const mongoose = require("mongoose");
const User = mongoose.model("User");
const Course = mongoose.model("Course");
const Class = mongoose.model("Class");
const ObjectId = mongoose.Types.ObjectId;

const upload_schema = require("./class-validation-schemas");
const service_helpers = require("./class-services-helpers");
const { upload_file } = require("./promises");

const user_premissions = require("./../../../data/misc-data.json");

// uploads files to server and binds multipart/form-data
// encoded data into req.body, files in req.files
function update(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  let course_id;
  upload_file(file_utils.multer_multi_doc_upload, req, res)
    .then(result => {
      if (!result)
        throw http_utils.mongoose_promise_chain_error(
          "expected an object with documents"
        );

      logging_utils.info(
        "files uploaded. request filled with multipart/form data."
      );
      return User.findById(req.currentUser.id).exec();
    })
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt find current user"
        );
      return upload_schema.update_body_schema.validate(req.body);
    })
    .then(result => {
      if (result.error) {
        throw http_utils.mongoose_promise_chain_error(result.error.details);
      }

      logging_utils.info("form fields validated.");

      // find equivalent course to create an instance of.
      return Course.findOne({
        name: req.body.course_name
      })
        .lean()
        .exec();
    })
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt find an equaivlent course for the class."
        );

      logging_utils.info(
        "found a course, trying to update a class if it exists, otherwise create new."
      );

      course_id = record._id;

      return Class.findOneAndUpdate(
        {
          _id: ObjectId(req.params.id),
          course_id,
          term: req.body.term,
          year: req.body.year,
        },
        {
          expire: new Date(),
          instructor_id: ObjectId(req.currentUser.id),
        },
        { upsert: true, new: true, set: true }
      ).exec();
    })
    .then(record => {
      service_helpers.update_class(req, record);
      return record.save();
    })
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt save changes to the class that is being updated"
        );

      logging_utils.info(`class ${record._id} updated succesfully.`);
      http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, record);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(`error updating class: ${err}`);
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

async function get_by_id(req, res) {
  const res_body = { status: '', errors: [], result: {} };
  try {
    const user = await User.findById(req.currentUser.id);
    if (!user) {
      throw http_utils.mongoose_promise_chain_error(
        "couldnt find current user"
      );
    }
    const requestedClass = await Class.findById(req.params.id);
    if (!requestedClass) {
      throw http_utils.mongoose_promise_chain_error(
        `couldn't find class`
      );
    }
    http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, requestedClass)
  } catch (err) {
    if (err) {
      logging_utils.error(`error getting class by name: ${err}`);
      http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
    }
  } finally {
    return res.json(res_body);
  }
}

function get_by_name(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  let user_faculty;
  let user_role;
  let user_premission_level;
  User.findById(req.currentUser.id)
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt find current user"
        );
      user_faculty = record.faculty;
      user_role = record.role;
      user_premission_level = user_premissions.role_access_levels[user_role];
      return Class.find(
        user_premission_level === user_premissions.premissions["read_all"] ||
          user_premission_level ===
            user_premissions.premissions["read_faculty"] ||
          user_premission_level ===
            user_premissions.premissions["read_faculty_write_local"]
          ? {}
          : {
              _id: { $in: record.classes }
            }
      )
        .populate({ path: "course_id", options: { lean: true } })
        .lean()
        .exec();
    })
    .then(records => {
      records = records.filter(record => {
        return (
          (((user_premission_level ===
            user_premissions.premissions["read_all"] &&
            record.course_id.name === req.body.class.name) ||
            user_premissions.premissions["read_faculty"] ||
            user_premission_level ===
              user_premissions.premissions["read_faculty_write_local"]) &&
            record.course_id.faculty === user_faculty &&
            record.course_id.name === req.body.class.name) ||
          (req.body.class && record.course_id.name === req.body.class.name)
        );
      });

      if (records.length === 0)
        throw http_utils.mongoose_promise_chain_error(
          "user does not have any matching classes with given name"
        );

      logging_utils.info("found classes by name");

      http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, records);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(`error getting class by name: ${err}`);
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

function get_all(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  let user_role;
  let user_faculty;
  let user_premission_level;
  User.findById(req.currentUser.id)
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt find current user"
        );

      user_role = record.role;
      user_faculty = record.faculty;
      user_premission_level = user_premissions.role_access_levels[user_role];
      return Class.find(
        user_premission_level === user_premissions.premissions["read_all"] ||
          user_premission_level ===
            user_premissions.premissions["read_faculty"] ||
          user_premission_level ===
            user_premissions.premissions["read_faculty_write_local"]
          ? {}
          : {
              instructor_id: ObjectId(req.currentUser.id)
            }
      )
        .populate({ path: "course_id", options: { lean: true } })
        .lean()
        .exec();
    })
    .then(records => {
      if (
        user_premission_level ===
          user_premissions.premissions["read_faculty"] ||
        user_premission_level ===
          user_premissions.premissions["read_faculty_write_local"]
      ) {
        records = records.filter(
          record => record.course_id.faculty === user_faculty
        );
      }

      logging_utils.info("found all classes");
      http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, records);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(`error getting classes: ${err}`);
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

module.exports = { get_all, get_by_name, update, get_by_id };
