const logging_utils = require("../../../utils/logger");

const mongoose = require("mongoose");
const Class = mongoose.model("Class");

function get_document_name(req, grad_attribute, criteria, fallback) {
  grad_attribute = grad_attribute.replace(' ', '_');
  if (!req || !req.files) return fallback;
  const file = req.files.find(obj => {
    const split_index = obj.fieldname.lastIndexOf("_");
    return (
      obj.fieldname.substring(0, split_index) === grad_attribute &&
      obj.fieldname.substring(split_index + 1, obj.fieldname.length) ===
        criteria
    );
  });
  if (!file) return fallback;
  const extindex = file.originalname.lastIndexOf('.')
  const ext = extindex >= 0 ? file.originalname.substring(extindex) : ''
  return file.path + ext;
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
    const oldDocuments = {
      exceeds: document.data[i].evaluation_report.exceeds.documents,
      meets: document.data[i].evaluation_report.meets.documents,
      developing: document.data[i].evaluation_report.developing.documents,
      fail: document.data[i].evaluation_report.fail.documents,
    }
    document.data[i].evaluation_report = {}
    if (req.body.data[i].exceeds) {
      document.data[i].evaluation_report.exceeds = {
        criteria: req.body.data[i].exceeds.criteria,
        grade: req.body.data[i].exceeds.grade,
        documents: get_document_name(req, grad_attribute, 'exceeds',
          oldDocuments.exceeds),
      };
    }

    if (req.body.data[i].meets) {
      document.data[i].evaluation_report.meets = {
        criteria: req.body.data[i].meets.criteria,
        grade: req.body.data[i].meets.grade,
        documents: get_document_name(req, grad_attribute, 'meets',
          oldDocuments.meets),
      };
    }

    if (req.body.data[i].developing) {
      document.data[i].evaluation_report.developing = {
        criteria: req.body.data[i].developing.criteria,
        grade: req.body.data[i].developing.grade,
        documents: get_document_name(req, grad_attribute, 'developing',
          oldDocuments.developing),
      };
    }

    if (req.body.data[i].fail) {
      document.data[i].evaluation_report.fail = {
        criteria: req.body.data[i].fail.criteria,
        grade: req.body.data[i].fail.grade,
        documents: get_document_name(req, grad_attribute, 'fail',
          oldDocuments.fail),
      };
    }
    console.log(oldDocuments)
    console.log(document.data[i].evaluation_report)
  }

  if (
    !document.status ||
    (req.body.complete_flag === "false" && document.status !== "Late")
  )
    document.status = "Incomplete";
  else document.status = "Complete";
}

module.exports = {
  update_class,
  update_late_class_statuses
};
