import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => {
    try {
      const cachedUser = localStorage.getItem("user");
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch (error) {
      return null;
    }
  });
  const [form, setForm] = useState(() => {
    try {
      const cachedUser = localStorage.getItem("user");
      const parsedUser = cachedUser ? JSON.parse(cachedUser) : null;

      return {
        name: parsedUser?.name || "",
        email: parsedUser?.email || "",
        password: ""
      };
    } catch (error) {
      return { name: "", email: "", password: "" };
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState(null);

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

      setProfile(res.data);
      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        password: ""
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role
        })
      );
    } catch (err) {
      console.log(err);
      setFeedback({ type: "error", message: "Unable to load profile." });
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
    setFeedback(null);

    try {
      const payload = {
        name: form.name,
        email: form.email
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      const res = await axios.put(
        `${process.env.REACT_APP_API}/api/profile/me`,
        payload,
        getAuthConfig()
      );

      setProfile(res.data.user || null);
      if (res.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: res.data.user._id,
            name: res.data.user.name,
            email: res.data.user.email,
            role: res.data.user.role
          })
        );
      }
      setForm((prev) => ({ ...prev, password: "" }));
      setFeedback({ type: "success", message: "Profile updated successfully." });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Failed to update profile."
      });
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
      localStorage.removeItem("user");
      alert("Your account has been deleted.");
      navigate("/register");
      window.location.reload();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Failed to delete account."
      });
      setDeleting(false);
    }
  };

  const profileData = profile || JSON.parse(localStorage.getItem("user") || "null");

  const formattedJoinDate = profile?.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      }).format(new Date(profile.createdAt))
    : "Not available";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="glass w-full max-w-xl rounded-3xl p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Loading your profile</h2>
          <p className="mt-2 text-sm text-gray-500">Fetching your account details and preferences.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col gap-8 px-4 py-8 lg:flex-row lg:items-start">
      <aside className="glass w-full rounded-3xl p-6 shadow-xl lg:max-w-sm">
        <div className="flex items-center gap-4 border-b border-white/50 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-2xl font-bold text-white shadow-lg">
            {(profileData?.name || "U").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Account</p>
            <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
            <p className="text-sm text-gray-600">Review and edit your details.</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Name</p>
            <p className="mt-1 text-base font-medium text-gray-900">{profileData?.name || "Not set"}</p>
          </div>

          <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Email</p>
            <p className="mt-1 break-all text-base font-medium text-gray-900">{profileData?.email || "Not set"}</p>
          </div>

          <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Role</p>
            <p className="mt-1 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              {profileData?.role || "user"}
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Member since</p>
            <p className="mt-1 text-base font-medium text-gray-900">{formattedJoinDate}</p>
          </div>
        </div>
      </aside>

      <section className="w-full flex-1 space-y-6">
        <div className="glass rounded-3xl p-6 shadow-xl lg:p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Edit profile</h3>
            <p className="mt-1 text-sm text-gray-600">
              Update your name, email, and password from one place.
            </p>
          </div>

          {feedback && (
            <div
              className={`mb-6 rounded-2xl px-4 py-3 text-sm font-medium ${
                feedback.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <form onSubmit={handleSave} className="grid gap-5">
            <div>
              <label className="mb-2 block font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-4 transition-all duration-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-4 transition-all duration-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                New Password <span className="text-sm text-gray-400">(optional)</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep your current password"
                className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-4 transition-all duration-300 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full justify-center py-4 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving changes..." : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="glass rounded-3xl border border-red-100 p-6 shadow-xl lg:p-8">
          <h3 className="text-xl font-bold text-red-600">Danger Zone</h3>
          <p className="mt-2 text-sm text-gray-600">
            Deleting your account will permanently remove your profile, BMI history, weekly plan, and campaign activity.
          </p>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="btn-danger mt-5 w-full justify-center py-4 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Deleting account..." : "Delete Account Permanently"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Profile;
