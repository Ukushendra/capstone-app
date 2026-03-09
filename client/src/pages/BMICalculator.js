import React, { useState } from "react";
import axios from "axios";

function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [advice, setAdvice] = useState("");
  const [relatedCampaigns, setRelatedCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState("");

  const getUserId = () => {
    const token = localStorage.getItem("token");
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.id;
  };

  const handleBookmark = async (campaignId) => {
    try {
      await axios.post("/api/campaign/bookmark", {
        campaignId,
        userId: getUserId(),
      });
      alert("Campaign Bookmarked!");
    } catch (err) {
      console.log(err);
    }
  };

  const handleComplete = async (campaignId) => {
    try {
      await axios.post("/api/campaign/complete", {
        campaignId,
        userId: getUserId(),
      });
      alert("Marked as Completed!");
    } catch (err) {
      console.log(err);
    }
  };

  const handleRate = async (campaignId, rating) => {
    try {
      await axios.post("/api/campaign/rate", {
        campaignId,
        userId: getUserId(),
        rating,
      });
      alert("Rated Successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  const calculateBMI = async () => {
    setWeeklyPlan("");
    if (!weight || !height) {
      alert("Please enter both weight and height");
      return;
    }

    setLoading(true);

    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    setBmi(bmiValue);

    let selectedCategory = "";
    let selectedAdvice = "";
    let categoryColor = "";

    if (bmiValue < 18.5) {
      selectedCategory = "Underweight";
      selectedAdvice = "You may need to improve nutrition and consult a healthcare provider.";
      categoryColor = "from-yellow-400 to-orange-500";
    } else if (bmiValue < 24.9) {
      selectedCategory = "Normal";
      selectedAdvice = "Great! Maintain a balanced diet and regular exercise.";
      categoryColor = "from-green-400 to-emerald-500";
    } else if (bmiValue < 29.9) {
      selectedCategory = "Overweight";
      selectedAdvice = "Increased risk of diabetes and heart disease.";
      categoryColor = "from-orange-400 to-red-500";
    } else {
      selectedCategory = "Obese";
      selectedAdvice = "High risk of chronic diseases like diabetes and hypertension.";
      categoryColor = "from-red-500 to-red-700";
    }

    setCategory(selectedCategory);
    setAdvice(selectedAdvice);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post("/api/bmi/save", {
          userId: getUserId(),
          bmi: bmiValue,
          category: selectedCategory,
        });
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const res = await axios.get("/api/campaign");
      const campaigns = res.data;

      let keyword = "";
      if (selectedCategory === "Underweight") keyword = "nutrition";
      else if (selectedCategory === "Normal") keyword = "healthy";
      else if (selectedCategory === "Overweight") keyword = "diabetes";
      else keyword = "heart";

      const filtered = campaigns.filter((camp) =>
        camp.category.toLowerCase().includes(keyword)
      );

      setRelatedCampaigns(filtered);
    } catch (err) {
      console.log(err);
    }
    // Generate AI Weekly Health Plan
    try {
      const planRes = await axios.post("/api/weekly-plan/generate", {
        bmi: bmiValue,
        category: selectedCategory,
      });

      const planText = planRes.data.plan;
      setWeeklyPlan(planText);
      
      // Save weekly plan to localStorage for Dashboard tracking
      const planData = {
        plan: planText,
        bmi: bmiValue,
        category: selectedCategory,
        createdAt: new Date().toISOString(),
        completedDays: []
      };
      localStorage.setItem('weeklyPlan', JSON.stringify(planData));
    } catch (err) {
      console.log("Error generating weekly plan:", err);
    }

    setLoading(false);
  };

  const getBMIGaugeWidth = () => {
    if (!bmi) return "0%";
    const minBMI = 15;
    const maxBMI = 40;
    const percentage = ((bmi - minBMI) / (maxBMI - minBMI)) * 100;
    return `${Math.min(Math.max(percentage, 0), 100)}%`;
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-12 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <span className="text-4xl">🏥</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BMI Calculator
          </h2>
          <p className="text-gray-500 text-sm mt-2">Enter your details to calculate your BMI</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-2">Weight (kg)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">⚖️</span>
              <input
                type="number"
                placeholder="Enter weight in kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-4 pl-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-medium mb-2">Height (cm)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📏</span>
              <input
                type="number"
                placeholder="Enter height in cm"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-4 pl-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <button
            onClick={calculateBMI}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </span>
            ) : (
              "Calculate BMI"
            )}
          </button>
        </div>

        {bmi && (
          <div className="mt-8 animate-slide-up">
            {/* BMI Gauge */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-gray-600 font-medium">Your BMI</span>
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {bmi}
                </span>
              </div>
              
              {/* Visual Gauge */}
              <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500 transition-all duration-1000 ease-out"
                  style={{ width: getBMIGaugeWidth() }}
                ></div>
                <div 
                  className="absolute top-0 h-full w-1 bg-gray-800 transition-all duration-1000 ease-out"
                  style={{ left: getBMIGaugeWidth() }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>15</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
            </div>

            {/* Result Card */}
            <div className={`bg-gradient-to-r ${category.includes("Underweight") ? "from-yellow-400 to-orange-500" : category.includes("Normal") ? "from-green-400 to-emerald-500" : category.includes("Overweight") ? "from-orange-400 to-red-500" : "from-red-500 to-red-700"} p-6 rounded-2xl text-white shadow-lg`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">
                  {category.includes("Underweight") ? "⚠️" : category.includes("Normal") ? "✅" : category.includes("Overweight") ? "⚡" : "🚨"}
                </span>
                <h3 className="text-xl font-bold">{category}</h3>
              </div>
              <p className="text-white/90">
                <strong>Health Advice:</strong> {advice}
              </p>
            </div>
          </div>
        )}

        {relatedCampaigns.length > 0 && (
          <div className="mt-8 animate-slide-up">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Recommended Campaigns
              </span>
            </h3>
            {weeklyPlan && (
  <div className="mt-8 animate-slide-up">
    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <span className="text-2xl">📅</span>
      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Your AI Weekly Health Plan
      </span>
    </h3>

    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl shadow-md">
      <p className="text-gray-700 whitespace-pre-line">
        {weeklyPlan}
      </p>
    </div>
  </div>
)}

            <div className="space-y-4">
              {relatedCampaigns.map((camp) => (
                <div
                  key={camp._id}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-medium rounded-full">
                          {camp.category}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {camp.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {camp.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={() => handleBookmark(camp._id)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      🔖 Bookmark
                    </button>

                    <button
                      onClick={() => handleComplete(camp._id)}
                      className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      ✅ Completed
                    </button>

                    <button
                      onClick={() => handleRate(camp._id, 5)}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      ⭐ Rate 5
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BMICalculator;
