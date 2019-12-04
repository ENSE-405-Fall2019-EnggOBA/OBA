const data = require("../../../data/form-data.json");
const http_utils = require("../../../utils/web");
const logging_utils = require("../../../utils/logger");

const mongoose = require("mongoose");
const Indicator = mongoose.model("Indicator");
const GraduateAttribute = mongoose.model("GraduateAttribute");

// delete a graduate attribute by number
function delete_graduate_attribute(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  GraduateAttribute.findOneAndDelete({ number: req.params.number })
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "could not delete graduate attribute with given number"
        );
        logging_utils.info("deleted graduate attribute succesfully!");
        http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, record);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(
          `error deleting graduate attribute by number: ${err}`
        );
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

// delete an indicator by number
function delete_indicator(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  Indicator.findOneAndDelete({ number: req.params.number })
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "could not delete indicator with given number"
        );

        logging_utils.info("deleted indicator succesfully!");
        http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, record);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(`error deleting indicator by number: ${err}`);
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

// get a graduate attribute by number
function get_graduate_attribute_by_number(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  GraduateAttribute.findOne({ number: req.body.graduate_attribute.number })
    .lean()
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "could not find graduate attribute by given number"
        );

      logging_utils.info("found attributes");
      http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, record);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(
          `error getting graduate attribute by given number: ${err}`
        );
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

// create a new UNIQUE graduate attribute
function create_graduate_attribute(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  const graduate_attribute = new GraduateAttribute();

  graduate_attribute.number = req.body.graduate_attribute.number;
  graduate_attribute.title = req.body.graduate_attribute.title;
  graduate_attribute.description = req.body.graduate_attribute.description;
  graduate_attribute.sub_gas = req.body.graduate_attribute.sub_gas;
  GraduateAttribute.findOne({ number: graduate_attribute.number })
    .lean()
    .exec()
    .then(record => {
      if (record)
        throw http_utils.mongoose_promise_chain_error(
          "graduate attribute record already exists"
        );

      logging_utils.info(
        "graduate attribute data is unique, saving to the db."
      );
      return graduate_attribute.save();
    })
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "could not persist changes to db."
        );

      logging_utils.info("created graduate attribute succesfully!");
      http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, record);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(`error creating a new graduate attribute: ${err}`);
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

// update an exisiting graduate attribute
function update_graduate_attribute(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  GraduateAttribute.findOne({ number: req.body.graduate_attribute.number })
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "cannot find exisiting graduate attribute to update."
        );

      logging_utils.info(
        "found exisiting graduate attribute, trying to update"
      );

      if (req.body.graduate_attribute.title)
        record.title = req.body.graduate_attribute.title;

      if (req.body.graduate_attribute.description)
        record.description = req.body.graduate_attribute.description;

      if (
        req.body.graduate_attribute.sub_gas &&
        req.body.graduate_attribute.sub_gas.length > 0
      )
        record.sub_gas = req.body.graduate_attribute.sub_gas;

      return record.save();
    })
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "could not persist changes to exisiting graduate attribute record."
        );
      http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, record);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(
          `error updating exisiting graduate attribute: ${err}`
        );
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

// get all graduate attributes
function get_all_graduate_attributes(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  GraduateAttribute.find({})
    .lean()
    .exec()
    .then(records => {
      logging_utils.info("found all graduate attributes");
      http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, records);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(`error getting all graduate attributes: ${err}`);
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

// get an indicator by number
function get_indicator_by_number(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  Indicator.findOne({ number: req.body.indicator.number })
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "could not find indicator by given number"
        );

      logging_utils.info("found indicator by given number");
      http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, record);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(`error getting indicator by give number: ${err}`);
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

// create a unique indicator
function create_indicator(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  const indicator = new Indicator();

  indicator.number = req.body.indicator.number;
  indicator.title = req.body.indicator.title;
  Indicator.findOne({ number: indicator.number })
    .exec()
    .then(record => {
      if (record)
        throw http_utils.mongoose_promise_chain_error(
          "indicator record already exists"
        );

      logging_utils.info("indicator data is unique, saving to the db.");
      return indicator.save();
    })
    .then(result => {
      if (!result)
        throw http_utils.mongoose_promise_chain_error(
          "could not persist changes to db."
        );

      logging_utils.info("created indicator succesfully!");
      http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, result);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(`error creating a new indicator: ${err}`);
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

// update an exisiting indicator
function update_indicator(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  Indicator.findOne({ number: req.body.indicator.number })
    .exec()
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "cannot find exisiting indicator to update."
        );

      logging_utils.info("found exisiting indicator, trying to update");
      record.title = req.body.indicator.title;
      return record.save();
    })
    .then(record => {
      if (!record)
        throw http_utils.mongoose_promise_chain_error(
          "could not persist changes to exisiting indicator record."
        );
      http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, record);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(`error getting graduate attributes: ${err}`);
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

// get all indicators
function get_all_indicators(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  Indicator.find({})
    .exec()
    .then(records => {
      logging_utils.info("succesfully retrieved all indicator records");
      http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, records);
    })
    .catch(err => {
      if (err) {
        logging_utils.error(`error creating a new indicator: ${err}`);
        http_utils.responsify(res_body, http_utils.FLAG_INVALID_INPUT, [], err);
      }
    })
    .finally(() => {
      return res.json(res_body);
    });
}

// get all questions
function get_all_questions(req, res) {
  const res_body = { status: "", errors: [], result: {} };
  http_utils.responsify(res_body, http_utils.FLAG_VALID_INPUT, data.questions);
  return res.json(res_body);
}

module.exports = {
  get_graduate_attribute_by_number,
  create_graduate_attribute,
  update_graduate_attribute,
  get_all_graduate_attributes,
  delete_graduate_attribute,
  get_indicator_by_number,
  create_indicator,
  update_indicator,
  get_all_indicators,
  delete_indicator,
  get_all_questions
};
