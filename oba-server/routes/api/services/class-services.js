const http_status = require("http-status-codes");
const http_utils = require("../../../utils/web");
const logger = require("../../../utils/logger");

const mongoose = require("mongoose");
const Users = mongoose.model("User");
const Courses = mongoose.model("Course");
const Classes = mongoose.model("Class");

function get_all(req, res) {
  const res_body = { status: "", result: "", errors: [] };
  Users.findById(req.currentUser.id)
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt find current user"
        );
      return Classes.find({
        _id: { $in: record.classes }
      })
        .where("_id")
        .in(record.classes)
        .exec();
    })
    .then(records => {
      logger.info("found all classes");
      res_body.status = "ok";
      res_body.result = records;
    })
    .catch(err => {
      if (err) {
        logger.error(`error getting classes: ${err}`);
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
  if (!req.body.class)
    return res.json(
      http_utils.http_error_response(
        http_status.UNPROCESSABLE_ENTITY,
        "missing class in body of request"
      )
    );

  const faculty_name = req.body.class.faculty_name;
  if (!faculty_name)
    return res.json(
      http_utils.http_error_response(
        http_status.UNPROCESSABLE_ENTITY,
        "missing faculty name field"
      )
    );

  const course_number = req.body.class.course_number;
  if (!course_number)
    return res.json(
      http_utils.http_error_response(
        http_status.UNPROCESSABLE_ENTITY,
        "missing course_number field"
      )
    );

  const status = req.body.class.status;
  if (!status)
    return res.json(
      http_utils.http_error_response(
        http_status.UNPROCESSABLE_ENTITY,
        "missing status field"
      )
    );

  const term = req.body.class.term;
  if (!term)
    return res.json(
      http_utils.http_error_response(
        http_status.UNPROCESSABLE_ENTITY,
        "missing term field"
      )
    );

  const year = req.body.class.year;
  if (!year)
    return res.json(
      http_utils.http_error_response(
        http_status.UNPROCESSABLE_ENTITY,
        "missing year field"
      )
    );

  let user, course;
  const res_body = { status: "", result: "", errors: [] };

  Users.findById(req.currentUser.id)
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt find current user"
        );
      user = record;
      return Courses.findOne({ course_number: course_number }).exec();
    })
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "couldnt find existing course to create class for"
        );

      logger.info("course found.");
      course = record;
      // create a new class
      return new Classes({
        course_id: course.id,
        instructor_ids: [user.id],
        status: status,
        year: year,
        term: term
      }).save();
    })
    .then(record => {
      logger.info("new class succesfully created.");
      // add class to users class list
      user.classes.push(record.id);
      res_body.result = record;
      return user.save();
    })
    .then(() => {
      logger.info("user classes updated.");
      res_body.status = "ok";
    })
    .catch(err => {
      if (err) {
        if (err.name === http_utils.mongoose_chain_error) {
          logger.error(`${err.desc}`);
        } else logger.error(`error adding classes: ${err}`);

        res_body.errors.push(err);
        res_body.status = "bad";
        res.status(http_status.UNPROCESSABLE_ENTITY);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

module.exports = { get_all, create };
