const http_status = require("http-status-codes");
const mongoose_chain_error = "MongoosePromiseChainBreakError";

function http_error_response(status_code, error) {
  return {
    status: http_status.getStatusCode(http_status.getStatusText(status_code)),
    error: error
  };
}

function mongoose_promise_chain_error(error_desc) {
  const err = new Error();
  err.name = mongoose_chain_error;
  err.desc = error_desc;
  return err;
}

module.exports = {
  http_error_response,
  mongoose_promise_chain_error,
  mongoose_chain_error
};
