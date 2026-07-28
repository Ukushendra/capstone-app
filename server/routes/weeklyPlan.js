const express = require("express");
const Groq = require("groq-sdk");
const authMiddleware = require("../middleware/authMiddleware");
const WeeklyPlan = require("../models/WeeklyPlan");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const { bmi, category } = req.body;
    const parsedBMI = Number(bmi);

    if (!Number.isFinite(parsedBMI)) {
      return res.status(400).json({ message: "Invalid BMI value" });
    }

    const prompt = `
You are a public health assistant.

User BMI: ${parsedBMI}
Category: ${category}

Create a simple 7-day weekly health plan.
Each day should include:
- one exercise suggestion
- one diet or lifestyle suggestion

Keep the advice safe and general.
Format clearly by day.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant"
    });

    const plan = completion.choices[0].message.content;

    const savedPlan = await WeeklyPlan.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        bmi: parsedBMI,
        category,
        plan,
        completedDays: []
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.json(savedPlan);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/current", authMiddleware, async (req, res) => {
  try {
    const weeklyPlan = await WeeklyPlan.findOne({ userId: req.user.id });
    res.json(weeklyPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/current/completed-days", authMiddleware, async (req, res) => {
  try {
    const { dayIndex } = req.body;
    const parsedDayIndex = Number(dayIndex);

    if (!Number.isInteger(parsedDayIndex) || parsedDayIndex < 0 || parsedDayIndex > 6) {
      return res.status(400).json({ message: "dayIndex must be an integer from 0 to 6" });
    }

    const weeklyPlan = await WeeklyPlan.findOne({ userId: req.user.id });

    if (!weeklyPlan) {
      return res.status(404).json({ message: "Weekly plan not found" });
    }

    if (weeklyPlan.completedDays.includes(parsedDayIndex)) {
      weeklyPlan.completedDays = weeklyPlan.completedDays.filter(
        (day) => day !== parsedDayIndex
      );
    } else {
      weeklyPlan.completedDays.push(parsedDayIndex);
      weeklyPlan.completedDays.sort((a, b) => a - b);
    }

    await weeklyPlan.save();
    res.json(weeklyPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
