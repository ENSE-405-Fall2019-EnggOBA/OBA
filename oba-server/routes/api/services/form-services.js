const data = require("../../../data/form-data.json");
const http_utils = require("../../../utils/web");

// retrieve all graduate attributes from graduate attributes pool
function get_all_graduate_attributes(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  http_utils.responsify(
    res_body,
    http_utils.FLAG_VALID_INPUT,
    data.graduate_attributes
  );
  return res.json(res_body);
}

// retrieve all indicators from indicators pool
function get_all_indicators(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, data.indicators);
  return res.json(res_body);
}

// retrieve all questions from questions pool
function get_all_questions(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, data.questions);
  return res.json(res_body);
}

module.exports = {
  get_all_graduate_attributes,
  get_all_indicators,
  get_all_questions
};
