const http_status = require("http-status-codes");
const http_utils = require("../../../utils/web");
const logger = require("../../../utils/logger");

const mongoose = require("mongoose");
const Users = mongoose.model("User");
const Course = mongoose.model("Course");
const Class = mongoose.model("Class");

const files = require("../../../utils/files");
const upload_schema = require("./class-validation-schemas");

function update(req, res) {
  const res_body = { status: "", errors: {}, result: {} };

  // uploads files to server and binds multipart/form-data
  // encoded data into req.body, files in req.files
  files
    .upload_async(files.multer_multi_doc_upload, req, res)
    .then((result) => {
      logger.info("files uploaded. request filled with multipart/form data.");
      return Users.findById(req.currentUser.id).exec();
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
        var joi_errors = result.error.details.map(value =>
          value.message.replace(/"/g, "")
        );
        throw http_utils.mongoose_promise_chain_error({ joi: joi_errors });
      }

      logger.info("form fields validated.");

      return Class.findOne({
        _id: req.body.class_id
      });
    })
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt find class that is being updated"
        );

      logger.info("found target class, trying to update.");

      // graduate attributes
      record.graduate_attributes = req.body.graduateattr;

      // indicators
      record.indicators = req.body.indicator;

      // questions && answers
      for (let i = 0; i < req.body.questions.length; ++i) {
        record.questions_answers[i] = {
          question: req.body.questions[i],
          answer: req.body.answers[i]
        };

        delete record.questions_answers[i]["id"];
      }

      // evaluation reports
      const exceeds = req.body.exceeds;
      record.evaluation_report = {
        exceeds: {
          criteria: exceeds["criteria"],
          grade: exceeds["grade"],
          documents:
            req.files && req.files.exceeds_doc[0]
              ? req.files.exceeds_doc[0].path
              : ""
        }
      };

      const meets = req.body.meets;
      record.evaluation_report.meets = {
        criteria: meets["criteria"],
        grade: meets["grade"],
        documents:
          req.files && req.files.meets_doc[0] ? req.files.meets_doc[0].path : ""
      };

      const developing = req.body.developing;
      record.evaluation_report.developing = {
        criteria: developing["criteria"],
        grade: developing["grade"],
        documents:
          req.files && req.files.developing_doc[0]
            ? req.files.developing_doc[0].path
            : ""
      };

      const fail = req.body.fail;
      record.evaluation_report.fail = {
        criteria: fail["criteria"],
        grade: fail["grade"],
        documents:
          req.files && req.files.fail_doc[0] ? req.files.fail_doc[0].path : ""
      };
      return record.save();
    })
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt save changes to class that is being updated"
        );

      logger.info(`class ${record._id} updated succesfully.`);
      res_body.status =
        http_status.OK.toString() +
        " (" +
        http_status.getStatusText(http_status.OK) +
        ")";
      res_body.result = record;
    })
    .catch(err => {
      if (err) {
        logger.error(`error updating class: ${err}`);
        res_body.status =
          http_status.UNPROCESSABLE_ENTITY.toString() +
          " (" +
          http_status.getStatusText(http_status.UNPROCESSABLE_ENTITY) +
          ")";

        if (err.message) res_body.errors["class-update"] = err.message;
        else {
          if (err.meta) {
            res_body.errors["class-update"] = err.desc;
          } else {
            res_body.errors["class-update"] = err;
          }
        }

        res.status(http_status.UNPROCESSABLE_ENTITY);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

function get_by_id(req, res) {
  const res_body = { status: "", errors: {}, result: {} };
  Users.findById(req.currentUser.id)
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt find current user"
        );
      return Class.find({
        _id: req.body.class.object_id
      })
      .populate('course_id')
      .exec();
    })
    .then(record => {
      if (!record.length)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt find class by ObjectId"
        );

      logger.info("found class by ObjectId");
      res_body.status =
        http_status.OK.toString() +
        " (" +
        http_status.getStatusText(http_status.OK) +
        ")";
      res_body.result = record;
    })
    .catch(err => {
      if (err) {
        logger.error(`error getting class by ObjectId: ${err}`);
        res_body.status =
          http_status.UNPROCESSABLE_ENTITY.toString() +
          " (" +
          http_status.getStatusText(http_status.UNPROCESSABLE_ENTITY) +
          ")";

        if (err.message) res_body.errors["class-get-id"] = err.message;
        else {
          if (err.meta) {
            res_body.errors["class-get-id"] = err.desc;
          } else {
            res_body.errors["class-get-id"] = err;
          }
        }

        res.status(http_status.UNPROCESSABLE_ENTITY);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

function get_by_name(req, res) {
  const res_body = { status: "", errors: {}, result: {} };
  let records;
  Users.findById(req.currentUser.id)
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt find current user"
        );
      return Class.find({
        _id: { $in: record.classes }
      })
        .populate('course_id')
        .exec();
    })
    .then(records => {
      records = records.filter(
        record => record.course_id.name === req.body.class.name
      );

      if (records.length === 0)
        throw http_utils.mongoose_promise_chain_error(
          "user does not have any matching classes with given name"
        );

      logger.info("found classe(s) by name");

      res_body.status =
        http_status.OK.toString() +
        " (" +
        http_status.getStatusText(http_status.OK) +
        ")";
      res_body.result = records;
    })
    .catch(err => {
      if (err) {
        logger.error(`error getting class by name: ${err}`);
        res_body.status =
          http_status.UNPROCESSABLE_ENTITY.toString() +
          " (" +
          http_status.getStatusText(http_status.UNPROCESSABLE_ENTITY) +
          ")";

        if (err.message) res_body.errors["class-get-name"] = err.message;
        else {
          if (err.meta) {
            res_body.errors["class-get-name"] = err.desc;
          } else {
            res_body.errors["class-get-name"] = err;
          }
        }

        res.status(http_status.UNPROCESSABLE_ENTITY);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

function get_all(req, res) {
  const res_body = { status: "", errors: {}, result: {} };
  Users.findById(req.currentUser.id)
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt find current user"
        );
      return Class.find({
        _id: { $in: record.classes }
      })
        .populate('course_id')
        .exec();
    })
    .then(records => {
      if (!records.length)
      throw http_utils.mongoose_promise_chain_error(
        "couldnt find any classes for user"
      );
      logger.info("found all classes");
      res_body.status =
        http_status.OK.toString() +
        " (" +
        http_status.getStatusText(http_status.OK) +
        ")";
      res_body.result = records;
    })
    .catch(err => {
      if (err) {
        logger.error(`error getting classes: ${err}`);
        res_body.status =
          http_status.UNPROCESSABLE_ENTITY.toString() +
          " (" +
          http_status.getStatusText(http_status.UNPROCESSABLE_ENTITY) +
          ")";

        if (err.message) res_body.errors["class-get-all"] = err.message;
        else {
          if (err.meta) {
            res_body.errors["class-get-all"] = err.desc;
          } else {
            res_body.errors["class-get-all"] = err;
          }
        }

        res.status(http_status.UNPROCESSABLE_ENTITY);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

function create(req, res) {
  const res_body = { status: "", errors: {}, result: {} };
  let user, course;
  Users.findById(req.currentUser.id)
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt find current user"
        );
      user = record;
      return Course.findOne({
        name: req.body.class.name
      }).exec();
    })
    .then(record => {
      
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt find existing course to create class for"
        );

      logger.info("course found.");
      course = record;
      // create a new class
      return new Class({
        course_id: course.id,
        instructor_ids: [user.id],
        status: req.body.class.status,
        year: req.body.class.year,
        term: req.body.class.term
      }).save();
    })
    .then(record => {
      logger.info("new class succesfully created.");
      // add class to users class list
      user.classes.push(record.id);
      return user.save();
    })
    .then(record => {
      logger.info("user classes updated.");
      res_body.result = record;
      res_body.status =
        http_status.OK.toString() +
        " (" +
        http_status.getStatusText(http_status.OK) +
        ")";
    })
    .catch(err => {
      if (err) {
        if (err.name === http_utils.mongoose_chain_error) {
          logger.error(`${err.desc}`);
        } else logger.error(`error adding classes: ${err}`);

        res_body.status =
          http_status.UNPROCESSABLE_ENTITY.toString() +
          " (" +
          http_status.getStatusText(http_status.UNPROCESSABLE_ENTITY) +
          ")";

        if (err.message) res_body.errors["class-create"] = err.message;
        else {
          if (err.meta) {
            res_body.errors["class-create"] = err.desc;
          } else {
            res_body.errors["class-create"] = err;
          }
        }

        res.status(http_status.UNPROCESSABLE_ENTITY);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

module.exports = { get_all, create, get_by_id, get_by_name, update };
