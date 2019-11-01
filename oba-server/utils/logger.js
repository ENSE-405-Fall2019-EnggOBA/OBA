const config = require("../config/index");
const winston = require("winston");

const logger_debug_config = {
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
};

const logger_prod_config = {
  level: this.emerg,
  transports: [
    new winston.transports.Console({
      silent: true
    })
  ]
};

module.exports = winston.createLogger(
  config.isProduction ? logger_prod_config : logger_debug_config
);
