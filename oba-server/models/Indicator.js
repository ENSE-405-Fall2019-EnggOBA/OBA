const mongoose = require("mongoose");

const IndicatorSchema = new mongoose.Schema(
  {
    number: { type: Number },
    title: { type: String }
  },
  { timestamps: true }
);

mongoose.model("Indicator", IndicatorSchema, "Indicators");
