import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [overview, setOverview] = useState({});
  const [campaignStats, setCampaignStats] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: ""
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = { Authorization: token };

  useEffect(() => {
    fetchData();
    fetchCampaignStats();
  }, []);

  // Fetch users, campaigns, overview
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, campaignsRes, overviewRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API}/api/admin/users`, { headers }),
        axios.get(`${process.env.REACT_APP_API}/api/admin/campaigns`, { headers }),
        axios.get(`${process.env.REACT_APP_API}/api/admin/overview`, { headers })
      ]);

      setUsers(usersRes.data);
      setCampaigns(campaignsRes.data);
      setOverview(overviewRes.data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch campaign analytics
  const fetchCampaignStats = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/api/analytics/campaign-stats`);
      setCampaignStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Delete this user?")) {
      await axios.delete(`${process.env.REACT_APP_API}/api/admin/users/${id}`, { headers });
      fetchData();
    }
  };

  const promoteUser = async (id) => {
    await axios.put(`${process.env.REACT_APP_API}/api/admin/users/promote/${id}`, {}, { headers });
    fetchData();
  };

  const deleteCampaign = async (id) => {
    if (window.confirm("Delete this campaign?")) {
      await axios.delete(`${process.env.REACT_APP_API}/api/admin/campaigns/${id}`, { headers });
      fetchData();
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const createCampaign = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.REACT_APP_API}/api/admin/campaigns`, form, { headers });

      setForm({
        title: "",
        description: "",
        category: ""
      });

      fetchData();
      fetchCampaignStats();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8">

      <h2 className="text-4xl font-bold mb-8 text-red-600">
        👨‍💼 Admin Dashboard
      </h2>

      {/* OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
          <h3>Total Users</h3>
          <p className="text-3xl font-bold">{overview.totalUsers || 0}</p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-xl shadow">
          <h3>Total Campaigns</h3>
          <p className="text-3xl font-bold">{overview.totalCampaigns || 0}</p>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-xl shadow">
          <h3>Total BMI Records</h3>
          <p className="text-3xl font-bold">{overview.totalBMI || 0}</p>
        </div>

      </div>

      {/* CREATE CAMPAIGN */}
      <div className="bg-white shadow p-6 rounded-xl mb-10">

        <h3 className="text-xl font-semibold mb-4">
          ➕ Create Campaign
        </h3>

        <form onSubmit={createCampaign} className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            name="title"
            placeholder="Campaign Title"
            value={form.title}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />

          <textarea
            name="description"
            placeholder="Campaign Description"
            value={form.description}
            onChange={handleChange}
            required
            className="border p-3 rounded md:col-span-2"
          />

          <button
            type="submit"
            className="bg-green-600 text-white p-3 rounded md:col-span-2"
          >
            Create Campaign
          </button>

        </form>
      </div>

      {/* USERS */}
      <div className="bg-white shadow p-6 rounded-xl mb-10">

        <h3 className="text-xl font-semibold mb-4">
          👥 Manage Users
        </h3>

        {users.map((user) => (
          <div
            key={user._id}
            className="flex justify-between items-center border-b py-3"
          >

            <div>
              <strong>{user.name}</strong>
              <p className="text-sm text-gray-500">
                {user.email}
              </p>
            </div>

            <div className="flex gap-2">

              {user.role !== "admin" && (
                <button
                  onClick={() => promoteUser(user._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Promote
                </button>
              )}

              <button
                onClick={() => deleteUser(user._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* CAMPAIGNS */}
      <div className="bg-white shadow p-6 rounded-xl mb-10">

        <h3 className="text-xl font-semibold mb-4">
          📢 Manage Campaigns
        </h3>

        {campaigns.map((camp) => (
          <div
            key={camp._id}
            className="flex justify-between items-center border-b py-3"
          >

            <div>
              <strong>{camp.title}</strong>
              <p className="text-sm text-gray-500">
                {camp.category}
              </p>
            </div>

            <button
              onClick={() => deleteCampaign(camp._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>

          </div>
        ))}

      </div>

      {/* CAMPAIGN ANALYTICS */}
      <div className="bg-white shadow p-6 rounded-xl">

        <h3 className="text-xl font-semibold mb-4">
          📊 Campaign Analytics
        </h3>

        {campaignStats.map((stat, index) => (
          <div
            key={index}
            className="border-b py-3 flex justify-between"
          >

            <strong>{stat.title}</strong>

            <div className="flex gap-6">

              <span className="text-yellow-600">
                ⭐ {stat.avgRating}
              </span>

              <span className="text-blue-600">
                🔖 {stat.bookmarks}
              </span>

              <span className="text-green-600">
                ✅ {stat.completions}
              </span>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default AdminDashboard;