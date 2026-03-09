const express = require("express");
const Groq = require("groq-sdk");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Emergency keywords that require immediate medical attention
const emergencyKeywords = [
  "heart attack", "chest pain", "difficulty breathing", "breathing problems",
  "severe bleeding", "stroke", "unconscious", "unconsciousness", "severe injury",
  "heart pain", "can't breathe", "cannot breathe", "seizure", "stroke symptoms",
  "brain attack", "sudden numbness", "sudden confusion", "severe headache",
  "loss of consciousness", "fainted", "bleeding heavily", "emergency"
];

// Health-related keywords
const healthKeywords = [
  "health", "medical", "doctor", "hospital", "clinic", "medicine", "medication",
  "symptom", "symptoms", "illness", "disease", "infection", "virus", "bacteria",
  "fever", "cold", "flu", "cough", "headache", "stomach", "digestion", "diet",
  "nutrition", "exercise", "workout", "fitness", "weight", "bmi", "blood pressure",
  "sugar", "diabetes", "heart", "lung", "liver", "kidney", "pain", "ache",
  "nausea", "vomiting", "diarrhea", "constipation", "allergy", "skin", "rash",
  "sleep", "stress", "anxiety", "depression", "mental", "vitamin", "supplement",
  "vaccine", "vaccination", "immunity", "healthy", "wellness", "body", "treatment",
  "remedy", "cure", "prevention", "hygiene", "water", "hydration", "sleep"
];

// Check if message is health-related
const isHealthRelated = (message) => {
  const lowerMessage = message.toLowerCase();
  return healthKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Check if message contains emergency keywords
const containsEmergency = (message) => {
  const lowerMessage = message.toLowerCase();
  return emergencyKeywords.some(keyword => lowerMessage.includes(keyword));
};

router.post("/recommend", async (req, res) => {
  try {
    const { bmi, category } = req.body;

    const prompt = `
You are a public health assistant.

User BMI: ${bmi}
Category: ${category}

Give simple health recommendations for this user.
Include:
1. Diet advice
2. Exercise advice
3. Lifestyle tips
Keep answer short.
`;

    const chat = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant"
    });

    const advice = chat.choices[0].message.content;
    res.json({ advice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.json({ 
        response: "Hello! I'm your Health Assistant. How can I help you with your health today?" 
      });
    }

    const userMessage = message.trim();

    // Check for emergency keywords first
    if (containsEmergency(userMessage)) {
      return res.json({ 
        response: "⚠️ This may be a serious medical condition. Please seek immediate medical attention or visit the nearest doctor or hospital right away. If you're experiencing a medical emergency, please call your local emergency services immediately." 
      });
    }

    // Check if message is health-related
    if (!isHealthRelated(userMessage)) {
      return res.json({ 
        response: "I am a health assistant chatbot. Please ask a question related to health, wellness, or medical topics." 
      });
    }

    // Create prompt for Groq
    const prompt = `
You are a health assistant chatbot. Your role is to provide BASIC health guidance and GENERAL information only.

IMPORTANT RULES:
1. NEVER provide medical diagnoses
2. NEVER prescribe medications
3. ALWAYS recommend consulting a healthcare professional for proper diagnosis and treatment
4. Keep responses short and easy to understand
5. Focus on general health information, preventive care, and healthy lifestyle tips

User's question: ${userMessage}

Provide a helpful, general health response. If the question requires specific medical diagnosis, politely explain that you can only provide general information and recommend seeing a doctor.
`;

    const chat = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant"
    });

    const response = chat.choices[0].message.content;

    // Add disclaimer to the response
    const disclaimer = "\n\n⚕️ Note: This is general health information only. Please consult a healthcare professional for proper medical advice.";
    
    res.json({ response: response + disclaimer });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
