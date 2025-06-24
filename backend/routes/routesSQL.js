const express = require("express");
const HackSQL = require("../models/hackSQL");
const UserSQL = require("../models/userSQL");
const authMiddleware = require("../middlewares/authMiddleware");
const bcrypt = require('bcryptjs');

const router = express.Router();

// 1. Fetch all users
router.get("/users", async (req, res) => {
  try {
    const users = await UserSQL.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(users);
  } catch (err) {
    console.error("Error fetching SQL users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2. Create a new user (corrected)
router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await UserSQL.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserSQL.create({ 
      name, 
      email, 
      password: hashedPassword 
    });
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// 3. Fetch hacks created by a specific user
router.get("/hacks/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const hacks = await HackSQL.findAll({
      where: { created_by: userId },
      include: {
        model: UserSQL,
        attributes: ["name", "email"],
      },
    });
    res.json(hacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch hacks for this user" });
  }
});

// 4. Fetch all hacks
router.get("/hacks", async (req, res) => {
  try {
    const hacks = await HackSQL.findAll({
      include: [{
        model: UserSQL,
        attributes: ["name", "email"],
      }],
    });
    res.json(hacks);
  } catch (error) {
    console.error("Error fetching PostgreSQL hacks:", error);
    res.status(500).json({ error: "Error fetching PostgreSQL hacks" });
  }
});

// 5. Fetch a hack by ID
router.get("/hacks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const hack = await HackSQL.findByPk(id, {
      include: {
        model: UserSQL,
        attributes: ["name", "email"],
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

// 6. Create a new hack (protected)
router.post("/hacks", authMiddleware, async (req, res) => {
  const { title, description, category } = req.body;
  const created_by = req.user.id; // Get user ID from auth middleware
  
  try {
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
router.put("/hacks/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  try {
    const hack = await HackSQL.findByPk(id);
    if (!hack) {
      return res.status(404).json({ error: "Hack not found" });
    }

    // Verify the user owns this hack
    if (hack.created_by !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this hack" });
    }

    const updatedHack = await hack.update({
      title,
      description,
      category
    });

    res.json(updatedHack);
  } catch (error) {
    console.error("Error updating hack:", error);
    res.status(500).json({ error: "Failed to update hack" });
  }
});

// 8. Delete a hack
router.delete("/hacks/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const hack = await HackSQL.findByPk(id);
    if (!hack) {
      return res.status(404).json({ error: "Hack not found" });
    }
    
    // Verify the user owns this hack
    if (hack.created_by !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this hack" });
    }

    await hack.destroy();
    res.status(200).json({ message: "Hack deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete hack" });
  }
});

// 9. Delete a user by ID
router.delete("/users/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    // Only allow admins or the user themselves to delete accounts
    if (req.user.id !== parseInt(id) && !req.user.isAdmin) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const user = await UserSQL.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete all hacks created by this user
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