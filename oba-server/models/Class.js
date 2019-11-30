const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    instructor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    term: { type: String },
    year: { type: Number },
    status: { type: String , required: true },
    data: [
      {
        grad_attribute: String,
        indicator: String,
        questions_answers: [{ _id: false, question: String, answer: String }],
        evaluation_report: {
          exceeds: {
            criteria: String,
            grade: Number,
            documents: String
          },
          meets: {
            criteria: String,
            grade: Number,
            documents: String
          },
          developing: {
            criteria: String,
            grade: Number,
            documents: String
          },
          fail: {
            criteria: String,
            grade: Number,
            documents: String
          }
        }
      }
    ]
  },
  { timestamps: true }
);

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
mongoose.model("Class", ClassSchema, "Classes");
