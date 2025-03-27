const express = require("express");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose"); 
const Hack = require("../models/schema"); 
const User = require("../models/user"); 

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

// 🔹 Create a new hack
router.post("/hacks", hackValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let { title, description, category, created_by } = req.body;

    created_by = new mongoose.Types.ObjectId(created_by);

    // Check if user exists
    const userExists = await User.findById(created_by);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Prevent duplicate hacks with the same title
    const existingHack = await Hack.findOne({ title });
    if (existingHack) {
      return res.status(400).json({ error: "Hack with this title already exists" });
    }

    const hack = new Hack({ title, description, category, created_by });
    await hack.save();

    // ✅ Ensure created_by is returned as a string
    const formattedHack = { ...hack.toObject(), created_by: created_by.toString() };

    res.status(201).json(formattedHack);
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

    const hacks = await Hack.find(query).populate("created_by", "name email").lean();

    // ✅ Convert `created_by` ObjectId to string for consistency
    const formattedHacks = hacks.map(hack => ({
      ...hack,
      created_by: hack.created_by?._id.toString() || hack.created_by
    }));

    res.status(200).json(formattedHacks);
  } catch (error) {
    console.error("Error fetching hacks:", error);
    res.status(500).json({ error: "Error fetching hacks" });
  }
});

// 🔹 Get a hack by ID
router.get("/hacks/:id", async (req, res) => {
  try {
    const hack = await Hack.findById(req.params.id).lean();
    if (!hack) {
      return res.status(404).json({ error: "Hack not found" });
    }

    hack.created_by = hack.created_by.toString();
    res.json(hack);
  } catch (error) {
    console.error("Error fetching hack:", error);
    res.status(500).json({ error: "Server error" });
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
    ).lean();

    if (!hack) {
      return res.status(404).json({ error: "Hack not found" });
    }

    hack.created_by = hack.created_by.toString();
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
    const users = await User.find({}, "name email").lean();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// 🔹 Get a user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid User ID format" });
    }

    const user = await User.findById(id, "name email").lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userHacks = await Hack.find({ created_by: id }).lean();

    const formattedHacks = userHacks.map(hack => ({
      ...hack,
      created_by: hack.created_by.toString()
    }));

    res.status(200).json({ user, hacks: formattedHacks });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user" });
  }
});

module.exports = router;
