// src/pages/UpdateProfile.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const UpdateProfile = () => {
  const user  = useSelector((state) => state.auth.user);
  console.log(user.username);
  const navigate = useNavigate();

  const [newUsername, setNewUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // ✅ 1. Verify current password by trying a dummy password change (same password)
      await axios.post(
        "http://localhost:3000/api/v1/users/verify-password",
        {  currentPassword },
        { withCredentials: true }
      );

      // ✅ 2. Update username
      if (newUsername && newUsername !== user?.username) {
        await axios.post(
          "http://localhost:3000/api/v1/users/update-username",
          { newUsername }, // key should be `username`
          { withCredentials: true }
        );
      }

      // ✅ 3. Update profile picture
      if (profilePicture) {
        const formData = new FormData();
        formData.append("profilePicture", profilePicture);

        await axios.post(
          "http://localhost:3000/api/v1/users/update-profile-picture",
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      setSuccess("Profile updated successfully!");
      // localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(newUsername));
      setTimeout(() => navigate("/chat"), 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <form
        onSubmit={handleUpdate}
        className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Update Profile
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm mb-4 text-center">{success}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">New username</label>
          <input
            type="text"
            className="w-full p-2 border rounded dark:bg-gray-700"
            value={newUsername}
            placeholder="Enter new Username"
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            className="text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded dark:bg-gray-700"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
