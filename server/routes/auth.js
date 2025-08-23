const express = require("express");
const router = express.Router();
const User = require("../models/user");
const requireAdmin = require("../middleware/authMiddleware");

// Login
router.post("/login", async (req, res) => {
  const {
    username,
    password
  } = req.body;

  const user = await User.findOne({
    username
  });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }
  res.json({
    success: true,
    user: {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
    }
  });
});
// Register - only by admin
router.post("/register", requireAdmin, async (req, res) => {
  const {
    newUser
  } = req.body;
  console.log("newUser received from frontend:", newUser);

  const exists = await User.findOne({
    username: newUser.username
  });
  if (exists) {
    return res.status(409).json({
      success: false,
      message: "Username already exists"
    });
  }

  const createdUser = await User.create({
    username: newUser.username,
    password: newUser.password,
    email: newUser.email,
    fullName: newUser.fullName,
    role: newUser.role || "user",
    assignedBy: req.user._id
  });

  res.json({
    success: true,
    user: createdUser
  });
});

// Get all users (for admin)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error("🔥 Error during registration:", err);
    res.status(500).json({
      message: "Failed to fetch users"
    });
  }
});

// Delete user by ID
router.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({
      message: "User not found"
    });
    res.json({
      success: true
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete user"
    });
  }
});

//get admin users
router.get("/users/by-admin/:adminId", async (req, res) => {
  try {
    const users = await User.find({
      assignedBy: req.params.adminId
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch users"
    });
  }
});

module.exports = router;