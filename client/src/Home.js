import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

      {/* Hero Section with Animation */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-200 to-blue-200 rounded-full blur-3xl opacity-30 animate-float animation-delay-200"></div>
        </div>

        <div className="relative flex flex-col items-center justify-center text-center py-20 px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              🌍 Public Health
            </span>
            <br />
            <span className="text-gray-800">Campaign System</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8 animate-slide-up animation-delay-100">
            Empowering individuals to prevent chronic diseases through 
            personalized BMI analysis, health risk monitoring, 
            and targeted public health campaigns.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-slide-up animation-delay-200">
            {token ? (
              <>
                <Link
                  to="/bmi"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    📊 Check Your BMI
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Link>

                <Link
                  to="/dashboard"
                  className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    📈 View Dashboard
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    🚀 Get Started
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Link>

                <Link
                  to="/login"
                  className="group px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-transparent hover:border-purple-500"
                >
                  <span className="flex items-center gap-2">
                    🔐 Login
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/50 backdrop-blur-sm py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-fade-in">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🚀 Key Features
          </span>
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto animate-fade-in">
          Discover the powerful tools we provide to help you maintain your health
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 card-hover animate-slide-up">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 text-3xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              📊
            </div>
            <h3 className="text-xl font-bold text-blue-700 mb-3">
              BMI Monitoring
            </h3>
            <p className="text-gray-600">
              Track your BMI history and monitor health trends over time to prevent chronic diseases early.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 card-hover animate-slide-up animation-delay-100">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 text-3xl shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
              🎯
            </div>
            <h3 className="text-xl font-bold text-green-700 mb-3">
              Smart Campaign Recommendations
            </h3>
            <p className="text-gray-600">
              Receive targeted public health campaigns based on your health risk category.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 card-hover animate-slide-up animation-delay-200">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 text-3xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
              📈
            </div>
            <h3 className="text-xl font-bold text-purple-700 mb-3">
              Analytics Dashboard
            </h3>
            <p className="text-gray-600">
              Analyze obesity trends, campaign effectiveness, and public health impact through visual insights.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="text-white animate-fade-in">
            <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
            <div className="text-blue-100">Active Users</div>
          </div>
          <div className="text-white animate-fade-in animation-delay-100">
            <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
            <div className="text-blue-100">Health Campaigns</div>
          </div>
          <div className="text-white animate-fade-in animation-delay-200">
            <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
            <div className="text-blue-100">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-gray-900 text-white text-center py-8 mt-10">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-lg">
            © 2026 Public Health Campaign System | Preventing Chronic Diseases Together 💙
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Made with ❤️ for a healthier world
          </p>
        </div>
      </div>

    </div>
  );
}

export default Home;
