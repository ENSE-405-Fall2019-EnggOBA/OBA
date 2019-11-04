const http_status = require("http-status-codes");
const http_utils = require("../../../utils/web");
const logger = require("../../../utils/logger");

const mongoose = require("mongoose");
const Courses = mongoose.model("Course");

function get_by_id(req, res) {
  const res_body = { status: "", errors: {}, result: {} };
  Courses.findById(req.body.course.object_id)
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error("invalid course id");

      res_body.status =
        http_status.OK.toString() +
        " (" +
        http_status.getStatusText(http_status.OK) +
        ")";

      res_body.result = record;
    })
    .catch(err => {
      if (err) {
        logger.error(`error getting course by ObjectId: ${err}`);
        res_body.status =
          http_status.UNPROCESSABLE_ENTITY.toString() +
          " (" +
          http_status.getStatusText(http_status.UNPROCESSABLE_ENTITY) +
          ")";

          if (err.message) res_body.errors["course-get-id"] = err.message;
          else {
            if (err.meta) {
              res_body.errors["course-get-id"] = err.desc;
            } else {
              res_body.errors["course-get-id"] = err;
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
  Courses.findOne({ name: req.body.course.name })
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error("invalid course name");

      res_body.status =
        http_status.OK.toString() +
        " (" +
        http_status.getStatusText(http_status.OK) +
        ")";

      res_body.result = record;
    })
    .catch(err => {
      if (err) {
        logger.error(`error getting course by name: ${err}`);
        res_body.status =
          http_status.UNPROCESSABLE_ENTITY.toString() +
          " (" +
          http_status.getStatusText(http_status.UNPROCESSABLE_ENTITY) +
          ")";

          if (err.message) res_body.errors["course-get-name"] = err.message;
          else {
            if (err.meta) {
              res_body.errors["course-get-name"] = err.desc;
            } else {
              res_body.errors["course-get-name"] = err;
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
  Courses.find({})
    .exec()
    .then(records => {
      if (!records)
        throw http_utils.mongoose_promise_chain_error(
          "couldn't retrieve any courses"
        );

      res_body.status =
        http_status.OK.toString() +
        " (" +
        http_status.getStatusText(http_status.OK) +
        ")";

      res_body.result = records;
    })
    .catch(err => {
      if (err) {
        logger.error(`error getting all course documents: ${err}`);
        res_body.status =
          http_status.UNPROCESSABLE_ENTITY.toString() +
          " (" +
          http_status.getStatusText(http_status.UNPROCESSABLE_ENTITY) +
          ")";

          if (err.message) res_body.errors["course-get-all"] = err.message;
          else {
            if (err.meta) {
              res_body.errors["course-get-all"] = err.desc;
            } else {
              res_body.errors["course-get-all"] = err;
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
  new Courses({
    faculty: req.body.course.faculty,
    name: req.body.course.name,
    status: req.body.course.status
  })
    .save()
    .then(record => {
      res_body.status =
        http_status.OK.toString() +
        " (" +
        http_status.getStatusText(http_status.OK) +
        ")";
      res_body.result = record;
    })
    .catch(err => {
      if (err) {
        logger.error(`error creating new course: ${err}`);
        res_body.status =
          http_status.UNPROCESSABLE_ENTITY.toString() +
          " (" +
          http_status.getStatusText(http_status.UNPROCESSABLE_ENTITY) +
          ")";

          if (err.message) res_body.errors["course-create"] = err.message;
          else {
            if (err.meta) {
              res_body.errors["course-create"] = err.desc;
            } else {
              res_body.errors["course-create"] = err;
            }
          }
  
        res.status(http_status.UNPROCESSABLE_ENTITY);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

module.exports = { get_by_id, get_all, get_by_name, create };
