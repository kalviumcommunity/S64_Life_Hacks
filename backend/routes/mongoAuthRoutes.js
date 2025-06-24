const express = require("express");
const { body, validationResult } = require("express-validator");
const mongoAuthController = require("../controllers/mongoAuthController");
const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Register user
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validateRequest,
  mongoAuthController.register
);

// Login user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  mongoAuthController.login
);

// Logout user
router.post("/logout", mongoAuthController.logout);

// Get current user
router.get("/me", mongoAuthController.getCurrentUser);

module.exports = router;