const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const errorhandler = require("errorhandler");
const config = require("./config");
const http_status = require("http-status-codes");

const app = express();

app.use(cors());
app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(config.mongodbUri, {
  // options to use new non-deorecated settings
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

if (!config.isProduction) {
  app.use(errorhandler());
  mongoose.set("debug", true);
}

require("./models/User");
require("./models/Course");
require("./models/Class");
require("./config/passport");

// main application routes
app.use(require("./routes"));

// 404 error generator
app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});

// development error handler showing stack traces
if (!config.isProduction) {
  app.use((error, req, res, next) => {
    // handle joi validation error
    if (error && error.error && error.error.details) {
      const res_body = { status: "", errors: {}, result: {} };
      var joi_errors = error.error.details.map(value =>
        value.message.replace(/"/g, "")
      );
      res_body.errors['joi'] = joi_errors;
      res_body.status =
        http_status.UNPROCESSABLE_ENTITY.toString() +
        " (" +
        http_status.getStatusText(http_status.UNPROCESSABLE_ENTITY) +
        ")";
      
      res.status(http_status.UNPROCESSABLE_ENTITY).json(res_body);
    } else {
      console.log(error.stack);
      res.status(error.status || 500);
      res.json({
        errors: {
          message: error.message,
          error
        }
      });
    }
  });
}

// production error handler hiding stack traces
app.use((error, req, res, next) => {
  // handle joi validation error
  if (error && error.error && error.error.details) {
    const res_body = { status: "", errors: {}, result: {} };
    var joi_errors = error.error.details.map(value =>
      value.message.replace(/"/g, "")
    );
    res_body.errors['joi'] = joi_errors;
    res_body.status =
      http_status.UNPROCESSABLE_ENTITY.toString() +
      " (" +
      http_status.getStatusText(http_status.UNPROCESSABLE_ENTITY) +
      ")";
    
    res.status(http_status.UNPROCESSABLE_ENTITY).json(res_body);
  } else {
    res.status(error.status || 500);
    res.json({
      errors: {
        message: error.message,
        error
      }
    });
  }
});

// start server
const server = app.listen(config.port, () => {
  console.log(`Listening on port ${server.address().port}`);
});
