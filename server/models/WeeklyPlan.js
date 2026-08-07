const mongoose = require("mongoose");

const weeklyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    bmi: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    plan: {
      type: String,
      required: true
    },
    completedDays: {
      type: [Number],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("WeeklyPlan", weeklyPlanSchema);
