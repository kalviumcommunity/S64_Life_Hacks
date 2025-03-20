const express = require("express");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose"); // Import mongoose for ObjectId validation
const Hack = require("../models/schema"); // Import Hack model
const User = require("../models/user"); // Import User model

const router = express.Router();

// 🔹 Validation rules for creating/updating a hack
const hackValidationRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("created_by")
    .notEmpty()
    .withMessage("Created_by (User ID) is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid User ID format"),
];
// 🔹 Create a new hack (Prevents duplicate titles)
router.post("/hacks", hackValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let { title, description, category, created_by } = req.body;

    // Convert `created_by` to ObjectId
    created_by = new mongoose.Types.ObjectId(created_by);

    // Check if user exists
    const userExists = await User.findById(created_by);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Check if hack with the same title exists
    const existingHack = await Hack.findOne({ title });
    if (existingHack) {
      return res.status(400).json({ error: "Hack with this title already exists" });
    }

    const hack = new Hack({ title, description, category, created_by });
    await hack.save();
    res.status(201).json(hack);
  } catch (error) {
    console.error("Error creating hack:", error);
    res.status(500).json({ error: "Error creating hack" });
  }
});


// 🔹 Get all hacks OR filter by `created_by`
router.get("/hacks", async (req, res) => {
  try {
    const { created_by } = req.query;
    let query = {};

    if (created_by) {
      if (!mongoose.Types.ObjectId.isValid(created_by)) {
        return res.status(400).json({ error: "Invalid User ID format" });
      }
      query.created_by = created_by;
    }

    const hacks = await Hack.find(query).populate("created_by", "name email");
    if (hacks.length === 0) {
      return res.status(404).json({ message: "No hacks found" });
    }

    res.status(200).json(hacks);
  } catch (error) {
    console.error("Error fetching hacks:", error);
    res.status(500).json({ error: "Error fetching hacks" });
  }
});

// 🔹 Update an existing hack
router.put("/hacks/:id", hackValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let { title, description, category, created_by } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid Hack ID format" });
    }

    created_by = new mongoose.Types.ObjectId(created_by);

    const hack = await Hack.findByIdAndUpdate(
      req.params.id,
      { title, description, category, created_by },
      { new: true, runValidators: true }
    );

    if (!hack) {
      return res.status(404).json({ error: "Hack not found" });
    }

    res.json(hack);
  } catch (error) {
    console.error("Error updating hack:", error);
    res.status(500).json({ error: "Error updating hack" });
  }
});

// 🔹 Delete a hack
router.delete("/hacks/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid Hack ID format" });
    }

    const hack = await Hack.findByIdAndDelete(req.params.id);

    if (!hack) {
      return res.status(404).json({ error: "Hack not found" });
    }

    res.status(200).json({ message: "Hack deleted successfully" });
  } catch (error) {
    console.error("Error deleting hack:", error);
    res.status(500).json({ error: "Error deleting hack" });
  }
});

// 🔹 Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email");

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// 🔹 Create a new user
router.post(
  "/users",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email } = req.body;

      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      const newUser = new User({ name, email });
      await newUser.save();

      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Error creating user" });
    }
  }
);

module.exports = router;
