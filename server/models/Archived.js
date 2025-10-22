const mongoose = require("mongoose");

const ArchivedSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      trim: true,
    },
    sentence: {
      type: String,
      required: true,
      trim: true,
    },
    meaning: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Make sure you have a User model
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Archived", ArchivedSchema);
