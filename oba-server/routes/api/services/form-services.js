const data = require("../../../data/form-data.json");
const http_status = require("http-status-codes");

// retrieve all graduate attributes from graduate attributes pool
function get_all_graduate_attributes(req, res) {
  const res_body = { status: "", errors: {}, result: {} };
  res_body.status =
    http_status.OK.toString() +
    " (" +
    http_status.getStatusText(http_status.OK) +
    ")";
  res_body.result = data.graduate_attributes;
  return res.json(res_body);
}

// retrieve all indicators from indicators pool
function get_all_indicators(req, res) {
  const res_body = { status: "", errors: {}, result: {} };
  res_body.status =
    http_status.OK.toString() +
    " (" +
    http_status.getStatusText(http_status.OK) +
    ")";
  res_body.result = data.indicators;
  return res.json(res_body);
}

// retrieve all questions from questions pool
function get_all_questions(req, res) {
  const res_body = { status: "", errors: {}, result: {} };
  res_body.status =
    http_status.OK.toString() +
    " (" +
    http_status.getStatusText(http_status.OK) +
    ")";
  res_body.result = data.questions;
  return res.json(res_body);
}

module.exports = {
  get_all_graduate_attributes,
  get_all_indicators,
  get_all_questions
};
