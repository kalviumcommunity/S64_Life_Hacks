const { body, validationResult } = require("express-validator");
const { isValidObjectId } = require("mongoose"); // If using MongoDB

const validateHack = [
  // Enhanced string validation
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 100 }).withMessage("Title must be ≤100 characters"),
    
  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 20 }).withMessage("Description needs at least 20 characters"),
    
  // Category with allowed values
  body("category")
    .trim()
    .notEmpty().withMessage("Category is required")
    .isIn(["tech", "life", "productivity"]).withMessage("Invalid category"),
    
  // Flexible ID validation (MongoDB or SQL)
  body("created_by")
    .notEmpty().withMessage("User ID is required")
    .custom((value) => {
      return isValidObjectId(value) || Number.isInteger(Number(value));
    }).withMessage("Invalid user ID format"),
    
  // Enhanced error formatter
  (req, res, next) => {
    const errors = validationResult(req).formatWith(({ msg }) => msg);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: "Validation failed",
        details: errors.array() 
      });
    }
    next();
  }
];

// Add auth-specific validators
const validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 })
];

module.exports = { validateHack, validateLogin };