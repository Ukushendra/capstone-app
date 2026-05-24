require("dotenv").config();

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
app.use("/api/weekly-plan", weeklyPlanRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/bmi", bmiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/health-ai", healthAIRoutes);

// DATABASE
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Database connected"))
.catch(err => console.log(err));

// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});