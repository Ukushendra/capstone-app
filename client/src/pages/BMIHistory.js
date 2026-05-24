import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function BMIHistory() {
  const [history, setHistory] = useState([]);

  const token = localStorage.getItem("token");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/api/bmi/history/${decoded.id}`);
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const chartData = {
    labels: history.map((item) => new Date(item.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "Your BMI",
        data: history.map((item) => item.bmi),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Normal BMI Range",
        data: history.map(() => 24.9),
        borderColor: "#10b981",
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
      {
        label: "Overweight Threshold",
        data: history.map(() => 25),
        borderColor: "#f59e0b",
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "'Segoe UI', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#4b5563",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 15,
        max: 35,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: function(value) {
            return value;
          }
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📈 Your BMI Trend
          </span>
        </h2>
        <p className="text-gray-500">Track your BMI history over time</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 animate-slide-up">
        {history.length > 0 ? (
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500 text-lg">No BMI history available yet</p>
            <p className="text-gray-400 text-sm mt-2">Calculate your BMI to start tracking</p>
          </div>
        )}
      </div>

      {/* BMI Categories Legend */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
            <span className="font-medium text-yellow-700">Underweight</span>
          </div>
          <p className="text-sm text-yellow-600">BMI less than 18.5</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="font-medium text-green-700">Normal</span>
          </div>
          <p className="text-sm text-green-600">BMI 18.5 - 24.9</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
            <span className="font-medium text-orange-700">Overweight</span>
          </div>
          <p className="text-sm text-orange-600">BMI 25 - 29.9</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="font-medium text-red-700">Obese</span>
          </div>
          <p className="text-sm text-red-600">BMI 30 or higher</p>
        </div>
      </div>
    </div>
  );
}

export default BMIHistory;
