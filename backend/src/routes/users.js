const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route  GET /api/users
// @desc   Get all users (public profiles)
// @access Private
router.get("/", protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ isActive: true })
      .select("name email bio avatar createdAt lastLogin")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route  GET /api/users/stats
// @desc   Get user stats
// @access Private
router.get("/stats", protect, async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const newToday = await User.countDocuments({
      createdAt: { $gte: todayStart },
    });
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const newThisWeek = await User.countDocuments({
      createdAt: { $gte: weekStart },
    });

    res.status(200).json({
      success: true,
      data: { totalUsers, newToday, newThisWeek },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
