const http_status = require("http-status-codes");

const ERROR_PROMISE_BREAK = "MongoosePromiseChainBreakError";
const FLAG_INVALID_INPUT = 0x1;
const FLAG_VALID_INPUT = 0x2;
const FLAG_UNAUTH_ACCESS = 0x4;

function http_error_response(status_code, error) {
  return {
    status: http_status.getStatusCode(http_status.getStatusText(status_code)),
    error: error
  };
}

function mongoose_promise_chain_error(error_desc) {
  const err = new Error();
  err.type = ERROR_PROMISE_BREAK;
  err.desc = error_desc;
  return err;
}

function responsify(json, flag, result = [], err = null, res = null) {
  if (flag & FLAG_VALID_INPUT) {
    // status code
    json.status =
      http_status.OK.toString() +
      " (" +
      http_status.getStatusText(http_status.OK) +
      ")";

    json.result = result;

    if (res) res.status(http_status.OK);

    // clear errors
    json.errors = [];
  } else if (flag & FLAG_UNAUTH_ACCESS) {
    // status code
    json.status =
      http_status.UNAUTHORIZED.toString() +
      " (" +
      http_status.getStatusText(http_status.UNAUTHORIZED) +
      ")";

    if (!err) return;

    // mongoose chain break error
    if (err.type) {
      json.errors.push(err.desc);
    } else {
      // handle other errors
      json.errors.push(err);
    }
    if (res) res.status(http_status.UNAUTHORIZED);
  } else if (flag & FLAG_INVALID_INPUT) {
    // status code
    json.status =
      http_status.UNPROCESSABLE_ENTITY.toString() +
      " (" +
      http_status.getStatusText(http_status.UNPROCESSABLE_ENTITY) +
      ")";

    if (!err) return;

    // mongoose chain break error
    if (err.type) {
      json.errors.push(err.desc);
    } else {
      // handle other errors
      json.errors.push(err);
    }
    if (res) res.status(http_status.UNPROCESSABLE_ENTITY);
  }
}

module.exports = {
  FLAG_INVALID_INPUT,
  FLAG_VALID_INPUT,
  FLAG_UNAUTH_ACCESS,
  ERROR_PROMISE_BREAK,
  http_error_response,
  mongoose_promise_chain_error,
  responsify
};
