const mongoose = require("mongoose");

const GraduateAttributeSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    title: { type: String },
    description: { type: String },
    sub_gas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Indicator"
      }
    ]
  },
  { timestamps: true }
);

GraduateAttributeSchema.index({ number: 1 }, { unique: true });

mongoose.model(
  "GraduateAttribute",
  GraduateAttributeSchema,
  "GAs"
);
