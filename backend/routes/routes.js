const express = require("express");
const Hack = require("../models/schema");  // Import Hack model
const router = express.Router();

// **Create** - Add a new hack
router.post("/hacks", async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const hack = new Hack({ title, description, category });
    await hack.save();
    res.status(201).json(hack);
  } catch (error) {
    res.status(400).json({ error: "Error creating hack" });
  }
});

// **Read** - Get all hacks
router.get("/hacks", async (req, res) => {
  try {
    const hacks = await Hack.find();
    res.json(hacks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching hacks" });
  }
});
router.get("/hacks/:id", async (req, res) => {
  try {
    const hack = await Hack.findById(req.params.id);
    if (!hack) {
      return res.status(404).json({ error: "Hack not found" });
    }
    res.json(hack);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


// **Update** - Update an existing hack by ID
router.put("/hacks/:id", async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const hack = await Hack.findByIdAndUpdate(
      req.params.id,
      { title, description, category },
      { new: true }
    );
    if (!hack) return res.status(404).json({ error: "Hack not found" });
    res.json(hack);
  } catch (error) {
    res.status(400).json({ error: "Error updating hack" });
  }
});

// **Delete** - Delete a hack by ID
router.delete("/hacks/:id", async (req, res) => {
  try {
    const hack = await Hack.findByIdAndDelete(req.params.id);
    if (!hack) return res.status(404).json({ error: "Hack not found" });
    res.status(200).json({ message: "Hack deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting hack" });
  }
});

module.exports = router;
