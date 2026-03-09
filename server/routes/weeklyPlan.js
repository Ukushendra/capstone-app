const express = require("express");
const Groq = require("groq-sdk");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/generate", async (req, res) => {
  try {
    const { bmi, category } = req.body;

    const prompt = `
You are a public health assistant.

User BMI: ${bmi}
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

    res.json({ plan });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
