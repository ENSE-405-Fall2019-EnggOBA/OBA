const mongoose = require("mongoose");

const GraduateAttributeSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    title: { type: String },
    description: { type: String }
  },
  { timestamps: true }
);

GraduateAttributeSchema.index({ number: 1 }, { unique: true });

mongoose.model(
  "GraduateAttribute",
  GraduateAttributeSchema,
  "GAs"
);
