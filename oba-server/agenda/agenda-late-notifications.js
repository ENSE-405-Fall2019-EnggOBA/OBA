const dates_hash = require("../utils/dates");

module.exports = agenda => {
  agenda.on("ready", () => {
    const {
      update_late_class_statuses
    } = require("../routes/api/services/class-services-helpers");

    const json_late_policies = require("../data/misc-data.json")[
      "late_policies"
    ];

    const agenda_job_scheduler = require("./agenda-job-scheduler")(agenda);

    for (let term in json_late_policies[0]) {
      const month = json_late_policies[0][term].Month;
      const day = json_late_policies[0][term].Day;
      const current_date = new Date();
      let date_delta;

      // set late policy for next year
      if (
        current_date.getMonth() > dates_hash[month] ||
        (current_date.getMonth() === dates_hash[month] &&
          current_date.getDate() >= day)
      ) {
        // calculate the time delta
        date_delta =
          new Date(current_date.getFullYear() + 1, dates_hash[month] - 1, day) -
          current_date;
      } else {
        date_delta =
          new Date(current_date.getFullYear(), dates_hash[month] - 1, day) -
          current_date;
      }

      // convert the delta to day units
      date_delta = Math.ceil(date_delta / (1000 * 60 * 60 * 24));

      // emit late reminder based on deadline date
      const job_options = {
        job_name: term,
        job_start_delta: date_delta,
        job_fn: (job, done) => {
          update_late_class_statuses(term);
          done();
        }
      };
      agenda_job_scheduler.schedule_job(job_options);
    }

    // start after a timeout period, so jobs can be scheduled first.
    setTimeout(function() {
      agenda.start();
    }, 5000);
  });
};
