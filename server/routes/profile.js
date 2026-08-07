const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const BMI = require("../models/BMI");
const WeeklyPlan = require("../models/WeeklyPlan");
const Campaign = require("../models/Campaign");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {};

    if (typeof name === "string") {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
      updates.name = trimmedName;
    }

    if (typeof email === "string") {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail) {
        return res.status(400).json({ message: "Email cannot be empty" });
      }

      const existingUser = await User.findOne({
        email: trimmedEmail,
        _id: { $ne: req.user.id }
      });

      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      updates.email = trimmedEmail;
    }

    if (typeof password === "string" && password.trim()) {
      updates.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    Object.assign(user, updates);
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: "Profile updated successfully", user: userResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await BMI.deleteMany({ userId: req.user.id });
    await WeeklyPlan.deleteOne({ userId: req.user.id });
    await Campaign.updateMany(
      {},
      {
        $pull: {
          bookmarks: req.user.id,
          completedBy: req.user.id,
          ratings: { userId: req.user.id }
        }
      }
    );
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
