const http_status = require("http-status-codes");
const http_utils = require("../../../utils/web");
const logger = require("../../../utils/logger");

const mongoose = require("mongoose");
const Courses = mongoose.model("Course");

function get_by_id(req, res) {
  const res_body = { status: "", result: "", errors: [] };

  const course_object_Id = req.body.course.object_id;
  if (!course_object_Id)
    return res.json(
      http_utils.http_error_response(
        http_status.UNPROCESSABLE_ENTITY,
        "missing object id field"
      )
    );

  Courses.findById(course_object_Id)
    .exec()
    .then(record => {
      res_body.status = "ok";
      res_body.result = record;
    })
    .catch(err => {
      if (err) {
        logger.error(`error getting course by ObjectId: ${err}`);
        res_body.status = "bad";
        res_body.errors.push(err);
        res.status(http_status.UNPROCESSABLE_ENTITY);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

function get_all(req, res) {
  const res_body = { status: "", result: "", errors: [] };
  Courses.find({})
    .exec()
    .then(records => {
      res_body.status = "ok";
      res_body.result = records;
    })
    .catch(err => {
      if (err) {
        logger.error(`error getting all course documents: ${err}`);
        res_body.status = "bad";
        res_body.errors.push(err);
        res.status(http_status.UNPROCESSABLE_ENTITY);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

function create(req, res) {
  const res_body = { status: "", result: "", errors: [] };
  const course = new Courses();

  course.faculty_name = req.body.course.faculty_name;
  if (!course.faculty_name)
    return res.json(
      http_utils.http_error_response(
        http_status.UNPROCESSABLE_ENTITY,
        "missing faculty name field"
      )
    );

  course.course_number = req.body.course.course_number;
  if (!course.course_number)
    return res.json(
      http_utils.http_error_response(
        http_status.UNPROCESSABLE_ENTITY,
        "missing course number field"
      )
    );

  course.status = req.body.course.status;
  if (!course.status)
    return res.json(
      http_utils.http_error_response(
        http_status.UNPROCESSABLE_ENTITY,
        "missing status field"
      )
    );

  course
    .save()
    .then(record => {
      res_body.status = "ok";
      res_body.result = record;
    })
    .catch(err => {
      if (err) {
        logger.error(`error creating new course: ${err}`);
        res_body.status = "bad";
        res_body.errors.push(err);
        res.status(http_status.UNPROCESSABLE_ENTITY);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

module.exports = { get_by_id, get_all, create };
