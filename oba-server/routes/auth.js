const jwt = require('express-jwt');
const { secret } = require('../config');
const http_status = require("http-status-codes");
const logger = require("../utils/logger");

function getToken(req) {
  const { authorization } = req.headers
  if (!authorization) {
      return null
  }
  const [ method, token ] = authorization.split(' ')
  if ([ 'Token', 'Bearer' ].includes(method)) {
      return token
  }
  return null
}

function guard(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(http_status.UNAUTHORIZED);
    logger.error(
      `[${req.protocol +
        "://" +
        req.get("host") +
        req.originalUrl}] ERROR: ${http_status.getStatusText(
        http_status.UNAUTHORIZED
      )}`
    );
    const status = http_status.getStatusText(http_status.UNAUTHORIZED);
    return res.json({
      status: "bad",
      result: "",
      error:
        status.toUpperCase() +
        "(" +
        http_status.getStatusCode(status).toString() +
        ")"
    });
  } else next();
}

module.exports = {
  guard,
  required: jwt({
    secret,
    userProperty: 'currentUser',
    getToken
  })
};
