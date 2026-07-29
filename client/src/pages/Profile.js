import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem("token");

  const getAuthConfig = () => ({
    headers: {
      authorization: token
    }
  });

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/profile/me`,
        getAuthConfig()
      );
      setForm((prev) => ({
        ...prev,
        name: res.data.name || "",
        email: res.data.email || ""
      }));
    } catch (err) {
      console.log(err);
      alert("Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: form.name,
        email: form.email
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      await axios.put(
        `${process.env.REACT_APP_API}/api/profile/me`,
        payload,
        getAuthConfig()
      );

      setForm((prev) => ({ ...prev, password: "" }));
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(
      "Type DELETE to permanently remove your account and all your data."
    );

    if (confirmation !== "DELETE") {
      return;
    }

    setDeleting(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/api/profile/me`,
        getAuthConfig()
      );
      localStorage.removeItem("token");
      alert("Your account has been deleted.");
      navigate("/register");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete account");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen py-12 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-xl animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <span className="text-4xl">👤</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Update your personal information
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              New Password (optional)
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-red-100">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-600 mb-4">
            Deleting your account will permanently remove your profile, BMI history,
            weekly plan, and campaign activity.
          </p>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting Account..." : "Delete Account Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
