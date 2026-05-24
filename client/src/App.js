import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BMICalculator from "./pages/BMICalculator";
import BMIHistory from "./pages/BMIHistory";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Chatbot from "./components/Chatbot";

function App() {
  const token = localStorage.getItem("token");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <Router>
      <div className="min-h-screen">
        {/* Enhanced Glassmorphism Navigation */}
        <nav className="glass sticky top-0 z-50 mx-4 mt-4 rounded-2xl shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2 group">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🏥</span>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Public Health App
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/" className="px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 font-medium">
                  Home
                </Link>

                {token && (
                  <Link to="/bmi" className="px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 font-medium">
                    BMI
                  </Link>
                )}

                {decoded?.role === "admin" && (
                  <Link to="/admin" className="px-4 py-2 rounded-xl text-purple-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 font-medium">
                    Admin
                  </Link>
                )}

                {token && (
                  <Link to="/dashboard" className="px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 font-medium">
                    Dashboard
                  </Link>
                )}

                {token && (
                  <Link to="/bmi-history" className="px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 font-medium">
                    History
                  </Link>
                )}

                {!token && (
                  <Link to="/register" className="px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 font-medium">
                    Register
                  </Link>
                )}

                {!token ? (
                  <Link to="/login" className="btn-primary ml-2">
                    Login
                  </Link>
                ) : (
                  <button onClick={handleLogout} className="ml-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95 transition-all duration-300">
                    Logout
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden pb-4 animate-slide-down">
                <div className="flex flex-col space-y-2">
                  <Link to="/" className="px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
                  {token && <Link to="/bmi" className="px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>BMI</Link>}
                  {decoded?.role === "admin" && <Link to="/admin" className="px-4 py-2 rounded-xl text-purple-700 hover:bg-purple-50 hover:text-purple-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Admin</Link>}
                  {token && <Link to="/dashboard" className="px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>}
                  {token && <Link to="/bmi-history" className="px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>History</Link>}
                  {!token && <Link to="/register" className="px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Register</Link>}
                  {!token && <Link to="/login" className="px-4 py-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors" onClick={() => setIsMenuOpen(false)}>Login</Link>}
                  {token && <button onClick={handleLogout} className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left">Logout</button>}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content with Animation */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bmi" element={token ? <BMICalculator /> : <Navigate to="/login" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/bmi-history" element={token ? <BMIHistory /> : <Navigate to="/login" />} />
          </Routes>
        </main>

        {/* Chatbot - Shows on all pages after login */}
        {token && <Chatbot />}
      </div>
    </Router>
  );
}

export default App;
