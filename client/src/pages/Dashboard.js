import React, { useEffect, useState } from "react";
import axios from "axios";
import Chatbot from "../components/Chatbot";

const token = localStorage.getItem("token");
const decoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
const userId = decoded?.id;

const bookmarkCampaign = async (campaignId) => {
  try {
    await axios.post(`${process.env.REACT_APP_API}/api/campaign/bookmark`, { campaignId, userId });
    alert("Campaign bookmarked");
  } catch (err) {
    console.log(err);
  }
};

const completeCampaign = async (campaignId) => {
  try {
    await axios.post(`${process.env.REACT_APP_API}/api/campaign/complete`, { campaignId, userId });
    alert("Campaign completed");
  } catch (err) {
    console.log(err);
  }
};

const rateCampaign = async (campaignId) => {
  try {
    await axios.post(`${process.env.REACT_APP_API}/api/campaign/rate`, { campaignId, userId, rating: 5 });
    alert("Campaign rated ⭐");
  } catch (err) {
    console.log(err);
  }
};

function Dashboard() {
  const [data, setData] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weeklyPlan, setWeeklyPlan] = useState(null);

  useEffect(() => {
    fetchDashboard();
    fetchCampaigns();
    loadWeeklyPlan();
  }, []);

  const loadWeeklyPlan = () => {
    const savedPlan = localStorage.getItem('weeklyPlan');
    if (savedPlan) {
      setWeeklyPlan(JSON.parse(savedPlan));
    }
  };

  const toggleDayCompletion = (dayIndex) => {
    if (!weeklyPlan) return;
    
    const completedDays = [...weeklyPlan.completedDays];
    if (completedDays.includes(dayIndex)) {
      completedDays.splice(completedDays.indexOf(dayIndex), 1);
    } else {
      completedDays.push(dayIndex);
    }
    
    const updatedPlan = { ...weeklyPlan, completedDays };
    setWeeklyPlan(updatedPlan);
    localStorage.setItem('weeklyPlan', JSON.stringify(updatedPlan));
  };

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/api/analytics/summary`);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/api/campaign`);
      setCampaigns(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-bold mb-8">
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📊 User Dashboard
        </span>
      </h2>

      {/* Summary Cards with Gradient Effects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card 1 */}
        <div className="group relative bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white/80 font-medium">Total BMI Records</h3>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-4xl font-bold text-white">{data.totalBMI || 0}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white/80 font-medium">Total Campaigns</h3>
              <span className="text-3xl">📢</span>
            </div>
            <p className="text-4xl font-bold text-white">{data.totalCampaigns || 0}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group relative bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white/80 font-medium">Most Common Category</h3>
              <span className="text-3xl">🎯</span>
            </div>
            <p className="text-2xl font-bold text-white">{data.mostCommonCategory || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Weekly Plan Section */}
      {weeklyPlan && (
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 mb-8 animate-slide-up">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>📅</span>
            Your AI Weekly Health Plan
          </h3>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-gray-600">
              BMI: <strong>{weeklyPlan.bmi}</strong> ({weeklyPlan.category})
            </span>
            <span className="text-sm text-gray-600">
              Progress: <strong>{weeklyPlan.completedDays?.length || 0}/7</strong> days
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const isCompleted = weeklyPlan.completedDays?.includes(index);
              return (
                <button
                  key={day}
                  onClick={() => toggleDayCompletion(index)}
                  className={`p-3 rounded-xl text-center transition-all duration-200 ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-semibold text-sm">{day}</div>
                  <div className="text-xs mt-1">
                    {isCompleted ? 'Done' : 'Pending'}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-4 bg-purple-50 rounded-xl">
            <p className="text-sm text-gray-700 whitespace-pre-line">{weeklyPlan.plan}</p>
          </div>
        </div>
      )}

      {/* Campaign Section */}
      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 animate-slide-up">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span>📢</span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Public Health Campaigns
          </span>
        </h3>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-gradient h-32 rounded-xl"></div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500">No campaigns available</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((camp, index) => (
              <div
                key={camp._id}
                className="group border border-gray-100 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/50 card-hover animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-medium rounded-full">
                        {camp.category}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">
                      {camp.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {camp.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => bookmarkCampaign(camp._id)}
                      className="group/btn px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <span className="flex items-center gap-1">
                        🔖 Bookmark
                      </span>
                    </button>

                    <button
                      onClick={() => completeCampaign(camp._id)}
                      className="group/btn px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <span className="flex items-center gap-1">
                        ✅ Completed
                      </span>
                    </button>

                    <button
                      onClick={() => rateCampaign(camp._id)}
                      className="group/btn px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <span className="flex items-center gap-1">
                        ⭐ Rate
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  );
}

export default Dashboard;
