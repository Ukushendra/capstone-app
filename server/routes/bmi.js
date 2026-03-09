const express = require("express");
const BMI = require("../models/BMI");

const router = express.Router();

// 🔹 Save BMI
router.post("/save", async (req, res) => {
  try {
    const { userId, bmi, category } = req.body;

    const newBMI = new BMI({
      userId,
      bmi,
      category
    });

    await newBMI.save();

    res.status(201).json({ message: "BMI saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Get BMI history for a user
router.get("/history/:userId", async (req, res) => {
  try {
    const history = await BMI.find({ userId: req.params.userId })
      .sort({ createdAt: 1 }); // oldest to newest

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;