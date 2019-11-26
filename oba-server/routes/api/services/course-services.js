const http_utils = require("../../../utils/web");
const logging_utils = require("../../../utils/logger");

const mongoose = require("mongoose");
const Course = mongoose.model("Course");

function get_by_id(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  Course.findById(req.body.course.object_id)
    .lean()
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error("invalid course id");
      http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, record);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(`error getting course by ObjectId: ${err}`);
        http_utils.http_json_fmt(
          res_body,
          http_utils.FLAG_INVALID_INPUT,
          [],
          err
        );
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

function get_by_name(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  Course.findOne({ name: req.body.course.name })
    .lean()
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error("invalid course name");

      http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, record);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(`error getting course by name: ${err}`);
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

function get_all(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  Course.find({})
    .lean()
    .exec()
    .then(records => {
      if (!records)
        throw http_utils.mongoose_promise_chain_error(
          "couldn't retrieve any courses"
        );

      http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, records);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(`error getting all course documents: ${err}`);
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

function create(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  new Course({
    faculty: req.body.course.faculty,
    name: req.body.course.name,
    status: req.body.course.status
  })
    .save()
    .then(record => {
      http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, record);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(`error creating new course: ${err}`);
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

module.exports = { get_by_id, get_all, get_by_name, create };
