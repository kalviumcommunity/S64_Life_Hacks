const express = require("express");
const HackSQL = require("../models/hackSQL");
const UserSQL = require("../models/userSQL");
const router = express.Router();

// 1. Fetch all users
router.get("/users", async (req, res) => {
  try {
    const users = await UserSQL.findAll({
      attributes: ["id", "name", "email"], // Fetch specific columns
    });
    res.json(users);
  } catch (err) {
    console.error("Error fetching SQL users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2. Fetch hacks created by a specific user
router.get("/hacks/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const hacks = await HackSQL.findAll({
      where: { created_by: userId },
      include: {
        model: UserSQL,
        attributes: ["name", "email"], // Include user details
      },
    });
    res.json(hacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch hacks for this user" });
  }
});

// 3. Fetch all hacks (Corrected Placement)
router.get("/hacks", async (req, res) => {
  try {
    const hacks = await HackSQL.findAll({
      include: [
        {
          model: UserSQL,
          attributes: ["name", "email"], // Include user details
        },
      ],
    });
    res.json(hacks);
  } catch (error) {
    console.error("Error fetching PostgreSQL hacks:", error);
    res.status(500).json({ error: "Error fetching PostgreSQL hacks" });
  }
});

// 4. Fetch a hack by ID
router.get("/hacks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const hack = await HackSQL.findByPk(id, {
      include: {
        model: UserSQL,
        attributes: ["name", "email"], // Include user details
      },
    });
    if (!hack) {
      return res.status(404).json({ error: "Hack not found" });
    }
    res.json(hack);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch hack" });
  }
});

// 5. Create a new user
router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await UserSQL.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
    const newUser = await UserSQL.create({ name, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// 6. Create a new hack
router.post("/hacks", async (req, res) => {
  const { title, description, category, created_by } = req.body;
  try {
    const userExists = await UserSQL.findByPk(created_by);
    if (!userExists) {
      return res.status(400).json({ error: "User not found" });
    }
    const newHack = await HackSQL.create({
      title,
      description,
      category,
      created_by,
    });
    res.status(201).json(newHack);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create hack" });
  }
});

// 7. Update a hack
router.put("/hacks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, category, created_by } = req.body;

  console.log(`🔍 Update request received for Hack ID: ${id}`);
  console.log("📥 Received Data:", req.body);

  try {
    const hack = await HackSQL.findByPk(id);
    if (!hack) {
      console.log("⚠️ Hack not found in PostgreSQL.");
      return res.status(404).json({ error: "Hack not found" });
    }

    console.log("✅ Hack found. Proceeding with update...");

    const updatedHack = await hack.update({
      title,
      description,
      category,
      created_by,
    });

    console.log("✅ Hack updated successfully:", updatedHack);
    res.json(updatedHack);
  } catch (error) {
    console.error("❌ Error updating hack:", error);
    res.status(500).json({ error: "Failed to update hack" });
  }
});


// 8. Delete a hack
router.delete("/hacks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const hack = await HackSQL.findByPk(id);
    if (!hack) {
      return res.status(404).json({ error: "Hack not found" });
    }
    await hack.destroy();
    res.status(200).json({ message: "Hack deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete hack" });
  }
});
// 9. Delete a user by ID
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserSQL.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Optionally: Delete all hacks created by this user (if needed)
    await HackSQL.destroy({ where: { created_by: id } });

    // Delete the user
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});


module.exports = router;
