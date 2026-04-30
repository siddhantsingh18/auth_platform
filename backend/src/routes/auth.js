const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { protect, generateToken } = require("../middleware/auth");

const router = express.Router();

// Validation rules
const signupValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2–50 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Helper to handle validation errors
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  return null;
};

// @route  POST /api/auth/signup
// @desc   Register a new user
// @access Public
router.post("/signup", signupValidation, async (req, res, next) => {
  try {
    const validationError = handleValidation(req, res);
    if (validationError) return;

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// @route  POST /api/auth/login
// @desc   Login user
// @access Public
router.post("/login", loginValidation, async (req, res, next) => {
  try {
    const validationError = handleValidation(req, res);
    if (validationError) return;

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// @route  GET /api/auth/me
// @desc   Get current user profile
// @access Private
router.get("/me", protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// @route  PUT /api/auth/profile
// @desc   Update user profile
// @access Private
router.put(
  "/profile",
  protect,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be 2–50 characters"),
    body("bio")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Bio cannot exceed 200 characters"),
  ],
  async (req, res, next) => {
    try {
      const validationError = handleValidation(req, res);
      if (validationError) return;

      const { name, bio } = req.body;
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (bio !== undefined) updateData.bio = bio;

      const user = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        success: true,
        message: "Profile updated successfully!",
        user,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route  PUT /api/auth/change-password
// @desc   Change user password
// @access Private
router.put(
  "/change-password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  async (req, res, next) => {
    try {
      const validationError = handleValidation(req, res);
      if (validationError) return;

      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user._id).select("+password");
      const isMatch = await user.comparePassword(currentPassword);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect.",
        });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password changed successfully!",
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
