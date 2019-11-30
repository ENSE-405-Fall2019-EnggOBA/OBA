const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const errorhandler = require("errorhandler");
require("dotenv-extended").config();
const config = require("./config");
const http_utils = require("./utils/web");
const app = express();

const Agenda = require("agenda");
const agenda = new Agenda({
  db: {
    address: config.mongodbUri,
    collection: "Agenda_Deferred_Jobs",
    options: { useNewUrlParser: true, useUnifiedTopology: true }
  }
});

require("./agenda/agenda-late-notifications")(agenda);

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
require("./models/Indicator");
require("./models/GraduateAttribute");
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
    // handle joi validation errors
    if (error && error.error && error.error.details) {
      const res_body = { status: "", errors: [], result: {} };
      console.log(error.error.details);
      http_utils.responsify(
        res_body,
        http_utils.FLAG_INVALID_INPUT,
        [],
        error.error.details,
        res
      );
      res.json(res_body);
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
if (config.isProduction) {
  app.use((error, req, res, next) => {
    // handle joi validation error
    if (error && error.error && error.error.details) {
      const res_body = { status: "", errors: [], result: {} };
      http_utils.responsify(
        res_body,
        http_utils.FLAG_INVALID_INPUT,
        [],
        error.error.details,
        res
      );
      res.json(res_body);
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
}

// start server
const server = app.listen(config.port, () => {
  console.log(`Listening on port ${server.address().port}`);
});
