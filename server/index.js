const path = require("path");
const dotenv = require("dotenv");

const envResult = dotenv.config({ path: path.resolve(__dirname, ".env") });
if (envResult.error) {
  dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
const authRoutes = require("./routes/auth");
const campaignRoutes = require("./routes/campaign");
const bmiRoutes = require("./routes/bmi");
const adminRoutes = require("./routes/admin");
const analyticsRoutes = require("./routes/analytics");
const healthAIRoutes = require("./routes/healthAI");
const weeklyPlanRoutes = require("./routes/weeklyPlan");
const profileRoutes = require("./routes/profile");
app.use("/api/weekly-plan", weeklyPlanRoutes);
app.use("/api/profile", profileRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/bmi", bmiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/health-ai", healthAIRoutes);

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("Missing MONGO_URI. Add it to server/.env (or project-root .env).");
  process.exit(1);
}

// DATABASE + SERVER
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });