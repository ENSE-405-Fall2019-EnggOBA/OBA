const jwt = require("express-jwt");
const { secret } = require("../config");
const http_status = require("http-status-codes");
const logger = require("../utils/logger");
const http_utils = require("../utils/web");

function getToken(req) {
  const { authorization } = req.headers;
  if (!authorization) {
    return null;
  }
  const [method, token] = authorization.split(" ");
  if (["Token", "Bearer"].includes(method)) {
    return token;
  }
  return null;
}

function guard(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    const res_body = { status: "", errors: [], result: {} };
    res.status(http_status.UNAUTHORIZED);
    logger.error(
      `[${req.protocol +
        "://" +
        req.get("host") +
        req.originalUrl}] ERROR: ${http_status.getStatusText(
        http_status.UNAUTHORIZED
      )}`
    );

    http_utils.responsify(
      res_body,
      http_utils.FLAG_UNAUTH_ACCESS,
      [],
      "Unauthorized access to protected route.",
      res
    );
    return res.json(res_body);
  } else next();
}

module.exports = {
  guard,
  required: jwt({
    secret,
    userProperty: "currentUser",
    getToken
  })
};
