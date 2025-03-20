const mongoose = require("mongoose");

// Define Hack Schema
const hackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true, // Ensure a user is always associated with a hack
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Hack model
const Hack = mongoose.model("Hack", hackSchema);
module.exports = Hack;
