const express = require("express");
const BMI = require("../models/BMI");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 Save BMI
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { bmi, category } = req.body;
    const parsedBMI = Number(bmi);

    if (!Number.isFinite(parsedBMI)) {
      return res.status(400).json({ message: "Invalid BMI value" });
    }

    const newBMI = new BMI({
      userId: req.user.id,
      bmi: parsedBMI,
      category
    });

    await newBMI.save();

    res.status(201).json({ message: "BMI saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Get BMI history for a user
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const history = await BMI.find({ userId: req.user.id }).sort({ createdAt: 1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;