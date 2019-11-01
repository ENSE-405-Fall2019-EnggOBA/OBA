const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    instructor_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    term: { type: String },
    year: {
      type: String,
      validate: [
        validate_year_field,
        "Class year must be for the current year"
      ]
    },
    status: String,
    graduate_attributes: [String],
    indicators: [String],
    questions_answers: [{ question: String, answer: String }],
    evaluation_report: {
      exceeds: {
        criteria: String,
        grade: String,
        documents: [String]
      },
      meets: {
        criteria: String,
        grade: String,
        documents: [String]
      },
      developing: {
        criteria: String,
        grade: String,
        documents: [String]
      },
      fail: {
        criteria: String,
        grade: String,
        documents: [String]
      }
    }
  },
  { timestamps: true }
);

function validate_year_field(year) {
  return year == new Date().getFullYear();
}

ClassSchema.methods.toSimpleJSON = function(course) {
  return {
    course_number: course.course_number,
    faculty_name: course.faculty_name,
    instructors: this.instructors,
    term: course.term,
    year: course.year,
    course_status: course.status,
    class_status: this.status
  };
};

ClassSchema.index({ course_id: 1, year: 1, term: 1 }, { unique: true });
mongoose.model("Class", ClassSchema, "Classes-" + new Date().getFullYear());
