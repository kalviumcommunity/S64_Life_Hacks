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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Hack model
const Hack = mongoose.model("Hack", hackSchema);
module.exports = Hack;
