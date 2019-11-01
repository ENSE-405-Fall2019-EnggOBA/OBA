const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    faculty_name: { type: String, required: true}, // faculty the course belongs 2
    course_number: { type: String, required: true}, // course #
    status: {type:String}, // is the course currently avaiable to be offered as a class? enrollement allowed right now?
  },
  { timestamps: true }
);

CourseSchema.methods.toSimpleJSON = function() {
    return {
      faculty_name: this.faculty_name,
      course_number: this.email,
      status: this.status,
    };
  };

CourseSchema.index({faculty_name: 1, course_number: 1}, {unique: true});

mongoose.model("Course", CourseSchema, "Courses");
