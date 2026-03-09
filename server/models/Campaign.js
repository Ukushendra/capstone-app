const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  completedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  ratings: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      rating: Number
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Campaign", campaignSchema);