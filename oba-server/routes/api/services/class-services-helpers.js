const logging_utils = require("../../../utils/logger");

const mongoose = require("mongoose");
const Class = mongoose.model("Class");

function find_tokenized_criteria_index(req, grad_attribute, criteria) {
  if (!req || !req.files) return -1;
  return req.files.findIndex(obj => {
    const split_index = obj.fieldname.lastIndexOf("_");
    return (
      obj.fieldname.substring(0, split_index) === grad_attribute &&
      obj.fieldname.substring(split_index + 1, obj.fieldname.length) ===
        criteria
    );
  });
}

function update_late_class_statuses(term_filter) {
  Class.updateMany(
    { status: "Incomplete", term: term_filter },
    { status: "Late" }
  )
    .lean()
    .exec()
    .then(() => {
      logging_utils.info("updated records succesfully");
    })
    .catch(err => {
      logging_utils.error(err);
    });
}

function update_class(req, document) {
  // iterate over the multi-dim data array
  for (let i = 0; i < req.body.data.length; ++i) {
    let data_index = -1;

    // empty data, means the current ga can't be in the data array to start
    if (document.data == null) {
      document.data.push({});
      data_index = 0;
    } else {
      // if the ga is in the array, use that index, otherwise create new index
      data_index = document.data.findIndex(
        obj => obj.grad_attribute == req.body.data[i].grad_attribute
      );
      if (data_index == -1) {
        document.data.push({});
        data_index = document.data[document.data.length - 1];
      }
    }

    // graduate attributes
    const grad_attribute = req.body.data[i].grad_attribute;
    if (grad_attribute)
      document.data[i].grad_attribute = grad_attribute;

    // corresponding indicator
    if (req.body.data[i].indicator)
      document.data[i].indicator = req.body.data[i].indicator;

    // questions && answers
    if (req.body.data[i].questions)
      for (let j = 0; j < req.body.data[i].questions.length; ++j) {
        document.data[i].questions_answers[j] = {
          question: req.body.data[i].questions[j],
          answer: req.body.data[i].answers[j]
        };

        delete document.data[i].questions_answers[j]["id"];
      }

    // evaluation reports
    if (req.body.data[i].exceeds) {
      const exceeds_index = find_tokenized_criteria_index(
        req,
        document.data[i].grad_attribute,
        "exceeds"
      );

      document.data[i].evaluation_report = {
        exceeds: {
          criteria: req.body.data[i].exceeds.criteria,
          grade: req.body.data[i].exceeds.grade,
          documents: exceeds_index >= 0 ? req.files[exceeds_index].path : ""
        }
      };
    }

    if (req.body.data[i].meets) {
      const meets_index = find_tokenized_criteria_index(
        req,
        document.data[i].grad_attribute,
        "meets"
      );

      document.data[i].evaluation_report.meets = {
        criteria: req.body.data[i].meets.criteria,
        grade: req.body.data[i].meets.grade,
        documents: meets_index >= 0 ? req.files[meets_index].path : ""
      };
    }

    if (req.body.data[i].developing) {
      const developing_index = find_tokenized_criteria_index(
        req,
        document.data[i].grad_attribute,
        "developing"
      );

      document.data[i].evaluation_report.developing = {
        criteria: req.body.data[i].developing.criteria,
        grade: req.body.data[i].developing.grade,
        documents: developing_index >= 0 ? req.files[developing_index].path : ""
      };
    }

    if (req.body.data[i].fail) {
      const fail_index = find_tokenized_criteria_index(req, grad_attribute, "fail");

      document.data[i].evaluation_report.fail = {
        criteria: req.body.data[i].fail.criteria,
        grade: req.body.data[i].fail.grade,
        documents: fail_index >= 0 ? req.files[fail_index].path : ""
      };
    }
  }

  if (
    !document.status ||
    (req.body.complete_flag === "false" && document.status !== "Late")
  )
    document.status = "Incomplete";
  else document.status = "Complete";
}

module.exports = {
  find_tokenized_criteria_index,
  update_class,
  update_late_class_statuses
};
