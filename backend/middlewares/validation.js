const { body, validationResult } = require("express-validator");

const validateHack = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("created_by")
    .notEmpty()
    .withMessage("Created_by (User ID) is required")
    .isInt().withMessage("Created_by must be a valid user ID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateHack };
