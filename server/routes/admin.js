const express = require("express");
const User = require("../models/User");
const Campaign = require("../models/Campaign");
const BMI = require("../models/BMI");
const adminMiddleware = require("../middleware/adminmiddleware");

const router = express.Router();

// 🔹 Get All Users
router.get("/users", adminmiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete User
router.delete("/users/:id", adminmiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Promote User to Admin
router.put("/users/promote/:id", adminmiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { role: "admin" });
    res.json({ message: "User promoted to admin" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 🔹 Create Campaign (Admin Only)
router.post("/campaigns", adminmiddleware, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const newCampaign = new Campaign({
      title,
      description,
      category
    });

    await newCampaign.save();

    res.status(201).json({ message: "Campaign created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get All Campaigns
router.get("/campaigns", adminmiddleware, async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete Campaign
router.delete("/campaigns/:id", adminmiddleware, async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: "Campaign deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 System Overview
router.get("/overview", adminmiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();
    const totalBMI = await BMI.countDocuments();

    res.json({
      totalUsers,
      totalCampaigns,
      totalBMI
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
