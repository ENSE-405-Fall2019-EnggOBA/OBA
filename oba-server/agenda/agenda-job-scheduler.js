const logging_utils = require("../utils/logger");
const crypto = require("crypto");

function job_context_t(id, name, fn) {
  this.id = id;
  this.name = name;
  this.fn = fn;
}

class job_scheduler {
  constructor(agenda) {
    this.agenda = agenda;
    this.job_contexts = [];
  }

  // internal method
  _define_job(id, fn) {
    this.agenda.define(id, fn);
  }

  // internal method
  _schedule_job_helper(options) {
    logging_utils.info("job schedule being created.");

    this._define_job(options.job_name, options.job_fn);
    const id = crypto.randomBytes(options.job_name.length).toString("hex");
    this.job_contexts.push(
      new job_context_t(id, options.job_name, options.job_fn)
    );
    const scheduled_job = this.agenda
      .create(options.job_name, { id: id })
      .schedule("in" + " " + options.job_start_delta.toString() + " days")
      .repeatAt("365 days");

    scheduled_job
      .save()
      .then(() => {
        logging_utils.info("job persisted succesfully to the db.");
      })
      .catch(err => {
        logging_utils.error(`failed to persist job to the db: ${err}`);
      });

    logging_utils.info("job schedule save transaction completed");
  }

  // public client method
  schedule_job(options) {
    this.agenda
      .jobs({})
      .then(jobs => {
        const job_index = jobs.findIndex(job => {
          return job.attrs.name === options.job_name;
        });

        // if the job already exists, delete it from the db create fresh records.
        if (job_index !== -1) {
          this.agenda
            .cancel({ name: options.name })
            .then(cancel_count => {
              logging_utils.warn(
                `job already exists in db: ${options.job_name} `
              );
              logging_utils.warn(`canceled # of jobs: ${cancel_count}`);
              this._schedule_job_helper(options);
            })
            .catch(err => {
              logging_utils.error(`error canceling existing job: ${err} `);
            });
        } else {
          this._schedule_job_helper(options);
        }
      })
      .catch(err => {
        if (err) logging_utils.error(err);
      });
  }
}

module.exports = agenda => {
  return new job_scheduler(agenda);
};
