const express = require("express");
const { body, validationResult } = require("express-validator");
const Hack = require("../models/schema"); // Import Hack model

const router = express.Router();

// Validation rules
const hackValidationRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
];

// **Create** - Add a new hack (with validation)
router.post("/hacks", hackValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation Errors:", errors.array()); // Log errors
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, category } = req.body;
    const hack = new Hack({ title, description, category });
    await hack.save();
    res.status(201).json(hack);
  } catch (error) {
    console.error("Error creating hack:", error);
    res.status(500).json({ error: "Error creating hack" });
  }
});

// **Read** - Get all hacks
router.get("/hacks", async (req, res) => {
  try {
    const hacks = await Hack.find();
    res.json(hacks);
  } catch (error) {
    console.error("Error fetching hacks:", error);
    res.status(500).json({ error: "Error fetching hacks" });
  }
});

// **Update** - Update an existing hack by ID (with validation)
router.put("/hacks/:id", hackValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation Errors:", errors.array()); // Log errors
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, category } = req.body;
    const hack = await Hack.findByIdAndUpdate(
      req.params.id,
      { title, description, category },
      { new: true, runValidators: true } // Ensures schema validation
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

// **Delete** - Delete a hack by ID
router.delete("/hacks/:id", async (req, res) => {
  try {
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

module.exports = router;
