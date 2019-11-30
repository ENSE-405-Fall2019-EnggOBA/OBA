const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    faculty: { type: String, required: true },
  },
  { timestamps: true }
);

CourseSchema.methods.toSimpleJSON = function() {
  return {
    name: this.name,
    faculty: this.faculty,
    status: this.status
  };
};

CourseSchema.index({ faculty: 1, name: 1 }, { unique: true });

mongoose.model("Course", CourseSchema, "Courses");
